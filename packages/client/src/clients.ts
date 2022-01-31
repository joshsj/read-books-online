import {
  AccountDto,
  AllocateTicketRequest,
  AuthorizeTicketRequest,
  CompleteTicketRequest,
  CreateTicketRequest,
  CreateUserRequest,
  Id,
  ReferenceDataDto,
  ReferenceDataType,
  ReviewTicketRequest,
  SubmitTicketPriceRequest,
  TicketDto,
  TicketQuery,
  TokenDto,
  UserDto,
  Username,
} from "@client/models";
import { Endpoint } from "@client/types";

type IUserClient = {
  user: Endpoint<"create", CreateUserRequest> & Endpoint<"get", Username, UserDto>;
};

type IAuthClient = {
  auth: Endpoint<"get", void, TokenDto> &
    Endpoint<"post", AccountDto, TokenDto> &
    Endpoint<"delete">;
};

type ITicketClient = {
  ticket: Endpoint<"create", CreateTicketRequest> &
    Endpoint<"update", CompleteTicketRequest> &
    Endpoint<"get", Id, TicketDto> &
    Endpoint<"get", TicketQuery, TicketDto[]> &
    Endpoint<"delete", Id> & {
      allocation: Endpoint<"create", AllocateTicketRequest>;
      review: Endpoint<"create", ReviewTicketRequest>;
      authorization: Endpoint<"create", AuthorizeTicketRequest>;
      price: Endpoint<"create", SubmitTicketPriceRequest>;
    };
};

type IReferenceDataClient = {
  referenceData: Endpoint<"get", ReferenceDataType, ReferenceDataDto[]>;
};

export { IAuthClient, ITicketClient, IUserClient, IReferenceDataClient };
