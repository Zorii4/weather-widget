import axios from "axios"
import { ISavedCity } from "../interfaces/cities"

export const getCitiesWeather = async (cities: ISavedCity[]) => {

    const requests: any[] = []

    cities.forEach((city) => {
      requests.push(
        axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city.cityName}&units=metric&appid=bbb4b95c8c949d4616e5799117279e7f`)
      )
    })
    
    const weatherData = await Promise.all(requests)

    return weatherData
  }