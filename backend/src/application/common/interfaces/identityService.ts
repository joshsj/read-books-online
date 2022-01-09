import { Password, Username } from "@/domain/common/constrainedTypes";
import { Id } from "@/domain/common/id";
import { User } from "@/domain/entities/user";

type AuthTokenValue = string;

type IIdentityService = {
  login(username: Username, password: Password): Promise<AuthTokenValue>;
  login(refresh: "refresh"): Promise<AuthTokenValue>;

  authenticate(): Promise<void>;

  getCurrentUserId(): Promise<Id>;
  getCurrentUser(): Promise<User>;
};

export { IIdentityService, AuthTokenValue };
