import { IAuditService } from "@backend/application/common/interfaces/auditService";
import { IIdentityService } from "@backend/application/common/interfaces/identityService";
import { Auditable } from "@backend/domain/common/auditable";
import { User } from "@backend/domain/entities/user";
import { AuditService } from "@backend/infrastructure/auditService";
import { expect } from "chai";

describe("Audit Service", () => {
  const fields = ["aField", "anotherField"] as const;
  type Field = typeof fields[number];

  const user = {} as User;
  const identityService: Partial<IIdentityService> = {
    getCurrentUser: () => Promise.resolve(user),
  };

  const newSut = (): IAuditService => new AuditService(identityService as IIdentityService);

  describe("init()", () => {
    it("Provides an auditing object for the specified fields", async () => {
      const sut = newSut();

      const result = await sut.init(...fields);
      const expectedKeys: Array<keyof Auditable<Field>> = ["aField", "anotherField"];

      expect(result).to.have.all.keys(expectedKeys);

      expect(result.aField.at).to.be.instanceOf(Date);
      expect(result.anotherField.at).to.be.instanceOf(Date);

      expect(result.aField.by).to.equal(user);
      expect(result.anotherField.by).to.equal(user);
    });
  });

  describe("audit()", () => {
    it("Updates specified fields", async () => {
      const epoch = new Date(0);

      const auditable: Auditable<Field> = {
        aField: { at: epoch, by: {} as User },
        anotherField: { at: epoch, by: {} as User },
      };

      const auditedField = fields[0];

      const sut = newSut();

      await sut.audit(auditable, auditedField);

      expect(auditable.aField.at).to.be.greaterThan(epoch);
      expect(auditable.anotherField.at).to.equal(epoch);

      expect(auditable.aField.by).to.equal(user);
      expect(auditable.anotherField.by).not.to.equal(user);
    });
  });
});
