import { defineStore } from "pinia";
import { ref } from "vue";

export default defineStore("dialogs", ()=>{
  let showMkdirDialog=ref(false);

  return {
    showMkdirDialog,
  }
})