import {
  reviewingOtherTicket,
  reviewingCompletedTicket,
  reviewingNonAllocatedTicket,
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

const ReviewTicketRequest = object({ ticketId: Id, complete: bool().required() }).concat(
  Request("reviewTicketRequest")
);

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
    const states = getTicketStates(ticket);

    // allows completion of tickets currently requiring new information
    ensure(!states.includes("complete"), new RBOError("authorization", reviewingCompletedTicket));

    ensure(
      states.includes("allocated"),
      new RBOError("authorization", reviewingNonAllocatedTicket)
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

  async handle({ ticketId, complete }: ReviewTicketRequest) {
    const ticket = (await this.ticketRepository.get(ticketId))!;

    ticket.reviewed = {
      at: new Date(),
      state: complete ? "complete" : "incomplete",
    };

    await this.ticketRepository.update(ticket);
  }
}

export {
  ReviewTicketCommandHandler,
  ReviewTicketRequest,
  ReviewTicketRequestAuthorizer,
  ReviewTicketRequestValidator,
};
