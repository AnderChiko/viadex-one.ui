import "primeicons/primeicons.css";
import "./style.css";
import "./flags.css";

import { createApp } from "vue";
import PrimeVue from "primevue/config";
import ConfirmationService from 'primevue/confirmationservice'
import DialogService from 'primevue/dialogservice'
import ToastService from 'primevue/toastservice';

import App from "./App.vue";
import AppState from './plugins/appState.js';
import Noir from './presets/Noir.js';
import Chart from 'primevue/chart';


const app = createApp(App);

app.use(PrimeVue, {
    theme: {
        preset: Noir,
        options: {
            prefix: 'p',
            darkModeSelector: '.p-dark',
            cssLayer: false,
        }
    }
});
app.use(AppState);
app.use(ConfirmationService);
app.use(ToastService);
app.use(DialogService);

//app.component('ThemeSwitcher', ThemeSwitcher);
app.component('Chart', Chart);


app.mount("#app");
