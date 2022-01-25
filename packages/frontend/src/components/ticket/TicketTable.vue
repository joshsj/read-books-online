<script setup lang="ts">
import { TicketDto, TicketState } from "@client/models";
import { formatDate } from "@core/utilities/date";
import { truncate } from "@core/utilities/string";
import Username from "@frontend/components/general/Username.vue";
import { useBusiness } from "@frontend/plugins/business";
import { route } from "@frontend/router";
import { approvalState } from "@frontend/utilities/ticket";
import { PropType } from "vue";

defineProps({
  tickets: {
    type: Object as PropType<TicketDto[]>,
    required: true,
  },
});

const emit = defineEmits(["needTickets"]);

const { ticketBusiness } = useBusiness();

const approvalStateClass = (state: TicketState) =>
  "tag is-light is-medium is-" + approvalState.variant(state);
</script>

<template>
  <o-table :data="tickets">
    <o-table-column label="Information" width="50%">
      <template v-slot="{ row: { information } }">
        <span>
          {{ truncate(information, 150) }}
        </span>
      </template>
    </o-table-column>

    <o-table-column label="Created">
      <template v-slot="{ row: { created } }">
        <span>
          <username :username="created.by.username" />
          <br />
          {{ formatDate(created.at, "date") }}
        </span>
      </template>
    </o-table-column>

    <o-table-column label="Allocated">
      <template v-slot="{ row: { states, allocated } }">
        <span v-if="states.includes('allocated')">
          <username :username="allocated.to.username" />
          <br />
          {{ formatDate(allocated.at, "date") }}
        </span>
      </template>
    </o-table-column>

    <o-table-column label="Approval">
      <template v-slot="{ row: { states, approved } }">
        <span v-if="states.includes('allocated')">
          <span :class="approvalStateClass(states.at(-1)!)">
            {{ approvalState.displayText(states.at(-1)!) }}
          </span>
          <br />
          {{ approved ? formatDate(approved.at, "date") + " " : "" }}
        </span>
      </template>
    </o-table-column>

    <o-table-column label="Actions" position="centered">
      <template v-slot="{ index, row: ticket }">
        <o-dropdown
          :position="`${index >= tickets.length / 2 ? 'top' : 'bottom'}-left`">
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
                .allocate(ticket)
                .then((x) => x && emit('needTickets'))
            ">
            Allocate
          </o-dropdown-item>

          <o-dropdown-item
            v-if="ticketBusiness.canApprove(ticket)"
            @click="
              ticketBusiness
                .approve(ticket)
                .then((x) => x && emit('needTickets'))
            ">
            Approve
          </o-dropdown-item>

          <o-dropdown-item
            v-if="ticketBusiness.canCancel(ticket)"
            @click="
              ticketBusiness
                .cancel(ticket)
                .then((x) => x && emit('needTickets'))
            ">
            Cancel
          </o-dropdown-item>
        </o-dropdown>
      </template>
    </o-table-column>

    <template #empty>
      <div class="notification is-info is-light" v-if="!tickets.length">
        No tickets found
      </div>
    </template>
  </o-table>
</template>
