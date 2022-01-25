import { Authorizer } from "@backend/domain/common/authorizer";
import { UserDto } from "./userDto";

type AuthorizerDto = UserDto | Extract<Authorizer, "system">;
const AuthorizerDto = {
  fromAuthorizer: (authorizer: Authorizer) =>
    authorizer === "system" ? "system" : UserDto.fromUser(authorizer),
};

export { AuthorizerDto };
