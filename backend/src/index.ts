import { getEnv } from "./env";
import { createServer } from "./server";

const main = async () => {
  const env = getEnv();

  console.log(env);

  createServer(env);
};

main();
