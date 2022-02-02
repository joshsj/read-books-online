import {
  notFound,
  updatingDisabledOfAuthorizer,
  updatingUserNonAuthorizer,
  updatingUserRolesNonAuthorizer,
} from "@backend/application/common/error/messages";
import { RBOError } from "@backend/application/common/error/rboError";
import { IRequestAuthorizer, IRequestValidator } from "@backend/application/common/interfaces/cqrs";
import { IIdentityService } from "@backend/application/common/interfaces/identityService";
import { IUserRepository } from "@backend/application/common/interfaces/repository";
import { Request } from "@backend/application/common/utilities/cqrs";
import { Id } from "@backend/domain/common/id";
import { User } from "@backend/domain/entities/user";
import { ICommandHandler } from "@core/cqrs/types/request";
import { ensure } from "@core/utilities";
import { InferType, object } from "yup";

const UpdateUserRequest = User.pick(["email", "roles", "disabled"])
  .partial()
  .concat(object({ userId: Id.required() }))
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

    if (currentUser._id !== request.userId) {
      ensure(isAuthorizer, new RBOError("authorization", updatingUserNonAuthorizer));
    }

    if (request.roles) {
      ensure(isAuthorizer, new RBOError("authorization", updatingUserRolesNonAuthorizer));
    }

    if (typeof request.disabled !== "undefined") {
      const targetUser =
        currentUser._id === request.userId
          ? currentUser
          : (await this.userRepository.get(request.userId))!;

      ensure(
        !targetUser.roles.includes("authorizer"),
        new RBOError("authorization", updatingDisabledOfAuthorizer)
      );
    }

    this.constrainRoles(request, currentUser);
  }

  /** Ensures authorizer role cannot be changed (it must be allocated at a database level instead) */
  private constrainRoles(request: UpdateUserRequest, currentUser: User) {
    if (!request.roles) {
      return;
    }

    // preserve current authorizer role
    if (currentUser.roles.includes("authorizer")) {
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

  constructor(private readonly userRepository: IUserRepository) {}

  async handle({ userId, email, roles, disabled }: UpdateUserRequest) {
    const user = (await this.userRepository.get(userId))!;

    email && (user.email = email);
    roles && (user.roles = roles);
    typeof disabled !== "undefined" && (user.disabled = disabled);

    await this.userRepository.update(user);
  }
}

export {
  UpdateUserRequest,
  UpdateUserRequestAuthorizer,
  UpdateUserRequestValidator,
  UpdateUserCommandHandler,
};
