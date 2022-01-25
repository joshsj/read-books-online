<script setup lang="ts">
import { TicketDto } from "@client/models";
import { route } from "@frontend/router";
defineProps({
  ticket: { type: Object as PropType<TicketDto>, required: true },
});
</script>

<template>
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
        ticketBusiness.allocate(ticket).then((x) => x && emit('needTickets'))
      ">
      Allocate
    </o-dropdown-item>

    <o-dropdown-item
      v-if="ticketBusiness.canReview(ticket)"
      @click="
        ticketBusiness.review(ticket).then((x) => x && emit('needTickets'))
      ">
      Review
    </o-dropdown-item>

    <o-dropdown-item
      v-if="ticketBusiness.canComplete(ticket)"
      @click="emit('complete', ticket)">
      Complete
    </o-dropdown-item>

    <o-dropdown-item
      v-if="ticketBusiness.canCancel(ticket)"
      @click="
        ticketBusiness.cancel(ticket).then((x) => x && emit('needTickets'))
      ">
      Cancel
    </o-dropdown-item>
  </o-dropdown>
</template>
