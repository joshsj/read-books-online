import { IHttpContextService } from "@backend/application/common/interfaces/httpContextService";
import { Dependency } from "@backend/application/dependency";
import { HttpContextService } from "@backend/infrastructure/httpContextService";
import { DependencyContainer } from "tsyringe";
import { middlewareAsync } from "../utilities/request";

let contexts = 0;
const AuthenticationKey = "token" as const;

const configurePerSocketContainer = (serverContainer: DependencyContainer) =>
  middlewareAsync(async (socket) => {
    const container = serverContainer.createChildContainer();

    const authenticationTokenValue = socket.handshake.auth[AuthenticationKey];

    container.register<IHttpContextService>(Dependency.httpContextService, {
      useValue: new HttpContextService({
        type: "socket",
        id: contexts++,
        authenticationTokenValue,
        refreshTokenValue: undefined,
      }),
    });

    socket.data.container = container;
  });

export { configurePerSocketContainer };
