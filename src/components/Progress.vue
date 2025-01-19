<template>
  <div class="progress_panel" :style="{height: panelHeight+'px'}">
    <div class="progress_titlebar" @click="togglePanel">
      <div>上传列表</div>
      <i class="pi pi-arrow-circle-up progress_titleicon" v-if="panelHeight==50"></i>
      <i class="pi pi-arrow-circle-down progress_titleicon" v-else></i>
    </div>
    <div class="progress_content">
      <div class="progress_item" v-for="(item, index) in progress().uploadList" :key="index">
        <div class="progress_name">
          <div class="progress_nameText">{{ item.name }}</div>
          <div class="progress_size">
            {{ calSize({name: item.name, isDir: false, size: item.size, selected: false}) }}
          </div>
        </div>
        <div class="progress_statusIcon">
          <i class="pi pi-check-circle" v-if="item.progress==100"></i>
          <i class="pi pi-cloud-upload"v-else></i>
        </div>
        <div class="progress_bar" v-if="item.progress!=100" :style="{width: item.progress+'%'}"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import "../styles/progress.css";
import progress from "../hooks/progress";
import { calSize } from "../hooks/static";

let panelHeight=ref(50);

const togglePanel=()=>{
  if(panelHeight.value==50){
    panelHeight.value=400;
  }else{
    panelHeight.value=50;
  }
}
</script>