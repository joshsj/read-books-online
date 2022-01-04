import { JWTConfiguration } from "@/application/common/models/jwtConfiguration";
import { Dependency } from "@/infrastructure/dependency";
import { handleAsync } from "@/web/common/utilities/requestHelper";
import { Handler } from "express";
import jwt from "jsonwebtoken";
import { container } from "tsyringe";

const authenticator: Handler = handleAsync(async ({}, {}, next, { getToken, setAuthenticated }) => {
  const token = getToken();

  const jwtConfiguration = container.resolve<JWTConfiguration>(Dependency.jwtConfiguration);
  jwt.verify(token, jwtConfiguration.secret, { algorithms: [jwtConfiguration.algorithm] });

  setAuthenticated();

  next();
});

export { authenticator };
