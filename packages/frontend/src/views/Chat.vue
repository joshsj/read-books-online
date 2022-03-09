<script setup lang="ts">
import { store } from "@frontend/store";
import { MessageDto, BriefUserDto } from "@client/models";
import RboModal from "@frontend/components/general/Modal.vue";
import { computed } from "vue";
import { socket } from "@frontend/socket";

const refresh = () =>
  socket.send({
    requestName: "getMessagesRequest",
    ticketId: store.chat.activeTicket?._id,
  });

const messages = computed((): MessageDto[] => {
  const ticketId = store.chat.activeTicket?._id;

  if (!ticketId) {
    return [];
  }

  const messages = store.chat.messages[ticketId];

  return messages ?? [];
});
</script>

<template>
  <rbo-modal
    title="Chat"
    main-button-text="Close"
    main-button-variant=""
    :alt-button-hidden="true"
    v-model:active="store.chat.active">
    <template #header>
      <o-button variant="success" @click="refresh" icon-right="refresh" />
    </template>

    <div
      v-for="{ at, content, from } in messages"
      :key="at"
      class="message-container"
      :class="{
        'is-justify-content-flex-end': from._id === store.user?._id,
      }">
      <div class="message is-small">
        <div class="message-header">{{ from.username }}</div>
        <div class="message-body">{{ content }}</div>
      </div>
    </div>

    <div v-if="!messages.length" class="notification is-info is-light">
      No messages
    </div>
  </rbo-modal>
</template>

<style scoped lang="scss">
@import "bulma/bulma.sass";

.message-container {
  @extend .is-flex;
  @extend .is-justify-content-flex-start;
  @extend .mb-4;
}

.message {
  max-width: 75%;
}
</style>
