import { Mode } from "@/application/common/interfaces";
import { Algorithm } from "jsonwebtoken";

type Env = Readonly<{
  SERVER_PORT: number;

  NODE_ENV: Mode;

  MONGO_URI: string;
  MONGO_DB_NAME: string;

  HASHING_SALT_ROUNDS: number;

  JWT_SECRET: string;
  JWT_EXPIRES_IN: string;
  JWT_ALGORITHM: Algorithm;
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
    JWT_ALGORITHM,
  } = process.env as FileEnv;

  return Object.freeze({
    MONGO_URI,
    MONGO_DB_NAME,
    JWT_SECRET,
    JWT_EXPIRES_IN,
    SERVER_PORT: parseInt(SERVER_PORT),
    NODE_ENV: NODE_ENV as Mode,
    JWT_ALGORITHM: JWT_ALGORITHM as Algorithm,
    HASHING_SALT_ROUNDS: parseInt(HASHING_SALT_ROUNDS),
  });
};

export { Env, getEnv };
