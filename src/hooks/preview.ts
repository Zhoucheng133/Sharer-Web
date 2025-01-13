import { defineStore } from "pinia";
import { ref, watch } from "vue";
import { getFileType, Types } from "./static";
import hostname from "./hostname";
import store from "./store";

export default defineStore("preview", ()=>{
  let previewFile=ref<string>("");
  let previewType = ref<Types | undefined>(undefined);
  let exit=ref<boolean>(false);
  let previewUrl=ref("");

  watch(previewFile, async (newVal)=>{
    if(newVal.length==0){
      return;
    }
    previewType.value=getFileType(previewFile.value);
    previewUrl.value=`${hostname}/api/raw?path=${store().pathResolve}${previewFile.value}&token=${store().token}`;
  })

  const closePreview=()=>{
    exit.value=true;
    setTimeout(() => {
      previewFile.value="";
      exit.value=false;
      previewType.value=undefined;
      previewUrl.value="";
    }, 200);
  }

  const download=()=>{
    const link=`${hostname}/api/download?path=${store().pathResolve}${previewFile.value}&token=${store().token}`;
    window.location.href=link;
  }

  return {previewFile, previewType, previewUrl, closePreview, exit, download};
})