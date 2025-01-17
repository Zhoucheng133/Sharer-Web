import { defineStore } from "pinia";
import { ref } from "vue";

export default defineStore("dialogs", ()=>{
  let showMkdirDialog=ref(false);
  let showRenameDialog=ref(false);
  let showDelDialog=ref(false);

  let selectName=ref("");

  return {
    showMkdirDialog,
    showRenameDialog,
    selectName,
    showDelDialog
  }
})