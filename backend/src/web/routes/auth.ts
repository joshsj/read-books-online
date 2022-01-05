import { ValidationError } from "@/application/common/error/validationError";
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
    if (!AccountDto.guard(accountDto)) {
      throw new ValidationError();
    }

    const configuration = container.resolve<IConfiguration>(Dependency.configuration);
    const hashingService = container.resolve<IHashingService>(Dependency.hashingService);
    const user = await container.resolve<IUserRepository>(Dependency.userRepository).getByUsername(accountDto.username);

    ensure(!!user);
    ensure(await hashingService.compare(accountDto.password, user.passwordHash));

    const token = signToken({ sub: user.id }, configuration);
    const tokenDto: TokenDto = { token };

    ok(tokenDto);
  })
);

export { routes as authRoutes };
