import { ApiError } from "@/application/common/error/apiError";
import { invalidToken } from "@/application/common/error/messages";
import { ILogger } from "@/application/common/interfaces/logger";
import { ITokenService } from "@/application/common/interfaces/tokenService";
import { Dependency } from "@/application/dependency";
import { ensure } from "@/common/utilities";
import { handleAsync } from "@/web/common/utilities/requestHelper";
import { Handler } from "express";
import { container } from "tsyringe";

const authenticator: Handler = handleAsync(async ({}, {}, { getToken, setAuthenticated }) => {
  const log = container.resolve<ILogger>(Dependency.logger);
  const tokenService = container.resolve<ITokenService>(Dependency.tokenService);

  const token = getToken();
  ensure(!!token, new ApiError("authorization", invalidToken));

  log("authentication", `Attempting with token ${token}`);

  await tokenService.validate(token);

  log("authentication", "Passed");

  setAuthenticated();
});

export { authenticator };
