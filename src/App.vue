<template>
  <Toast />
  <RouterView/>
</template>

<script lang="ts" setup>
import axios from 'axios';
import { RouterView, useRouter } from 'vue-router';
import hostname from './hooks/hostname';
const router=useRouter();
import { Toast } from 'primevue';
const init=async ()=>{
  const {data: auth}=await axios.get(`${hostname}/api/auth`);
  if(auth.useAuth){
    router.replace("/login");
  }
}

init();
</script>