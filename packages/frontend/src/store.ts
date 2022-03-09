import { Id, MessageDto, Role, TicketDto } from "@client/models";
import { Some } from "@core/utilities/types";
import { reactive, UnwrapNestedRefs, watch } from "vue";
import { socket } from "./socket";

type UserStore = Readonly<{
  authenticationToken: string;
  _id: Id;
  username: string;
  roles: Role[];
}>;

type Store = {
  apiUrl: string | undefined;
  user: UserStore | undefined;

  page: {
    loading: boolean;
    load: <T>(p: Promise<T>) => Promise<T>;
  };

  /** Ticket Id: Messages  */
  chat: {
    active: boolean;
    activeTicket: TicketDto | undefined;

    messages: { [id: Id]: MessageDto[] };
    updateMessages: (messages: Some<MessageDto>) => void;
  };
};

const store: UnwrapNestedRefs<Store> = reactive<Store>({
  apiUrl: undefined,
  user: undefined,

  page: {
    loading: false,
    load: (p) => {
      store.page.loading = true;

      return p.finally(() => (store.page.loading = false));
    },
  },

  chat: {
    active: false,
    activeTicket: undefined,

    messages: {},
    updateMessages: (messages) => {
      // overwrite
      if (Array.isArray(messages)) {
        // extract from first ticket
        const ticketId = messages[0]?.ticketId;

        if (!ticketId) {
          return;
        }

        store.chat.messages[ticketId] = messages;
      } else {
        const ticketId = messages.ticketId;

        if (!store.chat.messages[ticketId]) {
          store.chat.messages[ticketId] = [];
        }

        store.chat.messages[messages.ticketId]?.push(messages);
      }
    },
  },
});

watch(
  () => store.user,
  (x) => socket[x ? "open" : "close"]()
);

watch(
  () => store.chat.activeTicket,
  () => {
    // ensure tickets have been initially requested
    if (!store.chat.activeTicket) {
      return;
    }

    const ticketId = store.chat.activeTicket._id;
    const messages = store.chat.messages[ticketId];

    if (Array.isArray(messages)) {
      return;
    }

    socket.send({ requestName: "getMessagesRequest", ticketId });
  }
);

export { store, Store, UserStore };
