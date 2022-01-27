<script setup lang="ts">
import { TicketQuery } from "@client/models";
import { EmptyTicketQuery } from "@frontend/utilities/ticket";
import { PropType } from "vue";

const props = defineProps({
  query: { type: Object as PropType<TicketQuery>, required: true },
});

const emit = defineEmits(["update:query", "change"]);

const onChange = () => {
  emit("update:query", props.query);
  emit("change");
};

const onClear = () => {
  emit("update:query", EmptyTicketQuery());
  emit("change");
};
</script>

<template>
  <div class="block">
    <o-dropdown>
      <template #trigger>
        <o-button label="Filter" variant="primary" />
      </template>

      <div class="p-2">
        <o-field label="Information" label-for="Information">
          <o-input
            id="Information"
            name="Information"
            placeholder="Information"
            v-model="query.filter.information" />
        </o-field>

        <o-button label="Save" variant="primary" @click="onChange" />
      </div>
    </o-dropdown>

    <o-button label="Clear" variant="light" class="ml-2" @click="onClear" />
  </div>
</template>

<style scoped>
.field {
  min-width: 15rem;
}
</style>
