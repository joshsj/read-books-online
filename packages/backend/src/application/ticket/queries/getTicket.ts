import { cannotView, notFound } from "@backend/application/common/error/messages";
import { RBOError } from "@backend/application/common/error/rboError";
import { IRequestAuthorizer, IRequestValidator } from "@backend/application/common/interfaces/cqrs";
import { IIdentityService } from "@backend/application/common/interfaces/identityService";
import { ITicketRepository } from "@backend/application/common/interfaces/repository";
import { Request } from "@backend/application/common/utilities/cqrs";
import { Id } from "@backend/domain/common/id";
import { IQueryHandler } from "@core/cqrs/types";
import { ensure } from "@core/utilities";
import { InferType, object } from "yup";
import { TicketDto } from "./ticketDto";

const GetTicketRequest = object({
  ticketId: Id,
}).concat(Request("getTicketRequest"));

type GetTicketRequest = InferType<typeof GetTicketRequest>;

class GetTicketQueryValidator implements IRequestValidator<GetTicketRequest> {
  requestName = "getTicketRequest" as const;

  constructor(private readonly ticketRepository: ITicketRepository) {}

  async validate(request: unknown) {
    ensure(GetTicketRequest.isValidSync(request), new RBOError("validation"));

    ensure(
      await this.ticketRepository.exists(request.ticketId),
      new RBOError("missing", notFound(request.ticketId, "Ticket"))
    );
  }
}

class GetTicketQueryAuthorizer implements IRequestAuthorizer<GetTicketRequest> {
  requestName = "getTicketRequest" as const;

  constructor(
    private readonly identityService: IIdentityService,
    private readonly ticketRepository: ITicketRepository
  ) {}

  async authorize(request: GetTicketRequest) {
    const currentUser = await this.identityService.getCurrentUser();

    if (currentUser.roles.some((r) => ["employee", "authorizer"].includes(r))) {
      return;
    }

    const ticket = (await this.ticketRepository.get(request.ticketId))!;

    ensure(
      ticket.createdBy._id === currentUser._id,
      new RBOError("authorization", cannotView("ticket"))
    );
  }
}

class GetTicketQueryHandler implements IQueryHandler<GetTicketRequest, TicketDto> {
  handles = "getTicketRequest" as const;

  constructor(private readonly ticketRepository: ITicketRepository) {}

  async handle({ ticketId }: GetTicketRequest) {
    const ticket = (await this.ticketRepository.get(ticketId))!;

    return TicketDto.fromTicket(ticket);
  }
}

export {
  GetTicketRequest,
  GetTicketQueryValidator,
  GetTicketQueryAuthorizer,
  GetTicketQueryHandler,
};
