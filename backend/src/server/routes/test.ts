import { Router } from "express";

const routes = Router();

routes.get("*", (_req, res) => res.send("hello world"));

export { routes as testRoutes };
