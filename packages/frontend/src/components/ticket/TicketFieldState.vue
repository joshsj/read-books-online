<script setup lang="ts">
export type TicketFieldState = "passed" | "failed" | "pending";

import { PropType } from "vue";

const variants = {
  passed: "success",
  failed: "danger",
  pending: "info",
};

defineProps({
  title: { type: String, required: true },
  state: { type: String as PropType<TicketFieldState>, required: true },
});
</script>

<template>
  <article :class="`message is-${variants[state]}`">
    <div class="message-header">
      <p>{{ title }}</p>
    </div>

    <div class="message-body">
      <slot>{{ state === "pending" ? "Pending" : "" }}</slot>
    </div>
  </article>
</template>
