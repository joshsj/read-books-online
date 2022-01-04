import { ILogger } from "@/application/common/interfaces/logger";
import { ICQRS } from "@/application/common/interfaces/cqrs";
import { IUserRepository } from "@/application/common/interfaces/repository";
import { Dependency as ApplicationDependency } from "@/application/dependency";
import { toDependencies } from "@/common/utilities";
import { CQRS } from "@/infrastructure/cqrs";
import { logger } from "@/infrastructure/logger";
import { UserRepository } from "@/infrastructure/repository/userRepository";
import { container } from "tsyringe";

const Dependency = {
  ...ApplicationDependency,
  ...toDependencies(["mode", "jwtConfiguration"]),
};

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
