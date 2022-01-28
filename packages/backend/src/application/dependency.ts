import { AuthorizerBehavior } from "@backend/application/common/behaviors/authorizerBehavior";
import { RequestLoggerBehavior } from "@backend/application/common/behaviors/requestLoggerBehavior";
import { ValidatorBehavior } from "@backend/application/common/behaviors/validatorBehavior";
import { resolveAny } from "@backend/application/common/utilities/dependency";
import {
  CreateTicketCommandAuthorizer,
  CreateTicketCommandHandler,
  CreateTicketCommandValidator,
} from "@backend/application/ticket/commands/createTicket";
import {
  CreateUserCommandHandler,
  CreateUserCommandValidator,
} from "@backend/application/user/commands/createUser";
import { CQRS } from "@core/cqrs";
import { IRequestBehavior } from "@core/cqrs/types/behavior";
import { INotificationHandler } from "@core/cqrs/types/notification";
import { IRequestHandler } from "@core/cqrs/types/request";
import { ICQRS } from "@core/cqrs/types/service";
import { toDependencies } from "@core/utilities/dependency";
import { container, FactoryProvider, InjectionToken } from "tsyringe";
import { IRequestAuthorizer, IRequestValidator } from "./common/interfaces/cqrs";
import {
  GetReferenceDataQueryHandler,
  GetReferenceDataRequestValidator,
} from "./referenceData/queries/getReferenceData";
import {
  AllocateTicketCommandHandler,
  AllocateTicketRequestAuthorizer,
  AllocateTicketRequestValidator,
} from "./ticket/commands/allocateTicket";
import {
  AuthorizeTicketCommandHandler,
  AuthorizeTicketRequestAuthorizer,
  AuthorizeTicketRequestValidator,
} from "./ticket/commands/authorizeTicket";
import {
  CancelTicketCommandHandler,
  CancelTicketRequestAuthorizer,
  CancelTicketRequestValidator,
} from "./ticket/commands/cancelTicket";
import {
  CompleteTicketRequestAuthorizer,
  CompleteTicketRequestValidator,
  ProvideNewInformationCommandHandler,
} from "./ticket/commands/completeTicket";
import {
  ReviewTicketCommandHandler,
  ReviewTicketRequestAuthorizer,
  ReviewTicketRequestValidator,
} from "./ticket/commands/reviewTicket";
import {
  SubmitTicketPriceCommandHandler,
  SubmitTicketPriceRequestAuthorizer,
  SubmitTicketPriceRequestValidator,
} from "./ticket/commands/submitTicketPrice";
import { AuthorizeTicketNotificationHandler } from "./ticket/notifications/authorizedTicket";
import { IncompleteTicketNotificationHandler } from "./ticket/notifications/incompleteTicket";
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
  "notificationHandler",
]);

const registerBehaviors = () => {
  container
    .register<IRequestBehavior>(Dependency.requestBehavior, {
      useFactory: (c) => new RequestLoggerBehavior(c.resolve(Dependency.logger)),
    })
    .register<IRequestBehavior>(Dependency.requestBehavior, {
      useFactory: (c) =>
        new ValidatorBehavior(
          c.resolve(Dependency.logger),
          resolveAny(c, Dependency.requestValidator)
        ),
    })
    .register<IRequestBehavior>(Dependency.requestBehavior, {
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
const registerRequestHandlers = registerer<IRequestHandler>(Dependency.requestHandler);
const registerNotificationHandlers = registerer<INotificationHandler<any>>(
  Dependency.notificationHandler
);

const registerApplicationDependencies = () => {
  container.register<ICQRS>(Dependency.cqrs, {
    useFactory: (c) =>
      new CQRS(
        c.resolveAll<IRequestHandler>(Dependency.requestHandler),
        resolveAny(c, Dependency.requestBehavior),
        resolveAny(c, Dependency.notificationHandler)
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
    (c) => new CompleteTicketRequestValidator(c.resolve(Dependency.ticketRepository)),
    (c) => new AuthorizeTicketRequestValidator(c.resolve(Dependency.ticketRepository)),
    (c) => new SubmitTicketPriceRequestValidator(c.resolve(Dependency.ticketRepository)),
    () => new GetReferenceDataRequestValidator(),
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
    (c) =>
      new CompleteTicketRequestAuthorizer(
        c.resolve(Dependency.identityService),
        c.resolve(Dependency.ticketRepository)
      ),
    (c) =>
      new AuthorizeTicketRequestAuthorizer(
        c.resolve(Dependency.identityService),
        c.resolve(Dependency.ticketRepository)
      ),
    (c) =>
      new SubmitTicketPriceRequestAuthorizer(
        c.resolve(Dependency.identityService),
        c.resolve(Dependency.ticketRepository)
      ),
  ]);

  registerRequestHandlers([
    (c) =>
      new CreateUserCommandHandler(
        c.resolve(Dependency.hashingService),
        c.resolve(Dependency.userRepository)
      ),
    (c) =>
      new CreateTicketCommandHandler(
        c.resolve(Dependency.ticketRepository),
        c.resolve(Dependency.identityService)
      ),

    (c) => new GetTicketQueryHandler(c.resolve(Dependency.ticketRepository)),
    (c) => new GetTicketsQueryHandler(c.resolve(Dependency.ticketRepository)),
    (c) =>
      new AllocateTicketCommandHandler(
        c.resolve(Dependency.ticketRepository),
        c.resolve(Dependency.identityService)
      ),
    (c) => new CancelTicketCommandHandler(c.resolve(Dependency.ticketRepository)),
    (c) =>
      new ReviewTicketCommandHandler(c.resolve(Dependency.ticketRepository), () =>
        c.resolve(Dependency.cqrs)
      ),
    (c) => new ProvideNewInformationCommandHandler(c.resolve(Dependency.ticketRepository)),
    (c) =>
      new AuthorizeTicketCommandHandler(
        c.resolve(Dependency.ticketRepository),
        () => c.resolve(Dependency.cqrs),
        c.resolve(Dependency.identityService)
      ),
    (c) =>
      new SubmitTicketPriceCommandHandler(
        c.resolve(Dependency.ticketRepository),
        () => c.resolve(Dependency.cqrs),
        c.resolve(Dependency.configuration)
      ),
    (c) => new GetReferenceDataQueryHandler(() => c.resolve(Dependency.userRepository)),
  ]);

  registerNotificationHandlers([
    (c) =>
      new IncompleteTicketNotificationHandler(
        c.resolve(Dependency.configuration),
        c.resolve(Dependency.identityService)
      ),
    (c) =>
      new AuthorizeTicketNotificationHandler(
        c.resolve(Dependency.configuration),
        c.resolve(Dependency.identityService)
      ),
  ]);
};

export { Dependency, registerApplicationDependencies };
