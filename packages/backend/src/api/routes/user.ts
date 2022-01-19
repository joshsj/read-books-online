import { handleAsync } from "@backend/api/common/utilities/request";
import { Dependency } from "@backend/application/dependency";
import { ICQRS } from "@core/cqrs/types";
import { Router } from "express";

const router = Router();

router.post(
  "",
  handleAsync(async ({ body }, {}, { getPerRequestContainer }) => {
    await getPerRequestContainer().resolve<ICQRS>(Dependency.cqrs).send(body);

    return { state: "created" };
  })
);

export { router as userRoutes };
