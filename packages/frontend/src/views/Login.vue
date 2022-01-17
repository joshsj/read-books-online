<script setup lang="ts">
import { useForm, useField } from "vee-validate";
import { AccountDto } from "@client/models";
import { fieldState } from "@frontend/plugins/forms";
import { client, isRBOError } from "@frontend/client";
import { store } from "@frontend/store";
import { useRouter } from "vue-router";
import { route } from "@frontend/router";
import { useNotifier } from "@frontend/plugins/notifier";

const router = useRouter();
const { notify } = useNotifier();

const { handleSubmit } = useForm<AccountDto>({ validationSchema: AccountDto });

const onSubmit = handleSubmit(async (dto) => {
  const result = await client.auth.post(dto);

  if (isRBOError(result)) {
    notify(result.message, "danger");
    return;
  }

  store.authenticationToken = result.token;
  router.push(route({ name: "home" }));
});

const username = useField<string>("username");
const password = useField<string>("password");
</script>

<template>
  <div class="container">
    <form @submit="onSubmit">
      <h1 class="title">Login</h1>

      <o-field
        label="Username"
        label-for="Username"
        v-bind="fieldState(username)">
        <o-input
          id="Username"
          name="Username"
          placeholder="Username"
          v-model="username.value" />
      </o-field>

      <o-field
        label="Password"
        label-for="Password"
        v-bind="fieldState(password)">
        <o-input
          id="Password"
          name="Password"
          placeholder="Password"
          type="Password"
          v-model="password.value"
          password-reveal />
      </o-field>

      <o-field>
        <o-button native-type="submit" variant="primary">Login</o-button>
      </o-field>
    </form>
  </div>
</template>
