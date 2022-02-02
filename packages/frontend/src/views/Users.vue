<script setup lang="ts">
import { UpdateUserRequest, UserDto } from "@client/models";
import { client, isRBOError } from "@frontend/client";
import ViewTitle from "@frontend/components/general/ViewTitle.vue";
import UpdateModal from "@frontend/components/user/UserUpdateModal.vue";
import { useBusiness } from "@frontend/plugins/business";
import { useInteractor } from "@frontend/plugins/interactor";
import { route } from "@frontend/router";
import { store } from "@frontend/store";
import { disabledToggleText, prettyRoles } from "@frontend/utilities/user";
import { FormContext } from "vee-validate";
import { onMounted, ref } from "vue";
import Username from "@frontend/components/general/Username.vue";
import { prettyBoolean } from "@frontend/utilities/component";
import { capitalize } from "@core/utilities/string";

const { notify } = useInteractor();
const { userBusiness } = useBusiness();

const table = ref({ items: [] as UserDto[] });

const getUsers = async () => {
  const response = await store.pageLoad(client.user.get());

  if (isRBOError(response)) {
    notify(response);
    return;
  }

  table.value.items = response;
};

const modal = ref({
  active: false,

  onMain: async () => {
    if (!updateModal.value) {
      return;
    }

    const request = {
      ...updateModal.value.form.values,
    };
    !userBusiness.canUpdateRoles() && (request.roles = undefined);

    await userBusiness.update(request).then(getUsers);
  },
});
const updateModal = ref<{ form: FormContext<UpdateUserRequest> } | undefined>();

const onUpdateClick = (user: UserDto) => {
  if (!updateModal.value) {
    return;
  }

  const { email, roles } = user;

  updateModal.value.form.setValues({
    requestName: "updateUserRequest",
    userId: user._id,
    email,
    roles,
  });
  modal.value.active = true;
};

onMounted(getUsers);
</script>

<template>
  <div class="container">
    <view-title title="Users" />

    <o-table :data="table.items">
      <o-table-column label="Username">
        <template v-slot="{ row: { username } }">
          <span><username :username="username" /></span>
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

      <o-table-column label="Disabled">
        <template v-slot="{ row: { disabled } }">
          <span>{{ prettyBoolean(disabled) }}</span>
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

            <o-dropdown-item
              v-if="userBusiness.canUpdate(user.username)"
              @click="onUpdateClick(user)">
              Update
            </o-dropdown-item>

            <o-dropdown-item
              v-if="userBusiness.canDisable(user)"
              @click="userBusiness.toggleDisabled(user!).then((x ) => {x && getUsers()})">
              {{ capitalize(disabledToggleText(user.disabled)) }}
            </o-dropdown-item>
          </o-dropdown>
        </template>
      </o-table-column>
    </o-table>

    <update-modal
      ref="updateModal"
      v-model:active="modal.active"
      @main="modal.onMain" />
  </div>
</template>
