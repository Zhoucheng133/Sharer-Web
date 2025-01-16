<template>
  <Dialog v-model:visible="dialogs.showMkdirDialog" modal header="新建文件夹" :style="{ width: '25rem' }">
    <div class="flex items-center gap-4 mb-4">
      <InputText style="margin-top: 10px;" autocomplete="off" size="small" placeholder="输入文件夹名称" v-model="name" />
    </div>
    <div class="flex justify-end gap-2">
      <Button type="button" label="取消" severity="secondary" size="small" @click="cancel"></Button>
      <Button type="button" label="创建" size="small" @click="create"></Button>
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
const dialogs=useDialogs();
const toast=useToast()

let name=ref("");

const cancel=()=>{
  dialogs.showMkdirDialog=false;
}

const create=async ()=>{
  if(name.value.length==0){
    toast.add({ severity: 'error', summary: '创建失败', detail: "文件夹名称不能为空", life: 2000 });
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
      toast.add({ severity: 'success', summary: '创建成功', detail: `已创建文件夹“${name.value}”`, life: 2000 });
      await getList();
      dialogs.showMkdirDialog=false;
    }else{
      toast.add({ severity: 'error', summary: '创建失败', detail: response.msg, life: 2000 });
    }
  }
}

</script>