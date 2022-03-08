import { keyOfSchema } from "@backend/application/common/utilities/schema";
import { Ticket } from "@backend/domain/entities/ticket";
import { mixed } from "yup";

type TicketField = Exclude<keyof Ticket, "_id">;
const TicketFields = keyOfSchema(Ticket.omit(["_id"]));

const ticketField = mixed((x): x is TicketField => TicketFields.includes(x));

export { TicketField, TicketFields, ticketField };
