<template>
  <div class="login_body">
    <div class="login_panel">
      <div class="login_title">{{ t('login') }}</div>
      <div class="login_form">
        <InputText size="small" v-model="username" style="width: 100%;" :placeholder="t('username')" />
        <Password size="small" v-model="password" style="width: 100%; margin-top: 20px;" :placeholder="t('password')" :feedback="false" />
        <Button :label="t('login')" size="small" class="login_button" @click="login(username, password)" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { checkAuth, loginHandler } from '../hooks/auth';
import { InputText, Password, Button } from 'primevue';
import "../styles/login.css";
import { onMounted, ref } from 'vue';
import { useToast } from 'primevue';
import store from '../hooks/store';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const toast = useToast();
const router=useRouter();

async function login(username: string, password: string){
  if(username.length==0){
    toast.add({ severity: 'error', summary: t('loginFail'), detail: t('emptyUsername'), life: 3000 });
    return;
  }else if(password.length==0){
    toast.add({ severity: 'error', summary: t('loginFail'), detail: t('emptyPassword'), life: 3000 });
    return;
  }
  const response=await loginHandler(username, password);
  if(!response.ok){
    toast.add({ severity: 'error', summary: t('loginFail'), detail: t('wrongUsernameOrPassword'), life: 3000 });
  }else{
    localStorage.setItem("token", response.msg);
    store().token=response.msg;
    router.replace("/");
  }
}

onMounted(()=>{
  localStorage.clear();
})

let username=ref("");
let password=ref("");

checkAuth(false);
</script>