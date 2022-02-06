import { Router } from "express";
import { authenticator } from "@backend/web/api/common/middlewares/authenticator";
import { handleAsync } from "@backend/web/api/common/utilities/request";

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
