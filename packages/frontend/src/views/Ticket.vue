<script setup lang="ts">
import { isRBOError } from "@client/index";
import { TicketDto } from "@client/models";
import { formatDate } from "@core/utilities/date";
import { client } from "@frontend/client";
import Username from "@frontend/components/general/Username.vue";
import ViewTitle from "@frontend/components/general/ViewTitle.vue";
import TicketState from "@frontend/components/ticket/TicketFieldState.vue";
import { useBusiness } from "@frontend/plugins/business";
import { useInteractor } from "@frontend/plugins/interactor";
import { route } from "@frontend/router";
import { store } from "@frontend/store";
import {
  approvalState,
  PendingVariant,
  prettyTicketState,
} from "@frontend/utilities/ticket";
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
            .cancel(ticket!)
            .then((x) => {x && router.push(route({ name: 'tickets' }))})
        " />
    </view-title>

    <div class="columns is-6">
      <div class="column content">
        <strong>Status</strong>
        <p>{{ prettyTicketState(ticket.states.at(-1)!) }}</p>

        <strong>Information</strong>
        <p>{{ ticket.information }}</p>
      </div>

      <div class="column is-4 is-offset-2">
        <div class="tile is-ancestor">
          <div class="tile is-parent is-vertical">
            <ticket-state
              title="Created"
              class="tile is-child"
              variant="success">
              <p>
                By <username :username="ticket.created.by.username" /> at
                {{ formatDate(ticket.created.at) }}
              </p>
            </ticket-state>

            <ticket-state
              title="Allocated"
              class="tile is-child"
              :variant="
                ticket.states.includes('allocated') ? 'success' : PendingVariant
              ">
              <p>
                <template v-if="ticket.states.includes('allocated')">
                  To <username :username="ticket.allocated!.to.username" /> at
                  {{ formatDate(ticket.allocated!.at) }}
                </template>

                <template v-else>
                  Pending
                  <template v-if="ticketBusiness.canAllocate(ticket)">
                    (<a
                      @click="
                    ticketBusiness
                      .allocate(ticket!)
                      .then((x) => {x && getTicket()})"
                      >Allocate</a
                    >)
                  </template>
                </template>
              </p>
            </ticket-state>

            <ticket-state
              title="Approval"
              class="tile is-child"
              v-if="ticket.states.includes('allocated')"
              :variant="approvalState.variant(ticket.states.at(-1)!)">
              <p>
                {{ approvalState.displayText(ticket.states.at(-1)!)  }}

                <template v-if="ticketBusiness.canApprove(ticket)">
                  (<a
                    @click="
                      ticketBusiness.approve(ticket!).then((x) => {
                        x && getTicket();
                      })
                    "
                    >Approve</a
                  >)
                </template>

                <template v-else-if="ticketBusiness.canProvideNewInfo(ticket)">
                  (<a>Provide</a>)
                </template>
              </p>
            </ticket-state>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
