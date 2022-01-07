import { IConfiguration } from "@/application/common/interfaces/configuration";
import { IHashingService } from "@/application/common/interfaces/hashingService";
import { ILogger } from "@/application/common/interfaces/logger";
import { Mode } from "@/application/common/interfaces/mode";
import { Dependency, registerApplicationDependencies } from "@/application/dependency";
import { ensure } from "@/common/utilities";
import { Env, getEnv } from "@/env";
import { registerInfrastructureDependencies } from "@/infrastructure/dependency";
import { HashingService } from "@/infrastructure/hashingService";
import { logger } from "@/infrastructure/logger";
import { createMongoConnection } from "@/infrastructure/repository/connection";
import { Server } from "@/web/server";
import { Algorithm } from "jsonwebtoken";
import { container } from "tsyringe";

const registerInitDependencies = (env: Env) => {
  const configuration: IConfiguration = {
    mode: env.NODE_ENV as Mode,
    server: {
      port: parseInt(env.SERVER_PORT),
      cookie: {
        secret: env.SERVER_COOKIE_SECRET,
        refreshTokenKey: env.SERVER_COOKIE_REFRESH_TOKEN_KEY,
      },
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

  logger("init", "Configuration", ...Object.entries(configuration));

  ensure(IConfiguration.guard(configuration), new Error("Invalid configuration"));

  container
    .register<IHashingService>(Dependency.hashingService, {
      useFactory: (c) => new HashingService(c.resolve<IConfiguration>(Dependency.configuration)),
    })
    .register<IConfiguration>(Dependency.configuration, {
      useValue: configuration,
    });
};

const main = async () => {
  const env = getEnv();

  registerInitDependencies(env);
  registerApplicationDependencies();
  registerInfrastructureDependencies();

  await createMongoConnection();

  new Server(
    container.resolve<ILogger>(Dependency.logger),
    container.resolve<IConfiguration>(Dependency.configuration)
  ).start();
};

main();
