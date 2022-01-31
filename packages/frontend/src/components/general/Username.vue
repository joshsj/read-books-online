<script setup lang="ts">
import { useBusiness } from "@frontend/plugins/business";
import { route } from "@frontend/router";

defineProps({ username: { type: String, required: true } });

const { userBusiness } = useBusiness();
</script>

<template>
  <router-link
    v-if="userBusiness.canView(username)"
    :to="route({ name: 'user', username: username })">
    @{{ username }}
  </router-link>

  <template v-else>@{{ username }}</template>
</template>
