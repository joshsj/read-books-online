import { ApiError } from "@/application/common/error/apiError";
import { failedToCreateAuthToken, incorrectPassword, userNotFound } from "@/application/common/error/messages";
import { IConfiguration } from "@/application/common/interfaces/configuration";
import { IHashingService } from "@/application/common/interfaces/hashingService";
import { IUserRepository } from "@/application/common/interfaces/repository";
import { Dependency } from "@/application/dependency";
import { ensure } from "@/common/utilities";
import { AccountDto, TokenDto } from "@/web/common/models/auth";
import { handleAsync } from "@/web/common/utilities/requestHelper";
import { Router } from "express";
import { container } from "tsyringe";

const routes = Router();

routes.post(
  "",
  handleAsync(async ({ body: accountDto }, {}, { ok, signToken }) => {
    ensure(AccountDto.guard(accountDto), new ApiError("validation"));

    const configuration = container.resolve<IConfiguration>(Dependency.configuration);
    const hashingService = container.resolve<IHashingService>(Dependency.hashingService);
    const user = await container.resolve<IUserRepository>(Dependency.userRepository).getByUsername(accountDto.username);

    ensure(!!user, new ApiError("missing", userNotFound(accountDto.username)));
    ensure(
      await hashingService.compare(accountDto.password, user.passwordHash),
      new ApiError("authentication", incorrectPassword(accountDto.username))
    );

    const token = await signToken({ sub: user.id }, configuration);
    ensure(token !== false, new ApiError("authentication", failedToCreateAuthToken));

    const tokenDto: TokenDto = { token };

    ok(tokenDto);
  })
);

export { routes as authRoutes };
