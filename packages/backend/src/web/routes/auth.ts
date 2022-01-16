import { IIdentityService } from "@backend/application/common/interfaces/identityService";
import { Dependency } from "@backend/application/dependency";
import { AccountDto, TokenDto } from "@backend/web/common/models/auth";
import {
  AssertSchema,
  assertSchema as _assertSchema,
} from "@backend/application/common/utilities/schema";
import { handleAsync } from "@backend/web/common/utilities/requestHelper";
import { Router } from "express";

const assertSchema: AssertSchema = _assertSchema;

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
    assertSchema(accountDto, AccountDto);

    const container = getPerRequestContainer();

    const token = await container
      .resolve<IIdentityService>(Dependency.identityService)
      .login(accountDto.username, accountDto.password);

    const tokenDto: TokenDto = { token };

    ok(tokenDto);
  })
);

export { routes as authRoutes };
