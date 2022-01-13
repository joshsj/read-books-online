<script setup lang="ts">
import { ref } from "vue";

document.getElementsByTagName("html")[0]!.classList.add("has-navbar-fixed-top");

const activeClass = ref<string | undefined>(undefined);
const toggleNavbar = () =>
  (activeClass.value = activeClass.value ? undefined : "is-active");
</script>

<template>
  <header>
    <nav
      class="navbar is-transparent has-shadow is-spaced is-fixed-top"
      role="navigation"
      aria-label="main navigation"
    >
      <div class="navbar-brand">
        <router-link to="/" class="navbar-item">
          <h1 class="title mb-0">ReadBooksOnline</h1>
        </router-link>

        <a
          role="button"
          class="navbar-burger"
          :class="activeClass"
          aria-label="menu"
          aria-expanded="false"
          @click="toggleNavbar"
        >
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
        </a>
      </div>

      <div class="navbar-menu" :class="activeClass">
        <div class="navbar-end has-text-weight-semibold">
          <router-link to="/" class="navbar-item">Home</router-link>

          <router-link to="/" class="navbar-item">Login</router-link>
        </div>
      </div>
    </nav>
  </header>

  <main>
    <div class="container">
      <router-view />
    </div>
  </main>
</template>

<style scoped lang="scss">
@use "sass:map";

@import "bulma/bulma.sass";

header {
  border-bottom: 2px solid $light;
  margin-bottom: map.get($spacing-values, "6");
}

@include touch {
  header {
    margin-bottom: map.get($spacing-values, "3");
  }
}
</style>
