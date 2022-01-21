import { dateReviver } from "./date";

const toUrlParams = (params: object) =>
  Object.entries(params)
    .map(([key, value]) => `${key}=${encodeURIComponent(JSON.stringify(value))}`)
    .join("&");

const fromUrlParams = (params: string) =>
  params.split("&").reduce<any>((obj, pair) => {
    const [key, value] = pair.split("=") as [string, string];

    obj[key] = JSON.parse(decodeURIComponent(value), dateReviver);

    return obj;
  }, {});

export { toUrlParams, fromUrlParams };
