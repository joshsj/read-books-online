import { ApiError, IApiError } from "@/application/common/error";
import { newId } from "@/domain/common/id";
import { itUsesMongo } from "@/test/utilities/mongo";
import { TestEntity } from "@/test/utilities/testEntity";
import { TestEntityModel } from "@/test/utilities/testEntityModel";
import { expect } from "chai";

const model = TestEntityModel;
const expectedError: IApiError = { type: "validation" };

describe("Mongo Models", () => {
  itUsesMongo();

  describe("Validation", () => {
    it("Passes for valid entities", async () => {
      const validEntity: TestEntity = { id: newId(), min3: "abcde" };

      return expect(model.create(validEntity)).to.be.fulfilled;
    });

    it("Triggers for invalid IDs", async () => {
      const invalidEntity: TestEntity = { id: "invalid id", min3: "ab" };

      return expect(model.create(invalidEntity)).to.be.rejectedWith(ApiError).and.eventually.include(expectedError);
    });

    it("Triggers for invalid fields", async () => {
      const invalidEntity: TestEntity = { id: newId(), min3: "a" };

      return expect(model.create(invalidEntity)).to.be.rejectedWith(ApiError).and.eventually.include(expectedError);
    });
  });
});
