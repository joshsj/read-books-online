import { IConfiguration } from "@backend/application/common/interfaces/configuration";
import { ILogger } from "@backend/application/common/interfaces/logger";
import { errorHandler } from "@backend/web/api/common/middlewares/errorHandler";
import { httpContextServiceProvider } from "@backend/web/api/common/middlewares/httpContextServiceProvider";
import { missingRouteHandler } from "@backend/web/api/common/middlewares/missingRouteHandler";
import { requestLogger } from "@backend/web/api/common/middlewares/requestLogger";
import { authRoutes } from "@backend/web/api/routes/auth";
import { referenceDataRoutes } from "@backend/web/api/routes/referenceData";
import { ticketRoutes } from "@backend/web/api/routes/ticket";
import { userRoutes } from "@backend/web/api/routes/user";
import cookieParser from "cookie-parser";
import cors from "cors";
import express, { Router } from "express";

const startApiServer = async (logger: ILogger, configuration: IConfiguration) => {
  const routes = Router()
    .use("/auth", authRoutes)
    .use("/user", userRoutes)
    .use("/ticket", ticketRoutes)
    .use("/referenceData", referenceDataRoutes);

  if (configuration.mode === "development") {
    routes.use("/test", (await import("@backend/web/api/routes/test")).testRoutes);
  }

  const app = express()
    .use(express.json({ strict: true }))
    .use(cookieParser(configuration.server.cookie.secret))
    .use(
      cors({
        origin: configuration.server.cors.origins,
        credentials: true,
      })
    )
    .use(httpContextServiceProvider)
    .use(requestLogger)
    .use("/api", routes)
    .use(missingRouteHandler)
    .use(errorHandler);

  const { port } = configuration.server;

  const server = app.listen(port, () => logger.log("server", `Listening on port ${port}`));

  return { server };
};

export { startApiServer };
