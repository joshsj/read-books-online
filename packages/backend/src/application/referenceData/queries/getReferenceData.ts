import { IUserRepository } from "@backend/application/common/interfaces/repository";
import {
  DelayedDependency,
  Request,
  SchemaRequestValidator,
} from "@backend/application/common/utilities/cqrs";
import { ReferenceDataType } from "@backend/domain/constants/referenceDataType";
import { ReferenceData } from "@backend/domain/entities/referenceData";
import { IQueryHandler } from "@core/cqrs/types/request";
import { InferType, object } from "yup";

const GetReferenceDataRequest = object({
  type: ReferenceDataType.required(),
}).concat(Request("getReferenceDataRequest"));
type GetReferenceDataRequest = InferType<typeof GetReferenceDataRequest>;

class GetReferenceDataRequestValidator extends SchemaRequestValidator<GetReferenceDataRequest> {
  requestName = "getReferenceDataRequest" as const;

  constructor() {
    super(GetReferenceDataRequest);
  }
}

class GetReferenceDataQueryHandler
  implements IQueryHandler<GetReferenceDataRequest, ReferenceData[]>
{
  handles = "getReferenceDataRequest" as const;

  // delayed resolution allows many repositories to be depended on without overhead
  constructor(private readonly userRepository: DelayedDependency<IUserRepository>) {}

  async handle() {
    return await this.userRepository().getReferenceData();
  }
}

export { GetReferenceDataQueryHandler, GetReferenceDataRequest, GetReferenceDataRequestValidator };
