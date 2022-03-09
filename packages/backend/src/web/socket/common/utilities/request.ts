import { IHttpContextService } from "@backend/application/common/interfaces/httpContextService";
import { Dependency } from "@backend/application/dependency";
import { HttpContextService } from "@backend/infrastructure/httpContextService";
import { Server, Socket } from "socket.io";
import { container, DependencyContainer } from "tsyringe";

type SocketMiddleware = Parameters<Server["use"]>[0];

type MiddlewareAsync = (
  handler: (socket: Parameters<SocketMiddleware>[0]) => Promise<void>
) => SocketMiddleware;

const middlewareAsync: MiddlewareAsync = (handler) => (socket, next) =>
  handler(socket)
    .then(() => next())
    .catch((x) => next(x));

let contexts = 0;
const AuthenticationKey = "token" as const;

const createPerRequestContainer = (socket: Socket): DependencyContainer => {
  const authenticationTokenValue = socket.handshake.auth[AuthenticationKey];

  container.register<IHttpContextService>(Dependency.httpContextService, {
    useFactory: () =>
      new HttpContextService({
        type: "socket",
        id: contexts++,
        authenticationTokenValue,
        refreshTokenValue: undefined,
      }),
  });

  return container;
};

export { middlewareAsync, MiddlewareAsync, createPerRequestContainer };
