import { Auditable } from "@backend/domain/common/auditable";

type IAuditService = {
  init<T extends string>(...fields: T[]): Promise<Auditable<T>>;
  audit<T extends string>(auditable: Partial<Auditable<T>>, ...fields: T[]): Promise<void>;
};

export { IAuditService };
