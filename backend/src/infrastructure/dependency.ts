import { ICQRS } from "@/application/common/interfaces/cqrs";
import { ILogger } from "@/application/common/interfaces/logger";
import { IUserRepository } from "@/application/common/interfaces/repository";
import { ITokenService } from "@/application/common/interfaces/tokenService";
import { Dependency } from "@/application/dependency";
import { CQRS } from "@/infrastructure/cqrs";
import { logger } from "@/infrastructure/logger";
import { UserRepository } from "@/infrastructure/repository/userRepository";
import { container } from "tsyringe";
import { TokenService } from "./tokenService";

const registerInfrastructureDependencies = () => {
  container
    .register<ILogger>(Dependency.logger, { useValue: logger })
    .register<IUserRepository>(Dependency.userRepository, { useValue: new UserRepository() })
    .register<ITokenService>(Dependency.tokenService, { useValue: new TokenService() })
    .register<ICQRS>(Dependency.cqrs, { useFactory: (c) => new CQRS(c) });
};

export { registerInfrastructureDependencies };
