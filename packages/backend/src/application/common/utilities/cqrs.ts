import { RBOError } from "@backend/application/common/error/rboError";
import { IRequestAuthorizer, IRequestValidator } from "@backend/application/common/interfaces/cqrs";
import { IIdentityService } from "@backend/application/common/interfaces/identityService";
import { Role } from "@backend/domain/constants/role";
import { IRequest, IRequestName } from "@core/cqrs/types";
import { ensure } from "@core/utilities";
import { mixed, object, ObjectSchema } from "yup";
import { requiresRoles } from "@backend/application/common/error/messages";

const Request = <T extends IRequestName>(requestName: T): ObjectSchema<IRequest<T>> =>
  object({
    // TODO reduce assertion from any to T, not compatible with current typing
    requestName: mixed((x): x is any => x === requestName)
      .strict()
      .required(),
  });

type Request<T extends IRequestName> = IRequest<T>;

abstract class SchemaRequestValidator<T extends IRequest<any>> implements IRequestValidator<T> {
  abstract requestName: T["requestName"];

  constructor(private readonly schema: ObjectSchema<T>) {}

  async validate(request: unknown) {
    console.log(this.schema.validateSync(request));

    ensure(this.schema.isValidSync(request), new RBOError("validation"));
  }
}

abstract class RoleRequestAuthorizer<T extends IRequest<any>> implements IRequestAuthorizer<T> {
  abstract requestName: T["requestName"];
  abstract readonly requiredRoles: ReadonlyArray<Role>;

  constructor(protected readonly identityService: IIdentityService) {}

  async authorize({}: T) {
    const currentUser = await this.identityService.getCurrentUser();

    ensure(
      this.requiredRoles.every((r) => currentUser.roles.includes(r)),
      new RBOError("authorization", requiresRoles(...this.requiredRoles))
    );
  }
}

export { Request, SchemaRequestValidator, RoleRequestAuthorizer };
