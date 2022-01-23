import { RBOErrorDto } from "@backend/application/common/dtos/errorDto";
import { Id } from "@backend/domain/common/id";
import { IAuthClient, ITicketClient } from "@client/clients";

type EndpointName = "get" | "post" | "create" | "put" | "update" | "delete";

type ResponseData = object | void;
type RequestData<T extends EndpointName> = ResponseData | (T extends "get" ? Id : never);

type Endpoint<
  TName extends EndpointName,
  TReq extends RequestData<TName> = void,
  TRes extends ResponseData = void
> = {
  [K in TName]: (req: TReq) => Promise<TRes | RBOErrorDto>;
};

type RBOClientMethod = "GET" | "POST" | "PUT" | "DELETE";

type RBOClientRequestState = {
  endpoint: string;
  method: string;
  body: string | undefined;
  defaultHeaders: Record<string, string>;
};

type RBOClientRequester = (state: RBOClientRequestState) => Promise<any>;

type RBOClient = IAuthClient & ITicketClient;

export {
  Endpoint,
  EndpointName,
  RequestData,
  ResponseData,
  RBOClientRequester,
  RBOClientMethod,
  RBOClientRequestState,
  RBOClient,
  RBOErrorDto,
};
