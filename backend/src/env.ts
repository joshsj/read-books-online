import { Mode } from "@/application/common/interfaces";

type Env = Readonly<{
  SERVER_PORT: number;

  NODE_ENV: Mode;

  MONGO_URI: string;
  MONGO_DB_NAME: string;

  HASHING_SALT_ROUNDS: number;

  JWT_SECRET: string;
  JWT_EXPIRES_IN: string;
}>;

type FileEnv = { [K in keyof Env]: string };

const getEnv = (): Env => {
  const {
    SERVER_PORT,
    NODE_ENV,
    MONGO_URI,
    MONGO_DB_NAME,
    HASHING_SALT_ROUNDS,
    JWT_SECRET,
    JWT_EXPIRES_IN,
  } = process.env as FileEnv;

  return Object.freeze({
    SERVER_PORT: parseInt(SERVER_PORT),
    NODE_ENV: NODE_ENV as Mode,
    MONGO_URI,
    MONGO_DB_NAME,
    HASHING_SALT_ROUNDS: parseInt(HASHING_SALT_ROUNDS),
    JWT_SECRET,
    JWT_EXPIRES_IN,
  });
};

export { Env, getEnv };
