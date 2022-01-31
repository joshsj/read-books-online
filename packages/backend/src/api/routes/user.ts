import { handleAsync } from "@backend/api/common/utilities/request";
import { Dependency } from "@backend/application/dependency";
import { GetUserRequest } from "@backend/application/user/queries/getuser";
import { ICQRS } from "@core/cqrs/types/service";
import { Router } from "express";
import { authenticator } from "../common/middlewares/authenticator";

const router = Router();

router.get(
  "/:username",
  authenticator,
  handleAsync(async ({ params }, {}, { getPerRequestContainer }) => {
    const request: GetUserRequest = {
      requestName: "getUserRequest",
      username: params.username!,
    };

    const value = await getPerRequestContainer().resolve<ICQRS>(Dependency.cqrs).send(request);

    return { state: "ok", value };
  })
);

router.post(
  "",
  handleAsync(async ({ body }, {}, { getPerRequestContainer }) => {
    await getPerRequestContainer().resolve<ICQRS>(Dependency.cqrs).send(body);

    return { state: "created" };
  })
);

export { router as userRoutes };
