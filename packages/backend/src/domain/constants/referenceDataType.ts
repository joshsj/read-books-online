import { mixed } from "yup";

const ReferenceDataTypes = ["user"] as const;
type ReferenceDataType = typeof ReferenceDataTypes[number];

const ReferenceDataType = mixed<ReferenceDataType>((x: any): x is ReferenceDataType =>
  x ? ReferenceDataTypes.includes(x) : true
);

export { ReferenceDataType, ReferenceDataTypes };
