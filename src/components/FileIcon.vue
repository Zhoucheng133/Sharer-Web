<template>
  <div>
    <img :src="getAsset()" alt="" height="25px">
  </div>
</template>

<script setup lang="ts">
const props = defineProps(["file"])

import audioIcon from "../assets/audio.svg";
import btIcon from "../assets/bt.svg";
import folerIcon from "../assets/folder.svg";
import htmlIcon from "../assets/html.svg";
import imageIcon from "../assets/image.svg";
import pdfIcon from "../assets/pdf.svg";
import pptIcon from "../assets/ppt.svg";
import txtIcon from "../assets/txt.svg";
import unkownIcon from "../assets/unkown.svg";
import videoIcon from "../assets/video.svg";
import wordIcon from "../assets/word.svg";
import xlsIcon from "../assets/xls.svg";
import zipIcon from "../assets/zip.svg";
import { getFileType, Types } from "../hooks/static";

function getAsset(){
  switch (getType()) {
    case Types.Audio:
      return audioIcon;
    case Types.Bt:
      return btIcon;
    case Types.Folder:
      return folerIcon;
    case Types.Html:
      return htmlIcon;
    case Types.Image:
      return imageIcon;
    case Types.Pdf:
      return pdfIcon;
    case Types.Ppt:
      return pptIcon;
    case Types.Txt:
      return txtIcon;
    case Types.Unkown:
      return unkownIcon;
    case Types.Video:
      return videoIcon;
    case Types.Word:
      return wordIcon;
    case Types.Xls:
      return xlsIcon;
    case Types.Zip:
      return zipIcon;
  }
}

function getType(){
  if(props.file.isDir){
    return Types.Folder;
  }
  const name: string=props.file.name;
  return getFileType(name);
}

</script>