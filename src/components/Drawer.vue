<template>
  <Drawer v-model:visible="drawer().showDrawer" header="文件操作" position="bottom" style="height: auto">
    <div class="drawer_item" @click="drawer().download">
      <div class="drawer_item_icon">
        <i class="pi pi-download"></i>
      </div>
      <div class="drawer_item_label">下载</div>
    </div>
    <div class="drawer_item" @click="drawer().rename">
      <div class="drawer_item_icon">
        <i class="pi pi-pen-to-square"></i>
      </div>
      <div class="drawer_item_label">重命名</div>
    </div>
    <div class="drawer_item" style="color: red;" @click="drawer().del">
      <div class="drawer_item_icon">
        <i class="pi pi-trash"></i>
      </div>
      <div class="drawer_item_label">删除</div>
    </div>
  </Drawer>
</template>

<script lang="ts" setup>
import Drawer from 'primevue/drawer';
import drawer from '../hooks/drawer';
import "../styles/drawer.css";
</script>