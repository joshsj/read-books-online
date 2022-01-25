import { mixed } from "yup";

const CompletionStates = ["incomplete", "complete"] as const;

type CompletionState = typeof CompletionStates[number];

const CompletionState = mixed((x: any): x is CompletionState => CompletionStates.includes(x));

export { CompletionState, CompletionStates };
