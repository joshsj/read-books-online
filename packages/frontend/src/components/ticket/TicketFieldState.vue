<script setup lang="ts">
defineProps({
  title: { type: String, required: true },
  variant: { type: String, required: true },
});
</script>

<template>
  <article :class="`message is-${variant}`">
    <div class="message-header">
      <p>{{ title }}</p>
    </div>

    <div class="message-body">
      <slot />
    </div>
  </article>
</template>
