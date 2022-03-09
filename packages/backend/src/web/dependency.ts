import { Dependency } from "@backend/application/dependency";
import { INotificationHandler } from "@core/cqrs/types/notification";
import { container } from "tsyringe";
import { MessageNotificationHandler } from "./socket/handlers/messageNotificationHandler";

const registerWebDependencies = () => {
  container.register<INotificationHandler<any>>(Dependency.notificationHandler, {
    useFactory: (c) => new MessageNotificationHandler(c.resolve(Dependency.sockets)),
  });
};

export { registerWebDependencies };
