import { IConfiguration } from "@/application/common/interfaces/configuration";
import { ILogger } from "@/application/common/interfaces/logger";
import { ensure } from "@/common/utilities";
import { Dependency } from "@/infrastructure/dependency";
import { handleAsync } from "@/web/common/utilities/requestHelper";
import { Handler } from "express";
import jwt from "jsonwebtoken";
import { container } from "tsyringe";

const authenticator: Handler = handleAsync(async ({}, {}, { getToken, setAuthenticated }) => {
  const log = container.resolve<ILogger>(Dependency.logger);

  const token = getToken();
  ensure(!!token);

  log("authentication", `Attempting with token ${token}`);

  const {
    jwt: { secret, algorithm },
  } = container.resolve<IConfiguration>(Dependency.configuration);

  jwt.verify(token, secret, { algorithms: [algorithm] });

  log("authentication", "Passed");

  setAuthenticated();
});

export { authenticator };
