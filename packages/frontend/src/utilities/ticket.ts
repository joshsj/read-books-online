import { ReviewState } from "@client/models";

const reviewStateVariant = (reviewState?: ReviewState) =>
  reviewState === "approved" ? "success" : reviewState === "rejected" ? "danger" : "info";

export { reviewStateVariant };
