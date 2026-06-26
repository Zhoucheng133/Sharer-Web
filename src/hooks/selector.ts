import { defineStore } from "pinia";
import type { FileItem } from "./store";
import { ref } from "vue";
import store from "./store";

export default defineStore("selector", ()=>{
  let selectedFile=ref<FileItem[]>([]);
  let selectAll=ref<boolean>(false);
  let indeterminate=ref<boolean>(false);

  function selectAllChange(e: any){
    if(e.target.checked){
      store().fileList=store().fileList.map((item: FileItem)=>{
        return {
          ...item,
          selected: true,
        }
      })
      selectedFile.value=store().fileList;
    }else{
      store().fileList=store().fileList.map((item: FileItem)=>{
        return {
          ...item,
          selected: false,
        }
      })
      selectedFile.value=[];
    }
  }

  function selectChange(file: FileItem){

    if(file.selected){
      selectedFile.value.push(file);
    }else{
      selectedFile.value=selectedFile.value.filter((item: FileItem)=>{
        return item.name!==file.name;
      })
    }

    if(store().fileList.every(item => item.selected == false)){
      selectAll.value=false;
      indeterminate.value=false;
    }else if(store().fileList.every(item => item.selected == true)){
      selectAll.value=true;
      indeterminate.value=false;
    }else{
      indeterminate.value=true;
    }
  }

  return {selectAll, selectedFile, selectAllChange, selectChange, indeterminate}
})