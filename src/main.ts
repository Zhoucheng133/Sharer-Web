import { createApp } from 'vue';
import App from './App.vue';
import PrimeVue from 'primevue/config';
import Aura from '@primevue/themes/aura';
import "./styles/main.css";
import { definePreset } from '@primevue/themes';
import 'primeicons/primeicons.css';
import ToastService from 'primevue/toastservice';
import router from "./router/index";
import { createPinia } from 'pinia';
import ConfirmationService from 'primevue/confirmationservice';

const app = createApp(App);
const pinia = createPinia()

app.use(ToastService);
app.use(ConfirmationService);
app.use(router);
app.use(pinia);

const primaryColor="cyan";

const MyPreset = definePreset(Aura, {
  semantic: {
    primary: {
      50: `{${primaryColor}.50}`,
      100: `{${primaryColor}.100}`,
      200: `{${primaryColor}.200}`,
      300: `{${primaryColor}.300}`,
      400: `{${primaryColor}.400}`,
      500: `{${primaryColor}.500}`,
      600: `{${primaryColor}.600}`,
      700: `{${primaryColor}.700}`,
      800: `{${primaryColor}.800}`,
      900: `{${primaryColor}.900}`,
      950: `{${primaryColor}.950}`
    }
  }
});

app.use(PrimeVue, {
  theme: {
    preset: MyPreset
  }
});
app.mount('#app')