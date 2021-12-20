import { Router } from "express";
import { handleAsync } from "@/server/utilities";

const routes = Router();

routes.get("/hello", (_req, res) => res.send("hello world"));

routes.get(
  "/throw",
  handleAsync(async () => {
    throw "the very very bad thing";
  })
);

export { routes as testRoutes };
