import { ensure } from "@/common/utilities";
import { toUrlParams } from "@/web/common/utilities/http";
import { AuthClient } from "@/web/routes/auth";

type Fetch = typeof fetch;

const methods = {
  get: "GET",

  post: "POST",
  create: "POST",

  put: "PUT",
  update: "PUT",

  delete: "DELETE",
} as const;

const convertSegment = (segment: string, key: string): string | undefined => {
  const temp = segment.replace(key, "");

  return temp ? temp[0]!.toLowerCase() + temp.slice(1) : undefined;
};

const getMethod = (segment: string) => {
  const key = Object.keys(methods).find((m) => segment.startsWith(m));

  ensure(!!key, new Error(`Method could not be found for segment ${segment}`));

  return {
    newSegment: convertSegment(segment, key),
    method: methods[key as keyof typeof methods],
  };
};

const callEndpoint = (segments: string[], args: any[], _fetch: Fetch) => {
  ensure(segments.length > 1, new Error("Invalid segments, at least two segments are required to form an endpoint"));

  const { method, newSegment } = getMethod(segments.pop()!);

  newSegment && segments.push(newSegment);

  const data = args[0];
  const endpoint = "/" + segments.join("/") + (data && method === "GET" ? toUrlParams(data) : "");
  const body = data && method !== "GET" ? data : undefined;

  // TODO fetch

  console.log(method);
  console.log(endpoint);
  console.log(body);

  return;
};

// allows apply, construct proxy methods
const dummy = Object.assign(class {}, () => void 0);

const createSegmentProxy = (segments: string[], fetch: Fetch | undefined): any =>
  new Proxy(dummy, {
    get({}, segment) {
      if (typeof segment !== "string") {
        return undefined;
      }

      return createSegmentProxy([...segments, segment], fetch);
    },

    apply: ({}, {}, args) => {
      ensure(!!fetch, new Error("fetch parameter required when constructing"));

      callEndpoint(segments, args, fetch);
    },

    construct: ({}, args) => createSegmentProxy([], args[0]),
  });

type Clients = { auth: AuthClient };

type IRBOClient = {
  // TODO add base url
  new (fetch: Fetch): Clients;
} & Clients;

const RBOClient: IRBOClient = createSegmentProxy([], undefined);

export { IRBOClient, RBOClient };
