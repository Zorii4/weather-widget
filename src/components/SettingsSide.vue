<template>
  <div class="container">
    <div class="wrapper">
      <h4 class="city-name">Settings</h4>
      <button class="btn" @click="toggleView"><i class="fa-solid fa-xmark"></i></button>
    </div>
    <div class="city-badge-wrapper">
      <ul>
        <li v-for="city in savedCities" 
          :key="city.id" 
          class="city-badge" 
          :draggable="isDraggable"
          @dragstart="dragStartHendler(city)"
          @dragover.prevent
          @drop.prevent="dropHendler(city)"
        >
          <i @mousedown="isDraggable = true" class="fa-solid fa-bars burger"></i>
          <p>{{ city.cityName }}</p>
          <i class="fa-solid fa-trash remove" @click="removeCity(city.id)"></i>
        </li>
      </ul>
    </div>
    <form @submit.prevent="addCity" class="input-wrapper">
      <div class="input-label-wrapper">
        <label for="city">Add  Location</label>
        <input type="text" id="city" placeholder="City name" v-model="cityName" required>
      </div>
      <button class="submit-btn" type="submit"><i class="fa-solid fa-circle-plus"></i></button>
    </form>
  </div>
</template>

<script setup lang="ts">
  import { ref } from "vue"
  import { ISavedCity } from "../interfaces/cities"

  const emit = defineEmits(["toggle-view"])

  const toggleView = () => {
    emit('toggle-view')
  }

  const isDraggable = ref(false)
  const currentCard = ref()
  const cityName = ref("")
  const savedCities = ref<ISavedCity[]>(JSON.parse(localStorage.getItem("savedCities") || "[]"))

  let order = savedCities.value.length
  const addCity = () => {
    order += 1
    savedCities.value.push({
      id: Date.now(),
      cityName: cityName.value,
      order: order
    })
    localStorage.setItem("savedCities", JSON.stringify(savedCities.value))
    cityName.value = ""
  }

  const dragStartHendler = (card: ISavedCity) => {
    currentCard.value = card
  }

  const dropHendler = (card: ISavedCity) => {
    savedCities.value = savedCities.value.map (c => {
      if (c.id === card.id) {
        return {...c, order: currentCard.value.order}
      }
      if(c.id === currentCard.value.id) {
        return {...c, order: card.order}
      }
      return c
    })
    isDraggable.value = false
    sortedCities()
  }

  const sortedCities = () => {
    savedCities.value = savedCities.value.slice().sort((a,b) => {
      if (a.order > b.order) {
        return 1
      } else {
        return -1
      }
    })
    localStorage.setItem("savedCities", JSON.stringify(savedCities.value))
  }

  const removeCity = (id: number) => {
    const cities = JSON.parse(localStorage.getItem("savedCities") || "[]")
    savedCities.value = cities.filter((c: ISavedCity) => c.id !== id)
    localStorage.setItem("savedCities", JSON.stringify(savedCities.value))
    if(savedCities.value.length === 0) {
      localStorage.removeItem("savedCities")
    }
  }

</script>
