<script setup lang="ts">
const onClick = () => alert("Hello, world!");
</script>

<template>
  <div class="container">
    <o-button @click="onClick">Click me!</o-button>
  </div>
</template>
