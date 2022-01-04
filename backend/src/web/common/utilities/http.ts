import { Response } from "express-serve-static-core";

const ok = (res: Response, result?: object) => {
  res.status(200);

  result ? res.json(result) : res.end();
};
const created = (res: Response) => res.status(201).end();
const noContent = (res: Response) => res.status(204).end();

export { ok, created, noContent };
