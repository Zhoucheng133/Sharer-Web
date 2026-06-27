import { defineStore } from "pinia";
import { ref } from "vue";
import type { FileItem } from "./store";
import store from "./store";

interface CopyMoveFiles{
  files: Array<string>;
  type: "copy" | "move";
  path: string;
}

export default defineStore("copyMove", ()=>{
  const copyMoveFiles = ref<CopyMoveFiles | null>(null);

  function copyMoveSelector(files: FileItem[], type: "copy" | "move"){
    copyMoveFiles.value = {
      files: files.map(file=>file.name),
      type: type,
      path: store().pathResolve,
    };
  }

  function clearCopyMove() {
    copyMoveFiles.value = null;
  }

  return {
    copyMoveFiles,
    copyMoveSelector,
    clearCopyMove
  };
});