import { requestLoggerBehavior } from "@/application/behaviors/requestLoggerBehavior";
import { validatorBehavior } from "@/application/behaviors/validatorBehavior";
import { logger } from "@/application/logger";
import {
  testRequestHandler,
  testRequestValidator,
} from "@/application/features/test";
import { IBehavior, ICQRSManager, IRequestSender } from "@/common/cqrs";
import { Dependency, ILogger } from "@/dependency";
import { Env, getEnv } from "@/env";
import { startServer } from "@/hosting";
import { createCQRSManager } from "@/library/cqrsManager";
import { container } from "tsyringe";

// TODO: replace with directory scanning
const registerCQRSDependencies = (cqrsManager: ICQRSManager) => {
  const register = <T>(token: symbol, arr: T[]) =>
    arr.forEach((x) => container.register<T>(token, { useValue: x }));

  container.register<IRequestSender>(Dependency.requestSender, {
    useValue: cqrsManager.sender,
  });

  register<IBehavior>(Dependency.behavior, [
    requestLoggerBehavior,
    validatorBehavior,
  ]);

  register(Dependency.handler, [testRequestHandler]);
  register(Dependency.validator, [testRequestValidator]);
};

const main = async () => {
  const env = getEnv();

  container
    .register<ILogger>(Dependency.logger, { useValue: logger })
    .register<Env>(Dependency.env, { useValue: env });

  const cqrsManager = createCQRSManager();
  registerCQRSDependencies(cqrsManager);

  logger("init", "Using env", env);

  startServer();
};

main();
