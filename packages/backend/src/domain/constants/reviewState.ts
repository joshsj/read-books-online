import { mixed } from "yup";

const ReviewStates = ["incomplete", "complete"] as const;

type ReviewState = typeof ReviewStates[number];

const ReviewState = mixed((x: any): x is ReviewState => ReviewStates.includes(x));

export { ReviewState, ReviewStates };
