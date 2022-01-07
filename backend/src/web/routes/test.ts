import { Router } from "express";
import { authenticator } from "@/web/middlewares/authenticator";
import { handleAsync } from "@/web/common/utilities/requestHelper";

const routes = Router();

routes.get(
  "/auth",
  authenticator,
  handleAsync(async ({}, res) => {
    res.send(200).json({ authenticated: true });
  })
);

export { routes as testRoutes };
