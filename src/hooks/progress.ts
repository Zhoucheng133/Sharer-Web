import { defineStore } from "pinia";
import { ref } from "vue";

export interface UploadItem{
  id: string, // nanoid()
  name: string,
  progress: number // 0~100
  size: number
}

export default defineStore("progress", ()=>{
  let uploadList=ref<UploadItem[]>([]);
  let panelHeight=ref(50);

  const togglePanel=()=>{
    if(panelHeight.value==50){
      panelHeight.value=400;
    }else{
      panelHeight.value=50;
    }
  }

  return {
    uploadList,
    togglePanel,
    panelHeight
  }
})