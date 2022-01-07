import { Handler } from "express";
import { handleAsync } from "@/web/common/utilities/requestHelper";
import { ErrorDto } from "@/web/common/models/error";

const missingRouteHandler: Handler = handleAsync(async ({}, res) => {
  const dto: ErrorDto = { error: true, type: "invalidRoute" };
  res.status(404).json(dto).end();
});

export { missingRouteHandler };
