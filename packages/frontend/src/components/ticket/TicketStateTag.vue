<script setup lang="ts">
import { TicketState } from "@client/models";
import {
  StateVariants,
  prettyTicketState,
  ProgressState,
} from "@frontend/utilities/ticket";
import { computed, PropType } from "vue";

const props = defineProps({
  state: { type: String as PropType<TicketState> },

  // used for review & authorization stage, falls back to 'Pending'
  progress: { type: Boolean, default: false },
});

const variant = computed<string>(() =>
  props.progress
    ? ProgressState.variant(props.state as ProgressState)
    : StateVariants[props.state as TicketState]
);

const text = computed<string>(() =>
  props.progress
    ? ProgressState.text(props.state as ProgressState)
    : prettyTicketState(props.state as TicketState)
);
</script>

<template>
  <span :class="`tag is-light is-medium is-${variant}`">
    <slot>{{ text }}</slot>
  </span>
</template>
