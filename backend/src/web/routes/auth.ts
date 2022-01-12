import { RBOError } from "@/application/common/error/rboError";
import { IIdentityService } from "@/application/common/interfaces/identityService";
import { Dependency } from "@/application/dependency";
import { ensure } from "@/common/utilities";
import { AccountDto, TokenDto } from "@/web/common/models/auth";
import { handleAsync } from "@/web/common/utilities/requestHelper";
import { Router } from "express";

const routes = Router();

routes.get(
  "",
  handleAsync(async ({}, {}, { getPerRequestContainer, ok }) => {
    const container = getPerRequestContainer();

    const token = await container
      .resolve<IIdentityService>(Dependency.identityService)
      .login("refresh");
    const tokenDto: TokenDto = { token };

    ok(tokenDto);
  })
);

routes.post(
  "",
  handleAsync(async ({ body: accountDto }, {}, { ok, getPerRequestContainer }) => {
    ensure(AccountDto.guard(accountDto), new RBOError("validation"));

    const container = getPerRequestContainer();

    const token = await container
      .resolve<IIdentityService>(Dependency.identityService)
      .login(accountDto.username, accountDto.password);

    const tokenDto: TokenDto = { token };

    ok(tokenDto);
  })
);

export { routes as authRoutes };
