import { AuthorizationState, ReviewState, TicketState, TicketQuery } from "@client/models";

const DefaultVariant = "info";

type TerminalState = Extract<ReviewState, "Information Incomplete"> | AuthorizationState;

type TerminalStateVariants = { [K in TerminalState]: string };
const TerminalStateVariants: TerminalStateVariants = {
  "Information Incomplete": "danger",
  "Purchase Denied": "danger",
  "Purchase Approved": "success",
};

const stateVariant = (state?: TicketState): string => {
  const terminalVariant = terminalStateVariant(state as TerminalState);

  return terminalVariant ? terminalVariant : state ? "success" : DefaultVariant;
};

const terminalStateVariant = (state?: TerminalState) =>
  state ? TerminalStateVariants[state] : undefined;

const EmptyTicketQuery = (): TicketQuery => ({ filter: {} });

export { DefaultVariant, stateVariant, terminalStateVariant, EmptyTicketQuery };
