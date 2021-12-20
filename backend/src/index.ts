import "reflect-metadata";
import { container } from "tsyringe";
import { Dependency, Logger } from "./dependency";
import { Env, getEnv } from "./env";
import { startServer } from "./server";

const main = async () => {
  const env = getEnv();
  // TODO: consider moving
  const logger: Logger = (context, data: any, ...rest: any[]) =>
    console.log(
      `[${context}] ${[data, ...rest]
        .map((x) => (typeof x === "object" ? JSON.stringify(x) : x))
        .join(", ")}`
    );

  container
    .register<Logger>(Dependency.logger, { useValue: logger })
    .register<Env>(Dependency.env, { useValue: env });

  logger("init", "Using env", env);

  startServer();
};

main();
