<template>
  <div class="login_body">
    <div class="login_panel">
      <div class="login_title">登录</div>
      <div class="login_form">
        <InputText size="small" v-model="username" style="width: 100%;" placeholder="用户名" />
        <Password size="small" v-model="password" style="width: 100%; margin-top: 20px;" placeholder="密码" :feedback="false" />
        <Button label="登录" size="small" class="login_button" @click="login(username, password)" />
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
const toast = useToast();
const router=useRouter();

async function login(username: string, password: string){
  if(username.length==0){
    toast.add({ severity: 'error', summary: '登录失败', detail: '用户名不能为空', life: 3000 });
    return;
  }else if(password.length==0){
    toast.add({ severity: 'error', summary: '登录失败', detail: '密码不能为空', life: 3000 });
    return;
  }
  const response=await loginHandler(username, password);
  if(!response.ok){
    toast.add({ severity: 'error', summary: '登录失败', detail: '用户名或者密码错误', life: 3000 });
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