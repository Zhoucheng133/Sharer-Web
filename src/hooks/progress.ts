import { defineStore } from "pinia";
import { ref } from "vue";

export interface UploadItem{
  name: string,
  progress: number
}

export default defineStore("progress", ()=>{
  let uploadList=ref<UploadItem[]>([]);

  return {
    uploadList
  }
})