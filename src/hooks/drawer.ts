import { defineStore } from "pinia";
import { ref } from "vue";
import type { FileItem } from "./store";
import { delHandler, downloadHandler, renameHandler } from "./handler";

export default defineStore("drawer", ()=>{
  let showDrawer=ref(false);
  let selectedItem=ref<FileItem>({
    name: "",
    size: 0,
    isDir: false,
    selected: false
  });

  function download(){
    downloadHandler(selectedItem.value);
    showDrawer.value=false;
  }

  function del(){
    
  }

  function rename(){
    showDrawer.value=false;
    renameHandler(selectedItem.value)
  }

  function toggleDrawer(item: FileItem){
    selectedItem.value=item;
    showDrawer.value=true;
  }

  return {
    showDrawer,
    selectedItem,
    toggleDrawer,
    download,
    del,
    rename
  }
})