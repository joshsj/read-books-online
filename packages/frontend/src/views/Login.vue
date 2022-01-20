<script setup lang="ts">
import { AccountDto } from "@client/models";
import { fieldState } from "@frontend/utilities/forms";
import { useLogin } from "@frontend/plugins/login";
import { useNotifier } from "@frontend/plugins/notifier";
import { useField, useForm } from "vee-validate";

const { notify } = useNotifier();
const { login } = useLogin();

const { handleSubmit } = useForm<AccountDto>({ validationSchema: AccountDto });

const onSubmit = handleSubmit(async (dto) => {
  const error = await login(dto);

  if (!error) {
    return;
  }

  notify(error.message, "danger");
});

const username = useField<string>("username");
const password = useField<string>("password");
</script>

<template>
  <div class="container">
    <h1 class="title">Login</h1>

    <form @submit="onSubmit">
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
