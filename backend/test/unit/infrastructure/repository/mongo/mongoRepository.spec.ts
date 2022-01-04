import { IRepository } from "@/application/common/interfaces/repository";
import { newId } from "@/domain/common/id";
import { MongoRepository } from "@/infrastructure/repository/mongoRepository";
import { TestEntity } from "@/test/unit/domain/testEntity";
import { itUsesMongo } from "@/test/utilities/mongo";
import { expect } from "chai";
import { TestEntityModel } from "./testEntityModel";

describe("Mongo Repository", () => {
  itUsesMongo();

  beforeEach(async () => {
    await TestEntityModel.create(testEntityOne);
    await TestEntityModel.create(testEntityTwo);
  });

  const testEntityOne: TestEntity = { id: newId(), min3: "test entity one" };
  const testEntityTwo: TestEntity = { id: newId(), min3: "test entity two" };
  const model = TestEntityModel;
  const repository: IRepository<TestEntity> = new MongoRepository(
    TestEntity,
    model
  );

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
        const entity: TestEntity = { id: newId(), min3: "entity" };

        await repository.insert(entity);

        const result = await model.findOne({ id: entity.id });

        expect(result).not.to.be.null;
        expect(result).to.have.property("min3", "entity");
      });
    });

    describe("Update", () => {
      it("An Entity", async () => {
        const entity: TestEntity = { id: newId(), min3: "entity" };
        model.create(entity);

        entity.min3 = "updated entity";

        await repository.update(entity);
        const result = await model.findOne({ id: entity.id });

        expect(result).not.to.be.null;
        expect(result).to.have.property("min3", "updated entity");
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
});
