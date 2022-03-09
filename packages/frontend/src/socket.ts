import { GetMessagesRequest, SendMessageRequest } from "@client/models";
import { dateReviver } from "@core/utilities/date";
import { io, Socket } from "socket.io-client";
import { store } from "./store";
import parser from "socket.io-msgpack-parser";

let _socket: Socket | undefined = undefined;

const socket = {
  open: () => {
    if (!(store.apiUrl && store.user)) {
      return;
    }

    // trim any trailing paths
    const url = new URL(store.apiUrl).origin;

    _socket = io(url, { parser });
    _socket.auth = { token: store.user.authenticationToken };

    _socket.on("message", store.chat.updateMessages);

    _socket.connect();
  },

  close: () => {
    _socket?.close();
  },

  send: (request: GetMessagesRequest | SendMessageRequest): void => {
    _socket?.send(request);
  },
};

export { socket };
