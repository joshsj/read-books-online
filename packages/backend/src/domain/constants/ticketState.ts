import { mixed } from "yup";
import { AuthorizationStates } from "./authorizationState";
import { CompletionStates } from "./completionState";

const TicketStates = [
  "unallocated",
  "allocated",
  ...CompletionStates,
  ...AuthorizationStates,
] as const;

type TicketState = typeof TicketStates[number];

const TicketState = mixed((x: any): x is TicketState => TicketStates.includes(x));

export { TicketState, TicketStates };
