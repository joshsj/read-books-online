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
  TokensDto,
  UpdateUserRequest,
  UserDto,
  Username,
} from "@client/models";
import { Endpoint } from "@client/types";

type IUserClient = {
  user: Endpoint<"create", CreateUserRequest> &
    Endpoint<"get", Username, UserDto> &
    Endpoint<"get", void, UserDto[]> &
    Endpoint<"update", UpdateUserRequest>;
};

type IAuthClient = {
  auth: Endpoint<"get", string, TokensDto> &
    Endpoint<"post", AccountDto, TokensDto> &
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
