import { ICQRS } from "@/application/common/interfaces/cqrs";
import { ILogger } from "@/application/common/interfaces/logger";
import { IUserRepository } from "@/application/common/interfaces/repository";
import { Dependency } from "@/application/dependency";
import { CQRS } from "@/infrastructure/cqrs";
import { logger } from "@/infrastructure/logger";
import { UserRepository } from "@/infrastructure/repository/userRepository";
import { container } from "tsyringe";

const registerInfrastructureDependencies = () => {
  container
    .register<ILogger>(Dependency.logger, { useValue: logger })
    .register<ICQRS>(Dependency.cqrs, {
      useFactory: (c) => new CQRS(c),
    })
    .register<IUserRepository>(Dependency.userRepository, {
      useValue: new UserRepository(),
    });
};

export { Dependency, registerInfrastructureDependencies };
