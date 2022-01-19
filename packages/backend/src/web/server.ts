import { IConfiguration } from "@backend/application/common/interfaces/configuration";
import { ILogger } from "@backend/application/common/interfaces/logger";
import { errorHandler } from "@backend/web/common/middlewares/errorHandler";
import { httpContextServiceProvider } from "@backend/web/common/middlewares/httpContextServiceProvider";
import { requestLogger } from "@backend/web/common/middlewares/requestLogger";
import { missingRouteHandler } from "@backend/web/common/middlewares/missingRouteHandler";
import { authRoutes } from "@backend/web/routes/auth";
import { ticketRoutes } from "@backend/web/routes/ticket";
import { userRoutes } from "@backend/web/routes/user";
import cookieParser from "cookie-parser";
import cors from "cors";
import express, { Router } from "express";

class Server {
  constructor(private readonly logger: ILogger, private readonly configuration: IConfiguration) {}

  start() {
    const routes = Router()
      .use("/auth", authRoutes)
      .use("/user", userRoutes)
      .use("/ticket", ticketRoutes);

    if (this.configuration.mode === "development") {
      import("@backend/web/routes/test").then(({ testRoutes }) => routes.use("/test", testRoutes));
    }

    const app = express()
      .use(express.json())
      .use(cookieParser(this.configuration.server.cookie.secret))
      .use(
        cors({
          origin: this.configuration.server.cors.origins,
          credentials: true,
        })
      )
      .use(httpContextServiceProvider)
      .use(requestLogger)
      .use("/api", routes)
      .use(missingRouteHandler)
      .use(errorHandler);

    const { port } = this.configuration.server;

    const server = app.listen(port, () => this.logger.log("server", `Listening on port ${port}`));

    return { server };
  }
}

export { Server };
