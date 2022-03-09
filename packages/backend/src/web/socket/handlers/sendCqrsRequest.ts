import { Dependency } from "@backend/application/dependency";
import { IRequest } from "@core/cqrs/types/request";
import { ICQRS } from "@core/cqrs/types/service";
import { Socket } from "../common/utilities/types";

const sendCqrsRequest = async (socket: Socket, request: IRequest<any>) => {
  const { container } = socket.data;

  const result = await container!.resolve<ICQRS>(Dependency.cqrs).send(request);

  result && socket.send(result);
};

export { sendCqrsRequest };
