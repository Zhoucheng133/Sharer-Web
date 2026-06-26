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
import { createI18n } from 'vue-i18n';
import zhCN from './i18n/zh_cn.ts';
import enUS from './i18n/en_us.ts';
import zhTW from './i18n/zh_tw.ts';

const app = createApp(App);
const pinia = createPinia()
const userLang = navigator.language;

const i18n=createI18n({
  legacy: false,
  locale: userLang,
  fallbackLocale: 'en-US',
  missingWarn: false,
  fallbackWarn: false,
  messages: {
    "zh-CN": zhCN,
    "en-US": enUS,
    "zh-TW": zhTW,
  }
})

app.use(ToastService);
app.use(ConfirmationService);
app.use(router);
app.use(pinia);
app.use(i18n)

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