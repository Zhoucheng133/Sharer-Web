<template>
  <Dialog v-model:visible="showRenameDialog" modal :header="t('rename')" :style="{ width: '25rem' }">
    <div class="flex items-center gap-4 mb-4">
      <InputText style="margin-top: 10px;" autocomplete="off" size="small" :placeholder="t('newName')" v-model="name" :autofocus="true" />
    </div>
    <div class="flex justify-end gap-2">
      <Button type="button" :label="t('cancel')" severity="secondary" size="small" @click="cancel"></Button>
      <Button type="button" :label="t('rename')" size="small" @click="rename"></Button>
    </div>
  </Dialog>
</template>

<script lang="ts" setup>
import { Dialog, InputText, Button, useToast } from 'primevue';
import dialogs from '../../hooks/dialogs';
import { ref, watch } from 'vue';
import axios from 'axios';
import hostname from '../../hooks/hostname';
import store from '../../hooks/store';
import { getList } from '../../hooks/handler';
import { storeToRefs } from 'pinia';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const toast=useToast()

let name=ref();

let {showRenameDialog}=storeToRefs(dialogs())

watch(showRenameDialog, ()=>{
  name.value=dialogs().selectName;
})

const rename=async ()=>{
  if(name.value.length==0){
    toast.add({ severity: 'error', summary: '重命名失败', detail: "文件(夹)名不能为空", life: 2000 });
  }else if(name.value==dialogs().selectName){
    toast.add({ severity: 'error', summary: '重命名失败', detail: "文件(夹)名和原来相同", life: 2000 });
  }else{
    const {data: response}=await axios.post(`${hostname}/api/rename`, {
      path: store().pathResolve,
      newName: name.value,
      oldName: dialogs().selectName
    }, {
      headers: {
        token: store().token,
      }
    })
    if(response.ok){
      toast.add({ severity: 'success', summary: '重命名成功', detail: `已经重命名为“${name.value}”`, life: 2000 });
      await getList();
      dialogs().showRenameDialog=false;
    }else{
      toast.add({ severity: 'error', summary: '重命名失败', detail: response.msg, life: 2000 });
    }
  }
}

const cancel=()=>{
  dialogs().showRenameDialog=false;
}

</script>