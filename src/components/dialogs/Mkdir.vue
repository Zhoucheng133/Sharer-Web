<template>
  <Dialog v-model:visible="dialogs.showMkdirDialog" modal :header="t('createFolder')" :style="{ width: '25rem' }">
    <div class="flex items-center gap-4 mb-4">
      <InputText style="margin-top: 10px;" autocomplete="off" size="small" :placeholder="t('inputFolder')" v-model="name" :autofocus="true" @keyup.enter="create" />
    </div>
    <div class="flex justify-end gap-2">
      <Button type="button" :label="t('cancel')" severity="secondary" size="small" @click="cancel"></Button>
      <Button type="button" :label="t('create')" size="small" @click="create"></Button>
    </div>
  </Dialog>
</template>

<script setup lang="ts">
import { Dialog, InputText, Button, useToast } from 'primevue';
import useDialogs from '../../hooks/dialogs';
import { ref } from 'vue';
import axios from 'axios';
import hostname from '../../hooks/hostname';
import store from '../../hooks/store';
import { getList } from '../../hooks/handler';
import { useI18n } from 'vue-i18n';

const dialogs=useDialogs();
const toast=useToast();
const { t } = useI18n();

let name=ref("");

const cancel=()=>{
  dialogs.showMkdirDialog=false;
}

const create=async ()=>{
  if(name.value.length==0){
    toast.add({ severity: 'error', summary: t('createFail'), detail: t("emptyFolderName"), life: 2000 });
  }else{
    const {data: response}=await axios.post(`${hostname}/api/mkdir`, {
      path: store().pathResolve,
      name: name.value,
    }, {
      headers: {
        token: store().token,
      }
    })
    if(response.ok){
      toast.add({ severity: 'success', summary: t('mkdirSuccess'), life: 2000 });
      await getList();
      name.value="";
      dialogs.showMkdirDialog=false;
    }else{
      toast.add({ severity: 'error', summary: t('mkdirFail'), detail: response.msg, life: 2000 });
    }
  }
}

</script>