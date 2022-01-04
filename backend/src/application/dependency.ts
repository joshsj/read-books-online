import { requestLoggerBehavior } from "@/application/common/behaviors/requestLoggerBehavior";
import { validatorBehavior } from "@/application/common/behaviors/validatorBehavior";
import { IBehavior } from "@/application/common/interfaces/cqrs";
import {
  createUserRequestHandler,
  createUserRequestValidator,
} from "@/application/user/createUser";
import { toDependencies } from "@/common/utilities";
import { container } from "tsyringe";
import { testRequestHandler, testRequestValidator } from "./test";

const Dependency = toDependencies([
  "logger",
  "handler",
  "behavior",
  "cqrs",
  "validator",
  "userRepository",
  "hashingService",
]);

// TODO: replace with directory scanning
const registerApplicationDependencies = () => {
  const register = <T>(token: symbol, arr: T[]) =>
    arr.forEach((x) => container.register<T>(token, { useValue: x }));

  register<IBehavior>(Dependency.behavior, [
    requestLoggerBehavior,
    validatorBehavior,
  ]);

  register(Dependency.handler, [testRequestHandler, createUserRequestHandler]);
  register(Dependency.validator, [
    testRequestValidator,
    createUserRequestValidator,
  ]);
};

export { Dependency, registerApplicationDependencies };
