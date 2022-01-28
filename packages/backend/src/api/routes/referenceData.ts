import { Dependency } from "@backend/application/dependency";
import { GetReferenceDataRequest } from "@backend/application/referenceData/queries/getReferenceData";
import { ReferenceDataType } from "@backend/domain/constants/referenceDataType";
import { ICQRS } from "@core/cqrs/types/service";
import { Router } from "express";
import { authenticator } from "../common/middlewares/authenticator";
import { handleAsync } from "../common/utilities/request";

const routes = Router().use(authenticator);

routes.get(
  "/:type",
  handleAsync(async ({ params }, {}, { getPerRequestContainer }) => {
    const { type } = params;

    const request: GetReferenceDataRequest = {
      requestName: "getReferenceDataRequest",
      type: type as ReferenceDataType,
    };

    const value = await getPerRequestContainer().resolve<ICQRS>(Dependency.cqrs).send(request);

    return { state: "ok", value };
  })
);

export { routes as referenceDataRoutes };
