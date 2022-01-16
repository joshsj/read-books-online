import { RBOError, IRBOError } from "@backend/application/common/error/rboError";
import { newId } from "@backend/domain/common/id";
import { useMongo } from "@backend/test/unit/utilities/mongo";
import { TestEntity } from "@backend/test/unit/utilities/testEntity";
import { TestEntityModel } from "@backend/test/unit/utilities/testEntityModel";
import { expect } from "chai";

const model = TestEntityModel;
const expectedError: IRBOError = { type: "validation" };

describe("Mongo Models", () => {
  useMongo();

  describe("Validation", () => {
    it("Passes for valid entities", async () => {
      const validEntity: TestEntity = { id: newId(), min3: "abcde" };

      const result = model.create(validEntity);

      return expect(result).to.be.fulfilled;
    });

    it("Triggers for invalid IDs", async () => {
      const invalidEntity: TestEntity = { id: "invalid id", min3: "ab" };

      const result = model.create(invalidEntity);

      return expect(result).to.be.rejectedWith(RBOError).and.eventually.include(expectedError);
    });

    it("Triggers for invalid fields", async () => {
      const invalidEntity: TestEntity = { id: newId(), min3: "a" };

      const result = model.create(invalidEntity);

      return expect(result).to.be.rejectedWith(RBOError).and.eventually.include(expectedError);
    });
  });
});
