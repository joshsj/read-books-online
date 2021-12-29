import { requestLoggerBehavior } from "@/application/common/behaviors/requestLoggerBehavior";
import { validatorBehavior } from "@/application/common/behaviors/validatorBehavior";
import { IBehavior } from "@/application/common/interfaces/cqrs";
import { Dependency as CommonDependency } from "@/common/dependency";
import { toDependencies } from "@/common/utilities";
import { container } from "tsyringe";
import { testRequestHandler, testRequestValidator } from "./test";

const Dependency = {
  ...CommonDependency,
  ...toDependencies([
    "handler",
    "behavior",
    "requestSender",
    "validator",
    "userRepository",
  ]),
};

// TODO: replace with directory scanning
const registerApplicationDependencies = () => {
  const register = <T>(token: symbol, arr: T[]) =>
    arr.forEach((x) => container.register<T>(token, { useValue: x }));

  register<IBehavior>(Dependency.behavior, [
    requestLoggerBehavior,
    validatorBehavior,
  ]);

  register(Dependency.handler, [testRequestHandler]);
  register(Dependency.validator, [testRequestValidator]);
};

export { Dependency, registerApplicationDependencies };
