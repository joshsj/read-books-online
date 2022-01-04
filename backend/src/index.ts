import { startServer } from "@/web/server";
import { Mode } from "@/application/common/interfaces";
import { IHashingService } from "@/application/common/interfaces/hashingService";
import { registerApplicationDependencies } from "@/application/dependency";
import { Env, getEnv } from "@/env";
import {
  Dependency,
  registerInfrastructureDependencies,
} from "@/infrastructure/dependency";
import { logger } from "@/infrastructure/logger";
import { createMongoConnection } from "@/infrastructure/repository/connection";
import { container } from "tsyringe";
import { HashingService } from "./infrastructure/hashingService";

const registerInitDependencies = ({ NODE_ENV, SALT_ROUNDS }: Env) => {
  container
    .register<Mode>(Dependency.mode, { useValue: NODE_ENV })
    .register<IHashingService>(Dependency.hashingService, {
      useValue: new HashingService(SALT_ROUNDS),
    });
};

const main = async () => {
  const env = getEnv();
  logger("init", env);

  registerInitDependencies(env);
  registerApplicationDependencies();
  registerInfrastructureDependencies();

  await createMongoConnection(env.MONGO_URI, env.MONGO_DB_NAME);

  startServer(env.SERVER_PORT, env.NODE_ENV);
};

main();
