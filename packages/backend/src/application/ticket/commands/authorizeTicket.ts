import {
  authorizingAuthorizedTicket,
  authorizingNonCompleteTicket,
  authorizingOwnAllocatedTicket,
  authorizingOwnCreatedTicket,
  notFound,
} from "@backend/application/common/error/messages";
import { RBOError } from "@backend/application/common/error/rboError";
import { IRequestValidator } from "@backend/application/common/interfaces/cqrs";
import { IIdentityService } from "@backend/application/common/interfaces/identityService";
import { ITicketRepository } from "@backend/application/common/interfaces/repository";
import { Request, RoleRequestAuthorizer } from "@backend/application/common/utilities/cqrs";
import { Id } from "@backend/domain/common/id";
import { AuthorizationState } from "@backend/domain/constants/ticketStates";
import { ICommandHandler } from "@core/cqrs/types/request";
import { ensure } from "@core/utilities";
import { InferType, object } from "yup";

const AuthorizeTicketRequest = object({
  ticketId: Id,
  state: AuthorizationState.required(),
}).concat(Request("authorizeTicketRequest"));
type AuthorizeTicketRequest = InferType<typeof AuthorizeTicketRequest>;

class AuthorizeTicketRequestValidator implements IRequestValidator<AuthorizeTicketRequest> {
  requestName = "authorizeTicketRequest" as const;

  constructor(private readonly ticketRepository: ITicketRepository) {}

  async validate(request: unknown) {
    ensure(AuthorizeTicketRequest.isValidSync(request), new RBOError("validation"));

    ensure(
      await this.ticketRepository.exists(request.ticketId),
      new RBOError("validation", notFound(request.ticketId, "Ticket"))
    );
  }
}

class AuthorizeTicketRequestAuthorizer extends RoleRequestAuthorizer<AuthorizeTicketRequest> {
  requestName = "authorizeTicketRequest" as const;
  requiredRoles = ["employee"] as const;

  constructor(
    identityService: IIdentityService,
    private readonly ticketRepository: ITicketRepository
  ) {
    super(identityService);
  }

  async authorize(request: AuthorizeTicketRequest) {
    const ticket = (await this.ticketRepository.get(request.ticketId))!;

    ensure(!ticket.authorized, new RBOError("validation", authorizingAuthorizedTicket));

    ensure(!!ticket.priced, new RBOError("authorization", authorizingNonCompleteTicket));

    const currentUser = await this.identityService.getCurrentUser();

    ensure(
      ticket.created.by._id !== currentUser._id,
      new RBOError("authorization", authorizingOwnCreatedTicket)
    );
    ensure(
      ticket.allocated!.to._id !== currentUser._id,
      new RBOError("authorization", authorizingOwnAllocatedTicket)
    );
  }
}

class AuthorizeTicketCommandHandler implements ICommandHandler<AuthorizeTicketRequest> {
  handles = "authorizeTicketRequest" as const;

  constructor(
    private readonly ticketRepository: ITicketRepository,
    private readonly identityService: IIdentityService
  ) {}

  async handle({ ticketId, state }: AuthorizeTicketRequest) {
    const ticket = (await this.ticketRepository.get(ticketId))!;
    const currentUser = await this.identityService.getCurrentUser();

    ticket.authorized = {
      at: new Date(),
      by: currentUser,
      state,
    };

    await this.ticketRepository.update(ticket);
  }
}

export {
  AuthorizeTicketCommandHandler,
  AuthorizeTicketRequestAuthorizer,
  AuthorizeTicketRequest,
  AuthorizeTicketRequestValidator,
};
