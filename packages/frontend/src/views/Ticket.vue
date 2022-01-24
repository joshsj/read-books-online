<script setup lang="ts">
import { isRBOError } from "@client/index";
import { TicketDto } from "@client/models";
import { formatDate } from "@core/utilities/date";
import { capitalize } from "@core/utilities/string";
import { client } from "@frontend/client";
import Username from "@frontend/components/general/Username.vue";
import ViewTitle from "@frontend/components/general/ViewTitle.vue";
import TicketState from "@frontend/components/ticket/TicketFieldState.vue";
import { useBusiness } from "@frontend/plugins/business";
import { useInteractor } from "@frontend/plugins/interactor";
import { route } from "@frontend/router";
import { store } from "@frontend/store";
import { reviewStateVariant } from "@frontend/utilities/ticket";
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";

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
    <view-title title="Ticket">
      <o-button
        v-if="ticketBusiness.canCancel(ticket)"
        variant="danger"
        label="Cancel"
        @click="
          ticketBusiness
            .cancel(ticket)
            .then((x) => x && router.push(route({ name: 'tickets' })))
        " />
    </view-title>

    <div class="columns is-6">
      <div class="column">
        <strong>Information</strong>
        <p>{{ ticket.information }}</p>
      </div>

      <div class="column is-4 is-offset-2">
        <div class="tile is-ancestor">
          <div class="tile is-parent is-vertical">
            <ticket-state title="Created" class="tile is-child" state="success">
              <p>
                By <username :username="ticket.created.by.username" /> at
                {{ formatDate(ticket.created.at, "date") }}
              </p>
            </ticket-state>

            <ticket-state
              title="Allocated"
              class="tile is-child"
              :state="ticket.allocated ? 'success' : 'info'">
              <p v-if="ticket.allocated">
                To <username :username="ticket.allocated.by.username" /> at
                {{ formatDate(ticket.created.at, "date") }}
              </p>

              <p v-else-if="ticketBusiness.canAllocate(ticket)">
                Pending (<a
                  @click="
                    ticketBusiness
                      .allocate(ticket)
                      .then((x) => x && getTicket())
                  "
                  >Allocate</a
                >)
              </p>
            </ticket-state>

            <ticket-state
              title="Review"
              class="tile is-child"
              :state="reviewStateVariant(ticket.reviewState)"
              v-if="!!ticket.allocated">
              <p v-if="ticket.reviewState && ticket.reviewed">
                {{ capitalize(ticket.reviewState) }} at
                {{ formatDate(ticket.created.at, "date") }}
              </p>
              <p v-else-if="ticketBusiness.canReview(ticket)">
                Pending (<a
                  @click="
                    ticketBusiness.review(ticket).then((x) => x && getTicket())
                  "
                  >Review</a
                >)
              </p>
            </ticket-state>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
