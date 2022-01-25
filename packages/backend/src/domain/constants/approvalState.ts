import { mixed } from "yup";

const ApprovalStates = ["requiresNewInformation", "approved"] as const;

type ApprovalState = typeof ApprovalStates[number];

const ApprovalState = mixed((x: any): x is ApprovalState => ApprovalStates.includes(x));

export { ApprovalState, ApprovalStates };