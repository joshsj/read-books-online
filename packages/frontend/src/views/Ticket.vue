<script setup lang="ts">
import { isRBOError } from "@client/index";
import { TicketDto } from "@client/models";
import { formatDate } from "@core/utilities/date";
import { client } from "@frontend/client";
import { useInteractor } from "@frontend/plugins/interactor";
import { route } from "@frontend/router";
import { store } from "@frontend/store";
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import Username from "@frontend/components/general/Username.vue";
import TicketState from "@frontend/components/ticket/TicketFieldState.vue";
import { useBusiness } from "@frontend/plugins/business";

const { ticketBusiness } = useBusiness();
const { notify } = useInteractor();
const router = useRouter();
const props = defineProps({ ticketId: { type: String, required: true } });

const ticket = ref<TicketDto | undefined>();

const getTicket = async () => {
  const response = await store.pageLoad(client.ticket.get(props.ticketId));

  if (isRBOError(response)) {
    notify(response);
    router.push(route({ name: "tickets" }));
    return;
  }

  ticket.value = response;
};

onMounted(getTicket);
</script>

<template>
  <div v-if="ticket" class="container">
    <div class="columns is-6">
      <div class="column">
        <div class="content">
          <h1 class="title">Ticket</h1>

          <strong>Information</strong>
          <p>{{ ticket.information }}</p>
        </div>
      </div>

      <div class="column is-4 is-offset-2">
        <div class="tile is-ancestor">
          <div class="tile is-parent is-vertical">
            <ticket-state title="Created" class="tile is-child" state="passed">
              <p>
                By <username :username="ticket.created.by.username" /> at
                {{ formatDate(ticket.created.at, "date") }}
              </p>
            </ticket-state>

            <ticket-state
              title="Allocated"
              class="tile is-child"
              :state="ticket.allocated ? 'passed' : 'pending'">
              <p v-if="ticket.allocated">
                To <username :username="ticket.allocated.by.username" /> at
                {{ formatDate(ticket.created.at, "date") }}
              </p>

              <p v-else-if="ticketBusiness.canAllocate(ticket)">
                Pending (<a
                  @click="
                    ticketBusiness
                      .allocate(ticket._id)
                      .then((x) => x && getTicket())
                  "
                  >Allocate</a
                >)
              </p>
            </ticket-state>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
