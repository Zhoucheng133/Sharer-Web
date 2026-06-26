<template>
  <Toast />
  <drag-select v-model="selection" :key="store().path">
    <RouterView />
  </drag-select>
</template>

<script lang="ts" setup>
import { RouterView } from 'vue-router';
import { Toast } from 'primevue';
import { watch } from 'vue';
import useSelector from './hooks/selector';
import { storeToRefs } from 'pinia';
import store from './hooks/store';

const selector=useSelector();

const selection=storeToRefs(selector).selection

watch(selection, ()=>{
  selector.dragSelectHandler(selection.value);
})


</script>