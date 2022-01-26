import { mixed } from "yup";
import { AuthorizationStates } from "./authorizationState";
import { ReviewStates } from "./reviewState";

const TicketStates = [
  "unallocated",
  "allocated",
  ...ReviewStates,
  "priced",
  ...AuthorizationStates,
] as const;

type TicketState = typeof TicketStates[number];

const TicketState = mixed((x: any): x is TicketState => TicketStates.includes(x));

export { TicketState, TicketStates };
