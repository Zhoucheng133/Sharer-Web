import { defineStore } from "pinia";
import { computed, ref } from "vue";

export interface FileItem{
  name: string,
  size: number,
  isDir: boolean,
  selected: boolean,
}

export default defineStore("store", ()=>{
  let fileList=ref<FileItem[]>([]);
  let token=ref<string>("");
  let path=ref<string[]>([]);

  const pathResolve=computed(()=>{
    let val="/";
    path.value.map((item)=>{
      val+=item;
      val+="/";
    })
    return val;
  })

  return {
    fileList, 
    token, 
    path, 
    pathResolve, 
  };
})