import { ensure } from "@/common/utilities";
import { isId } from "@/domain/common/id";
import { EndpointName, RequestData } from "@/web/client/types";
import { toUrlParams } from "../common/utilities/http";

type RBOMethod = "GET" | "POST" | "PUT" | "DELETE";

const endpointNameMethods: { [K in EndpointName]: RBOMethod } = {
  get: "GET",

  post: "POST",
  create: "POST",

  put: "PUT",
  update: "PUT",

  delete: "DELETE",
};

const getRequestData = (
  data: RequestData,
  segments: string[],
  { baseUrl, authenticationToken }: IRBOClientConfig
): {
  url: string;
  method: string;
  body: string | undefined;
  headers: Record<string, string> | undefined;
} => {
  const finalSegment = segments.pop()!;
  const method = endpointNameMethods[finalSegment as EndpointName];
  const endpoint = baseUrl + "/" + segments.join("/");
  const headers = authenticationToken
    ? { authentication: `Bearer ${authenticationToken}` }
    : undefined;

  if (!data) {
    return {
      url: endpoint,
      body: undefined,
      method,
      headers,
    };
  }

  if (isId(data)) {
    return {
      url: endpoint + "/" + data,
      body: undefined,
      method,
      headers,
    };
  }

  const [url, body] =
    method === "GET" ? [endpoint + "?" + toUrlParams(data)] : [endpoint, JSON.stringify(data)];

  return {
    url,
    body,
    method,
    headers,
  };
};

const callEndpoint = async (segments: string[], args: any[], config: IRBOClientConfig) => {
  ensure(
    segments.length > 1,
    new Error("Invalid segments, at least two segments are required to form an endpoint")
  );

  const { url, method, body, headers } = getRequestData(args[0] as RequestData, segments, config);

  return config
    .fetch(url, {
      method,
      body,
      headers,
    })
    .then((res) => res.json());
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

type Clients = {};

type IRBOClientConfig = {
  fetch: typeof fetch;
  baseUrl: string;
  authenticationToken?: string;
};

type IRBOClient = { new (config: IRBOClientConfig): Clients } & Clients;

const RBOClient: IRBOClient = createClientProxy([], {} as IRBOClientConfig);

export { IRBOClient, IRBOClientConfig, RBOClient, createClientProxy, RBOMethod };
