import {
  notFound,
  submittingPriceNonComplete,
  submittingPriceOtherTicket,
  submittingPriceToPricedTicket,
} from "@backend/application/common/error/messages";
import { RBOError } from "@backend/application/common/error/rboError";
import { IConfiguration } from "@backend/application/common/interfaces/configuration";
import { IRequestValidator } from "@backend/application/common/interfaces/cqrs";
import { IIdentityService } from "@backend/application/common/interfaces/identityService";
import { ITicketRepository } from "@backend/application/common/interfaces/repository";
import {
  DelayedDependency,
  Request,
  RoleRequestAuthorizer,
} from "@backend/application/common/utilities/cqrs";
import { PositiveNumber } from "@backend/domain/common/constrainedTypes";
import { Id } from "@backend/domain/common/id";
import { ICommandHandler } from "@core/cqrs/types/request";
import { ICQRS } from "@core/cqrs/types/service";
import { ensure } from "@core/utilities";
import { InferType, object } from "yup";
import { AuthorizeTicketBase } from "./base/authorizeTicketBase";

const SubmitTicketPriceRequest = object({
  ticketId: Id.required(),
  price: PositiveNumber.required(),
}).concat(Request("submitTicketPriceRequest"));
type SubmitTicketPriceRequest = InferType<typeof SubmitTicketPriceRequest>;

class SubmitTicketPriceRequestValidator implements IRequestValidator<SubmitTicketPriceRequest> {
  requestName = "submitTicketPriceRequest" as const;

  constructor(private readonly ticketRepository: ITicketRepository) {}

  async validate(request: unknown) {
    ensure(SubmitTicketPriceRequest.isValidSync(request), new RBOError("validation"));

    ensure(
      await this.ticketRepository.exists(request.ticketId),
      new RBOError("validation", notFound(request.ticketId, "Ticket"))
    );
  }
}

class SubmitTicketPriceRequestAuthorizer extends RoleRequestAuthorizer<SubmitTicketPriceRequest> {
  requestName = "submitTicketPriceRequest" as const;
  requiredRoles = ["employee"] as const;

  constructor(
    identityService: IIdentityService,
    private readonly ticketRepository: ITicketRepository
  ) {
    super(identityService);
  }

  async authorize(request: SubmitTicketPriceRequest) {
    await super.authorize(request);

    const ticket = (await this.ticketRepository.get(request.ticketId))!;

    ensure(!ticket.priced, new RBOError("authorization", submittingPriceToPricedTicket));

    ensure(
      ticket.reviewed?.state === "Information Complete",
      new RBOError("authorization", submittingPriceNonComplete)
    );

    const currentUser = await this.identityService.getCurrentUser();

    ensure(
      ticket.allocated!.to._id === currentUser._id,
      new RBOError("authorization", submittingPriceOtherTicket)
    );
  }
}

class SubmitTicketPriceCommandHandler
  extends AuthorizeTicketBase
  implements ICommandHandler<SubmitTicketPriceRequest>
{
  handles = "submitTicketPriceRequest" as const;

  constructor(
    ticketRepository: ITicketRepository,
    cqrs: DelayedDependency<ICQRS>,
    private readonly configuration: IConfiguration
  ) {
    super(ticketRepository, cqrs);
  }

  async handle({ ticketId, price }: SubmitTicketPriceRequest) {
    const ticket = (await this.ticketRepository.get(ticketId))!;
    const { costThreshold } = this.configuration.ticket;

    ticket.priced = {
      at: new Date(),
      value: price,
    };

    await this.ticketRepository.update(ticket);

    if (price > costThreshold) {
      return;
    }

    await super.authorize(ticketId, "Purchase Approved", null); // automatic system approval
  }
}

export {
  SubmitTicketPriceCommandHandler,
  SubmitTicketPriceRequest,
  SubmitTicketPriceRequestAuthorizer,
  SubmitTicketPriceRequestValidator,
};
