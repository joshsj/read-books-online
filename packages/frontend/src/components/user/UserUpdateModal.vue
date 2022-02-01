<script setup lang="ts">
import { Roles, UpdateUserRequest } from "@client/models";
import { capitalize } from "@core/utilities/string";
import FormModal from "@frontend/components/general/FormModal.vue";
import { useBusiness } from "@frontend/plugins/business";
import { fieldState } from "@frontend/utilities/forms";
import { useField, useForm } from "vee-validate";

const emit = defineEmits(["main"]);

const { userBusiness } = useBusiness();

const form = useForm<UpdateUserRequest>({
  validationSchema: UpdateUserRequest,
});
const email = useField<string>("email");
const roles = useField<string>("roles");

const onSubmit = form.handleSubmit(() => {
  emit("main");
  form.resetForm();
});

defineExpose({ form });
</script>

<template>
  <form-modal
    entity="User"
    mode="update"
    :valid="form.meta.value.valid ?? true"
    @main="onSubmit">
    <form @submit="onSubmit">
      <o-field label="Email" label-for="Email" v-bind="fieldState(email)">
        <o-input
          id="Email"
          name="Email"
          placeholder="Email"
          type="Email"
          v-model="email.value" />
      </o-field>

      <o-field
        v-if="userBusiness.canUpdateRoles()"
        label="Roles"
        v-bind="fieldState(roles)">
        <o-checkbox
          v-for="role in Roles"
          v-model="roles.value"
          :native-value="role"
          :disabled="role === 'authorizer'">
          {{ capitalize(role) }}
        </o-checkbox>
      </o-field>
    </form>
  </form-modal>
</template>
