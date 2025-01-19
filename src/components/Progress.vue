<template>
  <div class="progress_panel" :style="{height: panelHeight+'px'}">
    <div class="progress_titlebar" @click="togglePanel">
      <div>上传列表</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import "../styles/progress.css";

let panelHeight=ref(50);

const togglePanel=()=>{
  if(panelHeight.value==50){
    panelHeight.value=400;
  }else{
    panelHeight.value=50;
  }
}
</script>