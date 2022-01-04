import { JWTConfiguration } from "@/application/common/models/jwtConfiguration";
import { ensure } from "@/common/utilities";
import { Dependency } from "@/infrastructure/dependency";
import { handleAsync } from "@/web/common/utilities/http";
import { Handler } from "express";
import jwt from "jsonwebtoken";
import { container } from "tsyringe";

const authentication: Handler = handleAsync(async (req, {}, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  // TODO: add error message
  ensure(!!token);

  const jwtConfiguration = container.resolve<JWTConfiguration>(
    Dependency.jwtConfiguration
  );

  jwt.verify(token, jwtConfiguration.secret, {
    algorithms: [jwtConfiguration.algorithm],
  });

  next();
});

export { authentication };
