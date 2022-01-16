import { RBOError } from "@backend/application/common/error/rboError";
import { Id } from "@backend/domain/common/id";

type EndpointName = "get" | "post" | "create" | "put" | "update" | "delete";

type EndpointRes<T> = T extends void ? Promise<RBOError> : Promise<T | RBOError>;

type ResponseData = object | void;
type RequestData<T extends EndpointName = "get"> = ResponseData | (T extends "get" ? Id : never);

type Endpoint<
  TName extends EndpointName,
  TReq extends RequestData<TName> = void,
  TRes extends ResponseData = void
> = {
  [K in TName]: (req: TReq) => EndpointRes<TRes>;
};

export { Endpoint, EndpointName, EndpointRes, RequestData, ResponseData };
