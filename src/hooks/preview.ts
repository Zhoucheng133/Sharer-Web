import { defineStore } from "pinia";
import { ref } from "vue";

export default defineStore("preview", ()=>{
  let previewFile=ref<string>("");

  return {previewFile};
})