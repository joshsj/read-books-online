import { newId } from "@/domain/common/id";
import { ValidationError } from "@/application/common/error/validationError";
import { TestEntity } from "@/test/utilities/testEntity";
import { itUsesMongo } from "@/test/utilities/mongo";
import { expect } from "chai";
import { TestEntityModel } from "../../../../utilities/testEntityModel";

describe("Mongo Models", () => {
  itUsesMongo();

  const model = TestEntityModel;

  describe("Validation", () => {
    it("Passes for valid entities", async () => {
      const validEntity: TestEntity = { id: newId(), min3: "abcde" };

      return expect(model.create(validEntity)).to.be.fulfilled;
    });

    it("Triggers for invalid IDs", async () => {
      const invalidEntity: TestEntity = { id: "invalid id", min3: "ab" };

      return expect(model.create(invalidEntity)).to.be.rejectedWith(
        ValidationError
      );
    });

    it("Triggers for invalid fields", async () => {
      const invalidEntity: TestEntity = { id: newId(), min3: "a" };

      return expect(model.create(invalidEntity)).to.be.rejectedWith(
        ValidationError
      );
    });
  });
});
