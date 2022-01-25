import { mixed } from "yup";
import { ApprovalStates } from "./approvalState";

const TicketStates = ["unallocated", "allocated", ...ApprovalStates] as const;

type TicketState = typeof TicketStates[number];

const TicketState = mixed((x: any): x is TicketState => TicketStates.includes(x));

export { TicketState };
