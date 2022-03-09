import { Entity } from "@backend/domain/common/entity";
import { date, InferType, object, string } from "yup";
import { Ticket } from "./ticket";
import { User } from "./user";

const Message = object({
  ticket: Ticket,
  from: User,
  at: date().defined(),
  content: string().defined(),
}).concat(Entity);

type Message = InferType<typeof Message>;

export { Message };
