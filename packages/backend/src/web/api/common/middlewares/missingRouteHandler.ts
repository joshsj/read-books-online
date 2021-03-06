import { RBOErrorDto } from "@backend/application/common/dtos/errorDto";
import { Handler } from "express";

const missingRouteHandler: Handler = ({}, res) => {
  const dto: RBOErrorDto = {
    rboError: true,
    type: "invalidRoute",
    message: "Invalid route",
  };

  res.status(404).json(dto).end();
};

export { missingRouteHandler };
