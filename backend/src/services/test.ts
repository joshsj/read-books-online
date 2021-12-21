import { IQueryHandler, IRequest } from "@/library/cqrs/types";
import { IValidator } from "@/dependency";

type TestRequest = IRequest<"testRequest"> & { name: string };

const testRequestHandler: IQueryHandler<TestRequest, { testResponse: string }> =
  {
    handles: "testRequest",
    handle: async () => ({ testResponse: "hello world" }),
  };

const testRequestValidator: IValidator<TestRequest> = {
  requestName: "testRequest",
  validate: ({ name }) => (typeof name !== "string" ? ["Name is invalid"] : []),
};

export { TestRequest, testRequestHandler, testRequestValidator };
