<template>
  <div>
    <h3 v-if="geoError">You need to enable the geolocation setting in the browser</h3>
    <h3 v-if="fetchError">Something went wrong! =( Refresh the page and try again.</h3>
    <div class="container" v-for="(weatherData, index) in allCitiesWeather" :key="weatherData.data.id">
      <div class="wrapper">
        <h4 class="city-name">{{ weatherData.data.name }}, {{ weatherData.data.sys.country }}</h4>
        <button v-if="index === 0" class="btn" @click="toggleView"><i class="fa-solid fa-gear"></i></button>
      </div>
      <div class="wrapper">
        <h1>{{weatherData.data.main.temp}}&deg;C</h1>
        <img :src="`http://openweathermap.org/img/wn/${ weatherData.data.weather[0].icon}@2x.png`" />
      </div>
      <p class="description">Feels like {{ weatherData.data.main.feels_like }} {{ weatherData.data.weather[0].main}}, {{ weatherData.data.weather[0].description}}</p>
      <p>Wind: <i class="fa-solid fa-up-long wind-arrow" :style="`transform: rotateZ(${weatherData.data.wind.deg}deg)`"></i>{{ weatherData.data.wind.speed }} m/s</p>
      <p>Humidity: {{ weatherData.data.main.humidity }} %</p>
      <p>Visibility: {{ weatherData.data.visibility }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
  import axios from "axios"
  import { onMounted, ref } from "vue"
  import { getCitiesWeather } from "../apiServices/getCitiesWeather"
  import { ISavedCity } from "../interfaces/cities"

  const emit = defineEmits(["toggle-view"])

  const toggleView = () => {
    emit('toggle-view')
  }

  const geoError = ref(false)
  const fetchError = ref(false)
  const cities = ref<ISavedCity[]>([])
  const allCitiesWeather = ref()

  const getWeatherDefaultCity = () => {
    const success = async (position: GeolocationPosition) => {
      try {
        const data = await axios.get(`https:/api.openweathermap.org/data/2.5/weather?lat=${position.coords.latitude}&lon=${position.coords.longitude}&units=metric&appid=bbb4b95c8c949d4616e5799117279e7f`)
      allCitiesWeather.value = [data]
      } catch (error) {
        fetchError.value = true
      }
    }
    const error = () => {
      geoError.value = true
    }
    navigator.geolocation.getCurrentPosition(success, error)
  }

  onMounted(async () => {
    if(localStorage.getItem("savedCities")) {
      cities.value = JSON.parse(
        localStorage.getItem("savedCities") || "[]"
      )
      try {
        allCitiesWeather.value = await getCitiesWeather(cities.value)
      } catch (error) {
        fetchError.value = true
      }
    } else {
      getWeatherDefaultCity()
    }
  })
</script>
