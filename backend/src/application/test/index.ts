import {
  IQueryHandler,
  IRequest,
  IRequestValidator,
} from "@/application/common/interfaces/cqrs";

type TestRequest = IRequest<"testRequest"> & { name: string };

const testRequestHandler: IQueryHandler<TestRequest, { testResponse: string }> =
  {
    handles: "testRequest",
    handle: async () => ({ testResponse: "hello world" }),
  };

const testRequestValidator: IRequestValidator<TestRequest> = {
  requestName: "testRequest",
  validate: async () => {},
};

export { TestRequest, testRequestHandler, testRequestValidator };
