<script setup lang="ts">
import { BriefUserDto, MessageDto } from "@client/models";
import { formatDate } from "@core/utilities/date";
import RboModal from "@frontend/components/general/Modal.vue";
import { socket } from "@frontend/socket";
import { store } from "@frontend/store";
import { computed, ref } from "vue";

const ticketId = computed(() => store.chat.activeTicket?._id);
const newMessage = ref("");
const searchQuery = ref("");
const messagesContainer = ref<HTMLDivElement>();
const scrollToLatestMessage = () =>
  messagesContainer.value?.scrollTo({ top: Number.MAX_SAFE_INTEGER });

const messages = computed((): MessageDto[] => {
  const ticketId = store.chat.activeTicket?._id;

  if (!ticketId) {
    return [];
  }

  const messages = store.chat.messages[ticketId];

  if (!messages) {
    return [];
  }

  return messages;
});

const sendMessage = () => {
  socket.send({
    requestName: "sendMessageRequest",
    content: newMessage.value,
    ticketId: ticketId.value,
  });

  newMessage.value = "";
  scrollToLatestMessage();
};

const isOwnMessage = (from: BriefUserDto) => from._id === store.user?._id;
</script>

<template>
  <rbo-modal
    title="Chat"
    main-button-text="Close"
    main-button-variant=""
    :alt-button-hidden="true"
    v-model:active="store.chat.active">
    <template #header>
      <o-input placeholder="Search" v-model="searchQuery" icon="search" />
    </template>

    <div id="messages-container" ref="messagesContainer">
      <div
        v-for="{ at, content, from } in messages"
        :key="at"
        class="notification-container"
        :class="{
          'is-justify-content-flex-end': isOwnMessage(from),
        }">
        <div
          class="notification is-size-7"
          :class="{
            'is-warning': searchQuery
              ? content.includes(searchQuery)
              : undefined,
          }">
          <o-tooltip
            :label="formatDate(at, 'full')"
            :position="isOwnMessage(from) ? 'left' : 'right'">
            <span v-if="!isOwnMessage(from)" class="has-text-weight-medium">
              {{ from.username }}:
            </span>

            {{ content }}
          </o-tooltip>
        </div>
      </div>
    </div>

    <div v-if="!messages.length" class="notification is-info is-light">
      No messages
    </div>

    <form @submit.prevent="sendMessage">
      <div class="is-flex-grow-1">
        <o-input v-model="newMessage" placeholder="Message" required />
      </div>

      <o-button native-type="submit" label="Send" variant="info" class="ml-2" />
    </form>
  </rbo-modal>
</template>

<style scoped lang="scss">
@import "bulma/bulma.sass";

// fixed heights for scrollable messages & static message box
#messages-container {
  overflow-y: auto;
  height: calc(100% - 3.5em);
}

form {
  @extend .is-flex;
  @extend .is-align-items-flex-end;
  height: 3.5em;
}

.notification-container {
  @extend .is-flex;
  @extend .is-justify-content-flex-start;
  @extend .mb-3;
}

.notification {
  max-width: 75%;
}
</style>
