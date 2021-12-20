type NodeEnv = "development" | "production";

type Env = Readonly<{
  SERVER_PORT: number;
  NODE_ENV: NodeEnv;
}>;
type FileEnv = { [K in keyof Env]: string };

const getEnv = (): Env => {
  const { SERVER_PORT, NODE_ENV } = process.env as FileEnv;

  return Object.freeze({
    SERVER_PORT: parseInt(SERVER_PORT),
    NODE_ENV: NODE_ENV as NodeEnv,
  });
};

export { getEnv, Env, NodeEnv };
