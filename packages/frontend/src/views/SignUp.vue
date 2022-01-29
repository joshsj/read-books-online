<script setup lang="ts">
import { CreateUserRequest } from "@client/models";
import ViewTitle from "@frontend/components/general/ViewTitle.vue";
import { useInteractor } from "@frontend/plugins/interactor";
import { useLogin } from "@frontend/plugins/login";
import { route } from "@frontend/router";
import { fieldState } from "@frontend/utilities/forms";
import { useField, useForm } from "vee-validate";
import { RouterLink } from "vue-router";

const { notify } = useInteractor();
const { signUp } = useLogin();

const { handleSubmit } = useForm<CreateUserRequest>({
  validationSchema: CreateUserRequest,
  initialValues: {
    requestName: "createUserRequest",
  },
});

const onSubmit = handleSubmit(async (dto) => {
  const error = await signUp(dto);

  error && notify(error);
});

const username = useField<string>("username");
const password = useField<string>("password");
const email = useField<string>("email");
</script>

<template>
  <div class="container">
    <view-title title="Sign Up">
      <span class="is-size-5">
        (or <router-link :to="route({ name: 'login' })">Login</router-link>)
      </span>
    </view-title>

    <form @submit.prevent="onSubmit">
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

      <o-field label="Email" label-for="Email" v-bind="fieldState(email)">
        <o-input
          id="Email"
          name="Email"
          placeholder="Email"
          v-model="email.value" />
      </o-field>

      <o-field>
        <o-button native-type="submit" variant="primary" label="Sign Up" />
      </o-field>
    </form>
  </div>
</template>
