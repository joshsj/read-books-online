import { Endpoint } from "@client/types";
import { AccountDto, CreateTicketRequest, TokenDto } from "@client/models";

type IAuthClient = {
  auth: Endpoint<"get", void, TokenDto> &
    Endpoint<"post", AccountDto, TokenDto> &
    Endpoint<"delete">;
};

type ITicketClient = {
  ticket: Endpoint<"create", CreateTicketRequest>;
};

export { IAuthClient, ITicketClient };
