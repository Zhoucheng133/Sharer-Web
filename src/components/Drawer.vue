<template>
  <Drawer v-model:visible="drawer().showDrawer" :header="t('fileOptions')" position="bottom" style="height: auto">
    <div class="drawer_item" @click="drawer().download">
      <div class="drawer_item_icon">
        <i class="pi pi-download"></i>
      </div>
      <div class="drawer_item_label">{{ t('download') }}</div>
    </div>
    <div class="drawer_item" @click="drawer().rename">
      <div class="drawer_item_icon">
        <i class="pi pi-pen-to-square"></i>
      </div>
      <div class="drawer_item_label">{{ t('rename') }}</div>
    </div>
    <div class="drawer_item" style="color: red;" @click="drawer().del">
      <div class="drawer_item_icon">
        <i class="pi pi-trash"></i>
      </div>
      <div class="drawer_item_label">{{ t('delete') }}</div>
    </div>
  </Drawer>
</template>

<script lang="ts" setup>
import Drawer from 'primevue/drawer';
import drawer from '../hooks/drawer';
import "../styles/drawer.css";

import { useI18n } from 'vue-i18n';
const { t } = useI18n();
</script>