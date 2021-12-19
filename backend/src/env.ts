type Env = { SERVER_HOST: string; SERVER_PORT: number };
type FileEnv = { [K in keyof Env]: string };

const getEnv = (env?: any): Env => {
  const { SERVER_HOST, SERVER_PORT } = (env ?? process.env) as FileEnv;

  const data: Env = { SERVER_HOST, SERVER_PORT: parseInt(SERVER_PORT) };

  return data;
};

export { getEnv, Env };
