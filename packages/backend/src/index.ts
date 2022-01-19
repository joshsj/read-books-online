import { Server } from "@backend/api/server";
import { IConfiguration } from "@backend/application/common/interfaces/configuration";
import { ILogger } from "@backend/application/common/interfaces/logger";
import { Dependency, registerApplicationDependencies } from "@backend/application/dependency";
import { registerInitDependencies } from "@backend/dependency";
import { registerInfrastructureDependencies } from "@backend/infrastructure/dependency";
import { createMongoConnection } from "@backend/infrastructure/repository/connection";
import { container } from "tsyringe";

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
