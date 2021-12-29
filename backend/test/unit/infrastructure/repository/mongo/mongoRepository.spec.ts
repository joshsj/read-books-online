import { IRepository } from "@/application/common/interfaces/repository";
import { MongoRepository } from "@/infrastructure/repository/mongo/mongoRepository";
import { TestEntity, TestEntityModel } from "@/test/unit/domain/testEntity";
import { itUsesMongo } from "@/test/utilities/mongo";
import { expect } from "chai";

describe("Mongo Repository", () => {
  itUsesMongo();

  const testEntityOne = new TestEntity({ value: "test entity one" });
  const testEntityTwo = new TestEntity({ value: "test entity two" });
  const model = TestEntityModel;
  const repository: IRepository<TestEntity> = new MongoRepository(
    TestEntity,
    model
  );

  beforeEach(async () => {
    await TestEntityModel.create(testEntityOne);
    await TestEntityModel.create(testEntityTwo);
  });

  describe("Operations", () => {
    describe("Get", () => {
      it("All", async () => {
        const result = await repository.get();

        expect(result).to.have.length(2);
      });

      it("By ID", async () => {
        const id = testEntityOne.id;

        const result = await repository.get(id);

        expect(result).not.to.be.undefined;
      });

      it("By multiple IDs", async () => {
        const ids = [testEntityOne.id, testEntityTwo.id];
        const result = await repository.get(ids);

        expect(result).to.have.length(2);
      });
    });

    describe("Insert", () => {
      it("An Entity", async () => {
        const entity = new TestEntity({ value: "entity" });

        await repository.insert(entity);

        const result = await model.findOne({ id: entity.id });

        expect(result).not.to.be.null;
        expect(result).to.have.property("value", "entity");
      });
    });

    describe("Update", () => {
      it("An Entity", async () => {
        const entity = new TestEntity({ value: "entity" });
        model.create(entity);

        entity.value = "updated entity";

        await repository.update(entity);
        const result = await model.findOne({ id: entity.id });

        expect(result).not.to.be.null;
        expect(result).to.have.property("value", "updated entity");
      });
    });

    describe("Delete", () => {
      it("By Id", async () => {
        await repository.delete(testEntityOne.id);

        const result = await model.find();

        expect(result).to.have.length(1);
        expect(result[0]).to.have.property("id", testEntityTwo.id);
      });

      it("By multiple IDs", async () => {
        const ids = [testEntityOne.id, testEntityTwo.id];
        await repository.delete(ids);

        const result = await model.find();

        expect(result).to.have.length(0);
      });
    });
  });

  describe("Types", () => {
    it("Returns Entity<> instances", async () => {
      const entity = new TestEntity({ value: "entity" });
      model.create(entity);

      const result = await repository.get(entity.id);

      expect(result).to.be.instanceOf(TestEntity);
    });
  });
});
