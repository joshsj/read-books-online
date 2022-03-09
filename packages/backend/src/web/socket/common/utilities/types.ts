import { DependencyContainer } from "tsyringe";
import { Socket as IoSocket, Server as IoServer } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";

type SocketData = {
  container: DependencyContainer;
};

type Socket = IoSocket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, SocketData>;
type SocketServer = IoServer<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, SocketData>;

export { SocketData, Socket, SocketServer };
