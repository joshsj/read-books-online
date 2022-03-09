import { string, object, array, InferType, boolean } from "yup";
import { Role } from "@backend/domain/constants/role";
import { Entity } from "@backend/domain/common/entity";
import { Username } from "@backend/domain/common/constrainedTypes";
import { Ticket } from "./ticket";

const User = object({
  username: Username.defined(),
  email: string().email().defined(),
  roles: array().of(Role.defined()).strict().defined().min(1),
  passwordHash: string().strict().defined(),
  disabled: boolean().strict().defined(),
}).concat(Entity);

type User = InferType<typeof User>;

const isAssociatedToTicket = (user: User, ticket: Ticket): boolean =>
  [ticket.created.by._id, ticket.allocated?.to._id, ticket.authorized?.by?._id].includes(user._id);

export { User, isAssociatedToTicket };
