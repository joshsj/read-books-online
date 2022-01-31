import { cannotViewUser, userNotFound } from "@backend/application/common/error/messages";
import { RBOError } from "@backend/application/common/error/rboError";
import { IRequestAuthorizer, IRequestValidator } from "@backend/application/common/interfaces/cqrs";
import { IIdentityService } from "@backend/application/common/interfaces/identityService";
import { IUserRepository } from "@backend/application/common/interfaces/repository";
import { Request } from "@backend/application/common/utilities/cqrs";
import { Username } from "@backend/domain/common/constrainedTypes";
import { IQueryHandler } from "@core/cqrs/types/request";
import { ensure } from "@core/utilities";
import { InferType, object } from "yup";
import { UserDto } from "./userDto";

const GetUserRequest = object({
  username: Username.required(),
}).concat(Request("getUserRequest"));
type GetUserRequest = InferType<typeof GetUserRequest>;

class GetUserRequestValidator implements IRequestValidator<GetUserRequest> {
  requestName = "getUserRequest" as const;

  constructor(private readonly userRepository: IUserRepository) {}

  async validate(request: unknown) {
    ensure(GetUserRequest.isValidSync(request), new RBOError("validation"));

    ensure(
      await this.userRepository.existsByUsername(request.username),
      new RBOError("missing", userNotFound(request.username))
    );
  }
}

class GetUserRequestAuthorizer implements IRequestAuthorizer<GetUserRequest> {
  requestName = "getUserRequest" as const;

  constructor(private readonly identityService: IIdentityService) {}

  async authorize(request: GetUserRequest) {
    const currentUser = await this.identityService.getCurrentUser();

    if (currentUser.roles.some((r) => r !== "client")) {
      return;
    }

    ensure(
      request.username === currentUser.username,
      new RBOError("authorization", cannotViewUser)
    );
  }
}

class GetUserQueryHandler implements IQueryHandler<GetUserRequest, UserDto> {
  handles = "getUserRequest" as const;

  constructor(private readonly userRepository: IUserRepository) {}

  async handle({ username }: GetUserRequest) {
    const user = (await this.userRepository.getByUsername(username))!;

    return UserDto.fromUser(user);
  }
}

export { GetUserQueryHandler, GetUserRequest, GetUserRequestAuthorizer, GetUserRequestValidator };
