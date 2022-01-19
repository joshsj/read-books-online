import { ICQRS } from "@core/cqrs/types";
import { Dependency } from "@backend/application/dependency";
import { handleAsync } from "@backend/api/common/utilities/request";
import { Router } from "express";
import { container } from "tsyringe";

const router = Router();

router.post(
  "",
  handleAsync(async ({ body }, {}) => {
    await container.resolve<ICQRS>(Dependency.cqrs).send(body);

    return { state: "created" };
  })
);

export { router as userRoutes };
