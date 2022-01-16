import { Password, Username } from "@backend/domain/common/constrainedTypes";
import { Id } from "@backend/domain/common/id";
import { User } from "@backend/domain/entities/user";

type AuthTokenValue = string;

type IIdentityService = {
  login(username: Username, password: Password): Promise<AuthTokenValue>;
  login(refresh: "refresh"): Promise<AuthTokenValue>;

  authenticate(): Promise<void>;

  getCurrentUserId(): Promise<Id>;
  getCurrentUser(): Promise<User>;
};

export { IIdentityService, AuthTokenValue };
