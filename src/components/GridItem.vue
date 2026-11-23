<template>
  <div class="file_item grid_item"
       ref="el"
       :data-name="item.name"
       :class="{ 'dragging': isDragging, 'drag_over': isDropTarget, 'selected': item.selected }"
       draggable="true"
       @click="clickHanlder(item)"
       @dragstart="onDragStart"
       @dragend="onDragEnd"
       @dragenter="onDragEnter"
       @dragover="onDragOver"
       @dragleave="onDragLeave"
       @drop="onDrop">
    <div class="grid_thumb">
      <img class="grid_fallback" :src="fallbackIcon" alt="" />
      <img v-if="isImage && shouldLoad && !failed"
           class="grid_thumbnail"
           :class="{ 'is_loaded': loaded }"
           :src="thumbUrl"
           :alt="item.name"
           loading="lazy"
           decoding="async"
           @load="loaded = true"
           @error="failed = true" />

      <div class="grid_check" @click.stop>
        <Checkbox v-model="item.selected" binary size="small" @change="selector().selectChange(item)" />
      </div>

      <div class="grid_actions" @click.stop>
        <Button icon="pi pi-ellipsis-h" rounded severity="secondary" size="small"
                :aria-label="t('fileOptions')" :title="t('fileOptions')"
                aria-haspopup="true" :aria-controls="actionMenuId" @click="toggleActionMenu" />
      </div>
    </div>

    <div class="grid_name" :title="item.name">{{ item.name }}</div>
    <div class="grid_meta">
      <span>{{ item.isDir ? t('folder') : calSize(item) }}</span>
      <span class="grid_more" @click.stop>
        <Button icon="pi pi-ellipsis-v" severity="secondary" variant="text" size="small" @click="drawer().toggleDrawer(item)" />
      </span>
    </div>

    <Menu :id="actionMenuId" ref="actionMenu" :model="actionItems" :popup="true" appendTo="body" />
  </div>
</template>

<script setup lang="ts">
import { computed, ref, useId } from 'vue';
import { useI18n } from 'vue-i18n';
import { Button, Checkbox, Menu } from 'primevue';
import type { FileItem } from '../hooks/store';
import store from '../hooks/store';
import hostname from '../hooks/hostname';
import selector from '../hooks/selector';
import drawer from '../hooks/drawer';
import { clickHanlder, downloadHandler, delHandler, renameHandler } from '../hooks/handler';
import { calSize, getAsset, getFileType, Types } from '../hooks/static';
import { useLazyImage } from '../hooks/lazyImage';
import { useItemDrag } from '../hooks/itemDrag';

const props = defineProps<{ item: FileItem }>();
const item = computed(() => props.item);
const { t } = useI18n();

const actionMenu = ref();
const actionMenuId = `grid_action_menu_${useId()}`;
const actionItems = computed(() => [
  {
    label: t('download'),
    icon: 'pi pi-download',
    command: () => downloadHandler(item.value)
  },
  {
    label: t('rename'),
    icon: 'pi pi-pen-to-square',
    command: () => renameHandler(item.value)
  },
  {
    label: t('delete'),
    icon: 'pi pi-trash',
    class: 'grid_action_delete',
    command: () => delHandler(item.value)
  }
]);

function toggleActionMenu(event: MouseEvent) {
  actionMenu.value.toggle(event);
}

const isImage = computed(() => !item.value.isDir && getFileType(item.value.name) === Types.Image);
const fallbackIcon = computed(() => getAsset(item.value) ?? '');
const thumbUrl = computed(() => {
  if (!isImage.value) return '';
  const path = store().pathResolve + item.value.name;
  return `${hostname}/api/raw?path=${encodeURIComponent(path)}&token=${store().token}`;
});

// The observer only starts loading the full-size image when the tile is near the viewport.
const { shouldLoad, loaded, failed } = useLazyImage(thumbUrl);
const { isDragging, isDropTarget, onDragStart, onDragEnd, onDragEnter, onDragOver, onDragLeave, onDrop } = useItemDrag(item);
</script>
