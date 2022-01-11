import { RBOError } from "@/application/common/error/rboError";

type EndpointRes<T> = T extends void ? Promise<RBOError> : Promise<T | RBOError>;

type Endpoint<TReq extends object | void = void, TRes extends object | void = void> = TReq extends void
  ? () => EndpointRes<TRes>
  : (req: TReq) => EndpointRes<TRes>;

export { Endpoint, EndpointRes };
