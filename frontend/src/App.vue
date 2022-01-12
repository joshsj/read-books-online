<script setup lang="ts">
import { ref } from "vue";

const activeClass = ref<string | undefined>(undefined);
const toggleNavbar = () =>
  (activeClass.value = activeClass.value ? undefined : "is-active");
</script>

<template>
  <header>
    <nav
      class="navbar is-transparent p-4"
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
        <div class="navbar-end">
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
