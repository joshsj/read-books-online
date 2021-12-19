import { Env } from "@/env";
import express from "express";
import { testRoutes } from "./routes/test";

const createServer = ({ SERVER_PORT, NODE_ENV }: Env) => {
  const app = express();

  if (NODE_ENV === "development") {
    app.use("/test", testRoutes);
  }

  const server = app.listen(SERVER_PORT);

  return { server };
};

export { createServer };
