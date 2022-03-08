import { QueryDto } from "@backend/application/common/dtos/queryDto";
import { IRequestAuthorizer } from "@backend/application/common/interfaces/cqrs";
import { IIdentityService } from "@backend/application/common/interfaces/identityService";
import { ITicketRepository } from "@backend/application/common/interfaces/repository";
import { Request, SchemaRequestValidator } from "@backend/application/common/utilities/cqrs";
import { IQueryHandler } from "@core/cqrs/types/request";
import { InferType } from "yup";
import { TicketDto } from "./ticketDto";
import { TicketQuery } from "./ticketQuery";

const GetTicketsRequest = TicketQuery.concat(Request("getTicketsRequest"));
type GetTicketsRequest = InferType<typeof GetTicketsRequest>;

class GetTicketsQueryValidator extends SchemaRequestValidator<GetTicketsRequest> {
  requestName = "getTicketsRequest" as const;

  constructor() {
    super(GetTicketsRequest);
  }
}

class GetTicketsQueryAuthorizer implements IRequestAuthorizer<GetTicketsRequest> {
  requestName = "getTicketsRequest" as const;

  constructor(private readonly identityService: IIdentityService) {}

  async authorize({ filter }: GetTicketsRequest) {
    const currentUser = await this.identityService.getCurrentUser();

    if (currentUser.roles.some((r) => r !== "client")) {
      return;
    }

    // prevent clients from filtering tickets from other
    filter && (filter.userId = currentUser._id);
  }
}

class GetTicketsQueryHandler implements IQueryHandler<GetTicketsRequest, QueryDto<TicketDto>> {
  handles = "getTicketsRequest" as const;

  constructor(private readonly ticketRepository: ITicketRepository) {}

  async handle(request: GetTicketsRequest) {
    const { items, total } = await this.ticketRepository.query(request);

    return { items: items.map(TicketDto.fromTicket), total };
  }
}

export {
  GetTicketsRequest,
  GetTicketsQueryAuthorizer,
  GetTicketsQueryHandler,
  GetTicketsQueryValidator,
};
