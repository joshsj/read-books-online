import { IAuditService } from "@backend/application/common/interfaces/auditService";
import { IIdentityService } from "@backend/application/common/interfaces/identityService";
import { Auditable } from "@backend/domain/common/auditable";

class AuditService implements IAuditService {
  constructor(private readonly identityService: IIdentityService) {}

  async init<T extends string>(...fields: T[]) {
    return await this.persistFields({}, fields);
  }

  async audit<T extends string>(auditable: Partial<Auditable<T>>, ...fields: T[]) {
    await this.persistFields(auditable, fields);
  }

  private async persistFields<T extends string>(obj: any, fields: T[]): Promise<Auditable<T>> {
    if (!fields.length) {
      return obj;
    }

    const by = await this.identityService.getCurrentUser();
    const at = new Date();

    return fields.reduce<any>((prev, field) => {
      prev[field] = { at, by };

      return prev;
    }, obj);
  }
}

export { AuditService };
