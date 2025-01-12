import { defineStore } from "pinia";
import { ref, watch } from "vue";
import { getFileType, Types } from "./static";
import axios from "axios";
import hostname from "./hostname";
import store from "./store";

export default defineStore("preview", ()=>{
  let previewFile=ref<string>("");
  let previewType = ref<Types | undefined>(undefined);
  let previewUrl=ref("");
  let exit=ref<boolean>(false);

  watch(previewFile, async (newVal)=>{
    if(newVal.length==0){
      return;
    }else if(previewUrl.value){
      URL.revokeObjectURL(previewUrl.value);
    }
    const response=await axios.get(`${hostname}/api/raw?path=${store().pathResolve}${newVal}`, {
      headers: {
        token: store().token
      },
      responseType: "blob"
    })
    const mimeType = response.headers['content-type'] || 'application/octet-stream'; 
    const videoBlob = new Blob([response.data], { type: mimeType });
    previewUrl.value=URL.createObjectURL(videoBlob);
    previewType.value=getFileType(newVal);
  })

  const closePreview=()=>{
    exit.value=true;
    setTimeout(() => {
      previewFile.value="";
      exit.value=false;
      previewType.value=undefined;
    }, 200);
  }

  const download=async ()=>{
    const response = await axios.get(`${hostname}/api/download?path=${encodeURIComponent(store().pathResolve) + encodeURIComponent(previewFile.value)}`,
      {
        headers: {
          token: store().token,
        },
        responseType: 'blob',
      }
    );
    const headers = response.headers;
    
    const blobUrl = URL.createObjectURL(response.data);
    const a = document.createElement('a');
    a.href = blobUrl;
    a.download = decodeURIComponent(headers['file-name']); 
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  return {previewFile, previewType, previewUrl, closePreview, exit, download};
})