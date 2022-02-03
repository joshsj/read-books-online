import {
  notFound,
  updatingDisabledOfAuthorizer,
  updatingUserNonAuthorizer,
  updatingUserRolesNonAuthorizer,
} from "@backend/application/common/error/messages";
import { RBOError } from "@backend/application/common/error/rboError";
import { IRequestAuthorizer, IRequestValidator } from "@backend/application/common/interfaces/cqrs";
import { IIdentityService } from "@backend/application/common/interfaces/identityService";
import {
  ITicketRepository,
  IUserRepository,
} from "@backend/application/common/interfaces/repository";
import { Request } from "@backend/application/common/utilities/cqrs";
import { Id } from "@backend/domain/common/id";
import { User } from "@backend/domain/entities/user";
import { ICommandHandler } from "@core/cqrs/types/request";
import { ensure } from "@core/utilities";
import { boolean, InferType, object } from "yup";

const UpdateUserRequest = User.partial()
  .pick(["email", "roles"])
  .concat(
    object({
      userId: Id.required(),
      // TODO work out why partial doesn't undo .defined() on User.disabled
      // might be an issue with the library
      disabled: boolean().strict(),
    })
  )
  .concat(Request("updateUserRequest"));
type UpdateUserRequest = InferType<typeof UpdateUserRequest>;

class UpdateUserRequestValidator implements IRequestValidator<UpdateUserRequest> {
  requestName = "updateUserRequest" as const;

  constructor(private readonly userRepository: IUserRepository) {}

  async validate(request: unknown) {
    ensure(UpdateUserRequest.isValidSync(request), new RBOError("validation"));

    ensure(
      await this.userRepository.exists(request.userId),
      new RBOError("validation", notFound(request.userId, "User"))
    );
  }
}

class UpdateUserRequestAuthorizer implements IRequestAuthorizer<UpdateUserRequest> {
  requestName = "updateUserRequest" as const;

  constructor(
    private readonly identityService: IIdentityService,
    private readonly userRepository: IUserRepository
  ) {}

  async authorize(request: UpdateUserRequest) {
    const currentUser = await this.identityService.getCurrentUser();
    const isAuthorizer = currentUser.roles.includes("authorizer");
    const targetUser =
      currentUser._id === request.userId
        ? currentUser
        : (await this.userRepository.get(request.userId))!;

    if (currentUser._id !== request.userId) {
      ensure(isAuthorizer, new RBOError("authorization", updatingUserNonAuthorizer));
    }

    if (request.roles) {
      ensure(isAuthorizer, new RBOError("authorization", updatingUserRolesNonAuthorizer));
    }

    if (typeof request.disabled !== "undefined") {
      ensure(
        !targetUser.roles.includes("authorizer"),
        new RBOError("authorization", updatingDisabledOfAuthorizer)
      );
    }

    this.constrainRoles(request, targetUser);
  }

  /** Ensures authorizer role cannot be changed (it must be allocated at a database level instead) */
  private constrainRoles(request: UpdateUserRequest, targetUser: User) {
    if (!request.roles) {
      return;
    }

    // preserve current authorizer role
    if (targetUser.roles.includes("authorizer")) {
      request.roles.push("authorizer");
    } else {
      request.roles = request.roles.filter((r) => r !== "authorizer");
    }

    // make distinct
    request.roles = [...new Set(request.roles)];
  }
}

class UpdateUserCommandHandler implements ICommandHandler<UpdateUserRequest> {
  handles = "updateUserRequest" as const;

  constructor(
    private readonly userRepository: IUserRepository,
    private readonly ticketRepository: ITicketRepository
  ) {}

  async handle(request: UpdateUserRequest) {
    const user = (await this.userRepository.get(request.userId))!;

    request.email && (user.email = request.email);
    request.roles && (user.roles = request.roles);

    await this.processDisabled(request, user);

    await this.userRepository.update(user);
  }

  private async processDisabled(request: UpdateUserRequest, user: User) {
    const alreadyDisabled = user.disabled;

    typeof request.disabled !== "undefined" && (user.disabled = request.disabled);

    if (alreadyDisabled || !request.disabled) {
      return;
    }

    const tickets = await this.ticketRepository.filtered({ filter: { userId: user._id } });

    // delete created tickets without allocation
    await this.ticketRepository.delete(
      tickets.filter((t) => t.created.by._id === user._id && !t.allocated).map((t) => t._id)
    );

    // remove allocated tickets progress (review, pricing, etc.) without authorization
    await Promise.all(
      tickets
        .filter((t) => !t.authorized && t.allocated?.to._id === user._id)
        .map(({ _id, format, information, created }) =>
          this.ticketRepository.update({
            _id,
            format,
            information,
            created,
            allocated: null,
            priced: null,
            reviewed: null,
            authorized: null,
          })
        )
    );
  }
}

export {
  UpdateUserRequest,
  UpdateUserRequestAuthorizer,
  UpdateUserRequestValidator,
  UpdateUserCommandHandler,
};
