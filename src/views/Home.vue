<template>
  <Drag class="drag_view" v-if="isDragging" />
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
        <Menu ref="add" id="overlay_menu" :model="addItems(fileUploader, dirUploader)" :popup="true" />

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
    <Item v-for="(item, index) in store().list" :key="index" :item="item" @contextmenu="showMenu($event, item)" />
    <ContextMenu ref="menu" :model="menuItems" />
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
import store, { type FileItem } from '../hooks/store';
import { Button, Checkbox, ConfirmPopup, Toast, Menu, ContextMenu } from 'primevue';
import selector from '../hooks/selector';
import { pathHandler, downloadHandler, getList, menuDelHandler, addItems, refresh, uploadFiles, uploadFolder, toggleHide, clickHanlder, delHandler, renameHandler, readAllFilesFromDirectory, readFile } from '../hooks/handler';
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
import Item from '../components/Item.vue';
import Drag from '../components/Drag.vue';

const selectMenu=ref<FileItem>({
  name: '',
  size: 0,
  isDir: false,
  selected: false
});

const menuItems=ref([
  {
    label: '打开', 
    icon: selectMenu.value.isDir ? 'pi pi-folder-open' : 'pi pi-file',
    command: ()=>clickHanlder(selectMenu.value)
  },
  {
    label: '重命名',
    icon: 'pi pi-pen-to-square',
    command: ()=>renameHandler(selectMenu.value)
  },
  {
    label: '下载',
    icon: 'pi pi-download',
    command: ()=>downloadHandler(selectMenu.value)
  },
  {
    label: '删除',
    icon: 'pi pi-trash',
    command: ()=>delHandler(selectMenu.value)
  },
])

const showMenu=(event: any, item: FileItem)=>{
  selectMenu.value=item;
  menu.value.show(event);
}

const confirm = useConfirm();
const toast = useToast();

const menu = ref();
const add=ref();
function addButtons(event: any){
  add.value.toggle(event);
}

const fileUploader=ref();
const dirUploader=ref();


onMounted(async ()=>{
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
  const isAuth=await checkAuth(true);
  if(isAuth){
    getList();
  }
  window.addEventListener("dragenter", onDragEnter);
  window.addEventListener("dragover", onDragOver);
  window.addEventListener("dragleave", onDragLeave);
  window.addEventListener("drop", onDrop);
})

const dragCounter = ref(0);
const isDragging=ref(false);

const onDragEnter=(e: any)=>{
  dragCounter.value++;
  isDragging.value = true;
  e.preventDefault();
}

const onDragOver=(e: any)=>{
  e.preventDefault();
}

const onDragLeave=()=>{
  dragCounter.value--;
  if (dragCounter.value === 0) {
    isDragging.value = false;
  }
}

const onDrop=async (e: any)=>{
  e.preventDefault();
  dragCounter.value = 0;
  isDragging.value = false;
  if (e.dataTransfer.files.length > 0) {
    const items = e.dataTransfer?.items;
    if (!items) return;

    let fileList: File[] = [];

    for (const item of items) {
      const entry = (item as any).webkitGetAsEntry?.();
      if (entry) {
        if (entry.isDirectory) {
          const files = await readAllFilesFromDirectory(entry);
          fileList.push(...files);
          // ～转换和上传
          const dataTransfer = new DataTransfer();
          fileList.forEach((file) => dataTransfer.items.add(file));
          uploadFolder(dataTransfer.files, toast, null);
        } else if (entry.isFile) {
          const file = await readFile(entry);
          fileList.push(file);
          // ～转换和上传
          const dataTransfer = new DataTransfer();
          fileList.forEach((file) => dataTransfer.items.add(file));
          uploadFiles(dataTransfer.files, toast, null);
        }
      }
    }
  }
}


</script>