import {
  notFound,
  reviewingCompletedTicket,
  reviewingNonAllocatedTicket,
  reviewingOtherTicket,
} from "@backend/application/common/error/messages";
import { RBOError } from "@backend/application/common/error/rboError";
import { IRequestValidator } from "@backend/application/common/interfaces/cqrs";
import { IIdentityService } from "@backend/application/common/interfaces/identityService";
import { ITicketRepository } from "@backend/application/common/interfaces/repository";
import { Request, RoleRequestAuthorizer } from "@backend/application/common/utilities/cqrs";
import { Id } from "@backend/domain/common/id";
import { ReviewState } from "@backend/domain/constants/reviewState";
import { ICommandHandler } from "@core/cqrs/types";
import { ensure } from "@core/utilities";
import { InferType, object } from "yup";

const ReviewTicketRequest = object({
  ticketId: Id,
  state: ReviewState.required(),
}).concat(Request("reviewTicketRequest"));

type ReviewTicketRequest = InferType<typeof ReviewTicketRequest>;

class ReviewTicketRequestValidator implements IRequestValidator<ReviewTicketRequest> {
  requestName = "reviewTicketRequest" as const;

  constructor(private readonly ticketRepository: ITicketRepository) {}

  async validate(request: unknown) {
    ensure(ReviewTicketRequest.isValidSync(request), new RBOError("validation"));

    const ticket = await this.ticketRepository.get(request.ticketId);

    ensure(!!ticket, new RBOError("missing", notFound(request.ticketId, "Ticket")));
  }
}

class ReviewTicketRequestAuthorizer extends RoleRequestAuthorizer<ReviewTicketRequest> {
  requestName = "reviewTicketRequest" as const;
  requiredRoles = ["employee"] as const;

  constructor(
    identityService: IIdentityService,
    private readonly ticketRepository: ITicketRepository
  ) {
    super(identityService);
  }

  async authorize(request: ReviewTicketRequest) {
    await super.authorize(request);

    const ticket = (await this.ticketRepository.get(request.ticketId))!;

    ensure(!!ticket.allocated, new RBOError("authorization", reviewingNonAllocatedTicket));

    // allows completion of tickets currently requiring new information
    ensure(
      ticket.reviewed?.state !== "complete",
      new RBOError("authorization", reviewingCompletedTicket)
    );

    const currentUser = await this.identityService.getCurrentUser();

    ensure(
      ticket.allocated!.to._id === currentUser._id,
      new RBOError("authorization", reviewingOtherTicket)
    );
  }
}

class ReviewTicketCommandHandler implements ICommandHandler<ReviewTicketRequest> {
  handles = "reviewTicketRequest" as const;

  constructor(private readonly ticketRepository: ITicketRepository) {}

  async handle({ ticketId, state }: ReviewTicketRequest) {
    const ticket = (await this.ticketRepository.get(ticketId))!;

    ticket.reviewed = { at: new Date(), state };

    await this.ticketRepository.update(ticket);
  }
}

export {
  ReviewTicketCommandHandler,
  ReviewTicketRequest,
  ReviewTicketRequestAuthorizer,
  ReviewTicketRequestValidator,
};
