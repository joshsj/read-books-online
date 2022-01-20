<script setup lang="ts">
import { client } from "@frontend/client";
import RboFormModal from "@frontend/components/general/FormModal.vue";
import RboTicketForm, {
  Exposed,
} from "@frontend/components/ticket/TicketForm.vue";
import { useErrors } from "@frontend/plugins/errors";
import { useNotifier } from "@frontend/plugins/notifier";
import { delayedRef, ModifyMode } from "@frontend/utilities/component";
import { reactive, ref, shallowRef } from "vue";

const { notify } = useNotifier();
const { handleError } = useErrors();

const mode = ref<ModifyMode>("create");
const modal = reactive({ showing: false, loading: false });
const exposed = shallowRef<Exposed | undefined>(undefined);
const getRef = delayedRef(exposed);

const save = async () => {
  if (!exposed.value) {
    return;
  }
  const { form } = exposed.value;
  const response = await client.ticket.create(form.values);

  if (response) {
    handleError(response);
    return;
  }

  modal.showing = false;
  form.resetForm();
  notify("Ticket created", "success", "short");
};
</script>

<template>
  <div class="container">
    <h1 class="title">Tickets</h1>

    <o-button @click="modal.showing = true">Create</o-button>

    <rbo-form-modal
      entity="Ticket"
      v-model:active="modal.showing"
      :mode="mode"
      :valid="exposed?.form?.meta?.value?.valid ?? true"
      :loading="modal.loading"
      @main="save">
      <rbo-ticket-form :mode="mode" @vnode-mounted="getRef" />
    </rbo-form-modal>
  </div>
</template>
