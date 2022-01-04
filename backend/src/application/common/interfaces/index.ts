import { IRequest, IRequestName } from "@/application/common/interfaces/cqrs";

type ILoggerContext = "general" | "init" | "server" | "cqrs";
type ILogger = (context: ILoggerContext, data: any, ...rest: any[]) => void;

type IValidator<T extends IRequest<IRequestName>> = {
  requestName: T["requestName"];
  validate: (t: T) => Promise<void | never>;
};

type Mode = "development" | "production";

export { Mode, ILoggerContext, ILogger, IValidator };
