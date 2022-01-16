import { IRepository } from "@backend/application/common/interfaces/repository";
import { newId } from "@backend/domain/common/id";
import { MongoRepository } from "@backend/infrastructure/repository/mongoRepository";
import { TestEntity } from "@backend/test/unit/utilities/testEntity";
import { itUsesMongo } from "@backend/test/unit/utilities/mongo";
import { expect } from "chai";
import { TestEntityModel } from "@backend/test/unit/utilities/testEntityModel";
import { RBOError } from "@backend/application/common/error/rboError";
import { ExpectedError } from "@backend/test/unit/utilities";

describe("Mongo Repository", () => {
  itUsesMongo();

  beforeEach(async () => {
    await TestEntityModel.create(testEntityOne);
    await TestEntityModel.create(testEntityTwo);
  });

  const testEntityOne: TestEntity = { id: newId(), min3: "test entity one" };
  const testEntityTwo: TestEntity = { id: newId(), min3: "test entity two" };
  const model = TestEntityModel;
  const repository: IRepository<TestEntity> = new MongoRepository(TestEntity, model);

  describe("Operations", () => {
    describe("get()", () => {
      it("Returns all entities", () => {
        const result = repository.get();

        return expect(result).to.have.eventually.have.length(2);
      });

      it("Returns an entity by ID ", () => {
        const result = repository.get(testEntityOne.id);

        return expect(result).eventually.to.include(testEntityOne);
      });

      it("Returns an entity by multiple IDs", async () => {
        const ids = [testEntityTwo.id];
        const result = repository.get(ids);

        return expect(result).eventually.to.have.length(1);
      });
    });

    describe("exists()", () => {
      it("Finds an entity", async () => {
        const entity: TestEntity = { id: newId(), min3: "entity" };
        await model.create(entity);

        const result = repository.exists(entity.id);

        return expect(result).to.be.eventually.true;
      });
    });

    describe("insert()", () => {
      it("An Entity", async () => {
        const entity: TestEntity = { id: newId(), min3: "entity" };

        await repository.insert(entity);

        const result = model.findOne({ id: entity.id });
        const expected = { min3: "entity" };

        return expect(result).eventually.include(expected).and.be.not.null;
      });
    });

    describe("update()", () => {
      it("An Entity", async () => {
        const entity: TestEntity = { id: newId(), min3: "entity" };
        await model.create(entity);

        entity.min3 = "updated entity";
        await repository.update(entity);

        const result = model.findOne({ id: entity.id });
        const expected = { min3: "updated entity" };

        return expect(result).eventually.to.include(expected).and.be.not.null;
      });

      it("Throws when updating a missing entity", () => {
        const entity: TestEntity = { id: newId(), min3: "entity" };

        const result = repository.update(entity);
        const expectedError: ExpectedError = { type: "missing" };

        return expect(result).to.be.rejectedWith(RBOError).and.eventually.include(expectedError);
      });
    });

    describe("delete()", () => {
      it("By ID", async () => {
        await repository.delete(testEntityOne.id);

        const result = model.find();

        return expect(result).eventually.to.have.length(1);
      });

      it("By multiple IDs", async () => {
        const ids = [testEntityOne.id, testEntityTwo.id];
        await repository.delete(ids);

        const result = model.find();

        return expect(result).eventually.to.have.length(0);
      });
    });
  });
});
