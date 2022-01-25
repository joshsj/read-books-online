import {
  approveOtherTicket,
  approvingApprovedTicket,
  approvingNonAllocatedTicket,
  notFound,
} from "@backend/application/common/error/messages";
import { RBOError } from "@backend/application/common/error/rboError";
import { IRequestValidator } from "@backend/application/common/interfaces/cqrs";
import { IIdentityService } from "@backend/application/common/interfaces/identityService";
import { ITicketRepository } from "@backend/application/common/interfaces/repository";
import { Request, RoleRequestAuthorizer } from "@backend/application/common/utilities/cqrs";
import { Id } from "@backend/domain/common/id";
import { getTicketStates } from "@backend/domain/entities/ticket";
import { ICommandHandler } from "@core/cqrs/types";
import { ensure } from "@core/utilities";
import { bool, InferType, object } from "yup";

const ApproveTicketRequest = object({
  ticketId: Id,
  requiresAdditionalInformation: bool().required(),
}).concat(Request("approveTicketRequest"));

type ApproveTicketRequest = InferType<typeof ApproveTicketRequest>;

class ApproveTicketRequestValidator implements IRequestValidator<ApproveTicketRequest> {
  requestName = "approveTicketRequest" as const;

  constructor(private readonly ticketRepository: ITicketRepository) {}

  async validate(request: unknown) {
    ensure(ApproveTicketRequest.isValidSync(request), new RBOError("validation"));

    const ticket = await this.ticketRepository.get(request.ticketId);

    ensure(!!ticket, new RBOError("missing", notFound(request.ticketId, "Ticket")));
  }
}

class ApproveTicketRequestAuthorizer extends RoleRequestAuthorizer<ApproveTicketRequest> {
  requestName = "approveTicketRequest" as const;
  requiredRoles = ["employee"] as const;

  constructor(
    identityService: IIdentityService,
    private readonly ticketRepository: ITicketRepository
  ) {
    super(identityService);
  }

  async authorize(request: ApproveTicketRequest) {
    await super.authorize(request);

    const ticket = (await this.ticketRepository.get(request.ticketId))!;
    const states = getTicketStates(ticket);

    // allows approval of tickets currently requiring new information
    ensure(!states.includes("approved"), new RBOError("authorization", approvingApprovedTicket));

    ensure(
      states.includes("allocated"),
      new RBOError("authorization", approvingNonAllocatedTicket)
    );

    const currentUser = await this.identityService.getCurrentUser();

    ensure(
      ticket.allocated!.to._id === currentUser._id,
      new RBOError("authorization", approveOtherTicket)
    );
  }
}

class ApproveTicketCommandHandler implements ICommandHandler<ApproveTicketRequest> {
  handles = "approveTicketRequest" as const;

  constructor(private readonly ticketRepository: ITicketRepository) {}

  async handle({ ticketId, requiresAdditionalInformation }: ApproveTicketRequest) {
    const ticket = (await this.ticketRepository.get(ticketId))!;

    ticket.approved = {
      at: new Date(),
      state: requiresAdditionalInformation ? "requiresNewInformation" : "approved",
    };

    await this.ticketRepository.update(ticket);
  }
}

export {
  ApproveTicketCommandHandler,
  ApproveTicketRequest,
  ApproveTicketRequestAuthorizer,
  ApproveTicketRequestValidator,
};
