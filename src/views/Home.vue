<template>
  <div class="page">
    <div class="fixed">
      <div class="title_bar"></div>
      <div class="path">
        {{ "Root" + store().pathResolve }}
      </div>
      <div class="tools">
        <SplitButton size="small" :model="uploadButtons" label="上传" />
        <Button label="下载" variant="text" size="small" style="margin-left: 10px;"  :disabled="store().selectedFile.length==0" />
        <Button label="删除" variant="text" size="small" severity="danger" style="margin-left: 10px;" :disabled="store().selectedFile.length==0" />
      </div>
      <div class="header">
        <div class="header_label">
          <Checkbox v-model="store().selectAll" binary size="small" />
        </div>
        <div class="header_label">名称</div>
        <div class="header_label">大小</div>
      </div>
    </div>
    <div class="file_item" v-for="(item, index) in store().fileList" :key="index">
      <div class="file_label"></div>
      <div class="file_label">{{ item.name }}</div>
      <div class="file_label">{{ item.size }}</div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted } from 'vue';
import { checkAuth } from '../hooks/auth';
import "../styles/home.css";
import { getList } from '../hooks/request';
import store from '../hooks/store';
import { SplitButton, Button, Checkbox } from 'primevue';
import { uploadButtons } from '../hooks/static';

onMounted(async ()=>{
  if(await checkAuth(true)){
    getList();
  }
})
</script>