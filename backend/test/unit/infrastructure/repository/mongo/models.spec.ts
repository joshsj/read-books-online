import { newId } from "@/domain/common/id";
import { EntityValidationError } from "@/domain/error/entityValidationError";
import { TestEntity } from "@/test/unit/domain/testEntity";
import { itUsesMongo } from "@/test/utilities/mongo";
import { expect, use } from "chai";
import chaiAsPromised from "chai-as-promised";
import { TestEntityModel } from "./testEntityModel";
use(chaiAsPromised);

describe("Mongo Models", () => {
  itUsesMongo();

  const model = TestEntityModel;

  describe("Validation", () => {
    it("Triggers for invalid IDs", async () => {
      const invalidEntity: TestEntity = { id: "invalid id", min3: "abcde" };

      return expect(model.create(invalidEntity)).to.be.rejectedWith(
        EntityValidationError
      );
    });

    it("Triggers for invalid fields", async () => {
      const invalidEntity: TestEntity = { id: newId(), min3: "a" };

      return expect(model.create(invalidEntity)).to.be.rejectedWith(
        EntityValidationError
      );
    });
  });
});
