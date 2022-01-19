import { requestLoggerBehavior } from "@backend/application/common/behaviors/requestLoggerBehavior";
import { validatorBehavior } from "@backend/application/common/behaviors/validatorBehavior";
import {
  CreateTicketHandler,
  CreateTicketValidator,
} from "@backend/application/ticket/commands/createTicket";
import {
  CreateUserRequestHandler,
  CreateUserRequestValidator,
} from "@backend/application/user/commands/createUser";
import { CQRS } from "@core/cqrs";
import { IBehavior, ICQRS, IRequestHandler } from "@core/cqrs/types";
import { toDependencies } from "@core/utilities";
import { container } from "tsyringe";

const Dependency = toDependencies([
  // general
  "logger",
  "configuration",
  // services
  "hashingService",
  "identityService",
  "httpContextService",
  // repository
  "userRepository",
  "refreshTokenRepository",
  "ticketRepository",
  // cqrs
  "cqrs",
  "requestHandler",
  "requestBehavior",
  "requestValidator",
  "requestAuthorizer",
]);

const registerBehaviors = () => {
  container
    .register<IBehavior>(Dependency.requestBehavior, { useValue: requestLoggerBehavior })
    .register<IBehavior>(Dependency.requestBehavior, { useValue: validatorBehavior });
};

// TODO: replace with directory scanning
const registerApplicationDependencies = () => {
  container.register<ICQRS>(Dependency.cqrs, {
    useFactory: (c) =>
      new CQRS(
        c.resolveAll<IRequestHandler>(Dependency.requestHandler),
        c.isRegistered(Dependency.requestBehavior)
          ? c.resolveAll<IBehavior>(Dependency.requestBehavior)
          : []
      ),
  });

  registerBehaviors();

  container
    .register(Dependency.requestValidator, {
      useFactory: (c) => new CreateUserRequestValidator(c.resolve(Dependency.userRepository)),
    })
    .register(Dependency.requestHandler, {
      useFactory: (c) =>
        new CreateUserRequestHandler(
          c.resolve(Dependency.hashingService),
          c.resolve(Dependency.userRepository)
        ),
    });

  container
    .register(Dependency.requestValidator, {
      useFactory: (c) => new CreateTicketValidator(c.resolve(Dependency.identityService)),
    })
    .register(Dependency.requestHandler, {
      useFactory: (c) => new CreateTicketHandler(c.resolve(Dependency.ticketRepository)),
    });
};

export { Dependency, registerApplicationDependencies };
