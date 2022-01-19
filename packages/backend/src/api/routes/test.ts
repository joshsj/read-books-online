import { Router } from "express";
import { authenticator } from "@backend/api/common/middlewares/authenticator";
import { handleAsync } from "@backend/api/common/utilities/request";

const routes = Router();

routes.get(
  "/hello",
  handleAsync(async () => ({ state: "ok", value: { hello: "world" } }))
);

routes.get(
  "/auth",
  authenticator,
  handleAsync(async () => ({ state: "ok", value: { authenticated: true } }))
);

export { routes as testRoutes };
