import { mixed } from "yup";

const SortDirections = ["asc", "desc"] as const;
type SortDirection = typeof SortDirections[number];
const sortDirection = mixed((x): x is SortDirection => (x ? SortDirections.includes(x) : true));

export { SortDirections, SortDirection, sortDirection };
