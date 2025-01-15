<template>
  <Toast />
  <ConfirmPopup />
  <div class="page">
    <div class="fixed">
      <div class="title_bar"></div>
      <div class="path">
        <div :class="store().path.length==0 ? 'path_label_end' : 'path_label'" @click="pathHandler()">Root</div>
        <div class="path_item" v-for="(item, index) in store().path" :key="index">
          <i class="pi pi-arrow-right" style="margin-left: 5px; margin-right: 5px; font-size: 12px; display: flex; align-items: center;"></i>
          <div :class="index==store().path.length-1 ? 'path_label_end' : 'path_label'" @click="pathHandler(index)">{{ item }}</div>
        </div>
      </div>
      <div class="tools">
        <SplitButton size="small" :model="uploadButtons" label="上传" />
        <Button label="下载" variant="text" size="small" style="margin-left: 10px;"  :disabled="selector().selectedFile.length==0" @click="downloadHandler()" />
        
        <Button label="删除" variant="text" size="small" severity="danger" style="margin-left: 10px;" :disabled="selector().selectedFile.length==0" @click="delHandler($event, confirm, toast)"/>
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
    <div class="file_item" v-for="(item, index) in store().fileList" :key="index">
      <div class="file_label" style="display: flex; justify-content: center;">
        <Checkbox v-model="item.selected" binary size="small" @change="()=>selector().selectChange(item)" />
      </div>
      <div @click="clickHanlder(item)">
        <FileIcon :file="item" />
      </div>
      <div class="file_label" @click="clickHanlder(item)">{{ item.name }}</div>
      <div class="file_option">
        <Button icon="pi pi-download" rounded severity="secondary" variant="outlined" style="height: 30px; width: 30px;" @click="downloadHandler(item)" />
        <Button icon="pi pi-pen-to-square" rounded severity="secondary" variant="outlined" style="height: 30px; width: 30px; margin-left: 5px;" />
        <Button icon="pi pi-trash" rounded severity="danger" variant="outlined" style="height: 30px; width: 30px; margin-left: 5px;" @click="delHandler($event, confirm, toast, item)" />
      </div>
      <div class="file_label" @click="clickHanlder(item)">{{ calSize(item) }}</div>
    </div>
  </div>
  <Preview class="preview" v-if="preview().previewFile.length!=0"/>
</template>

<script lang="ts" setup>
import { onMounted } from 'vue';
import { checkAuth } from '../hooks/auth';
import "../styles/home.css";
import store from '../hooks/store';
import { SplitButton, Button, Checkbox, ConfirmPopup, Toast} from 'primevue';
import { uploadButtons, calSize } from '../hooks/static';
import FileIcon from '../components/FileIcon.vue';
import selector from '../hooks/selector';
import { clickHanlder, pathHandler, downloadHandler, getList, delHandler } from '../hooks/handler';
import Preview from '../components/Preview.vue';
import preview from '../hooks/preview';
import { useConfirm } from "primevue/useconfirm";
import { useToast } from "primevue/usetoast";

const confirm = useConfirm();
const toast = useToast();

onMounted(async ()=>{
  const isAuth=await checkAuth(true);
  if(isAuth){
    getList();
  }
})
</script>