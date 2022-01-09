import { IConfiguration } from "@/application/common/interfaces/configuration";
import { Mode } from "@/application/common/interfaces/mode";
import { ensure } from "@/common/utilities";
import { Algorithm } from "jsonwebtoken";

const EnvKeys = [
  "SERVER_PORT",
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

type EnvKey = typeof EnvKeys[number];
type Env = { [K in EnvKey]: string };

const getEnv = () =>
  EnvKeys.reduce<Partial<Env>>((env, key) => Object.assign(env, { [key]: process.env[key] }), {}) as Env;

const getConfiguration = (): IConfiguration => {
  const env = getEnv();

  const expiresInMs = parseInt(env.AUTH_EXPIRES_IN_MS);

  const configuration: IConfiguration = {
    mode: env.NODE_ENV as Mode,
    auth: {
      expiresInMs,

      jwt: {
        secret: env.JWT_SECRET,
        algorithm: env.JWT_ALGORITHM as Algorithm,
        issuer: env.JWT_ISSUER,
        audience: env.JWT_AUDIENCE,
      },
    },

    server: {
      port: parseInt(env.SERVER_PORT),
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

  ensure(IConfiguration.guard(configuration), new Error("Invalid configuration"));

  return configuration;
};

export { Env, getEnv, getConfiguration };
