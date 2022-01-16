import { ICQRS } from "@core/cqrs/types";
import { Dependency } from "@backend/application/dependency";
import { handleAsync } from "@backend/web/common/utilities/requestHelper";
import { Router } from "express";
import { container } from "tsyringe";

const router = Router();

router.post(
  "",
  handleAsync(async ({ body }, {}, { created }) => {
    await container.resolve<ICQRS>(Dependency.cqrs).send(body);

    created();
  })
);

export { router as userRoutes };
