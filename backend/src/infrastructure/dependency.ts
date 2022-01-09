import { IConfiguration } from "@/application/common/interfaces/configuration";
import { ICQRS } from "@/application/common/interfaces/cqrs";
import { IHashingService } from "@/application/common/interfaces/hashingService";
import { IHttpContextService } from "@/application/common/interfaces/httpContextService";
import { IIdentityService } from "@/application/common/interfaces/identityService";
import { ILogger } from "@/application/common/interfaces/logger";
import { IRefreshTokenRepository, IUserRepository } from "@/application/common/interfaces/repository";
import { Dependency } from "@/application/dependency";
import { CQRS } from "@/infrastructure/cqrs";
import { IdentityService } from "@/infrastructure/identityService";
import { Logger } from "@/infrastructure/logger";
import { UserRepository } from "@/infrastructure/repository/userRepository";
import { RefreshTokenRepository } from "@/infrastructure/repository/refreshTokenRepository";
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
    .register<IRefreshTokenRepository>(Dependency.refreshTokenRepository, { useValue: new RefreshTokenRepository() })
    .register<ICQRS>(Dependency.cqrs, { useFactory: (c) => new CQRS(c) });
};

export { registerInfrastructureDependencies };
