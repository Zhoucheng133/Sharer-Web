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
  let showHide=ref<boolean>(true);

  const pathResolve=computed(()=>{
    let val="/";
    path.value.map((item)=>{
      val+=item;
      val+="/";
    })
    return val;
  })

  const list=computed(()=>{
    return showHide.value ? fileList.value : fileList.value.filter((item)=>!item.name.startsWith("."))
  })

  return {
    fileList,
    token,
    path,
    pathResolve,
    showHide,
    list
  };
})