<script setup lang="ts">
import { computed, PropType } from "vue";
import { ModifyMode } from "@frontend/utilities/types";
import RboModal from "@frontend/components/general/Modal.vue";
import { capitalize } from "@core/utilities/string";

const props = defineProps({
  active: { type: Boolean, default: false },
  entity: { type: String, required: true },
  mode: { type: String as PropType<ModifyMode> },
  valid: { type: Boolean, default: true },
});

const title = computed(() =>
  props.mode ? `${capitalize(props.mode)} ${props.entity}` : props.entity
);
</script>

<template>
  <rbo-modal
    v-bind="$attrs"
    main-button-text="Save"
    alt-button-text="Cancel"
    :active="active"
    :title="title"
    :auto-close="false"
    :main-button-disabled="!valid">
    <slot />
  </rbo-modal>
</template>
