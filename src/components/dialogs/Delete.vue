<template>
  <Dialog v-model:visible="dialogs().showDelDialog" modal header="删除文件(夹)" :style="{ width: '25rem' }">
    <div class="flex items-center gap-4 mb-4">
      确定要删除“{{ dialogs().selectName }}”吗
    </div>
    <div class="flex justify-end gap-2">
      <Button type="button" label="取消" severity="secondary" size="small" @click="cancel"></Button>
      <Button type="button" label="删除" size="small" @click="del" severity="danger"></Button>
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
const toast=useToast()

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
    toast.add({ severity: 'success', summary: '操作成功', detail: "已删除文件(夹)", life: 2000 });
    getList();
    dialogs().showDelDialog=false;
  }else{
    toast.add({ severity: 'error', summary: '删除失败', detail: response.msg, life: 2000 });
  }
}

const cancel=()=>{
  dialogs().showDelDialog=false;
}
</script>