import { RefreshTokenValue } from "@backend/domain/entities/refreshToken";
import { AuthenticationTokenValue } from "./identityService";

type IHttpContext = Readonly<{
  type: "http" | "socket";
  id: number;
}> & {
  authenticationTokenValue: AuthenticationTokenValue | undefined;
  refreshTokenValue: RefreshTokenValue | undefined;
};

type IHttpContextService = { getCurrent(): IHttpContext };

export { IHttpContextService, IHttpContext };
