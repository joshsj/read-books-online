import { AuthorizerBehavior } from "@backend/application/common/behaviors/authorizerBehavior";
import { RequestLoggerBehavior } from "@backend/application/common/behaviors/requestLoggerBehavior";
import { ValidatorBehavior } from "@backend/application/common/behaviors/validatorBehavior";
import { resolveAny } from "@backend/application/common/utilities/dependency";
import {
  CreateTicketRequestAuthorizer,
  CreateTicketRequestHandler,
  CreateTicketRequestValidator,
} from "@backend/application/ticket/commands/createTicket";
import {
  CreateUserRequestHandler,
  CreateUserRequestValidator,
} from "@backend/application/user/commands/createUser";
import { CQRS } from "@core/cqrs";
import { IBehavior, ICQRS, IRequestHandler } from "@core/cqrs/types";
import { toDependencies } from "@core/utilities/dependency";
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
    .register<IBehavior>(Dependency.requestBehavior, {
      useFactory: (c) => new RequestLoggerBehavior(c.resolve(Dependency.logger)),
    })
    .register<IBehavior>(Dependency.requestBehavior, {
      useFactory: (c) =>
        new ValidatorBehavior(
          c.resolve(Dependency.logger),
          resolveAny(c, Dependency.requestValidator)
        ),
    })
    .register<IBehavior>(Dependency.requestBehavior, {
      useFactory: (c) =>
        new AuthorizerBehavior(
          c.resolve(Dependency.logger),
          resolveAny(c, Dependency.requestAuthorizer)
        ),
    });
};

const registerApplicationDependencies = () => {
  container.register<ICQRS>(Dependency.cqrs, {
    useFactory: (c) =>
      new CQRS(
        c.resolveAll<IRequestHandler>(Dependency.requestHandler),
        resolveAny(c, Dependency.requestBehavior)
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
    .register<CreateTicketRequestValidator>(Dependency.requestValidator, {
      useValue: new CreateTicketRequestValidator(),
    })
    .register<CreateTicketRequestAuthorizer>(Dependency.requestAuthorizer, {
      useFactory: (c) => new CreateTicketRequestAuthorizer(c.resolve(Dependency.identityService)),
    })
    .register<CreateTicketRequestHandler>(Dependency.requestHandler, {
      useFactory: (c) => new CreateTicketRequestHandler(c.resolve(Dependency.ticketRepository)),
    });
};

export { Dependency, registerApplicationDependencies };
