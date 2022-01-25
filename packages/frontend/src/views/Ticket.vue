<script setup lang="ts">
import { isRBOError } from "@client/index";
import { TicketDto } from "@client/models";
import { formatDate } from "@core/utilities/date";
import { client } from "@frontend/client";
import Username from "@frontend/components/general/Username.vue";
import ViewTitle from "@frontend/components/general/ViewTitle.vue";
import TicketField from "@frontend/components/ticket/TicketField.vue";
import { useBusiness } from "@frontend/plugins/business";
import { useInteractor } from "@frontend/plugins/interactor";
import { route } from "@frontend/router";
import { store } from "@frontend/store";
import {
  ticketProgressState,
  PendingVariant,
  prettyTicketState,
  TicketInformationModel,
} from "@frontend/utilities/ticket";
import { FormContext } from "vee-validate";
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import TicketInformationModal from "@frontend/components/ticket/TicketInformationModal.vue";

const props = defineProps({ ticketId: { type: String, required: true } });

const router = useRouter();
const { ticketBusiness } = useBusiness();
const { notify } = useInteractor();

const modal = ref<{ form: FormContext<TicketInformationModel> } | undefined>();
const modalActive = ref(false);

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

const onCompleteClick = ({ _id, information }: TicketDto) => {
  if (!modal.value) {
    return;
  }

  modal.value.form.values.ticketId = _id;
  modal.value.form.values.information = information;
  modalActive.value = true;
};

const onCompleted = async () => {
  if (!modal.value) {
    return;
  }

  const { ticketId, information } = modal.value.form.values;

  const result = await ticketBusiness.complete({
    requestName: "completeTicketRequest",
    ticketId,
    information,
  });

  result && getTicket();
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
            <ticket-field
              title="Creation"
              class="tile is-child"
              variant="success">
              <p>
                By <username :username="ticket.created.by.username" /> at
                {{ formatDate(ticket.created.at) }}
              </p>
            </ticket-field>

            <ticket-field
              title="Allocation"
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
            </ticket-field>

            <ticket-field
              title="Review"
              class="tile is-child"
              v-if="ticket.states.includes('allocated')"
              :variant="ticketProgressState.variant(ticket.reviewed?.state)">
              <p>
                {{ ticketProgressState.displayText(ticket.reviewed?.state) }}

                <template v-if="ticketBusiness.canReview(ticket)">
                  (<a
                    @click="
                      ticketBusiness.review(ticket!).then((x) => {
                        x && getTicket();
                      })
                    "
                    >Review</a
                  >)
                </template>

                <template v-else-if="ticketBusiness.canComplete(ticket)">
                  (<a @click="onCompleteClick(ticket!)">Complete</a>)
                </template>
              </p>
            </ticket-field>

            <ticket-field
              title="Purchase"
              class="tile is-child"
              v-if="ticket.states.includes('complete')"
              :variant="ticketProgressState.variant(ticket.authorized?.state)">
              <p>
                {{ ticketProgressState.displayText(ticket.authorized?.state) }}
              </p>
            </ticket-field>
          </div>
        </div>
      </div>
    </div>

    <ticket-information-modal
      ref="modal"
      mode="Update"
      v-model:active="modalActive"
      @main="onCompleted" />
  </div>
</template>
