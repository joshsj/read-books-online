import { RequestHandler, Response } from "express-serve-static-core";

type ResponseHelper = {
  ok(result?: object): void;
  created(): void;
  noContent(): void;
};

type AsyncRequestHandler = (
  ..._: [...Parameters<RequestHandler>, ResponseHelper]
) => Promise<void>;

const handleAsync =
  (handler: AsyncRequestHandler): RequestHandler =>
  (req, res, next) =>
    handler(req, res, next, createResponseHelper(res)).catch(next);

const ok = (res: Response, result?: object) => {
  res.status(200);

  result ? res.json(result) : res.end();
};
const created = (res: Response) => res.status(201).end();
const noContent = (res: Response) => res.status(204).end();

const createResponseHelper = (res: Response): ResponseHelper => ({
  ok: (result) => ok(res, result),
  created: () => created(res),
  noContent: () => noContent(res),
});

export { handleAsync, ok, created, noContent, createResponseHelper };
