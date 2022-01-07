const EnvKeys = [
  "SERVER_PORT",
  "SERVER_COOKIE_SECRET",
  "SERVER_COOKIE_REFRESH_TOKEN_KEY",
  "NODE_ENV",
  "MONGO_URI",
  "MONGO_DB_NAME",
  "HASHING_SALT_ROUNDS",
  "JWT_SECRET",
  "JWT_EXPIRES_IN",
  "JWT_ALGORITHM",
  "JWT_ISSUER",
  "JWT_AUDIENCE",
] as const;

type EnvKey = typeof EnvKeys[number];
type Env = { [K in EnvKey]: string };

const getEnv = () =>
  EnvKeys.reduce<Partial<Env>>((env, key) => Object.assign(env, { [key]: process.env[key] }), {}) as Env;

export { Env, getEnv };
