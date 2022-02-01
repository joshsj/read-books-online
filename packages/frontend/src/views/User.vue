<script setup lang="ts">
import { isRBOError } from "@client/index";
import { UserDto } from "@client/models";
import { client } from "@frontend/client";
import ViewTitle from "@frontend/components/general/ViewTitle.vue";
import { useInteractor } from "@frontend/plugins/interactor";
import { route } from "@frontend/router";
import { store } from "@frontend/store";
import { prettyRoles } from "@frontend/utilities/user";
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";

const props = defineProps({ username: { type: String, required: true } });

const router = useRouter();
const { notify } = useInteractor();

const user = ref<UserDto | undefined>();

const getUser = async () => {
  const response = await store.pageLoad(client.user.get(props.username));

  if (isRBOError(response)) {
    notify(response);
    router.push(route({ name: "tickets" }));
    return;
  }

  user.value = response;
};

onMounted(getUser);
</script>

<template>
  <div v-if="user" class="container">
    <view-title title="User" />

    <div class="content">
      <strong>Username</strong>
      <p>{{ user.username }}</p>

      <strong>Email</strong>
      <p>{{ user.email }}</p>

      <strong>Roles</strong>
      <p>{{ prettyRoles(user.roles) }}</p>
    </div>
  </div>
</template>
