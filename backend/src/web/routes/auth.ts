import { ApiError } from "@/application/common/error/apiError";
import { incorrectPassword, userNotFound } from "@/application/common/error/messages";
import { IHashingService } from "@/application/common/interfaces/hashingService";
import { IUserRepository } from "@/application/common/interfaces/repository";
import { ITokenService } from "@/application/common/interfaces/tokenService";
import { Dependency } from "@/application/dependency";
import { ensure } from "@/common/utilities";
import { AccountDto, TokenDto } from "@/web/common/models/auth";
import { handleAsync } from "@/web/common/utilities/requestHelper";
import { Router } from "express";
import { container } from "tsyringe";

const routes = Router();

routes.post(
  "",
  handleAsync(async ({ body: accountDto }, {}, { ok }) => {
    ensure(AccountDto.guard(accountDto), new ApiError("validation"));

    const hashingService = container.resolve<IHashingService>(Dependency.hashingService);
    const tokenService = container.resolve<ITokenService>(Dependency.tokenService);
    const user = await container.resolve<IUserRepository>(Dependency.userRepository).getByUsername(accountDto.username);

    ensure(!!user, new ApiError("missing", userNotFound(accountDto.username)));
    ensure(
      await hashingService.compare(accountDto.password, user.passwordHash),
      new ApiError("authentication", incorrectPassword(accountDto.username))
    );

    const token = await tokenService.create({ sub: user.id });
    const tokenDto: TokenDto = { token };

    ok(tokenDto);
  })
);

export { routes as authRoutes };
