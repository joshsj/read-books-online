import { ProvideNewInformationRequest, TicketState } from "@client/models";
import { capitalize } from "@core/utilities/string";
import { InferType } from "yup";

const PendingVariant = "info" as const;

const prettyTicketState = (state: TicketState) =>
  state === "requiresNewInformation" ? "Requires New Information" : capitalize(state);

const variants: { [K in TicketState]?: string } = {
  approved: "success",
  requiresNewInformation: "danger",
};

const approvalState = {
  displayText: (state: TicketState): string =>
    state === "allocated" ? "Pending" : prettyTicketState(state),
  variant: (state: TicketState): string => variants[state] ?? "info",
};

const TicketInformationModel = ProvideNewInformationRequest.pick(["ticketId", "information"]);
type TicketInformationModel = InferType<typeof TicketInformationModel>;

export { approvalState, prettyTicketState, PendingVariant, TicketInformationModel };
