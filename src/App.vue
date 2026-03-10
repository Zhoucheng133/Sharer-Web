<template>
  <Toast />
  <RouterView v-if="!loading" />
</template>

<script lang="ts" setup>
import { RouterView, useRouter } from 'vue-router';
import { Toast } from 'primevue';
import { onMounted, ref } from 'vue';
import { checkAuth } from './hooks/auth';

const router=useRouter();
const loading=ref(true);

onMounted(async ()=>{
  const ok=await checkAuth();
  if(!ok){
    await router.replace('/login');
  }
  loading.value=false;
})

</script>