import { CompleteTicketRequest, TicketState } from "@client/models";
import { capitalize } from "@core/utilities/string";
import { InferType } from "yup";

const PendingVariant = "info" as const;

const prettyTicketState = (state: TicketState) => capitalize(state);

const variants: { [K in TicketState]?: string } = {
  complete: "success",
  incomplete: "danger",
};

const reviewState = {
  displayText: (state: TicketState): string =>
    state === "allocated" ? "Pending" : prettyTicketState(state),
  variant: (state: TicketState): string => variants[state] ?? "info",
};

const TicketInformationModel = CompleteTicketRequest.pick(["ticketId", "information"]);
type TicketInformationModel = InferType<typeof TicketInformationModel>;

export { reviewState, prettyTicketState, PendingVariant, TicketInformationModel };
