<script setup lang="ts">
import { ref } from "vue";
import { route } from "@/router";
import { store } from "@/store";

document.getElementsByTagName("html")[0]!.classList.add("has-navbar-fixed-top");

const activeClass = ref<string | undefined>(undefined);
const toggleNavbar = () =>
  (activeClass.value = activeClass.value ? undefined : "is-active");
</script>

<template>
  <header>
    <nav
      class="navbar is-transparent has-shadow is-spaced is-fixed-top has-background-warning"
      role="navigation"
      aria-label="main navigation">
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
          @click="toggleNavbar">
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
        </a>
      </div>

      <div class="navbar-menu has-background-warning" :class="activeClass">
        <div class="navbar-end has-text-weight-semibold">
          <router-link :to="route({ name: 'home' })" class="navbar-item">
            Home
          </router-link>

          <router-link :to="route({ name: 'login' })" class="navbar-item">
            Login
          </router-link>
        </div>
      </div>
    </nav>
  </header>

  <main>
    <router-view />
  </main>

  <o-loading :full-page="true" :active="store.pageLoading" />
</template>

<style scoped lang="scss">
@use "sass:map";
@import "bulma/bulma.sass";

header {
  margin-bottom: map.get($spacing-values, "6");

  @include touch {
    margin-bottom: map.get($spacing-values, "4");
  }
}

nav {
  border-bottom: 3px solid $text;
}

main {
  --content-padding: #{$size-6};

  padding-left: var(--content-padding);
  padding-right: var(--content-padding);

  @include tablet {
    --content-padding: #{$size-6 * 4};
  }

  @include desktop {
    --content-padding: #{$size-6 * 8};
  }
}
</style>
