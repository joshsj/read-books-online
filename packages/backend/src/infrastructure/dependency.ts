import { IConfiguration } from "@backend/application/common/interfaces/configuration";
import { ICQRS } from "@backend/application/common/interfaces/cqrs";
import { IHashingService } from "@backend/application/common/interfaces/hashingService";
import { IHttpContextService } from "@backend/application/common/interfaces/httpContextService";
import { IIdentityService } from "@backend/application/common/interfaces/identityService";
import { ILogger } from "@backend/application/common/interfaces/logger";
import {
  IRefreshTokenRepository,
  IUserRepository,
} from "@backend/application/common/interfaces/repository";
import { Dependency } from "@backend/application/dependency";
import { CQRS } from "@backend/infrastructure/cqrs";
import { IdentityService } from "@backend/infrastructure/identityService";
import { Logger } from "@backend/infrastructure/logger";
import { UserRepository } from "@backend/infrastructure/repository/userRepository";
import { RefreshTokenRepository } from "@backend/infrastructure/repository/refreshTokenRepository";
import { container } from "tsyringe";

const registerInfrastructureDependencies = () => {
  container
    .register<ILogger>(Dependency.logger, {
      useFactory: (c) =>
        new Logger(
          c.isRegistered(Dependency.httpContextService)
            ? c.resolve<IHttpContextService>(Dependency.httpContextService)
            : undefined
        ),
    })
    .register<IIdentityService>(Dependency.identityService, {
      useFactory: (c) =>
        new IdentityService(
          c.resolve<IHttpContextService>(Dependency.httpContextService),
          c.resolve<IHashingService>(Dependency.hashingService),
          c.resolve<IConfiguration>(Dependency.configuration),
          c.resolve<IUserRepository>(Dependency.userRepository),
          c.resolve<IRefreshTokenRepository>(Dependency.refreshTokenRepository)
        ),
    })
    .register<IUserRepository>(Dependency.userRepository, { useValue: new UserRepository() })
    .register<IRefreshTokenRepository>(Dependency.refreshTokenRepository, {
      useValue: new RefreshTokenRepository(),
    })
    .register<ICQRS>(Dependency.cqrs, { useFactory: (c) => new CQRS(c) });
};

export { registerInfrastructureDependencies };
