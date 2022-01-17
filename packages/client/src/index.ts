import { isId } from "@backend/domain/common/id";
import { RBOErrorDto } from "@backend/web/common/models/error";
import {
  EndpointName,
  RBOClientMethod,
  RBOClientRequester,
  RBOClientRequestState,
  RequestData,
} from "@client/types";
import { ensure, toUrlParams } from "@core/utilities";

const endpointNameMethods: { [K in EndpointName]: RBOClientMethod } = {
  get: "GET",

  post: "POST",
  create: "POST",

  put: "PUT",
  update: "PUT",

  delete: "DELETE",
};

const getRequestState = (data: RequestData, segments: string[]): RBOClientRequestState => {
  const finalSegment = segments.pop()!;
  const method = endpointNameMethods[finalSegment as EndpointName];
  const endpoint = segments.join("/");

  if (!data) {
    return {
      endpoint: endpoint,
      body: undefined,
      method,
    };
  }

  if (isId(data)) {
    return {
      endpoint: endpoint + "/" + data,
      body: undefined,
      method,
    };
  }

  const [url, body] =
    method === "GET" ? [endpoint + "?" + toUrlParams(data)] : [endpoint, JSON.stringify(data)];

  return {
    endpoint: url,
    body,
    method,
  };
};

const callEndpoint = (segments: string[], args: any[], requester: RBOClientRequester) => {
  ensure(
    segments.length > 1,
    new Error("Invalid segments, at least two segments are required to form an endpoint")
  );

  return requester(getRequestState(args[0] as RequestData, segments));
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

    apply: ({}, {}, args) => callEndpoint(segments, args, requester),
  });

const checkKey: Extract<keyof RBOErrorDto, "rboError"> = "rboError";
const checkValue: RBOErrorDto["rboError"] = true;
const isRBOError = (obj: any): obj is RBOErrorDto => obj && obj[checkKey] === checkValue;

export { createClientProxy, isRBOError };
