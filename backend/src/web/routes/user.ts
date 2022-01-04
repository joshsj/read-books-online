import { ICQRS } from "@/application/common/interfaces/cqrs";
import { Dependency } from "@/application/dependency";
import { Router } from "express";
import { container } from "tsyringe";
import { handleAsync } from "@/web/common/utilities/requestHelper";

const router = Router();

router.post(
  "",
  handleAsync(async ({ body }, {}, {}, { created }) => {
    await container.resolve<ICQRS>(Dependency.cqrs).send(body);

    created();
  })
);

export { router as userRoutes };
