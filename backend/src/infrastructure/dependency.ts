import { IConfiguration } from "@/application/common/interfaces/configuration";
import { ICQRS } from "@/application/common/interfaces/cqrs";
import { IHashingService } from "@/application/common/interfaces/hashingService";
import { IHttpContextService } from "@/application/common/interfaces/httpContextService";
import { IIdentityService } from "@/application/common/interfaces/identityService";
import { ILogger } from "@/application/common/interfaces/logger";
import { IUserRepository } from "@/application/common/interfaces/repository";
import { Dependency } from "@/application/dependency";
import { CQRS } from "@/infrastructure/cqrs";
import { IdentityService } from "@/infrastructure/identityService";
import { logger } from "@/infrastructure/logger";
import { UserRepository } from "@/infrastructure/repository/userRepository";
import { container } from "tsyringe";

const registerInfrastructureDependencies = () => {
  container
    .register<ILogger>(Dependency.logger, { useValue: logger })
    .register<IIdentityService>(Dependency.identityService, {
      useFactory: (c) =>
        new IdentityService(
          c.resolve<IHttpContextService>(Dependency.httpContextService),
          c.resolve<IHashingService>(Dependency.hashingService),
          c.resolve<IConfiguration>(Dependency.configuration),
          c.resolve<IUserRepository>(Dependency.userRepository)
        ),
    })
    .register<IUserRepository>(Dependency.userRepository, { useValue: new UserRepository() })
    .register<ICQRS>(Dependency.cqrs, { useFactory: (c) => new CQRS(c) });
};

export { registerInfrastructureDependencies };
