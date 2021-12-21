import { Router } from "express";
import { handleAsync } from "@/server/utilities";
import { throwApiError } from "@/error";
import { container } from "tsyringe";
import { Dependency } from "@/dependency";
import { IRequestSender } from "@/cqrs/types";
import { TestRequest } from "@/services/test";

const routes = Router();

routes.get("/hello", (_req, res) => res.send("hello world"));

routes.get(
  "/throw",
  handleAsync(async () => throwApiError("validation", "some validation failed"))
);

routes.get(
  "/handler",
  handleAsync(async () => {
    const request: TestRequest = {
      requestName: "testRequest",
      name: "the name is bond",
    };

    return await container
      .resolve<IRequestSender>(Dependency.requestSender)
      .send(request);
  })
);

export { routes as testRoutes };
