import { IConfiguration } from "@backend/application/common/interfaces/configuration";
import { ILogger } from "@backend/application/common/interfaces/logger";
import { ensure } from "@core/utilities";
import { Server as HttpServer } from "http";
import { startApiServer } from "./api";

class Server {
  constructor(private readonly logger: ILogger, private readonly configuration: IConfiguration) {}

  private _server: HttpServer | undefined = undefined;

  get server(): HttpServer {
    ensure(!!this._server, new Error("ApiServer has not been started"));

    return this._server;
  }

  async start() {
    await startApiServer(this.logger, this.configuration);
  }
}

export { Server };
