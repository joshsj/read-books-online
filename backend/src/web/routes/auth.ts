import { ApiError } from "@/application/common/error/apiError";
import { IIdentityService } from "@/application/common/interfaces/identityService";
import { Dependency } from "@/application/dependency";
import { ensure } from "@/common/utilities";
import { AccountDto, TokenDto } from "@/web/common/models/auth";
import { handleAsync } from "@/web/common/utilities/requestHelper";
import { Router } from "express";

const routes = Router();

routes.post(
  "",
  handleAsync(async ({ body: accountDto }, {}, { ok, getPerRequestContainer }) => {
    ensure(AccountDto.guard(accountDto), new ApiError("validation"));

    const container = getPerRequestContainer();

    const token = await container
      .resolve<IIdentityService>(Dependency.identityService)
      .login(accountDto.username, accountDto.password);

    const tokenDto: TokenDto = { token };

    ok(tokenDto);
  })
);

export { routes as authRoutes };
