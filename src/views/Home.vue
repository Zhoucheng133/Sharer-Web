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
        <Button type="button" icon="pi pi-plus" @click="addButtons" aria-haspopup="true" aria-controls="overlay_menu" size="small" />
        <Menu ref="menu" id="overlay_menu" :model="addItems(fileUploader, dirUploader)" :popup="true" />

        <Button label="下载" variant="text" size="small" style="margin-left: 10px;"  :disabled="selector().selectedFile.length==0" @click="downloadHandler()" />
        <Button label="删除" variant="text" size="small" severity="danger" style="margin-left: 5px;" :disabled="selector().selectedFile.length==0" @click="menuDelHandler($event, confirm, toast)"/>
        <Button icon="pi pi-refresh" variant="text" size="small" style="margin-left: 5px;" @click="refresh(toast)" />
        <Button :icon="store().showHide ? 'pi pi-eye' : 'pi pi-eye-slash'" variant="text" size="small" style="margin-left: 5px;" @click="toggleHide" />
      </div>
      <div class="header">
        <div class="header_label" style="display: flex; justify-content: center;">
          <Checkbox v-model="selector().selectAll" binary size="small" @change="selector().selectAllChange" :indeterminate="selector().indeterminate" />
        </div>
        <div></div>
        <div class="header_label">名称</div>
        <div class="header_label">大小</div>
        <div></div>
      </div>
    </div>
    <div class="file_item" v-for="(item, index) in store().list" :key="index">
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
    <div style="height: 50px;"></div>
  </div>
  <Preview class="preview" v-if="preview().previewFile.length!=0"/>
  <Mkdir />
  <Rename />
  <Delete />
  <Drawer :visiable="drawer().showDrawer" />
  <Progress class="progress_component" />
  <input type="file" multiple style="display: none;" ref="fileUploader">
  <input type="file" multiple webkitdirectory directory style="display: none;" ref="dirUploader">
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import { checkAuth } from '../hooks/auth';
import "../styles/home.css";
import store from '../hooks/store';
import { Button, Checkbox, ConfirmPopup, Toast, Menu} from 'primevue';
import { calSize } from '../hooks/static';
import FileIcon from '../components/FileIcon.vue';
import selector from '../hooks/selector';
import { clickHanlder, pathHandler, downloadHandler, getList, menuDelHandler, delHandler, addItems, renameHandler, refresh, uploadFiles, uploadFolder, toggleHide } from '../hooks/handler';
import Preview from '../components/Preview.vue';
import preview from '../hooks/preview';
import { useConfirm } from "primevue/useconfirm";
import { useToast } from "primevue/usetoast";
import Mkdir from '../components/dialogs/Mkdir.vue';
import Drawer from '../components/Drawer.vue';
import drawer from '../hooks/drawer';
import Rename from '../components/dialogs/Rename.vue';
import Delete from '../components/dialogs/Delete.vue';
import Progress from '../components/Progress.vue';

const confirm = useConfirm();
const toast = useToast();

const menu = ref();
function addButtons(event: any){
  menu.value.toggle(event);
}

const fileUploader=ref();
const dirUploader=ref();
onMounted(()=>{
  store().showHide=localStorage.getItem("showHide")=='true' ? true : false
  if(fileUploader.value){
    fileUploader.value.addEventListener('change', (event: any) => {
      const target = event.currentTarget as HTMLInputElement;
      if (target.files && target.files.length > 0) {
        uploadFiles(target.files, toast, target);
      }
    });
  }
  if(dirUploader.value){
    dirUploader.value.addEventListener('change', (event: any)=>{
      const target = event.currentTarget as HTMLInputElement; 
      if(target.files && target.files.length>0){
        uploadFolder(target.files, toast, target);
      }
      
    })
  }
})


onMounted(async ()=>{
  const isAuth=await checkAuth(true);
  if(isAuth){
    getList();
  }
})
</script>