<script setup lang="ts">
import { CreateTicketRequest } from "@client/models";
import RboFormModal from "@frontend/components/general/FormModal.vue";
import RboTicketForm from "@frontend/components/ticket/TicketForm.vue";
import { ModifyMode } from "@frontend/utilities/component";
import { client } from "@frontend/client";
import { FormContext } from "vee-validate";
import { reactive, ref, shallowRef } from "vue";
import { useErrorHandler } from "@frontend/plugins/errorHandler";

const { handleError } = useErrorHandler();

const mode = ref<ModifyMode>("create");
const modal = reactive({ showing: false, loading: false });

const form = shallowRef<FormContext<CreateTicketRequest> | undefined>();
const onProvideForm = (f: FormContext<CreateTicketRequest>) => (form.value = f);

const save = async () => {
  if (!form.value) {
    return;
  }

  const error = await client.ticket.create(form.value.values);

  if (!error) {
    modal.showing = false;
    form.value.resetForm();
    return;
  }

  handleError(error);
};
</script>

<template>
  <div class="container">
    <h1 class="title">Tickets</h1>

    <o-button @click="modal.showing = true">Create</o-button>

    <rbo-form-modal
      v-model:active="modal.showing"
      entity="Ticket"
      :mode="mode"
      :valid="form?.meta?.value?.valid ?? true"
      :loading="modal.loading"
      @main="save">
      <rbo-ticket-form :mode="mode" @provide-form="onProvideForm" />
    </rbo-form-modal>
  </div>
</template>
