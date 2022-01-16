import { IConfiguration } from "@backend/application/common/interfaces/configuration";
import { Mode } from "@backend/application/common/interfaces/mode";
import { ensure, getEnv } from "@core/utilities";
import { JWTAlgorithm } from "@backend/domain/common/constrainedTypes";

const EnvArraySep = ",";

const EnvKeys = [
  "SERVER_PORT",
  "SERVER_CORS_ORIGINS",
  "NODE_ENV",
  "MONGO_URI",
  "MONGO_DB_NAME",
  "HASHING_SALT_ROUNDS",
  "AUTH_EXPIRES_IN_MS",
  "COOKIE_SECRET",
  "COOKIE_REFRESH_TOKEN_KEY",
  "JWT_SECRET",
  "JWT_ALGORITHM",
  "JWT_ISSUER",
  "JWT_AUDIENCE",
] as const;

const getConfiguration = (): IConfiguration => {
  const env = getEnv(EnvKeys, process.env);

  const expiresInMs = parseInt(env.AUTH_EXPIRES_IN_MS);

  const configuration: IConfiguration = {
    mode: env.NODE_ENV as Mode,
    auth: {
      expiresInMs,

      jwt: {
        secret: env.JWT_SECRET,
        algorithm: env.JWT_ALGORITHM as JWTAlgorithm,
        issuer: env.JWT_ISSUER,
        audience: env.JWT_AUDIENCE,
      },
    },

    server: {
      port: parseInt(env.SERVER_PORT),
      cors: { origins: env.SERVER_CORS_ORIGINS.split(EnvArraySep) },

      cookie: {
        secret: env.COOKIE_SECRET,
        refreshTokenKey: env.COOKIE_REFRESH_TOKEN_KEY,
      },
    },

    hashing: {
      saltRounds: parseInt(env.HASHING_SALT_ROUNDS),
    },

    mongo: {
      uri: env.MONGO_URI,
      databaseName: env.MONGO_DB_NAME,
    },
  };

  ensure(IConfiguration.isValidSync(configuration), new Error("Invalid configuration"));

  return configuration;
};

export { EnvKeys, getConfiguration };