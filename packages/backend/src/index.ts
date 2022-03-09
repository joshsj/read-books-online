import { IConfiguration } from "@backend/application/common/interfaces/configuration";
import { ILogger } from "@backend/application/common/interfaces/logger";
import { Dependency, registerApplicationDependencies } from "@backend/application/dependency";
import { registerInitDependencies } from "@backend/dependency";
import { registerInfrastructureDependencies } from "@backend/infrastructure/dependency";
import { createMongoConnection } from "@backend/infrastructure/repository/connection";
import { Server } from "@backend/web/server";
import { container } from "tsyringe";
import { MessageNotificationHandler } from "./web/socket/handlers/messageNotificationHandler";

const main = async () => {
  registerApplicationDependencies();
  registerInfrastructureDependencies();
  registerInitDependencies();

  await createMongoConnection();

  const { socketServer } = await new Server(
    container.resolve<ILogger>(Dependency.logger),
    container.resolve<IConfiguration>(Dependency.configuration)
  ).start();

  container.register(Dependency.notificationHandler, {
    useFactory: () => new MessageNotificationHandler(socketServer),
  });
};

main();
