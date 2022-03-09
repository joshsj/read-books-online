import { GetMessagesRequest, SendMessageRequest } from "@client/models";
import { io, Socket } from "socket.io-client";
import { store } from "./store";

let _socket: Socket | undefined = undefined;

const socket = {
  open: () => {
    if (!(store.apiUrl && store.user)) {
      return;
    }

    // trim any trailing paths
    const url = new URL(store.apiUrl).origin;

    _socket = io(url);
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
