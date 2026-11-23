<template>
  <Drag class="drag_view" v-if="isDragging" />
  <div v-if="selectionBox.active" class="selection_box"
       :style="{ left: selectionBox.x + 'px', top: selectionBox.y + 'px', width: selectionBox.w + 'px', height: selectionBox.h + 'px' }"></div>
  <Toast />
  <ConfirmPopup />
  <div class="page" @mousedown="onListMouseDown">
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
        <Menu ref="add" id="overlay_menu" :model="addItems(fileUploader, dirUploader, t)" :popup="true" />

        <Button :label="t('download')" variant="text" size="small" style="margin-left: 10px;"  :disabled="selector().selectedFile.length==0" @click="downloadHandler()" />
        <Button :label="t('delete')" variant="text" size="small" severity="danger" style="margin-left: 5px;" :disabled="selector().selectedFile.length==0" @click="menuDelHandler($event, confirm, toast, t)"/>
        <Button :label="t('copy')" variant="text" size="small" style="margin-left: 5px;" :disabled="selector().selectedFile.length==0" v-if="copyMove.copyMoveFiles==null" @click="copyMove.copyMoveSelector(selector().selectedFile, 'copy')"></Button>
        <Button :label="t('move')" variant="text" size="small" style="margin-left: 5px;" :disabled="selector().selectedFile.length==0" v-if="copyMove.copyMoveFiles==null" @click="copyMove.copyMoveSelector(selector().selectedFile, 'move')"></Button>
        <Button :label="t('copyHere')" variant="text" size="small" style="margin-left: 5px;" v-if="copyMove.copyMoveFiles?.type=='copy'" @click="copyMoveHandler(toast, t, 'copy')"></Button>
        <Button :label="t('moveHere')" variant="text" size="small" style="margin-left: 5px;" v-if="copyMove.copyMoveFiles?.type=='move'" @click="copyMoveHandler(toast, t, 'move')"></Button>
        <Button :label="t('cancel')" variant="text" size="small" style="margin-left: 5px;" v-if="copyMove.copyMoveFiles!=null" @click="copyMove.clearCopyMove()"></Button>
        <Button icon="pi pi-refresh" variant="text" size="small" style="margin-left: 5px;" @click="refresh(toast, t)" class="refresh_button" />
        <Button :icon="store().showHide ? 'pi pi-eye' : 'pi pi-eye-slash'" variant="text" size="small" style="margin-left: 5px;" @click="toggleHide" v-if="copyMove.copyMoveFiles==null" />
        <Button :icon="store().viewMode === 'grid' ? 'pi pi-list' : 'pi pi-th-large'"
                :title="store().viewMode === 'grid' ? t('listView') : t('gridView')"
                :aria-label="store().viewMode === 'grid' ? t('listView') : t('gridView')"
                variant="text" size="small" style="margin-left: 5px;" @click="toggleViewMode" />
      </div>
      <div class="header" v-if="store().viewMode === 'list'">
        <div class="header_label" style="display: flex; justify-content: center;">
          <Checkbox v-model="selector().selectAll" binary size="small" @change="selector().selectAllChange" :indeterminate="selector().indeterminate" />
        </div>
        <div></div>
        <div class="header_label">{{ t('name') }}</div>
        <div class="header_label">{{ t('size') }}</div>
        <div></div>
      </div>
      <div class="grid_header" v-else>
        <Checkbox v-model="selector().selectAll" binary size="small" @change="selector().selectAllChange" :indeterminate="selector().indeterminate" />
        <span class="header_label">{{ t('selectAll') }}</span>
      </div>
    </div>
    <div class="file_grid" v-if="store().viewMode === 'grid'">
      <GridItem v-for="item in store().list" :key="store().pathResolve + item.name" :item="item" @contextmenu="showMenu($event, item)" />
    </div>
    <template v-else>
      <Item v-for="(item, index) in store().list" :key="index" :item="item" @contextmenu="showMenu($event, item)" />
    </template>
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
  <ContextMenu ref="pageMenu" :model="bodyMenuItems" />
</template>

