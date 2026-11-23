<template>
  <div class="file_item"
       :class="{ 'dragging': isDragging, 'drag_over': isDropTarget }"
       draggable="true"
       @dragstart="onDragStart"
       @dragend="onDragEnd"
       @dragenter="onDragEnter"
       @dragover="onDragOver"
       @dragleave="onDragLeave"
       @drop="onDrop">
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
import { computed, ref } from 'vue';
import { useToast } from 'primevue/usetoast';
import { useI18n } from 'vue-i18n';
import type { FileItem } from '../hooks/store';
import store from '../hooks/store';
import selector from '../hooks/selector';
import { clickHanlder, downloadHandler, delHandler, renameHandler, moveFiles } from '../hooks/handler';
import { calSize } from '../hooks/static';
import drawer from '../hooks/drawer';
import { Button, Checkbox } from 'primevue';
import FileIcon from './FileIcon.vue';

const INTERNAL_DRAG_MIME = 'application/x-sharer-items';

interface DragMovePayload {
  from: string;
  files: string[];
}

const props = defineProps<{ item: FileItem }>();
const item = computed(() => props.item);

const toast = useToast();
const { t } = useI18n();

const isDragging = computed(() => selector().draggingFiles.some(name => name === item.value.name));
const isDropTarget = ref(false);

const isInternalDrag = (e: DragEvent) => !!e.dataTransfer?.types.includes(INTERNAL_DRAG_MIME);

function setDragImage(e: DragEvent, text: string) {
  if (!e.dataTransfer) return;
  const el = document.createElement('div');
  el.textContent = text;
  Object.assign(el.style, {
    position: 'fixed',
    top: '-1000px',
    left: '-1000px',
    padding: '8px 14px',
    borderRadius: '6px',
    backgroundColor: '#06B6D4',
    color: '#fff',
    fontSize: '14px',
    fontWeight: '600',
    whiteSpace: 'nowrap',
    pointerEvents: 'none',
  });
  document.body.appendChild(el);
  e.dataTransfer.setDragImage(el, el.offsetWidth / 2, el.offsetHeight / 2);
  setTimeout(() => el.remove(), 0);
}

function onDragStart(e: DragEvent) {
  if (!e.dataTransfer) return;

  const selected = selector().selectedFile;
  const files = selected.some(file => file.name === item.value.name)
    ? selected.map(file => file.name)
    : [item.value.name];

  const payload: DragMovePayload = { from: store().pathResolve, files };
  e.dataTransfer.setData(INTERNAL_DRAG_MIME, JSON.stringify(payload));
  e.dataTransfer.setData('text/plain', item.value.name);
  e.dataTransfer.effectAllowed = 'move';
  selector().draggingFiles = files;

  if (files.length > 1) {
    setDragImage(e, t('draggingItems', { n: files.length }));
  }
}

function onDragEnd() {
  selector().draggingFiles = [];
  isDropTarget.value = false;
}

function onDragEnter(e: DragEvent) {
  if (!item.value.isDir || !isInternalDrag(e)) return;
  e.preventDefault();
  isDropTarget.value = true;
}

function onDragOver(e: DragEvent) {
  if (!item.value.isDir || !isInternalDrag(e)) return;
  e.preventDefault();
  if (e.dataTransfer) e.dataTransfer.dropEffect = 'move';
  isDropTarget.value = true;
}

function onDragLeave(e: DragEvent) {
  if (!item.value.isDir) return;
  const el = e.currentTarget as HTMLElement;
  const related = e.relatedTarget as Node | null;
  if (related && el.contains(related)) return;
  isDropTarget.value = false;
}

async function onDrop(e: DragEvent) {
  if (!item.value.isDir || !isInternalDrag(e) || !e.dataTransfer) return;
  e.preventDefault();
  e.stopPropagation();
  selector().draggingFiles = [];
  isDropTarget.value = false;

  let payload: DragMovePayload;
  try {
    payload = JSON.parse(e.dataTransfer.getData(INTERNAL_DRAG_MIME));
  } catch {
    return;
  }
  if (!payload?.from || !Array.isArray(payload.files) || payload.files.length === 0) return;

  const to = store().pathResolve + item.value.name + '/';
  if (payload.files.some(name => to.startsWith(payload.from + name + '/'))) {
    toast.add({ severity: 'warn', summary: t('moveIntoSelf'), life: 3000 });
    return;
  }

  await moveFiles(toast, t, payload.from, payload.files, to);
}
</script>
