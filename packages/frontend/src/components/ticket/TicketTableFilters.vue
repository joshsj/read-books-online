<script setup lang="ts">
import {
  TicketQuery,
  ReferenceDataDto,
  SortDirections,
  TicketFields,
} from "@client/models";
import { capitalize } from "@core/utilities/string";
import { client, isRBOError } from "@frontend/client";
import { useInteractor } from "@frontend/plugins/interactor";
import { store } from "@frontend/store";
import { EmptyTicketQuery } from "@frontend/utilities/ticket";
import { computed, onMounted, PropType, ref } from "vue";

const props = defineProps({
  query: { type: Object as PropType<TicketQuery>, required: true },
});

const emit = defineEmits(["update:query", "change"]);

const { notify } = useInteractor();

const users = ref<ReferenceDataDto[]>([]);

const getUsers = async () => {
  const response = await store.pageLoad(client.referenceData.get("user"));

  if (isRBOError(response)) {
    notify(response);
    return;
  }

  users.value = response;
};

const onChange = () => {
  emit("update:query", props.query);
  emit("change");
};

const onClear = () => {
  emit("update:query", EmptyTicketQuery());
  emit("change");
};

onMounted(getUsers);

const canSelectUser = computed(() =>
  store.user?.roles.some((r) => r !== "client")
);
</script>

<template>
  <div class="block">
    <o-dropdown class="mr-3">
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

        <o-field v-if="canSelectUser" label="User" label-for="User">
          <o-select id="Users" v-model="query.filter.userId">
            <option :value="undefined" />

            <option v-for="{ _id, value } in users" :key="_id" :value="_id">
              {{ value }}
            </option>
          </o-select>
        </o-field>

        <o-button label="Save" variant="primary" @click="onChange" />
      </div>
    </o-dropdown>

    <o-dropdown class="mr-3">
      <template #trigger>
        <o-button label="Sort" variant="primary" />
      </template>

      <div class="p-2">
        <o-field label="Field" label-for="Field">
          <o-select id="Field" v-model="query.sortField">
            <option :value="undefined" />

            <option v-for="field in TicketFields" :key="field" :value="field">
              {{ capitalize(field) }}
            </option>
          </o-select>
        </o-field>

        <o-field label="Direction" label-for="Direction">
          <o-select id="Direction" v-model="query.sortDirection">
            <option
              v-for="direction in SortDirections"
              :key="direction"
              :value="direction">
              {{ capitalize(direction) }}
            </option>
          </o-select>
        </o-field>

        <o-button label="Save" variant="primary" @click="onChange" />
      </div>
    </o-dropdown>

    <o-button label="Clear" variant="light" @click="onClear" />
  </div>
</template>

<style scoped>
.field {
  min-width: 15rem;
}
</style>
