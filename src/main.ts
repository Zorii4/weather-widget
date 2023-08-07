import { defineCustomElement } from 'vue';
import App from "./MyApp.ce.vue";
import "@/assets/main.scss"

customElements.define('weather-widget',defineCustomElement(App));
