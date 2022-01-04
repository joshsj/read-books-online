import { ValidationError } from "@/application/common/error/validationError";
import { IConfiguration } from "@/application/common/interfaces/configuration";
import { IHashingService } from "@/application/common/interfaces/hashingService";
import { IUserRepository } from "@/application/common/interfaces/repository";
import { ensure } from "@/common/utilities";
import { Dependency } from "@/infrastructure/dependency";
import { AccountDto, JWTPayload, TokenDto } from "@/web/common/models/auth";
import { handleAsync } from "@/web/common/utilities/requestHelper";
import { Router } from "express";
import jwt from "jsonwebtoken";
import { container } from "tsyringe";

const routes = Router();

routes.post(
  "",
  handleAsync(async ({ body: accountDto }, {}, { ok }) => {
    if (!AccountDto.guard(accountDto)) {
      throw new ValidationError();
    }

    const userRepository = container.resolve<IUserRepository>(Dependency.userRepository);
    const hashingService = container.resolve<IHashingService>(Dependency.hashingService);
    const {
      jwt: { secret, expiresIn, algorithm },
    } = container.resolve<IConfiguration>(Dependency.configuration);

    const user = await userRepository.getByUsername(accountDto.username);

    ensure(!!user);
    ensure(await hashingService.compare(accountDto.password, user.passwordHash));

    const payload: JWTPayload = { sub: user.id };
    const dto: TokenDto = {
      token: jwt.sign(payload, secret, {
        algorithm: algorithm,
        expiresIn: expiresIn,
      }),
    };

    ok(dto);
  })
);

export { routes as authRoutes };
