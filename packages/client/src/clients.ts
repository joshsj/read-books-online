import { Endpoint } from "@client/types";
import { AccountDto, TokenDto } from "@client/models";

type IAuthClient = {
  auth: Endpoint<"get", void, TokenDto> &
    Endpoint<"post", AccountDto, TokenDto> &
    Endpoint<"delete">;
};

export { IAuthClient };
