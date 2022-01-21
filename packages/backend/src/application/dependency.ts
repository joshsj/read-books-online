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
import { container, FactoryProvider, InjectionToken } from "tsyringe";
import { IRequestAuthorizer, IRequestValidator } from "./common/interfaces/cqrs";
import {
  GetTicketRequestAuthorizer,
  GetTicketRequestHandler,
  GetTicketRequestValidator,
} from "./ticket/queries/getTicket";

import {
  GetTicketsRequestAuthorizer,
  GetTicketsRequestHandler,
  GetTicketsRequestValidator,
} from "./ticket/queries/getTickets";

const Dependency = toDependencies([
  // general
  "logger",
  "configuration",
  // services
  "hashingService",
  "identityService",
  "httpContextService",
  "auditService",
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

const registerer =
  <T>(token: InjectionToken) =>
  (factories: FactoryProvider<T>["useFactory"][]) =>
    factories.forEach((f) => container.register(token, { useFactory: f }));

const registerValidators = registerer<IRequestValidator<any>>(Dependency.requestValidator);
const registerAuthorizers = registerer<IRequestAuthorizer<any>>(Dependency.requestAuthorizer);
const registerHandlers = registerer<IRequestHandler>(Dependency.requestHandler);

const registerApplicationDependencies = () => {
  container.register<ICQRS>(Dependency.cqrs, {
    useFactory: (c) =>
      new CQRS(
        c.resolveAll<IRequestHandler>(Dependency.requestHandler),
        resolveAny(c, Dependency.requestBehavior)
      ),
  });

  registerBehaviors();

  registerValidators([
    (c) => new CreateUserRequestValidator(c.resolve(Dependency.userRepository)),
    () => new CreateTicketRequestValidator(),
    (c) => new GetTicketRequestValidator(c.resolve(Dependency.ticketRepository)),
    () => new GetTicketsRequestValidator(),
  ]);

  registerAuthorizers([
    (c) => new CreateTicketRequestAuthorizer(c.resolve(Dependency.identityService)),
    (c) =>
      new GetTicketRequestAuthorizer(
        c.resolve(Dependency.identityService),
        c.resolve(Dependency.ticketRepository)
      ),
    (c) => new GetTicketsRequestAuthorizer(c.resolve(Dependency.identityService)),
  ]);

  registerHandlers([
    (c) =>
      new CreateUserRequestHandler(
        c.resolve(Dependency.hashingService),
        c.resolve(Dependency.userRepository)
      ),
    (c) =>
      new CreateTicketRequestHandler(
        c.resolve(Dependency.ticketRepository),
        c.resolve(Dependency.auditService)
      ),

    (c) => new GetTicketRequestHandler(c.resolve(Dependency.ticketRepository)),
    (c) => new GetTicketsRequestHandler(c.resolve(Dependency.ticketRepository)),
  ]);
};

export { Dependency, registerApplicationDependencies };
