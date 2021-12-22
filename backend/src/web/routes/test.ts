import { Dependency } from "@/application/dependency";
import { TestRequest } from "@/application/test";
import { ICQRS } from "@/common/cqrs/types";
import { ApiError } from "@/web/error";
import { handleAsync, ok } from "@/web/utilities";
import { Router } from "express";
import { container } from "tsyringe";

const routes = Router();

routes.get("/hello", (_req, res) => res.send("hello world"));

routes.get(
  "/throw",
  handleAsync(async () => {
    throw new ApiError("validation", "some validation failed");
  })
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
