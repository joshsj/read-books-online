import {
  AccountDto,
  AllocateTicketRequest,
  ReviewTicketRequest,
  CreateTicketRequest,
  CreateUserRequest,
  Id,
  CompleteTicketRequest,
  TicketDto,
  TicketQuery,
  TokenDto,
} from "@client/models";
import { Endpoint } from "@client/types";

type IUserClient = {
  user: Endpoint<"create", CreateUserRequest>;
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
    } & {
      review: Endpoint<"put", ReviewTicketRequest>;
    };
};

export { IAuthClient, ITicketClient, IUserClient };
