import { defineStore } from "pinia";
import { ref } from "vue";
import type { FileItem } from "./store";

export default defineStore("drawer", ()=>{
  let showDrawer=ref(false);
  let selectedItem=ref<FileItem>();

  function toggleDrawer(item: FileItem){
    selectedItem.value=item;
    showDrawer.value=true;
  }

  return {showDrawer, selectedItem, toggleDrawer}
})