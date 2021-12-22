import { ILogger } from "@/application/common/interfaces";
import { registerApplicationDependencies } from "@/application/dependency";
import { Dependency as CommonDependency } from "@/common/dependency";
import { Env, getEnv } from "@/env";
import { logger } from "@/infrastructure/logger";
import { startServer } from "@/web/server";
import { container } from "tsyringe";
import { registerInfrastructureDependencies } from "@/infrastructure/dependency";
import { createMongoConnection } from "@/infrastructure/repository/mongo/connection";

const main = () => {
  const env = getEnv();
  logger("init", "Using env", env);

  container
    .register<ILogger>(CommonDependency.logger, { useValue: logger })
    .register<Env>(CommonDependency.env, { useValue: env });

  registerInfrastructureDependencies();
  registerApplicationDependencies();

  createMongoConnection(env.MONGO_URI, env.MONGO_DB_NAME);

  startServer();
};

main();
