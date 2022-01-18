import { RBOError } from "@backend/application/common/error/rboError";
import { IRepository } from "@backend/application/common/interfaces/repository";
import { Id, newId } from "@backend/domain/common/id";
import { MongoRepository } from "@backend/infrastructure/repository/mongoRepository";
import { ExpectedError } from "@backend/test/unit/utilities";
import { useMongo } from "@backend/test/unit/utilities/mongo";
import { ParentTestEntity, TestEntity } from "@backend/test/unit/utilities/testEntities";
import {
  ParentTestEntityModel,
  TestEntityModel,
} from "@backend/test/unit/utilities/testEntityModels";
import { expect } from "chai";

describe("Mongo Repository", () => {
  useMongo();

  describe("Operations", () => {
    const testEntityOne: TestEntity = { _id: newId(), min3: "test entity one" };
    const testEntityTwo: TestEntity = { _id: newId(), min3: "test entity two" };
    const model = TestEntityModel;
    const repository: IRepository<TestEntity> = new MongoRepository(TestEntity, model);

    beforeEach(async () => {
      await TestEntityModel.create(testEntityOne);
      await TestEntityModel.create(testEntityTwo);
    });

    describe("get()", () => {
      it("Returns all entities", () => {
        const result = repository.get();

        return expect(result).to.have.eventually.have.length(2);
      });

      it("Returns an entity by ID ", () => {
        const result = repository.get(testEntityOne._id);

        return expect(result).eventually.to.include(testEntityOne);
      });

      it("Returns an entity by multiple IDs", async () => {
        const ids = [testEntityTwo._id];
        const result = repository.get(ids);

        return expect(result).eventually.to.be.instanceOf(Array).and.have.length(1);
      });
    });

    describe("exists()", () => {
      it("Finds an entity", async () => {
        const entity: TestEntity = { _id: newId(), min3: "entity" };
        await model.create(entity);

        const result = repository.exists(entity._id);

        return expect(result).to.be.eventually.true;
      });
    });

    describe("insert()", () => {
      it("An Entity", async () => {
        const entity: TestEntity = { _id: newId(), min3: "entity" };

        await repository.insert(entity);

        const result = model.findOne({ _id: entity._id });
        const expected = { min3: "entity" };

        return expect(result).eventually.include(expected).and.be.not.null;
      });
    });

    describe("update()", () => {
      it("An Entity", async () => {
        const entity: TestEntity = { _id: newId(), min3: "entity" };
        await model.create(entity);

        entity.min3 = "updated entity";
        await repository.update(entity);

        const result = model.findOne({ _id: entity._id });
        const expected = { min3: "updated entity" };

        return expect(result).eventually.to.include(expected).and.be.not.null;
      });

      it("Throws when updating a missing entity", () => {
        const entity: TestEntity = { _id: newId(), min3: "entity" };

        const result = repository.update(entity);
        const expectedError: ExpectedError = { type: "missing" };

        return expect(result).to.be.rejectedWith(RBOError).and.eventually.include(expectedError);
      });
    });

    describe("delete()", () => {
      it("By ID", async () => {
        await repository.delete(testEntityOne._id);

        const result = model.find();

        return expect(result).eventually.to.have.length(1);
      });

      it("By multiple IDs", async () => {
        const ids = [testEntityOne._id, testEntityTwo._id];
        await repository.delete(ids);

        const result = model.find();

        return expect(result).eventually.to.have.length(0);
      });
    });
  });

  describe("Associations", () => {
    describe("One to one", () => {
      const child: TestEntity = Object.freeze({ _id: newId(), min3: "zyxv" });
      const parent: ParentTestEntity = Object.freeze({ _id: newId(), min3: "abcd", child });
      const repository = new MongoRepository<ParentTestEntity>(
        ParentTestEntity,
        ParentTestEntityModel
      );

      it("Returns an associated entity", async () => {
        await TestEntityModel.create(child);
        await ParentTestEntityModel.create(parent);

        const result = repository.get(parent._id);

        return expect(result).to.be.fulfilled.and.eventually.have.nested.property(
          "child._id",
          child._id
        );
      });

      it("Persists an associated entity", async () => {
        await TestEntityModel.create(child);
        await repository.insert(parent);

        const result = ParentTestEntityModel.findById(parent._id);

        return expect(result).to.be.fulfilled.and.eventually.have.nested.property(
          "child._id",
          child._id
        );
      });
    });
  });

  describe("One to many", () => {
    const children: TestEntity[] = [
      Object.freeze({ _id: newId(), min3: "child 1" }),
      Object.freeze({ _id: newId(), min3: "child 2" }),
    ];
    const parent: ParentTestEntity = Object.freeze({ _id: newId(), min3: "abcd", children });
    const repository = new MongoRepository<ParentTestEntity>(
      ParentTestEntity,
      ParentTestEntityModel
    );

    it("Returns associated entities", async () => {
      await TestEntityModel.create(children[0]);
      await TestEntityModel.create(children[1]);
      await ParentTestEntityModel.create(parent);

      const result = repository.get(parent._id);

      return expect(result).to.be.fulfilled.and.eventually.have.nested.property(
        "children.length",
        2
      );
    });

    it("Persists associated entities", async () => {
      const child = children[1]!;
      await TestEntityModel.create(child);
      await repository.insert(parent);

      const result = ParentTestEntityModel.findById(parent._id);

      return expect(result).to.be.fulfilled.and.eventually.have.nested.property(
        "children[0]._id",
        child._id
      );
    });
  });
});

describe("Validation", () => {
  const repository = new MongoRepository<TestEntity>(TestEntity, TestEntityModel);
  const expectedError = new RBOError("validation");
  const entity: TestEntity = { _id: newId(), min3: "abcde" };

  describe("insert()", () => {
    it("Triggers for entities", async () => {
      const result = repository.insert({ ...entity, min3: "ab" });

      return expect(result).to.be.rejectedWith(RBOError).and.eventually.include(expectedError);
    });
  });

  describe("update()", () => {
    it("Triggers for entities", async () => {
      await TestEntityModel.create(entity);

      const result = repository.update({ ...entity, min3: "ab" });

      return expect(result).to.be.rejectedWith(RBOError).and.eventually.include(expectedError);
    });
  });
});
