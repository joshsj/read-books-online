import { Mode } from "@/application/common/interfaces/mode";
import { JWTAlgorithm } from "@/domain/common/constrainedTypes";
import { Algorithm } from "jsonwebtoken";
import { Number, Record, Static, String } from "runtypes";

const Env = Record({
  SERVER_PORT: Number,

  NODE_ENV: Mode,

  MONGO_URI: String,
  MONGO_DB_NAME: String,

  HASHING_SALT_ROUNDS: Number,

  JWT_SECRET: String,
  JWT_EXPIRES_IN: String,
  JWT_ALGORITHM: JWTAlgorithm,
}).asReadonly();

type Env = Static<typeof Env>;

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

  const env: Env = {
    SERVER_PORT: parseInt(SERVER_PORT),
    NODE_ENV: NODE_ENV as Mode,
    MONGO_URI,
    MONGO_DB_NAME,
    JWT_SECRET,
    JWT_EXPIRES_IN,
    JWT_ALGORITHM: JWT_ALGORITHM as Algorithm,
    HASHING_SALT_ROUNDS: parseInt(HASHING_SALT_ROUNDS),
  };

  const validation = Env.validate(env);

  if (!validation.success) {
    console.log("Invalid environment variables");
    console.log(validation.details);
    process.exit(1);
  }

  return Object.freeze(env);
};

export { Env, getEnv };
