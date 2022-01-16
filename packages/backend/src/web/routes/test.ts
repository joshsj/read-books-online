import { Router } from "express";
import { authenticator } from "@backend/web/common/middlewares/authenticator";
import { handleAsync } from "@backend/web/common/utilities/requestHelper";

const routes = Router();

routes.get(
  "/hello",
  handleAsync(async ({}, res) => {
    res.status(200).json({ hello: "world" });
  })
);

routes.get(
  "/auth",
  authenticator,
  handleAsync(async ({}, res) => {
    res.status(200).json({ authenticated: true });
  })
);

export { routes as testRoutes };
