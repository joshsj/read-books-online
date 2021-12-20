import { Router } from "express";
import { handleAsync } from "@/server/utilities";
import { throwApiError } from "@/error";

const routes = Router();

routes.get("/hello", (_req, res) => res.send("hello world"));

routes.get(
  "/throw",
  handleAsync(async () => throwApiError("validation", "some validation failed"))
);

export { routes as testRoutes };
