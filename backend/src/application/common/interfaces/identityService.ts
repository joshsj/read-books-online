import { Password, Username } from "@/domain/common/constrainedTypes";
import { Id } from "@/domain/common/id";
import { User } from "@/domain/entities/user";

type AuthToken = string;

type IIdentityService = {
  login(username: Username, password: Password): Promise<AuthToken>;
  authenticate(): Promise<void>;
  getCurrentUserId(): Promise<Id>;
  getCurrentUser(): Promise<User>;
};

export { IIdentityService, AuthToken };
