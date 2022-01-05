import { IConfiguration } from "@/application/common/interfaces/configuration";
import { ILogger } from "@/application/common/interfaces/logger";
import { Dependency } from "@/application/dependency";
import { errorHandler } from "@/web/middlewares/errorHandler";
import { authRoutes } from "@/web/routes/auth";
import { userRoutes } from "@/web/routes/user";
import express, { Router } from "express";
import { container } from "tsyringe";

const startServer = () => {
  const log = container.resolve<ILogger>(Dependency.logger);
  const {
    server: { port },
  } = container.resolve<IConfiguration>(Dependency.configuration);

  const routes = Router().use("/user", userRoutes).use("/auth", authRoutes);
  const app = express().use(express.json()).use("/api", routes).use(errorHandler);
  const server = app.listen(port, () => log("server", `Listening on port ${port}`));

  return { server };
};

export { startServer };
