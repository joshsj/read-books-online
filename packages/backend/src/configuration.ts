import { IConfiguration } from "@backend/application/common/interfaces/configuration";
import { Mode } from "@backend/application/common/interfaces/mode";
import { JWTAlgorithm } from "@backend/domain/common/constrainedTypes";
import { ensure } from "@core/utilities";
import { getEnv } from "@core/utilities/env";
import path from "path";

const EnvKeys = [
  "SERVER_PORT",
  "SERVER_HTTPS_KEY_PATH",
  "SERVER_HTTPS_CERT_PATH",
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
  "TICKET_COST_THRESHOLD",
  "EMAIL_HOST",
  "EMAIL_PORT",
  "EMAIL_FROM",
  "APP_URL",
] as const;

const getConfiguration = (): IConfiguration => {
  const env = getEnv(EnvKeys, process.env);

  const expiresInMs = parseInt(env.AUTH_EXPIRES_IN_MS);

  const configuration: IConfiguration = {
    mode: env.NODE_ENV as Mode,
    appUrl: env.APP_URL,

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

      https: {
        certPath: path.normalize(env.SERVER_HTTPS_CERT_PATH),
        keyPath: path.normalize(env.SERVER_HTTPS_KEY_PATH),
      },

      cookie: {
        secret: env.COOKIE_SECRET,
        refreshTokenKey: env.COOKIE_REFRESH_TOKEN_KEY,
      },
    },

    email: {
      host: env.EMAIL_HOST,
      port: parseInt(env.EMAIL_PORT),
      from: env.EMAIL_FROM,
    },

    hashing: {
      saltRounds: parseInt(env.HASHING_SALT_ROUNDS),
    },

    mongo: {
      uri: env.MONGO_URI,
      databaseName: env.MONGO_DB_NAME,
    },

    ticket: {
      costThreshold: parseInt(env.TICKET_COST_THRESHOLD),
    },
  };

  ensure(IConfiguration.isValidSync(configuration), new Error("Invalid configuration"));

  return configuration;
};

export { EnvKeys, getConfiguration };
