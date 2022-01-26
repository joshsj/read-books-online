<script setup lang="ts">
import { TicketState } from "@client/models";
import {
  DefaultVariant,
  terminalStateVariant,
} from "@frontend/utilities/ticket";
import { computed, PropType } from "vue";

const props = defineProps({
  state: { type: String as PropType<TicketState> },
  fallback: { type: Boolean },
});

const tagClass = computed(() => {
  const variant = terminalStateVariant(props.state);

  return props.fallback || variant
    ? `tag is-light is-medium is-${variant ?? DefaultVariant}`
    : undefined;
});
</script>

<template>
  <span class="state-tag" :class="tagClass">{{ state }}</span>
</template>

<style scoped>
.state-tag {
  white-space: nowrap;
}
</style>
