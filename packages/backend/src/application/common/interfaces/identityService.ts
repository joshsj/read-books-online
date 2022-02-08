import { Id } from "@backend/domain/common/id";
import { User } from "@backend/domain/entities/user";
import { AccountDto } from "@backend/application/common/dtos/accountDto";
import { RefreshToken } from "@backend/domain/entities/refreshToken";

type AuthTokenValue = string;

type Tokens = {
  authenticationTokenValue: AuthTokenValue;
  refreshToken: RefreshToken;
};

type IIdentityService = {
  login(account: AccountDto): Promise<Tokens>;
  login(refresh: "refresh"): Promise<Tokens>;

  logout(): Promise<void>;

  authenticate(): Promise<void>;

  getCurrentUserId(): Promise<Id>;
  getCurrentUser(): Promise<User>;
};

export { IIdentityService, AuthTokenValue, Tokens };
