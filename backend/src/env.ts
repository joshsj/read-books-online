type NodeEnv = "development" | "production";

type Env = Readonly<{
  SERVER_PORT: number;

  NODE_ENV: NodeEnv;

  MONGO_URI: string;
  MONGO_DB_NAME: string;
}>;
type FileEnv = { [K in keyof Env]: string };

const getEnv = (): Env => {
  const { SERVER_PORT, NODE_ENV, MONGO_URI, MONGO_DB_NAME } =
    process.env as FileEnv;

  return Object.freeze({
    SERVER_PORT: parseInt(SERVER_PORT),
    NODE_ENV: NODE_ENV as NodeEnv,
    MONGO_URI,
    MONGO_DB_NAME,
  });
};

export { getEnv, Env, NodeEnv };
