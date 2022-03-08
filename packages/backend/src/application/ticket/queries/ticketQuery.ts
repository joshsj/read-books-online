import { Id } from "@backend/domain/common/id";
import { sortDirection } from "@backend/domain/constants/sortDirection";
import { InferType, object, string } from "yup";
import { ticketField } from "./ticketField";

const TicketQuery = object({
  filter: object({
    information: string().strict(),
    userId: Id,
  }).default(undefined),

  sortField: ticketField.defined(),
  sortDirection: sortDirection.defined(),
}).partial();

type TicketQuery = InferType<typeof TicketQuery>;

export { TicketQuery };
