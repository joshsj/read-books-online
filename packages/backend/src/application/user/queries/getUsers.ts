import { IUserRepository } from "@backend/application/common/interfaces/repository";
import {
  Request,
  RoleRequestAuthorizer,
  SchemaRequestValidator,
} from "@backend/application/common/utilities/cqrs";
import { IQueryHandler } from "@core/cqrs/types/request";
import { InferType } from "yup";
import { UserDto } from "./userDto";

const GetUsersRequest = Request("getUsersRequest");
type GetUsersRequest = InferType<typeof GetUsersRequest>;

class GetUsersRequestValidator extends SchemaRequestValidator<GetUsersRequest> {
  requestName = "getUsersRequest" as const;

  constructor() {
    super(GetUsersRequest);
  }
}

class GetUsersRequestAuthorizer extends RoleRequestAuthorizer<GetUsersRequest> {
  requestName = "getUsersRequest" as const;
  requiredRoles = ["authorizer"] as const;
}

class GetUsersQueryHandler implements IQueryHandler<GetUsersRequest, UserDto[]> {
  handles = "getUsersRequest" as const;

  constructor(private readonly userRepository: IUserRepository) {}

  async handle() {
    const users = await this.userRepository.get();

    return users.map(UserDto.fromUser);
  }
}

export {
  GetUsersQueryHandler,
  GetUsersRequest,
  GetUsersRequestAuthorizer,
  GetUsersRequestValidator,
};
