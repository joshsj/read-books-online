import { Dependency, Logger } from "@/dependency";
import { Env, NodeEnv } from "@/env";
import express, { Express } from "express";
import { container } from "tsyringe";
import { testRoutes } from "./routes/test";
import { errorHandler } from "./middlewares/errorHandler";

const configureRoutes = (app: Express, NODE_ENV: NodeEnv): void => {
  if (NODE_ENV === "development") {
    app.use("/test", testRoutes);
  }
};

const startServer = () => {
  const { SERVER_PORT, NODE_ENV } = container.resolve<Env>(Dependency.env);
  const log = container.resolve<Logger>(Dependency.logger);

  const app = express();

  configureRoutes(app, NODE_ENV);

  app.use(express.json());
  app.use(errorHandler);

  const server = app.listen(SERVER_PORT, () =>
    log("server", `Listening on port ${SERVER_PORT}`)
  );

  return { server };
};

export { startServer };
