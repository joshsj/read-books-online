import { mixed } from "yup";

const ReviewStates = ["approved", "rejected"] as const;

type ReviewState = typeof ReviewStates[number];

const ReviewState = mixed((x: any): x is ReviewState => ReviewStates.includes(x));

export { ReviewState };
