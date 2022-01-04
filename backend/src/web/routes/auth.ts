import { ValidationError } from "@/application/common/error/validationError";
import { IHashingService } from "@/application/common/interfaces/hashingService";
import { IUserRepository } from "@/application/common/interfaces/repository";
import { JWTConfiguration } from "@/application/common/models/jwtConfiguration";
import { ensure } from "@/common/utilities";
import { Dependency } from "@/infrastructure/dependency";
import { AccountDto, JWTPayload, TokenDto } from "@/web/common/models/auth";
import { handleAsync } from "@/web/common/utilities/http";
import { Router } from "express";
import jwt from "jsonwebtoken";
import { container } from "tsyringe";

const routes = Router();

routes.post(
  "",
  handleAsync(async ({ body: accountDto }, {}, {}, { ok }) => {
    if (!AccountDto.guard(accountDto)) {
      throw new ValidationError();
    }

    const userRepository = container.resolve<IUserRepository>(Dependency.userRepository);
    const hashingService = container.resolve<IHashingService>(Dependency.hashingService);
    const jwtConfiguration = container.resolve<JWTConfiguration>(Dependency.jwtConfiguration);

    const user = await userRepository.getByUsername(accountDto.username);

    ensure(!!user);
    ensure(await hashingService.compare(accountDto.password, user.passwordHash));

    const payload: JWTPayload = { sub: user.id };
    const dto: TokenDto = {
      token: jwt.sign(payload, jwtConfiguration.secret, {
        algorithm: jwtConfiguration.algorithm,
        expiresIn: jwtConfiguration.expiresIn,
      }),
    };

    ok(dto);
  })
);

export { routes as authRoutes };
