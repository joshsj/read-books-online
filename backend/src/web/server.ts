import { ILogger, Mode } from "@/application/common/interfaces";
import { Dependency } from "@/infrastructure/dependency";
import { errorHandler } from "@/web/middlewares/errorHandler";
import { authRoutes } from "@/web/routes/auth";
import { testRoutes } from "@/web/routes/test";
import { userRoutes } from "@/web/routes/user";
import express, { Router } from "express";
import { container } from "tsyringe";

const getRoutes = (mode: Mode) => {
  const router = Router();

  if (mode === "development") {
    router.use("/test", testRoutes);
  }

  router.use("/user", userRoutes);
  router.use("/auth", authRoutes);

  return router;
};

const startServer = (port: number, mode: Mode) => {
  const log = container.resolve<ILogger>(Dependency.logger);

  const app = express();

  app
    .use(express.json())

    .use("/api", getRoutes(mode))
    .use(errorHandler);

  const server = app.listen(port, () =>
    log("server", `Listening on port ${port}`)
  );

  return { server };
};

export { startServer };