<script lang="ts" setup>
import { computed, onMounted, onUnmounted, ref } from 'vue';
import "../styles/home.css";
import store, { type FileItem } from '../hooks/store';
import { Button, Checkbox, ConfirmPopup, Toast, Menu, ContextMenu } from 'primevue';
import selector from '../hooks/selector';
import { pathHandler, downloadHandler, getList, menuDelHandler, addItems, refresh, uploadFiles, uploadFolder, toggleHide, toggleViewMode, clickHanlder, delHandler, renameHandler, readAllFilesFromDirectory, readFile, mkdirHandler, copyMoveHandler } from '../hooks/handler';
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
import GridItem from '../components/GridItem.vue';
import Drag from '../components/Drag.vue';
import copymove from '../hooks/copymove.ts';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const copyMove=copymove();


const selectMenu=ref<FileItem>({
  name: '',
  size: 0,
  isDir: false,
  selected: false
});

const bodyMenuItems=computed(()=>{
  const items: any[] = [
    {
      label: t('refresh'),
      icon: 'pi pi-refresh',
      command: ()=>refresh(toast, t)
    },
    {
      label: t('createFolder'),
      icon: "pi pi-folder-plus",
      command: ()=>{
        mkdirHandler()
      }
    },
    {
      label: t('uploadFile'),
      icon: 'pi pi-file-arrow-up',
      command: ()=>{
        fileUploader.value.click();
      }
    },
    {
      label: t('uploadFolder'),
      icon: 'pi pi-upload',
      command: ()=>{
        dirUploader.value.click();
      }
    }
  ]

  if(copyMove.copyMoveFiles){
    items.unshift({ separator: true })
    if(copyMove.copyMoveFiles.type=='copy'){
      items.unshift({
        label: t('copyHere'),
        icon: 'pi pi-copy',
        command: ()=>copyMoveHandler(toast, t, 'copy')
      })
    }else{
      items.unshift({
        label: t('moveHere'),
        icon: 'pi pi-folder',
        command: ()=>copyMoveHandler(toast, t, 'move')
      })
    }
  }

  return items
})

