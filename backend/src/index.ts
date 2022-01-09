import { IConfiguration } from "@/application/common/interfaces/configuration";
import { IHashingService } from "@/application/common/interfaces/hashingService";
import { ILogger } from "@/application/common/interfaces/logger";
import { Dependency, registerApplicationDependencies } from "@/application/dependency";
import { getConfiguration } from "@/configuration";
import { registerInfrastructureDependencies } from "@/infrastructure/dependency";
import { HashingService } from "@/infrastructure/hashingService";
import { createMongoConnection } from "@/infrastructure/repository/connection";
import { Server } from "@/web/server";
import { container } from "tsyringe";

const registerInitDependencies = () => {
  const configuration = getConfiguration();

  container
    .register<IHashingService>(Dependency.hashingService, {
      useFactory: (c) => new HashingService(c.resolve<IConfiguration>(Dependency.configuration)),
    })
    .register<IConfiguration>(Dependency.configuration, { useValue: configuration });

  container.resolve<ILogger>(Dependency.logger).log("init", "Configuration", ...Object.entries(configuration));
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
