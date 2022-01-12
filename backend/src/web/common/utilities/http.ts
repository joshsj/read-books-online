import { Response } from "express-serve-static-core";

const ok = (res: Response, result?: object) => {
  res.status(200);

  result ? res.json(result) : res.end();
};
const created = (res: Response) => res.status(201).end();
const noContent = (res: Response) => res.status(204).end();

const toUrlParams = (params: object) =>
  Object.entries(params)
    .map(([key, value]) => `${key}=${Array.isArray(value) ? value.join(",") : value}`)
    .join("&");

export { ok, created, noContent, toUrlParams };
