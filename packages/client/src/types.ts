import { RBOErrorDto } from "@backend/application/common/dtos/errorDto";
import { IAuthClient, IReferenceDataClient, ITicketClient, IUserClient } from "@client/clients";

type EndpointName = "get" | "post" | "create" | "put" | "update" | "delete";

type ResponseData = object | void;
type RequestData<T extends EndpointName> =
  | ResponseData
  | (T extends "get" | "delete" ? string : never);

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

type RBOClient = IAuthClient & ITicketClient & IUserClient & IReferenceDataClient;

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
