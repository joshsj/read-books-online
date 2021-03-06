import { IConfiguration } from "@backend/application/common/interfaces/configuration";
import { ILogger } from "@backend/application/common/interfaces/logger";
import { Dependency } from "@backend/application/dependency";
import { errorHandler } from "@backend/web/api/common/middlewares/errorHandler";
import { httpContextServiceProvider } from "@backend/web/api/common/middlewares/httpContextServiceProvider";
import { missingRouteHandler } from "@backend/web/api/common/middlewares/missingRouteHandler";
import { requestLogger } from "@backend/web/api/common/middlewares/requestLogger";
import { authRoutes } from "@backend/web/api/routes/auth";
import { referenceDataRoutes } from "@backend/web/api/routes/referenceData";
import { ticketRoutes } from "@backend/web/api/routes/ticket";
import { userRoutes } from "@backend/web/api/routes/user";
import cors, { CorsOptions } from "cors";
import express, { Express, Router } from "express";
import { readFile } from "fs/promises";
import { createServer as createHttpServer, Server as HttpServer, ServerOptions } from "https";
import { Server as IoServer } from "socket.io";
import socketIoParser from "socket.io-msgpack-parser";
import { container as defaultContainer } from "tsyringe";
import { authenticator } from "./socket/common/middlewares/authenticator";
import { configurePerSocketContainer } from "./socket/common/middlewares/configureContainer";
import { Socket, SocketServer } from "./socket/common/utilities/types";
import { sendCqrsRequest } from "./socket/handlers/sendCqrsRequest";

class Server {
  constructor(private readonly logger: ILogger, private readonly configuration: IConfiguration) {}

  async start(): Promise<{ expressApp: Express; socketServer: IoServer }> {
    const { https, port } = this.configuration.server;

    const cors: CorsOptions = { origin: this.configuration.appUrl };
    const serverOptions: ServerOptions = {
      key: await readFile(https.keyPath),
      cert: await readFile(https.certPath),
    };

    const expressApp = this.setupExpressApp(cors);
    const server = createHttpServer(serverOptions, expressApp);
    const socketServer = this.setupSocket(server, cors);

    server.listen(port, () => this.logger.log("server", `Listening on port ${port}`));

    return { expressApp, socketServer };
  }

  private setupExpressApp(corsOptions: CorsOptions): Express {
    const routes = Router()
      .use("/auth", authRoutes)
      .use("/user", userRoutes)
      .use("/ticket", ticketRoutes)
      .use("/referenceData", referenceDataRoutes);

    if (this.configuration.mode === "development") {
      import("@backend/web/api/routes/test").then(({ testRoutes }) =>
        routes.use("/test", testRoutes)
      );
    }

    return express()
      .use(express.json({ strict: true }))
      .use(cors(corsOptions))
      .use(httpContextServiceProvider)
      .use(requestLogger)
      .use("/api", routes)
      .use(missingRouteHandler)
      .use(errorHandler);
  }

  private setupSocket(httpServer: HttpServer, cors: CorsOptions): SocketServer {
    const server: SocketServer = new IoServer(httpServer, { cors, parser: socketIoParser });

    const serverContainer = defaultContainer.register<Socket[]>(Dependency.sockets, {
      useFactory: () => [...server.sockets.sockets.values()],
    });

    // TODO configure error handling (currently silent)
    server.use((socket, next) => configurePerSocketContainer(serverContainer)(socket, next));
    server.use(authenticator);

    server.on("connection", (socket) =>
      socket.on("message", async (msg) => sendCqrsRequest(socket, msg))
    );

    return server;
  }
}

export { Server };
