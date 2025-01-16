<template>
  <Drawer v-model:visible="drawer().showDrawer" header="文件操作" position="bottom" style="height: auto">
    
  </Drawer>
</template>

<script lang="ts" setup>
import Drawer from 'primevue/drawer';
import drawer from '../hooks/drawer';
</script>