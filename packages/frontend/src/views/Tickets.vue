<script setup lang="ts">
import { TicketDto } from "@client/models";
import { formatDate } from "@core/utilities/date";
import { truncate } from "@core/utilities/string";
import { client, isRBOError } from "@frontend/client";
import { route } from "@frontend/router";
import RboFormModal from "@frontend/components/general/FormModal.vue";
import Username from "@frontend/components/general/Username.vue";
import RboTicketForm, {
  Exposed,
} from "@frontend/components/ticket/TicketForm.vue";
import { useNotifier } from "@frontend/plugins/notifier";
import { delayedRef, ModifyMode } from "@frontend/utilities/component";
import { onMounted, reactive, ref, shallowRef } from "vue";
import { store } from "@frontend/store";

const { notify } = useNotifier();

const modal = reactive({
  mode: "create" as ModifyMode,
  showing: false,
  loading: false,
});
const ticketForm = shallowRef<Exposed | undefined>(undefined);
const getFormRef = delayedRef(ticketForm);
const tickets = ref<TicketDto[]>([]);

const createTicket = async () => {
  if (!ticketForm.value) {
    return;
  }
  const { form } = ticketForm.value;
  const response = await client.ticket.create(form.values);

  if (response) {
    notify(response);
    return;
  }

  modal.showing = false;
  form.resetForm();
  notify({ message: "Ticket created", variant: "success", duration: "short" });
  getTickets();
};

const getTickets = async () => {
  const response = await store.pageLoad(
    client.ticket.get({
      filter: { createdAt: {}, createdBy: [] },
    })
  );

  if (isRBOError(response)) {
    notify(response);
    return;
  }

  tickets.value = response;
};

onMounted(getTickets);
</script>

<template>
  <div class="container">
    <h1 class="title">Tickets</h1>

    <o-table :data="tickets" sticky-header>
      <o-table-column label="Information">
        <template v-slot="{ row: { information } }">
          <span>{{ truncate(information, 250) }}</span>
        </template>
      </o-table-column>

      <o-table-column label="Created">
        <template v-slot="{ row: { createdAt, createdBy } }">
          <span>
            {{ formatDate(createdAt, "date") }}
            <username :username="createdBy.username" />
          </span>
        </template>
      </o-table-column>

      <o-table-column label="Actions">
        <template v-slot="{ index, row: { _id } }">
          <o-dropdown
            :position="`${index > tickets.length / 2 ? 'top' : 'bottom'}-left`">
            <template #trigger>
              <o-button outline>
                <span>!</span>
              </o-button>
            </template>

            <router-link
              :to="route({ name: 'ticket', ticketId: _id })"
              custom
              v-slot="{ navigate }">
              <o-dropdown-item @click="navigate"> View </o-dropdown-item>
            </router-link>
          </o-dropdown>
        </template>
      </o-table-column>
    </o-table>

    <o-button @click="modal.showing = true">Create</o-button>

    <rbo-form-modal
      entity="Ticket"
      v-model:active="modal.showing"
      :mode="modal.mode"
      :valid="ticketForm?.form?.meta?.value?.valid ?? true"
      :loading="modal.loading"
      @main="createTicket">
      <rbo-ticket-form @vnode-mounted="getFormRef" />
    </rbo-form-modal>
  </div>
</template>
