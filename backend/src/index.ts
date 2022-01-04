import { IHashingService } from "@/application/common/interfaces/hashingService";
import { Mode } from "@/application/common/interfaces/mode";
import { JWTConfiguration } from "@/application/common/models/jwtConfiguration";
import { registerApplicationDependencies } from "@/application/dependency";
import { Env, getEnv } from "@/env";
import { Dependency, registerInfrastructureDependencies } from "@/infrastructure/dependency";
import { HashingService } from "@/infrastructure/hashingService";
import { logger } from "@/infrastructure/logger";
import { createMongoConnection } from "@/infrastructure/repository/connection";
import { startServer } from "@/web/server";
import { container } from "tsyringe";

const registerInitDependencies = (env: Env) => {
  container
    .register<Mode>(Dependency.mode, { useValue: env.NODE_ENV })
    .register<IHashingService>(Dependency.hashingService, {
      useValue: new HashingService(env.HASHING_SALT_ROUNDS),
    })
    .register<JWTConfiguration>(Dependency.jwtConfiguration, {
      useValue: {
        secret: env.JWT_SECRET,
        expiresIn: env.JWT_EXPIRES_IN,
        algorithm: env.JWT_ALGORITHM,
      },
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
