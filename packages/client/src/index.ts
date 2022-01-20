import { isId } from "@backend/domain/common/id";
import {
  EndpointName,
  RBOClientMethod,
  RBOClientRequester,
  RBOClientRequestState,
  RBOErrorDto,
  RequestData,
} from "@client/types";
import { ensure } from "@core/utilities";
import { toUrlParams } from "@core/utilities/http";

const defaultHeaders: HeadersInit = Object.freeze({ "Content-Type": "application/json" });

const endpointNameMethods: { [K in EndpointName]: RBOClientMethod } = {
  get: "GET",

  post: "POST",
  create: "POST",

  put: "PUT",
  update: "PUT",

  delete: "DELETE",
};

const getRequestState = (data: RequestData<any>, segments: string[]): RBOClientRequestState => {
  const finalSegment = segments.pop()!;
  const method = endpointNameMethods[finalSegment as EndpointName];
  const endpoint = segments.join("/");

  if (!data) {
    return {
      endpoint: endpoint,
      body: undefined,
      method,
      defaultHeaders,
    };
  }

  if (isId(data)) {
    return {
      endpoint: endpoint + "/" + data,
      body: undefined,
      method,
      defaultHeaders,
    };
  }

  const [url, body] =
    method === "GET" ? [endpoint + "?" + toUrlParams(data)] : [endpoint, JSON.stringify(data)];

  return {
    endpoint: url,
    body,
    method,
    defaultHeaders,
  };
};

const callRequester = (segments: string[], args: any[], requester: RBOClientRequester) => {
  ensure(
    segments.length > 1,
    new Error("Invalid segments, at least two segments are required to form an endpoint")
  );

  return requester(getRequestState(args[0] as RequestData<any>, segments));
};

// allows apply, construct proxy methods
const dummy = Object.assign(class {}, () => void 0);

const createClientProxy = (segments: string[], requester: RBOClientRequester): unknown =>
  new Proxy(dummy, {
    get({}, segment) {
      if (typeof segment !== "string") {
        return undefined;
      }

      return createClientProxy([...segments, segment], requester);
    },

    apply: ({}, {}, args) => callRequester(segments, args, requester),
  });

const checkKey: Extract<keyof RBOErrorDto, "rboError"> = "rboError";
const checkValue: RBOErrorDto["rboError"] = true;
const isRBOError = (obj: any): obj is RBOErrorDto => obj && obj[checkKey] === checkValue;

export { createClientProxy, isRBOError };
