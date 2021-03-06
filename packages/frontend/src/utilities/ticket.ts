import { AuthorizationState, ReviewState, TicketState, TicketQuery } from "@client/models";
import { PageSize } from "./constants";

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

const defaultTicketQuery = (): TicketQuery => ({
  filter: {},
  pageNumber: 1,
  pageSize: PageSize,
});

export { DefaultVariant, stateVariant, terminalStateVariant, defaultTicketQuery };
