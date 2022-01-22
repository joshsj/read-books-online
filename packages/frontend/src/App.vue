<script setup lang="ts">
document.getElementsByTagName("html")[0]!.classList.add("has-navbar-fixed-top");

import { ref } from "vue";
import { route } from "@frontend/router";
import { store } from "@frontend/store";
import { useLogin } from "@frontend/plugins/login";

const { logout, isLoggedIn } = useLogin();

const activeClass = ref<string | undefined>(undefined);
const toggleNavbar = () =>
  (activeClass.value = activeClass.value ? undefined : "is-active");
</script>

<template>
  <header>
    <nav
      class="navbar is-transparent has-shadow is-spaced is-fixed-top is-dark"
      role="navigation"
      aria-label="main navigation">
      <div class="navbar-brand">
        <router-link :to="route({ name: 'home' })" class="navbar-item">
          <h1 class="title mb-0">ReadBooksOnline</h1>
        </router-link>

        <a
          v-show="isLoggedIn()"
          :aria-hidden="!isLoggedIn()"
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

      <div
        v-show="isLoggedIn()"
        :aria-hidden="!isLoggedIn()"
        class="navbar-menu"
        :class="activeClass">
        <div class="navbar-end has-text-weight-semibold">
          <router-link :to="route({ name: 'home' })" class="navbar-item">
            Home
          </router-link>

          <router-link :to="route({ name: 'tickets' })" class="navbar-item">
            Tickets
          </router-link>

          <div class="navbar-item has-dropdown is-hoverable">
            <a class="navbar-link">{{ store.user?.username ?? "User" }}</a>

            <div class="navbar-dropdown">
              <div class="navbar-item">
                <a class="button is-danger" @click="logout"> Logout </a>
              </div>
            </div>
          </div>
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

$base-spacing: map.get($spacing-values, "2");

main {
  padding: $base-spacing;

  @include tablet {
    padding: ($base-spacing * 2) ($base-spacing * 5);
  }

  @include desktop {
    padding: ($base-spacing * 6) ($base-spacing * 10);
  }
}

.title {
  color: inherit;
}
</style>
