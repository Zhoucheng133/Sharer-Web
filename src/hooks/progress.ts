import { defineStore } from "pinia";
import { ref } from "vue";

export interface UploadItem{
  id: string, // nanoid()
  name: string,
  progress: number // 0~100
}

export default defineStore("progress", ()=>{
  let uploadList=ref<UploadItem[]>([]);

  return {
    uploadList
  }
})