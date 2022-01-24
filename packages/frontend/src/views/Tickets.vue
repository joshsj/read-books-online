<script setup lang="ts">
import { TicketDto, Id } from "@client/models";
import { formatDate } from "@core/utilities/date";
import { truncate } from "@core/utilities/string";
import { client, isRBOError } from "@frontend/client";
import { route } from "@frontend/router";
import RboFormModal from "@frontend/components/general/FormModal.vue";
import Username from "@frontend/components/general/Username.vue";
import ViewTitle from "@frontend/components/general/ViewTitle.vue";
import RboTicketForm, {
  Exposed,
} from "@frontend/components/ticket/TicketForm.vue";
import { useInteractor } from "@frontend/plugins/interactor";
import { delayedRef } from "@frontend/utilities/component";
import { onMounted, reactive, ref, shallowRef } from "vue";
import { store } from "@frontend/store";
import { useBusiness } from "@frontend/plugins/business";
import { ModifyMode } from "@frontend/utilities/types";

const { notify } = useInteractor();
const { ticketBusiness } = useBusiness();

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
      filter: {
        created: {
          by: store.user!.roles.every((r) => r === "client")
            ? [store.user!._id]
            : [],
        },
      },
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
    <view-title title="Tickets">
      <o-button variant="primary" @click="modal.showing = true">
        Create
      </o-button>
    </view-title>

    <o-table :data="tickets">
      <o-table-column label="Information">
        <template v-slot="{ row: { information } }">
          <span>{{ truncate(information, 250) }}</span>
        </template>
      </o-table-column>

      <o-table-column label="Created">
        <template v-slot="{ row: { created } }">
          <span>
            {{ formatDate(created.at, "date") }}
            <username :username="created.by.username" />
          </span>
        </template>
      </o-table-column>

      <o-table-column label="Allocated">
        <template v-slot="{ row: { allocated } }">
          <span v-if="allocated">
            {{ formatDate(allocated.at, "date") }}
            <username :username="allocated.by.username" />
          </span>
        </template>
      </o-table-column>

      <o-table-column label="Actions" position="centered">
        <template v-slot="{ index, row: ticket }">
          <o-dropdown
            :position="`${
              index >= tickets.length / 2 ? 'top' : 'bottom'
            }-left`">
            <template #trigger>
              <o-button variant="info" outlined icon-right="chevron-down" />
            </template>

            <router-link
              :to="route({ name: 'ticket', ticketId: ticket._id })"
              custom
              v-slot="{ navigate }">
              <o-dropdown-item tag="a" @click="navigate">View</o-dropdown-item>
            </router-link>

            <o-dropdown-item
              v-if="ticketBusiness.canAllocate(ticket)"
              @click="
                ticketBusiness
                  .allocate(ticket._id)
                  .then((x) => x && getTickets())
              ">
              Allocate
            </o-dropdown-item>

            <o-dropdown-item
              v-if="ticketBusiness.canCancel(ticket)"
              @click="
                ticketBusiness.cancel(ticket._id).then((x) => x && getTickets())
              ">
              Cancel
            </o-dropdown-item>
          </o-dropdown>
        </template>
      </o-table-column>
    </o-table>

    <rbo-form-modal
      id="modify-ticket-modal"
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

<style>
#modify-ticket-modal textarea {
  height: 5rem;
}
</style>
