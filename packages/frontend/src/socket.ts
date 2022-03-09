import { store } from "./store";
import { io } from "socket.io-client";
import { SendMessageRequest } from "@client/models";

const socket = {
  open: () => {
    if (!(store.apiUrl && store.user)) {
      return;
    }

    // trim any trailing paths
    const url = new URL(store.apiUrl).origin;

    console.log(`Opening socket connection at ${url}`);

    const socket = io(url);
    socket.auth = { token: store.user.authenticationToken };

    socket.on("connect_error", (err) => {
      console.log(`connect_error due to ${err.message}`);
    });

    socket.on("connect", () => {
      const msg: SendMessageRequest = {
        requestName: "sendMessageRequest",
        ticketId: "61f821f942f54e0493b465ca",
        content: "hello world",
      };

      socket.send(msg);
    });

    socket.on("message", console.log);

    socket.connect();
  },

  close: () => {},
};

export { socket };
