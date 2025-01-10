import { defineStore } from "pinia";
import { computed, ref } from "vue";

interface FileItem{
  name: string,
  size: number,
  isDir: boolean,
  selected: boolean,
}

export default defineStore("store", ()=>{
  let fileList=ref<FileItem[]>([]);
  let token=ref<string>("");
  let path=ref<string[]>([]);
  let selectedFile=ref<FileItem[]>([]);
  let selectAll=ref<boolean>(false);

  const pathResolve=computed(()=>{
    let val="/";
    path.value.map((item)=>{
      val+=item;
      val+="/";
    })
    return val;
  })

  return {fileList, token, path, selectedFile, pathResolve, selectAll};
})