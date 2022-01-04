import { Mode } from "@/application/common/interfaces";

type Env = Readonly<{
  SERVER_PORT: number;

  NODE_ENV: Mode;

  MONGO_URI: string;
  MONGO_DB_NAME: string;

  SALT_ROUNDS: number;
}>;

type FileEnv = { [K in keyof Env]: string };

const getEnv = (): Env => {
  const { SERVER_PORT, NODE_ENV, MONGO_URI, MONGO_DB_NAME, SALT_ROUNDS } =
    process.env as FileEnv;

  return Object.freeze({
    SERVER_PORT: parseInt(SERVER_PORT),
    NODE_ENV: NODE_ENV as Mode,
    MONGO_URI,
    MONGO_DB_NAME,
    SALT_ROUNDS: parseInt(SALT_ROUNDS),
  });
};

export { Env, getEnv };
