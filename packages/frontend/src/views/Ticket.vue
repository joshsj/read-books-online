<script setup lang="ts">
import { isRBOError } from "@client/index";
import { TicketDto } from "@client/models";
import { formatDate } from "@core/utilities/date";
import { capitalize } from "@core/utilities/string";
import { client } from "@frontend/client";
import Username from "@frontend/components/general/Username.vue";
import ViewTitle from "@frontend/components/general/ViewTitle.vue";
import TicketField from "@frontend/components/ticket/TicketField.vue";
import TicketInformationModal from "@frontend/components/ticket/TicketInformationModal.vue";
import TicketPriceModal from "@frontend/components/ticket/TicketPriceModal.vue";
import StateTag from "@frontend/components/ticket/TicketStateTag.vue";
import { useBusiness } from "@frontend/plugins/business";
import { useInteractor } from "@frontend/plugins/interactor";
import { route } from "@frontend/router";
import { store } from "@frontend/store";
import { PendingVariant } from "@frontend/utilities/constants";
import {
  TicketInformationModel,
  TicketPriceModel,
} from "@frontend/utilities/forms";
import { stateVariant } from "@frontend/utilities/ticket";
import { ModifyMode } from "@frontend/utilities/types";
import { FormContext } from "vee-validate";
import { onMounted, reactive, ref } from "vue";
import { useRouter } from "vue-router";

const props = defineProps({ ticketId: { type: String, required: true } });

const router = useRouter();
const { ticketBusiness } = useBusiness();
const { notify } = useInteractor();

const completeModalRef = ref<
  { form: FormContext<TicketInformationModel> } | undefined
>();
const completeModal = reactive({
  active: false,
  mode: "create" as ModifyMode,

  onMain: async () => {
    if (!completeModalRef.value) {
      return;
    }

    const { ticketId, information } = completeModalRef.value.form.values;

    const result = await ticketBusiness.complete({
      requestName: "completeTicketRequest",
      ticketId,
      information,
    });

    result && getTicket();
  },
});

const priceModalRef = ref<
  { form: FormContext<TicketPriceModel> } | undefined
>();
const priceModal = reactive({
  active: false,

  onMain: async () => {
    if (!priceModalRef.value) {
      return;
    }

    const { ticketId, price } = priceModalRef.value.form.values;

    const result = await ticketBusiness.submitPrice({
      requestName: "submitTicketPriceRequest",
      ticketId,
      price,
    });

    result && getTicket();
  },
});

const ticket = ref<TicketDto | undefined>();

const getTicket = async () => {
  const response = await store.page.load(client.ticket.get(props.ticketId));

  if (isRBOError(response)) {
    notify(response);
    router.push(route({ name: "tickets" }));
    return;
  }

  ticket.value = store.chat.activeTicket = response;
};

const onCompleteClick = () => {
  if (completeModalRef.value && ticket.value) {
    completeModalRef.value.form.values.ticketId = ticket.value._id;
    completeModalRef.value.form.values.information = ticket.value.information;
    completeModal.active = true;
  }
};

const onSubmitPriceClick = () => {
  if (priceModalRef.value && ticket.value) {
    priceModalRef.value.form.values.ticketId = ticket.value._id;
    priceModal.active = true;
  }
};

onMounted(getTicket);
</script>

<template>
  <div v-if="ticket" class="container">
    <view-title title="Ticket">
      <div class="buttons">
        <o-button
          label="Chat"
          variant="light"
          @click="store.chat.active = true" />

        <o-button
          v-if="ticketBusiness.canCancel(ticket)"
          variant="danger"
          label="Cancel"
          @click="
          ticketBusiness
            .cancel(ticket!)
            .then((x) => {x && router.push(route({ name: 'tickets' }))})
        " />
      </div>
    </view-title>

    <div class="columns is-6">
      <div class="column content">
        <strong>Format</strong>
        <p>{{ capitalize(ticket.format) }}</p>

        <strong>Status</strong>
        <p><state-tag :state="ticket.states.at(-1)!" /></p>

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
              :variant="ticket.allocated ? 'success' : PendingVariant">
              <template v-if="ticket.allocated">
                To <username :username="ticket.allocated.to.username" /> at
                {{ formatDate(ticket.allocated.at) }}
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
            </ticket-field>

            <ticket-field
              title="Review"
              class="tile is-child"
              v-if="ticket.allocated"
              :variant="stateVariant(ticket.reviewed?.state)">
              {{ ticket.reviewed ? ticket.reviewed.state : "Pending" }}

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
                (<a @click="onCompleteClick">Complete</a>)
              </template>
            </ticket-field>

            <ticket-field
              title="Price"
              class="tile is-child"
              :variant="stateVariant(ticket.reviewed?.state)"
              v-if="ticket.reviewed?.state === 'Information Complete'">
              <template v-if="ticket.priced">
                {{ ticket.priced?.value.toFixed(2) ?? "Pending" }}
              </template>

              <template v-else>
                Pending

                <template v-if="ticketBusiness.canSubmitPrice(ticket)">
                  (<a @click="onSubmitPriceClick()">Submit Price</a>)
                </template>
              </template>
            </ticket-field>

            <ticket-field
              title="Purchase"
              class="tile is-child"
              v-if="ticket.priced"
              :variant="stateVariant(ticket.reviewed?.state)">
              <template v-if="ticket.authorized">
                {{ ticket.authorized.state }}
              </template>

              <template v-else>
                Pending

                <template v-if="ticketBusiness.canAuthorize(ticket)">
                  (<a
                    @click="
                      ticketBusiness.authorize(ticket!).then((x) => {
                        x && getTicket();
                      })
                    "
                    >Authorize</a
                  >)
                </template>
              </template>
            </ticket-field>
          </div>
        </div>
      </div>
    </div>

    <ticket-information-modal
      ref="completeModalRef"
      mode="Update"
      v-model:active="completeModal.active"
      @main="completeModal.onMain" />

    <ticket-price-modal
      ref="priceModalRef"
      v-model:active="priceModal.active"
      @main="priceModal.onMain" />
  </div>
</template>
