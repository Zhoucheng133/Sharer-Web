<template>
  <div class="page">
    <div class="fixed">
      <div class="title_bar"></div>
      <div class="path">
        {{ "Root" + store().pathResolve }}
      </div>
      <div class="tools">
        <SplitButton size="small" :model="uploadButtons" label="上传" />
        <Button label="下载" variant="text" size="small" style="margin-left: 10px;"  :disabled="selector().selectedFile.length==0" />
        <Button label="删除" variant="text" size="small" severity="danger" style="margin-left: 10px;" :disabled="selector().selectedFile.length==0" />
      </div>
      <div class="header">
        <div class="header_label" style="display: flex; justify-content: center;">
          <Checkbox v-model="selector().selectAll" binary size="small" @change="selector().selectAllChange" :indeterminate="selector().indeterminate" />
        </div>
        <div></div>
        <div class="header_label">名称</div>
        <div class="header_label">大小</div>
      </div>
    </div>
    <div class="file_item" v-for="(item, index) in store().fileList" :key="index" @click="clickHanlder(item)">
      <div class="file_label" style="display: flex; justify-content: center;">
        <Checkbox v-model="item.selected" binary size="small" @change="()=>selector().selectChange(item)" />
      </div>
      <div>
        <FileIcon :file="item" />
      </div>
      <div class="file_label">{{ item.name }}</div>
      <div class="file_label">{{ calSize(item) }}</div>
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
import { uploadButtons, calSize } from '../hooks/static';
import FileIcon from '../components/FileIcon.vue';
import selector from '../hooks/selector';
import { clickHanlder } from '../hooks/handler';

onMounted(async ()=>{
  if(await checkAuth(true)){
    getList();
  }
})
</script>