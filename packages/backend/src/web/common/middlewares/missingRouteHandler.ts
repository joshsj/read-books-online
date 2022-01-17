import { Handler } from "express";
import { handleAsync } from "@backend/web/common/utilities/requestHelper";
import { RBOErrorDto } from "@backend/web/common/models/error";

const missingRouteHandler: Handler = handleAsync(async ({}, res) => {
  const dto: RBOErrorDto = { rboError: true, type: "invalidRoute", message: "Invalid route" };

  res.status(404).json(dto).end();
});

export { missingRouteHandler };
