import { mixed } from "yup";
import { CompletionStates } from "./completionState";

const TicketStates = ["unallocated", "allocated", ...CompletionStates] as const;

type TicketState = typeof TicketStates[number];

const TicketState = mixed((x: any): x is TicketState => TicketStates.includes(x));

export { TicketState, TicketStates };
