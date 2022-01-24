import {
  AccountDto,
  AllocateTicketRequest,
  CreateTicketRequest,
  CreateUserRequest,
  Id,
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
    Endpoint<"get", Id, TicketDto> &
    Endpoint<"get", TicketQuery, TicketDto[]> & {
      allocation: Endpoint<"create", AllocateTicketRequest>;
    };
};

export { IAuthClient, ITicketClient, IUserClient };
