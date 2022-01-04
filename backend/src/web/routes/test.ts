import { ICQRS } from "@/application/common/interfaces/cqrs";
import { Dependency } from "@/application/dependency";
import { TestRequest } from "@/application/test";
import { handleAsync, ok } from "@/web/common/utilities/http";
import { authenticator } from "@/web/middlewares/authenticator";
import { Router } from "express";
import { container } from "tsyringe";

const router = Router();

router.get("/hello", ({}, res) => res.send("hello world"));

router.get(
  "/throw",
  handleAsync(async () => {
    throw new Error("something bad happened");
  })
);

router.get(
  "/handler",
  handleAsync(async ({}, res) => {
    const request: TestRequest = {
      requestName: "testRequest",
      name: "the name is bond",
    };

    ok(
      res,
      (await container.resolve<ICQRS>(Dependency.cqrs).send(request)) ??
        undefined
    );
  })
);

router.get(
  "/auth",
  authenticator,
  handleAsync(async ({}, {}, {}, { ok }) => {
    ok({ authenticated: "yup" });
  })
);

export { router as testRoutes };
