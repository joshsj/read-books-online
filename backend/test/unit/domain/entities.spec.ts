import { Entity } from "@/domain/common/entity";
import { EntityValidationError } from "@/domain/error/entityValidationError";
import { expect } from "chai";
import { describe } from "mocha";
import { validate } from "uuid";
import { TestEntity } from "./testEntity";

describe("Domain Entities", () => {
  describe("Construction", () => {
    it("Assigns the ID field", () => {
      const { id } = new TestEntity({ value: "ab" });

      expect(id).to.be.string;
      expect(Entity.isId(id)).to.be.true;
    });

    it("Assigns type properties", () => {
      const entity = new TestEntity({ value: "ab" });

      expect(entity).to.have.property("value", "ab");
    });

    it("Throws when the construction object is invalid", () => {
      expect(() => new TestEntity({ value: "" })).to.throw(
        EntityValidationError
      );
    });
  });

  describe("ID Helpers", () => {
    it("newId provides new IDs", () => {
      const id = Entity.newId();

      expect(validate(id)).to.be.true;
    });

    it("isId verifies a valid ID", () => {
      const id = Entity.newId();

      expect(Entity.isId(id)).to.be.true;
    });

    it("isId fails to validate a non-ID", () => {
      const id = 12345;

      expect(Entity.isId(id)).to.be.false;
    });
  });
});
