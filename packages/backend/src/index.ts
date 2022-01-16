import { IConfiguration } from "@backend/application/common/interfaces/configuration";
import { IHashingService } from "@backend/application/common/interfaces/hashingService";
import { ILogger } from "@backend/application/common/interfaces/logger";
import { Dependency, registerApplicationDependencies } from "@backend/application/dependency";
import { getConfiguration } from "@backend/configuration";
import { registerInfrastructureDependencies } from "@backend/infrastructure/dependency";
import { HashingService } from "@backend/infrastructure/hashingService";
import { createMongoConnection } from "@backend/infrastructure/repository/connection";
import { Server } from "@backend/web/server";
import { container } from "tsyringe";

const registerInitDependencies = () => {
  const configuration = getConfiguration();

  container
    .register<IHashingService>(Dependency.hashingService, {
      useFactory: (c) => new HashingService(c.resolve<IConfiguration>(Dependency.configuration)),
    })
    .register<IConfiguration>(Dependency.configuration, { useValue: configuration });

  container
    .resolve<ILogger>(Dependency.logger)
    .log("init", "Configuration", ...Object.entries(configuration));
};

const main = async () => {
  registerApplicationDependencies();
  registerInfrastructureDependencies();
  registerInitDependencies();

  await createMongoConnection();

  new Server(
    container.resolve<ILogger>(Dependency.logger),
    container.resolve<IConfiguration>(Dependency.configuration)
  ).start();
};

main();
