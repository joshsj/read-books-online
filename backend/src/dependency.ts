import { IRequest, IRequestName } from "./library/cqrs/types";

const Dependency = Object.freeze({
  logger: Symbol(),
  env: Symbol(),
  handler: Symbol(),
  behavior: Symbol(),
  requestSender: Symbol(),
  validator: Symbol(),
} as const);

type LoggerContext = "general" | "init" | "server" | "cqrs";
type Logger = (context: LoggerContext, data: any, ...rest: any[]) => void;

type IValidator<T extends IRequest<IRequestName>> = {
  requestName: T["requestName"];
  validate: (t: T) => string[];
};

export { Dependency, Logger, IValidator };
