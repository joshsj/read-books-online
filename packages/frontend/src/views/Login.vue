<script setup lang="ts">
import { AccountDto } from "@client/models";
import ViewTitle from "@frontend/components/general/ViewTitle.vue";
import { useLogin } from "@frontend/plugins/login";
import { useInteractor } from "@frontend/plugins/interactor";
import { fieldState } from "@frontend/utilities/forms";
import { useField, useForm } from "vee-validate";
import { reactive } from "vue";
import { fakeLoad } from "@frontend/utilities/component";

const { notify } = useInteractor();
const { login, signUp } = useLogin();

const { handleSubmit } = useForm<AccountDto>({ validationSchema: AccountDto });

const titles = reactive(["Login", "Sign Up"]);
const swap = () => fakeLoad().then(() => titles.reverse());

const onSubmit = handleSubmit(async (dto) => {
  const error = await (titles[0]! === "Sign Up" ? signUp : login)(dto);

  error && notify(error);
});

const username = useField<string>("username");
const password = useField<string>("password");
</script>

<template>
  <div class="container">
    <view-title :title="titles[0]!">
      <span class="is-size-5">
        (or <a @click="swap">{{ titles[1] }}</a
        >)
      </span>
    </view-title>

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
        <o-button native-type="submit" variant="primary">
          {{ titles[0] }}
        </o-button>
      </o-field>
    </form>
  </div>
</template>
