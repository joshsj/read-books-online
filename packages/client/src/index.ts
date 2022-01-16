import { isId } from "@backend/domain/common/id";
import { EndpointName, RequestData } from "@client/types";
import { Class, ensure, toUrlParams } from "@core/utilities";

type RBOMethod = "GET" | "POST" | "PUT" | "DELETE";

type RequestState = {
  url: string;
  method: string;
  body: string | undefined;
};

const endpointNameMethods: { [K in EndpointName]: RBOMethod } = {
  get: "GET",

  post: "POST",
  create: "POST",

  put: "PUT",
  update: "PUT",

  delete: "DELETE",
};

const getRequestState = (
  data: RequestData,
  segments: string[],
  { baseUrl }: IRBOClientConfig
): RequestState => {
  const finalSegment = segments.pop()!;
  const method = endpointNameMethods[finalSegment as EndpointName];
  const endpoint = baseUrl + "/" + segments.join("/");

  if (!data) {
    return {
      url: endpoint,
      body: undefined,
      method,
    };
  }

  if (isId(data)) {
    return {
      url: endpoint + "/" + data,
      body: undefined,
      method,
    };
  }

  const [url, body] =
    method === "GET" ? [endpoint + "?" + toUrlParams(data)] : [endpoint, JSON.stringify(data)];

  return {
    url,
    body,
    method,
  };
};

const callEndpoint = (segments: string[], args: any[], config: IRBOClientConfig) => {
  ensure(
    segments.length > 1,
    new Error("Invalid segments, at least two segments are required to form an endpoint")
  );

  return config.callback(getRequestState(args[0] as RequestData, segments, config));
};

// allows apply, construct proxy methods
const dummy = Object.assign(class {}, () => void 0);

const createClientProxy = (segments: string[], config: IRBOClientConfig): any =>
  new Proxy(dummy, {
    get({}, segment) {
      if (typeof segment !== "string") {
        return undefined;
      }

      return createClientProxy([...segments, segment], config);
    },

    apply: ({}, {}, args) => callEndpoint(segments, args, config),

    construct: ({}, args) => createClientProxy([], args[0]),
  });

type IRBOClient = {};

type IRBOClientConfig = {
  callback: (state: RequestState) => Promise<any>;
  baseUrl: string;
};

const RBOClient: Class<IRBOClient, [IRBOClientConfig]> = createClientProxy(
  [],
  {} as IRBOClientConfig
);

export { IRBOClient, IRBOClientConfig, RBOClient, createClientProxy, RBOMethod };
