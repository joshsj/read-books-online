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
      const expectedKeys: Array<keyof Auditable<Field>> = [
        "aFieldAt",
        "anotherFieldAt",
        "aFieldBy",
        "anotherFieldBy",
      ];

      expect(result).to.have.all.keys(expectedKeys);

      expect(result.aFieldAt).to.be.instanceOf(Date);
      expect(result.anotherFieldAt).to.be.instanceOf(Date);

      expect(result.aFieldBy).to.equal(user);
      expect(result.anotherFieldBy).to.equal(user);
    });
  });

  describe("audit()", () => {
    it("Updates specified fields", async () => {
      const epoch = new Date(0);

      const auditable: Auditable<Field> = {
        aFieldAt: epoch,
        aFieldBy: {} as User,

        anotherFieldAt: epoch,
        anotherFieldBy: {} as User,
      };

      const auditedField = fields[0];

      const sut = newSut();

      await sut.audit(auditable, auditedField);

      expect(auditable.aFieldAt).to.be.greaterThan(epoch);
      expect(auditable.anotherFieldAt).to.equal(epoch);

      expect(auditable.aFieldBy).to.equal(user);
      expect(auditable.anotherFieldBy).not.to.equal(user);
    });
  });
});
