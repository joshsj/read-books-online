import { RefreshTokenValue } from "@backend/domain/entities/refreshToken";
import { AuthTokenValue } from "./identityService";

type IHttpContext = Readonly<{
  type: "http" | "socket";
  id: number;
  authenticationTokenValue: AuthTokenValue | undefined;
  refreshTokenValue: RefreshTokenValue | undefined;
}>;

type IHttpContextService = { getCurrent(): IHttpContext };

export { IHttpContextService, IHttpContext };
