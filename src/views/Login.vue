<template>
  登录
</template>

<script lang="ts" setup>
import axios from 'axios';
import hostname from '../hooks/hostname';
import { useRouter } from 'vue-router';

const router=useRouter();
const init=async ()=>{
  const {data: auth}=await axios.get(`${hostname}/api/auth`);
  if(!auth.useAuth){
    router.replace("/");
  }
}

init();
</script>