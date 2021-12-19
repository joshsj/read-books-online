import "reflect-metadata";
import { container } from "tsyringe";
import { Dependency, Logger } from "./dependency";
import { Env, getEnv } from "./env";
import { startServer } from "./server";

// TODO: consider moving
const logger: Logger = (context, data: any, ...rest: any[]) =>
  console.log(`[${context}] ${[data, ...rest]}`);

const configureDependencies = (env: Env) =>
  container
    .register<Logger>(Dependency.logger, { useValue: logger })
    .register<Env>(Dependency.env, { useValue: env });

const main = async () => {
  const env = getEnv();

  logger("general", "info");
  logger("general", "info", { infoAgain: 1 });

  configureDependencies(env);

  startServer();
};

main();
