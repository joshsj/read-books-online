import {
  AccountDto,
  CreateTicketRequest,
  Id,
  TicketDto,
  TicketQuery,
  TokenDto,
} from "@client/models";
import { Endpoint } from "@client/types";

type IAuthClient = {
  auth: Endpoint<"get", void, TokenDto> &
    Endpoint<"post", AccountDto, TokenDto> &
    Endpoint<"delete">;
};

type ITicketClient = {
  ticket: Endpoint<"create", CreateTicketRequest> &
    Endpoint<"get", Id, TicketDto> &
    Endpoint<"get", TicketQuery, TicketDto[]>;
};

export { IAuthClient, ITicketClient };
