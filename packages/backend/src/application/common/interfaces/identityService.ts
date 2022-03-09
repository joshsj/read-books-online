import { AccountDto } from "@backend/application/common/dtos/accountDto";
import { Id } from "@backend/domain/common/id";
import { User } from "@backend/domain/entities/user";
import { TokensDto } from "../dtos/tokensDto";

type AuthenticationTokenValue = string;

type IIdentityService = {
  login(account: AccountDto): Promise<TokensDto>;
  login(refresh: "refresh"): Promise<TokensDto>;

  logout(): Promise<void>;

  authenticate(): Promise<void>;

  getCurrentUserId(): Promise<Id>;
  getCurrentUser(): Promise<User>;
};

export { IIdentityService, AuthenticationTokenValue };
