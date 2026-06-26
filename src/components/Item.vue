<template>
  <div class="file_item">
    <div class="file_label" style="display: flex; justify-content: center;">
      <Checkbox v-model="item.selected" binary size="small" @change="()=>selector().selectChange(item)" />
    </div>
    <div @click="clickHanlder(item)">
      <FileIcon :file="item" />
    </div>
    <div class="file_label" @click="clickHanlder(item)">{{ item.name }}</div>
    <div class="file_option">
      <Button icon="pi pi-download" rounded severity="secondary" variant="outlined" style="height: 30px; width: 30px;" @click="downloadHandler(item)" />
      <Button icon="pi pi-pen-to-square" rounded severity="secondary" variant="outlined" style="height: 30px; width: 30px; margin-left: 5px;" @click="renameHandler(item)" />
      <Button icon="pi pi-trash" rounded severity="danger" variant="outlined" style="height: 30px; width: 30px; margin-left: 5px;" @click="delHandler(item)" />
    </div>
    <div class="file_label" @click="clickHanlder(item)" style="text-align: right;">{{ calSize(item) }}</div>
    <div class="file_option_m">
      <Button icon="pi pi-ellipsis-v" severity="secondary" variant="text" style="height: 30px; width: 30px;" @click="drawer().toggleDrawer(item)" />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { FileItem } from '../hooks/store';
import selector from '../hooks/selector';
import { clickHanlder, downloadHandler, delHandler, renameHandler } from '../hooks/handler';
import { calSize } from '../hooks/static';
import drawer from '../hooks/drawer';
import { Button, Checkbox } from 'primevue';
import FileIcon from './FileIcon.vue';
import { computed } from 'vue';

const props = defineProps<{ item: FileItem }>();
const item = computed(() => props.item);
</script>