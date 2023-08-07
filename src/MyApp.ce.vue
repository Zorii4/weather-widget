<template>
  <transition name="fade" mode="out-in">
    <MainSide v-if="!settings" @toggleView="toggleView"/>
    <SettingsSide v-else @toggleView="toggleView"/>
  </transition>
</template>

<script setup lang="ts">
  import { ref } from "vue"
  import MainSide from "./components/MainSide.vue"
  import SettingsSide from "./components/SettingsSide.vue"
  
  const settings = ref(false)

  const toggleView = () => {
    settings.value = !settings.value
  }

</script>

<style lang="scss" src="@/assets/main.scss"></style>
