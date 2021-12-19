import { Dependency, Logger } from "@/dependency";
import { Env } from "@/env";
import express from "express";
import { container } from "tsyringe";
import { testRoutes } from "./routes/test";

const startServer = () => {
  const { SERVER_PORT, NODE_ENV } = container.resolve<Env>(Dependency.env);
  const log = container.resolve<Logger>(Dependency.logger);

  const app = express();

  app.use(express.json());

  if (NODE_ENV === "development") {
    app.use("/test", testRoutes);
  }

  const server = app.listen(SERVER_PORT, () =>
    log("server", `Listening on port ${SERVER_PORT}`)
  );

  return { server };
};

export { startServer };
