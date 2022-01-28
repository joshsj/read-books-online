import { ReferenceData } from "@backend/domain/entities/referenceData";
import { InferType } from "yup";

const ReferenceDataDto = ReferenceData.clone();
type ReferenceDataDto = InferType<typeof ReferenceDataDto>;

export { ReferenceDataDto };
