import { Id } from "@backend/domain/common/id";
import { User } from "@backend/domain/entities/user";
import { AccountDto } from "@backend/application/common/dtos/accountDto";

type AuthTokenValue = string;

type IIdentityService = {
  login(account: AccountDto): Promise<AuthTokenValue>;
  login(refresh: "refresh"): Promise<AuthTokenValue>;

  logout(): Promise<void>;

  authenticate(): Promise<void>;

  getCurrentUserId(): Promise<Id>;
  getCurrentUser(): Promise<User>;
};

export { IIdentityService, AuthTokenValue };
