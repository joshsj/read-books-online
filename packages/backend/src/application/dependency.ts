import { AuthorizerBehavior } from "@backend/application/common/behaviors/authorizerBehavior";
import { RequestLoggerBehavior } from "@backend/application/common/behaviors/requestLoggerBehavior";
import { ValidatorBehavior } from "@backend/application/common/behaviors/validatorBehavior";
import { resolveAny } from "@backend/application/common/utilities/dependency";
import {
  CreateTicketCommandHandler,
  CreateTicketCommandAuthorizer,
  CreateTicketCommandValidator,
} from "@backend/application/ticket/commands/createTicket";
import {
  CreateUserCommandHandler,
  CreateUserCommandValidator,
} from "@backend/application/user/commands/createUser";
import { CQRS } from "@core/cqrs";
import { IBehavior, ICQRS, IRequestHandler } from "@core/cqrs/types";
import { toDependencies } from "@core/utilities/dependency";
import { container, FactoryProvider, InjectionToken } from "tsyringe";
import { IRequestAuthorizer, IRequestValidator } from "./common/interfaces/cqrs";
import {
  AllocateTicketRequestAuthorizer,
  AllocateTicketCommandHandler,
  AllocateTicketRequestValidator,
} from "./ticket/commands/allocateTicket";
import {
  CancelTicketCommandHandler,
  CancelTicketRequestAuthorizer,
  CancelTicketRequestValidator,
} from "./ticket/commands/cancelTicket";
import {
  ReviewTicketCommandHandler,
  ReviewTicketRequestAuthorizer,
  ReviewTicketRequestValidator,
} from "./ticket/commands/reviewTicket";
import {
  GetTicketQueryAuthorizer,
  GetTicketQueryHandler,
  GetTicketQueryValidator,
} from "./ticket/queries/getTicket";
import {
  GetTicketsQueryAuthorizer,
  GetTicketsQueryHandler,
  GetTicketsQueryValidator,
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
    (c) => new CreateUserCommandValidator(c.resolve(Dependency.userRepository)),
    () => new CreateTicketCommandValidator(),
    (c) => new GetTicketQueryValidator(c.resolve(Dependency.ticketRepository)),
    () => new GetTicketsQueryValidator(),
    (c) => new AllocateTicketRequestValidator(c.resolve(Dependency.ticketRepository)),
    (c) => new CancelTicketRequestValidator(c.resolve(Dependency.ticketRepository)),
    (c) => new ReviewTicketRequestValidator(c.resolve(Dependency.ticketRepository)),
  ]);

  registerAuthorizers([
    (c) => new CreateTicketCommandAuthorizer(c.resolve(Dependency.identityService)),
    (c) =>
      new GetTicketQueryAuthorizer(
        c.resolve(Dependency.identityService),
        c.resolve(Dependency.ticketRepository)
      ),
    (c) => new GetTicketsQueryAuthorizer(c.resolve(Dependency.identityService)),
    (c) =>
      new AllocateTicketRequestAuthorizer(
        c.resolve(Dependency.identityService),
        c.resolve(Dependency.ticketRepository)
      ),
    (c) =>
      new CancelTicketRequestAuthorizer(
        c.resolve(Dependency.identityService),
        c.resolve(Dependency.ticketRepository)
      ),
    (c) =>
      new ReviewTicketRequestAuthorizer(
        c.resolve(Dependency.identityService),
        c.resolve(Dependency.ticketRepository)
      ),
  ]);

  registerHandlers([
    (c) =>
      new CreateUserCommandHandler(
        c.resolve(Dependency.hashingService),
        c.resolve(Dependency.userRepository)
      ),
    (c) =>
      new CreateTicketCommandHandler(
        c.resolve(Dependency.ticketRepository),
        c.resolve(Dependency.auditService)
      ),

    (c) => new GetTicketQueryHandler(c.resolve(Dependency.ticketRepository)),
    (c) => new GetTicketsQueryHandler(c.resolve(Dependency.ticketRepository)),
    (c) =>
      new AllocateTicketCommandHandler(
        c.resolve(Dependency.ticketRepository),
        c.resolve(Dependency.auditService)
      ),
    (c) => new CancelTicketCommandHandler(c.resolve(Dependency.ticketRepository)),
    (c) =>
      new ReviewTicketCommandHandler(
        c.resolve(Dependency.ticketRepository),

        c.resolve(Dependency.auditService)
      ),
  ]);
};

export { Dependency, registerApplicationDependencies };
