import { IncomingMessage, request } from "http";
import { RequestOptions } from "https";

const ok: Partial<Response> = { status: 200 };

const requestAsync = (options: RequestOptions): Promise<IncomingMessage> =>
  new Promise((res) => request(options, res));

export { ok, requestAsync };
