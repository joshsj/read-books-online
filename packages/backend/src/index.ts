import { IConfiguration } from "@backend/application/common/interfaces/configuration";
import { ILogger } from "@backend/application/common/interfaces/logger";
import { Dependency, registerApplicationDependencies } from "@backend/application/dependency";
import { registerInitDependencies } from "@backend/dependency";
import { registerInfrastructureDependencies } from "@backend/infrastructure/dependency";
import { createMongoConnection } from "@backend/infrastructure/repository/connection";
import { Server } from "@backend/web/server";
import { container } from "tsyringe";
import { registerWebDependencies } from "@backend/web/dependency";

const main = async () => {
  registerApplicationDependencies();
  registerInfrastructureDependencies();
  registerWebDependencies();
  registerInitDependencies();

  await createMongoConnection();

  await new Server(
    container.resolve<ILogger>(Dependency.logger),
    container.resolve<IConfiguration>(Dependency.configuration)
  ).start();
};

main();
