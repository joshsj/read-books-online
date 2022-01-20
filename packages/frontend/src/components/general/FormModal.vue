<script setup lang="ts">
import { PropType } from "vue";
import { ModifyMode } from "@frontend/utilities/component";
import RboModal from "@frontend/components/general/Modal.vue";
import { capitalize } from "@core/utilities/string";

defineProps({
  active: { type: Boolean, default: false },
  entity: { type: String, required: true },
  mode: { type: String as PropType<ModifyMode>, required: true },
  valid: { type: Boolean, default: true },
});
</script>

<template>
  <rbo-modal
    v-bind="$attrs"
    main-button-text="Save"
    alt-button-text="Cancel"
    :active="active"
    :title="capitalize(mode) + ' ' + entity"
    :auto-close="false"
    :main-button-disabled="!valid">
    <slot />
  </rbo-modal>
</template>
