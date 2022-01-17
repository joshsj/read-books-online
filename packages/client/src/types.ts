import { RBOError } from "@backend/application/common/error/rboError";
import { Id } from "@backend/domain/common/id";
import { IAuthClient } from "@client/clients";

type EndpointName = "get" | "post" | "create" | "put" | "update" | "delete";

type EndpointRes<T> = Promise<RBOError | (T extends void ? never : T)>;

type ResponseData = object | void;
type RequestData<T extends EndpointName = "get"> = ResponseData | (T extends "get" ? Id : never);

type Endpoint<
  TName extends EndpointName,
  TReq extends RequestData<TName> = void,
  TRes extends ResponseData = void
> = {
  [K in TName]: (req: TReq) => EndpointRes<TRes>;
};

type RBOClientMethod = "GET" | "POST" | "PUT" | "DELETE";

type RBOClientRequestState = {
  endpoint: string;
  method: string;
  body: string | undefined;
};

type RBOClientRequester = (state: RBOClientRequestState) => Promise<any>;

type RBOClient = IAuthClient;

export {
  Endpoint,
  EndpointName,
  EndpointRes,
  RequestData,
  ResponseData,
  RBOClientRequester,
  RBOClientMethod,
  RBOClientRequestState,
  RBOClient,
};
