<script setup lang="ts">
import { UserDto } from "@client/models";
import { client, isRBOError } from "@frontend/client";
import ViewTitle from "@frontend/components/general/ViewTitle.vue";
import { useInteractor } from "@frontend/plugins/interactor";
import { route } from "@frontend/router";
import { store } from "@frontend/store";
import { prettyRoles } from "@frontend/utilities/user";
import { onMounted, ref } from "vue";

const { notify } = useInteractor();

const table = ref({ items: [] as UserDto[] });

const getUsers = async () => {
  const response = await store.pageLoad(client.user.get());

  if (isRBOError(response)) {
    notify(response);
    return;
  }

  table.value.items = response;
};

onMounted(getUsers);
</script>

<template>
  <div class="container">
    <view-title title="Users" />

    <o-table :data="table.items">
      <o-table-column label="Username">
        <template v-slot="{ row: { username } }">
          <span>{{ username }}</span>
        </template>
      </o-table-column>

      <o-table-column label="Email">
        <template v-slot="{ row: { email } }">
          <span>{{ email }}</span>
        </template>
      </o-table-column>

      <o-table-column label="Roles">
        <template v-slot="{ row: { roles } }">
          <span>{{ prettyRoles(roles) }}</span>
        </template>
      </o-table-column>

      <o-table-column label="Actions" position="centered" width="7.5%">
        <template v-slot="{ index, row: user }">
          <o-dropdown
            :position="`${
              index >= table.items.length / 2 ? 'top' : 'bottom'
            }-left`">
            <template #trigger>
              <o-button variant="info" outlined icon-right="chevron-down" />
            </template>

            <router-link
              :to="route({ name: 'user', username: user.username })"
              custom
              v-slot="{ navigate }">
              <o-dropdown-item tag="a" @click="navigate">
                View
              </o-dropdown-item>
            </router-link>
          </o-dropdown>
        </template>
      </o-table-column>
    </o-table>
  </div>
</template>
