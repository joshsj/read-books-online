import { getEnv } from "./env";

const main = async () => {
  const env = getEnv();

  console.log(env);
};

main();
