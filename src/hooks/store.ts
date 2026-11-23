import { defineStore } from "pinia";
import { computed, ref } from "vue";

export interface FileItem{
  name: string,
  size: number,
  isDir: boolean,
  selected: boolean,
}

export type ViewMode = 'list' | 'grid';

export function resolvePath(path: string[]): string{
  let val="/";
  path.map((item)=>{
    val+=item;
    val+="/";
  })
  return val;
}

export default defineStore("store", ()=>{
  let fileList=ref<FileItem[]>([]);
  let token=ref<string>("");
  let path=ref<string[]>([]);
  let showHide=ref<boolean>(true);
  let viewMode=ref<ViewMode>(localStorage.getItem("viewMode")==='grid' ? 'grid' : 'list');

  const pathResolve=computed(()=>resolvePath(path.value))

  const list=computed(()=>{
    return showHide.value ? fileList.value : fileList.value.filter((item)=>!item.name.startsWith("."))
  })

  return {
    fileList,
    token,
    path,
    pathResolve,
    showHide,
    viewMode,
    list
  };
})