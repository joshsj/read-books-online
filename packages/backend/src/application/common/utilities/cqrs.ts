import { requiresRoles } from "@backend/application/common/error/messages";
import { RBOError } from "@backend/application/common/error/rboError";
import { IRequestAuthorizer, IRequestValidator } from "@backend/application/common/interfaces/cqrs";
import { IIdentityService } from "@backend/application/common/interfaces/identityService";
import { Role } from "@backend/domain/constants/role";
import { INotification, INotificationName } from "@core/cqrs/types/notification";
import { IRequest, IRequestName } from "@core/cqrs/types/request";
import { ensure } from "@core/utilities";
import { mixed, object, ObjectSchema } from "yup";

// tsyringe does not provide a method for
type DelayedDependency<T> = () => T;

const Request = <T extends IRequestName>(requestName: T): ObjectSchema<IRequest<T>> =>
  object({
    // TODO reduce assertion from any to T, not compatible with current typing
    requestName: mixed((x): x is any => x === requestName)
      .strict()
      .required(),
  });

const Notification = <T extends INotificationName>(
  notificationName: T
): ObjectSchema<INotification<T>> =>
  object({
    // TODO reduce assertion from any to T, not compatible with current typing
    notificationName: mixed((x): x is any => x === notificationName)
      .strict()
      .required(),
  });

abstract class SchemaRequestValidator<T extends IRequest<any>> implements IRequestValidator<T> {
  abstract requestName: T["requestName"];

  constructor(private readonly schema: ObjectSchema<T>) {}

  async validate(request: unknown) {
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

export { Request, Notification, SchemaRequestValidator, RoleRequestAuthorizer, DelayedDependency };
