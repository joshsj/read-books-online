<script setup lang="ts">
defineProps({
  title: { type: String, required: true },
});
</script>

<template>
  <div
    class="is-flex is-justify-content-space-between is-align-items-flex-start mb-5">
    <h1 class="title mb-0">{{ title }}</h1>
    <div><slot /></div>
  </div>
</template>
