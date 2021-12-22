import { Router } from "express";
import { handleAsync, ok } from "@/web/utilities";
import { throwApiError } from "@/web/error";
import { container } from "tsyringe";
import { Dependency } from "@/dependency";
import { ICQRS } from "@/common/cqrs/types";
import { TestRequest } from "@/application/test";

const routes = Router();

routes.get("/hello", (_req, res) => res.send("hello world"));

routes.get(
  "/throw",
  handleAsync(async () => throwApiError("validation", "some validation failed"))
);

routes.get(
  "/handler",
  handleAsync(async ({}, res) => {
    const request: TestRequest = {
      requestName: "testRequest",
      name: "the name is bond",
    };

    ok(
      res,
      await container.resolve<ICQRS>(Dependency.requestSender).send(request)
    );
  })
);

export { routes as testRoutes };
