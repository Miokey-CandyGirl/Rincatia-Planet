<template>
  <div class="default-layout">
    <div class="starfield" ref="starfieldRef"></div>
    <AppHeader @show-login="showLoginModal = true" />
    <main>
      <slot />
    </main>
    <AppFooter />
    <LoginModal v-if="showLoginModal" @close="showLoginModal = false" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import AppHeader from './AppHeader.vue'
import AppFooter from './AppFooter.vue'
import LoginModal from './LoginModal.vue'

const showLoginModal = ref(false)
const starfieldRef = ref(null)
</script>