const menuItems=ref([
  {
    label: t('open'), 
    icon: selectMenu.value.isDir ? 'pi pi-folder-open' : 'pi pi-file',
    command: ()=>clickHanlder(selectMenu.value)
  },
  {
    label: t('rename'),
    icon: 'pi pi-pen-to-square',
    command: ()=>renameHandler(selectMenu.value)
  },
  {
    label: t('download'),
    icon: 'pi pi-download',
    command: ()=>downloadHandler(selectMenu.value)
  },
  {
    label: t('copy'),
    icon: 'pi pi-copy',
    command: ()=>{
      selector().selectedFile=[selectMenu.value];
      copyMove.copyMoveSelector(selector().selectedFile, 'copy');
    }
  },
  {
    label: t('move'),
    icon: 'pi pi-folder',
    command: ()=>{
      selector().selectedFile=[selectMenu.value];
      copyMove.copyMoveSelector(selector().selectedFile, 'move');
    }
  },
  {
    label: t('delete'),
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
const pageMenu=ref();
const add=ref();
function addButtons(event: any){
  add.value.toggle(event);
}

const fileUploader=ref();
const dirUploader=ref();

const showBodyMenu=(event: any)=>{
  event.preventDefault();
  pageMenu.value.show(event);
}

onMounted(async ()=>{
  document.body.addEventListener("contextmenu", showBodyMenu);
  store().showHide=localStorage.getItem("showHide")=='true' ? true : false
  if(fileUploader.value){
    fileUploader.value.addEventListener('change', (event: any) => {
      const target = event.currentTarget as HTMLInputElement;
      if (target.files && target.files.length > 0) {
        uploadFiles(target.files, toast, t,  target);
      }
    });
  }
  if(dirUploader.value){
    dirUploader.value.addEventListener('change', (event: any)=>{
      const target = event.currentTarget as HTMLInputElement; 
      if(target.files && target.files.length>0){
        uploadFolder(target.files, toast, t, target);
      }
      
    })
  }
  getList();
  window.addEventListener("mousemove", onBoxMouseMove);
  window.addEventListener("mouseup", onBoxMouseUp);
  window.addEventListener("dragenter", onDragEnter);
  window.addEventListener("dragover", onDragOver);
  window.addEventListener("dragleave", onDragLeave);
  window.addEventListener("drop", onDrop);
})

onUnmounted(()=>{
  window.removeEventListener("mousemove", onBoxMouseMove);
  window.removeEventListener("mouseup", onBoxMouseUp);
})

const selectionBox = ref({
  active: false,
  startX: 0,
  startY: 0,
  x: 0,
  y: 0,
  w: 0,
  h: 0,
  additive: false,
});

function onListMouseDown(e: MouseEvent) {
  if (e.button !== 0) return;
  const target = e.target as HTMLElement;
  if (target.closest('.file_item') || target.closest('.fixed')) return;

  const additive = e.ctrlKey || e.metaKey;
  if (!additive) {
    store().fileList.forEach(item => item.selected = false);
    selector().selectedFile = [];
    selector().selectAll = false;
    selector().indeterminate = false;
  }

  selectionBox.value = {
    active: true,
    startX: e.clientX,
    startY: e.clientY,
    x: e.clientX,
    y: e.clientY,
    w: 0,
    h: 0,
    additive,
  };
  e.preventDefault();
}

function onBoxMouseMove(e: MouseEvent) {
  const box = selectionBox.value;
  if (!box.active) return;

  box.x = Math.min(box.startX, e.clientX);
  box.y = Math.min(box.startY, e.clientY);
  box.w = Math.abs(e.clientX - box.startX);
  box.h = Math.abs(e.clientY - box.startY);

  const left = box.x;
  const top = box.y;
  const right = left + box.w;
  const bottom = top + box.h;

  document.querySelectorAll<HTMLElement>('.file_item').forEach(el => {
    const rect = el.getBoundingClientRect();
    const intersects = rect.left < right && rect.right > left && rect.top < bottom && rect.bottom > top;
    const name = el.dataset.name;
    if (!name) return;
    const item = store().fileList.find(i => i.name === name);
    if (!item) return;

    if (intersects) {
      if (!item.selected) {
        item.selected = true;
        selector().selectedFile.push(item);
      }
    } else if (!box.additive && item.selected) {
      item.selected = false;
      selector().selectedFile = selector().selectedFile.filter(f => f.name !== name);
    }
  });

  const total = store().fileList.length;
  const count = selector().selectedFile.length;
  selector().selectAll = count === total;
  selector().indeterminate = count > 0 && count < total;
}

function onBoxMouseUp() {
  selectionBox.value.active = false;
}

const dragCounter = ref(0);
const isDragging=ref(false);

const isExternalDrag=(e: DragEvent)=>!!e.dataTransfer?.types.includes('Files');

const onDragEnter=(e: DragEvent)=>{
  if (!isExternalDrag(e)) return;
  dragCounter.value++;
  isDragging.value = true;
  e.preventDefault();
}

const onDragOver=(e: DragEvent)=>{
  if (!isExternalDrag(e)) return;
  e.preventDefault();
}

const onDragLeave=(e: DragEvent)=>{
  if (!isExternalDrag(e)) return;
  dragCounter.value--;
  if (dragCounter.value === 0) {
    isDragging.value = false;
  }
}

const onDrop = async (e: DragEvent) => {
  if (!isExternalDrag(e)) return;
  e.preventDefault();
  dragCounter.value = 0;
  isDragging.value = false;

  if (!e.dataTransfer?.items || e.dataTransfer.items.length === 0) return;

  const items = Array.from(e.dataTransfer.items);

  const filePromises: Promise<File>[] = [];
  const folderPromises: Promise<File[]>[] = [];

  for (const item of items) {
    const entry = (item as any).webkitGetAsEntry?.();
    if (!entry) continue;

    if (entry.isDirectory) {
      folderPromises.push(readAllFilesFromDirectory(entry));
    } else if (entry.isFile) {
      filePromises.push(readFile(entry));
    }
  }

  const fileResults = await Promise.all(filePromises);
  const folderResults = await Promise.all(folderPromises);

  const allFilesFromFolders = folderResults.flat();
  const allFiles = [...fileResults, ...allFilesFromFolders];

  if (allFiles.length > 0) {
    const dataTransfer = new DataTransfer();
    allFiles.forEach((file) => dataTransfer.items.add(file));

    // 分别上传文件和目录
    if (fileResults.length > 0) {
      const fileDT = new DataTransfer();
      fileResults.forEach((file) => fileDT.items.add(file));
      await uploadFiles(fileDT.files, toast, t, null, false);
    }

    if (folderResults.length > 0) {
      const folderDT = new DataTransfer();
      allFilesFromFolders.forEach((file) => folderDT.items.add(file));
      await uploadFolder(folderDT.files, toast, t, null, false);
    }
    toast.add({ severity: 'success', summary: t('uploadSuccess'), detail: t('uploadDone'), life: 2000 });
  }
};



</script>