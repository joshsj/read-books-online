import { Literal, Record, Runtype } from "runtypes";
import { IRequest, IRequestName } from "../interfaces/cqrs";

const Request = <T extends IRequestName>(name: T): Runtype<IRequest<T>> =>
  Record({
    requestName: Literal(name),
  });

export { Request };
