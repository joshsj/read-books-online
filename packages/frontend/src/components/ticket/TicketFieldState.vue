<script setup lang="ts">
export type TicketFieldState = "success" | "danger" | "info";

import { PropType } from "vue";

defineProps({
  title: { type: String, required: true },
  state: { type: String as PropType<TicketFieldState>, required: true },
});
</script>

<template>
  <article :class="`message is-${state}`">
    <div class="message-header">
      <p>{{ title }}</p>
    </div>

    <div class="message-body">
      <slot>{{ state === "info" ? "Pending" : "" }}</slot>
    </div>
  </article>
</template>
