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
  "mode",
  "jwtConfiguration",
  "hashingService",
  // repository
  "userRepository",
  // cqrs
  "cqrs",
  "requestHandler",
  "requestBehavior",
  "requestValidator",
  "requestAuthorizer",
]);

// TODO: replace with directory scanning
const registerApplicationDependencies = () => {
  const register = <T>(token: symbol, arr: T[]) =>
    arr.forEach((x) => container.register<T>(token, { useValue: x }));

  register<IBehavior>(Dependency.requestBehavior, [
    requestLoggerBehavior,
    validatorBehavior,
  ]);

  register(Dependency.requestHandler, [
    testRequestHandler,
    createUserRequestHandler,
  ]);
  register(Dependency.requestValidator, [
    testRequestValidator,
    createUserRequestValidator,
  ]);
};

export { Dependency, registerApplicationDependencies };
