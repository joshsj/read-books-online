import { errorHandler } from "@backend/api/common/middlewares/errorHandler";
import { httpContextServiceProvider } from "@backend/api/common/middlewares/httpContextServiceProvider";
import { missingRouteHandler } from "@backend/api/common/middlewares/missingRouteHandler";
import { requestLogger } from "@backend/api/common/middlewares/requestLogger";
import { authRoutes } from "@backend/api/routes/auth";
import { referenceDataRoutes } from "@backend/api/routes/referenceData";
import { ticketRoutes } from "@backend/api/routes/ticket";
import { userRoutes } from "@backend/api/routes/user";
import { IConfiguration } from "@backend/application/common/interfaces/configuration";
import { ILogger } from "@backend/application/common/interfaces/logger";
import cookieParser from "cookie-parser";
import cors from "cors";
import express, { Router } from "express";
import { readFile } from "fs/promises";
import { createServer, ServerOptions } from "https";

class Server {
  constructor(private readonly logger: ILogger, private readonly configuration: IConfiguration) {}

  async start() {
    const routes = Router()
      .use("/auth", authRoutes)
      .use("/user", userRoutes)
      .use("/ticket", ticketRoutes)
      .use("/referenceData", referenceDataRoutes);

    if (this.configuration.mode === "development") {
      import("@backend/api/routes/test").then(({ testRoutes }) => routes.use("/test", testRoutes));
    }

    const app = express()
      .use(express.json({ strict: true }))
      .use(cookieParser(this.configuration.server.cookie.secret))
      .use(
        cors({
          origin: this.configuration.appUrl,
          credentials: true,
        })
      )
      .use(httpContextServiceProvider)
      .use(requestLogger)
      .use("/api", routes)
      .use(missingRouteHandler)
      .use(errorHandler);

    const { port, https } = this.configuration.server;

    const serverOptions: ServerOptions = {
      key: await readFile(https.keyPath),
      cert: await readFile(https.certPath),
    };

    const server = createServer(serverOptions, app).listen(port, () =>
      this.logger.log("server", `Listening on port ${port}`)
    );

    return { server };
  }
}

export { Server };
