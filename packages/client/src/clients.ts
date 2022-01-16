import { Endpoint } from "@client/types";
import type { AccountDto, TokenDto } from "@backend/web/common/models/auth";

type IAuthClient = {
  auth: Endpoint<"get", void, TokenDto> & Endpoint<"post", AccountDto, TokenDto>;
};

export { IAuthClient };
