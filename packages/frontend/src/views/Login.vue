<script setup lang="ts">
import { AccountDto } from "@client/models";
import ViewTitle from "@frontend/components/general/ViewTitle.vue";
import { useLogin } from "@frontend/plugins/login";
import { useInteractor } from "@frontend/plugins/interactor";
import { fieldState } from "@frontend/utilities/forms";
import { useField, useForm } from "vee-validate";

const { notify } = useInteractor();
const { login } = useLogin();

const { handleSubmit } = useForm<AccountDto>({ validationSchema: AccountDto });

const onSubmit = handleSubmit(async (dto) => {
  const error = await login(dto);

  if (error) {
    notify(error);
  }
});

const username = useField<string>("username");
const password = useField<string>("password");
</script>

<template>
  <div class="container">
    <view-title title="Login" />

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
