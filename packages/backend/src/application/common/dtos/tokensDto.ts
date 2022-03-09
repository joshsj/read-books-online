import { RefreshTokenValue } from "@backend/domain/entities/refreshToken";
import { AuthenticationTokenValue } from "../interfaces/identityService";

type TokensDto = {
  authentication: { value: AuthenticationTokenValue };
  refresh: {
    value: RefreshTokenValue;
    expires: Date;
  };
};

export { TokensDto };
