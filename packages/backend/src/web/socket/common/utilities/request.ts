import { Server } from "socket.io";

type SocketMiddleware = Parameters<Server["use"]>[0];

type MiddlewareAsync = (
  handler: (socket: Parameters<SocketMiddleware>[0]) => Promise<void>
) => SocketMiddleware;

const middlewareAsync: MiddlewareAsync = (handler) => (socket, next) =>
  handler(socket)
    .then(() => next())
    .catch((x) => next(x));

export { middlewareAsync, MiddlewareAsync };
