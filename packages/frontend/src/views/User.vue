<script setup lang="ts">
import { isRBOError } from "@client/index";
import { UpdateUserRequest, UserDto } from "@client/models";
import { capitalize } from "@core/utilities/string";
import { client } from "@frontend/client";
import ViewTitle from "@frontend/components/general/ViewTitle.vue";
import UpdateModal from "@frontend/components/user/UserUpdateModal.vue";
import { useBusiness } from "@frontend/plugins/business";
import { useInteractor } from "@frontend/plugins/interactor";
import { route } from "@frontend/router";
import { store } from "@frontend/store";
import { prettyBoolean } from "@frontend/utilities/component";
import { disabledToggleText, prettyRoles } from "@frontend/utilities/user";
import { FormContext } from "vee-validate";
import { computed, onMounted, ref } from "vue";
import { useRouter } from "vue-router";

const props = defineProps({ username: { type: String, required: true } });

const router = useRouter();
const { notify } = useInteractor();
const { userBusiness } = useBusiness();

const user = ref<UserDto | undefined>();
const getUser = async () => {
  const response = await store.page.load(client.user.get(props.username));

  if (isRBOError(response)) {
    notify(response);
    router.push(route({ name: "tickets" }));
    return;
  }

  user.value = response;
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

    await userBusiness.update(request).then(getUser);
  },
});
const updateModal = ref<{ form: FormContext<UpdateUserRequest> } | undefined>();
capitalize;
const onUpdateClick = () => {
  if (!(updateModal.value && user.value)) {
    return;
  }

  const { email, roles } = user.value;

  updateModal.value.form.setValues({
    requestName: "updateUserRequest",
    userId: user.value._id,
    email,
    roles,
  });
  modal.value.active = true;
};

onMounted(getUser);

const isCurrentUser = computed<boolean>(
  () => !!store.user && !!user.value && store.user._id === user.value._id
);
</script>

<template>
  <div v-if="user" class="container">
    <view-title title="User">
      <div class="buttons">
        <o-button
          v-if="userBusiness.canUpdate(user.username)"
          label="Update"
          variant="primary"
          @click="onUpdateClick" />

        <o-button
          v-if="userBusiness.canDisable(user)"
          :label="capitalize(disabledToggleText(user.disabled))"
          variant="primary"
          @click="userBusiness.toggleDisabled(user!).then((x ) => {x && getUser()})" />
      </div>
    </view-title>

    <div class="content">
      <strong>Username</strong>
      <p>{{ user.username }}<template v-if="isCurrentUser"> (You)</template></p>

      <strong>Email</strong>
      <p>{{ user.email }}</p>

      <strong>Roles</strong>
      <p>{{ prettyRoles(user.roles) }}</p>

      <strong>Disabled</strong>
      <p>{{ prettyBoolean(user.disabled) }}</p>
    </div>

    <update-modal
      ref="updateModal"
      v-model:active="modal.active"
      @main="modal.onMain" />
  </div>
</template>
