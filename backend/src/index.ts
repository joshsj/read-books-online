import { IConfiguration } from "@/application/common/interfaces/configuration";
import { IHashingService } from "@/application/common/interfaces/hashingService";
import { Dependency, registerApplicationDependencies } from "@/application/dependency";
import { Env, getEnv } from "@/env";
import { registerInfrastructureDependencies } from "@/infrastructure/dependency";
import { HashingService } from "@/infrastructure/hashingService";
import { logger } from "@/infrastructure/logger";
import { createMongoConnection } from "@/infrastructure/repository/connection";
import { startServer } from "@/web/server";
import { Algorithm } from "jsonwebtoken";
import { container } from "tsyringe";
import { Mode } from "./application/common/interfaces/mode";

const registerInitDependencies = (env: Env) => {
  const configuration: IConfiguration = {
    mode: env.NODE_ENV as Mode,
    server: {
      port: parseInt(env.SERVER_PORT),
    },
    hashing: {
      saltRounds: parseInt(env.HASHING_SALT_ROUNDS),
    },
    jwt: {
      secret: env.JWT_SECRET,
      expiresIn: env.JWT_EXPIRES_IN,
      algorithm: env.JWT_ALGORITHM as Algorithm,
      issuer: env.JWT_ISSUER,
      audience: env.JWT_AUDIENCE,
    },
    mongo: {
      uri: env.MONGO_URI,
      databaseName: env.MONGO_DB_NAME,
    },
  };

  if (!IConfiguration.guard(configuration)) {
    throw new Error("Invalid configuration");
  }

  container
    .register<IHashingService>(Dependency.hashingService, {
      useValue: new HashingService(),
    })
    .register<IConfiguration>(Dependency.configuration, {
      useValue: configuration,
    });
};

const main = async () => {
  const env = getEnv();
  logger("init", env);

  registerInitDependencies(env);
  registerApplicationDependencies();
  registerInfrastructureDependencies();

  await createMongoConnection();

  startServer();
};

main();
