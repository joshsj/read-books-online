import { IConfiguration } from "@/application/common/interfaces/configuration";
import { ILogger } from "@/application/common/interfaces/logger";
import { errorHandler } from "@/web/common/middlewares/errorHandler";
import { httpContextServiceProvider } from "@/web/common/middlewares/httpContextServiceProvider";
import { missingRouteHandler } from "@/web/common/middlewares/missingRouteHandler";
import { authRoutes } from "@/web/routes/auth";
import { userRoutes } from "@/web/routes/user";
import cookieParser from "cookie-parser";
import express, { Router } from "express";

class Server {
  constructor(private readonly logger: ILogger, private readonly configuration: IConfiguration) {}

  start() {
    const routes = Router().use("/user", userRoutes).use("/auth", authRoutes);

    if (this.configuration.mode === "development") {
      import("@/web/routes/test").then(({ testRoutes }) => routes.use("/test", testRoutes));
    }

    const app = express()
      .use(express.json())
      .use(cookieParser(this.configuration.server.cookie.secret))
      .use(httpContextServiceProvider)
      .use("/api", routes)
      .use(missingRouteHandler)
      .use(errorHandler);

    const { port } = this.configuration.server;

    const server = app.listen(port, () => this.logger.log("server", `Listening on port ${port}`));

    return { server };
  }
}

export { Server };
