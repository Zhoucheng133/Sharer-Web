<template>
  <Dialog v-model:visible="dialogs().showDelDialog" modal :header="t('deleteFile/Dir')" :style="{ width: '25rem' }">
    <div class="flex items-center gap-4 mb-4">
      {{ t('confirmDelete') }} {{ dialogs().selectName }}” ?
    </div>
    <div class="flex justify-end gap-2">
      <Button type="button" :label="$t('cancel')" severity="secondary" size="small" @click="cancel"></Button>
      <Button type="button" :label="$t('delete')" size="small" @click="del" severity="danger"></Button>
    </div>
  </Dialog>
</template>

<script setup lang="ts">
import { Dialog, Button, useToast } from 'primevue';
import axios from 'axios';
import hostname from '../../hooks/hostname';
import store from '../../hooks/store';
import { getList } from '../../hooks/handler';
import dialogs from '../../hooks/dialogs';
import selector from '../../hooks/selector';
import { useI18n } from 'vue-i18n';
const toast=useToast()
const { t } = useI18n();

const del=async ()=>{
  const {data: response}=await axios.post(`${hostname}/api/del`, {
    path: store().pathResolve,
    files: [dialogs().selectName],
  }, {
    headers: {
      token: store().token,
    }
  })
  if(response.ok){
    toast.add({ severity: 'success', summary: t('opOk'), detail: t('deleteOk'), life: 2000 });
    getList();
    dialogs().showDelDialog=false;
    selector().selectAll=false;
    selector().selectedFile=[];
    selector().indeterminate=false;
  }else{
    toast.add({ severity: 'error', summary: t('deleteFail'), detail: response.msg, life: 2000 });
  }
}

const cancel=()=>{
  dialogs().showDelDialog=false;
}
</script>