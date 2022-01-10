import { ApiError, IApiError } from "@/application/common/error/apiError";
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

      const result = model.create(validEntity);

      return expect(result).to.be.fulfilled;
    });

    it("Triggers for invalid IDs", async () => {
      const invalidEntity: TestEntity = { id: "invalid id", min3: "ab" };

      const result = model.create(invalidEntity);

      return expect(result).to.be.rejectedWith(ApiError).and.eventually.include(expectedError);
    });

    it("Triggers for invalid fields", async () => {
      const invalidEntity: TestEntity = { id: newId(), min3: "a" };

      const result = model.create(invalidEntity);

      return expect(result).to.be.rejectedWith(ApiError).and.eventually.include(expectedError);
    });
  });
});
