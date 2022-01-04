import { ValidationError } from "@/application/common/error/validationError";
import { JWTConfiguration } from "@/application/common/interfaces";
import { IHashingService } from "@/application/common/interfaces/hashingService";
import { IUserRepository } from "@/application/common/interfaces/repository";
import { ensure } from "@/common/utilities";
import { Dependency } from "@/infrastructure/dependency";
import { handleAsync } from "@/web/common/utilities/http";
import { Router } from "express";
import jwt from "jsonwebtoken";
import { container } from "tsyringe";
import { JWTPayload } from "../common/models/jwtPayload";
import { AccountDto } from "../dto/auth";

const routes = Router();

routes.post(
  "",
  handleAsync(async ({ body: accountDto }, res, {}, { ok }) => {
    if (!AccountDto.guard(accountDto)) {
      throw new ValidationError();
    }

    const userRepository = container.resolve<IUserRepository>(
      Dependency.userRepository
    );
    const hashingService = container.resolve<IHashingService>(
      Dependency.hashingService
    );
    const jwtConfiguration = container.resolve<JWTConfiguration>(
      Dependency.jwtConfiguration
    );

    const user = await userRepository.getByUsername(accountDto.username);

    ensure(!!user);
    ensure(
      await hashingService.compare(accountDto.password, user.passwordHash)
    );

    const payload: JWTPayload = { sub: user.id };
    const token = jwt.sign(payload, jwtConfiguration.secret, {
      expiresIn: jwtConfiguration.expiresIn,
    });

    res.setHeader("Authorization", `Bearer ${token}`);

    ok();
  })
);

export { routes as authRoutes };
