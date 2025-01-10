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

function extName(name: string, ...exts: string[]){
  for (const element of exts) {
    const ext=`.${element}`;
    if(name.endsWith(ext)){
      return true;
    }
  }
  return false;
}

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
  if(extName(name, 'mp3', 'flac', 'acc', 'wav', 'ogg', 'm4a')){
    return Types.Audio;
  }else if(extName(name, 'bt')){
    return Types.Bt;
  }else if(extName(name, 'html')){
    return Types.Html;
  }else if(extName(name, 'png', 'jpeg', 'jpg', 'gif', 'svg')){
    return Types.Image;
  }else if(extName(name, 'pdf')){
    return Types.Pdf;
  }else if(extName(name, 'ppt', 'pptx')){
    return Types.Ppt;
  }else if(extName(name, 'txt', 'c', 'cpp', 'java', 'dart', 'vue', 'css', 'js', 'ts', 'go', 'json', 'md', 'php', 'swift', 'py', 'ruby', 'cs', 'sql')){
    return Types.Txt;
  }else if(extName(name, 'mp4', 'mkv', 'mov', 'rmvb', 'avi')){
    return Types.Video;
  }else if(extName(name, 'doc', 'docx')){
    return Types.Word;
  }else if(extName(name, 'xls', 'xlsx')){
    return Types.Xls;
  }else if(extName(name, 'zip', 'rar', '7z', 'tar', 'gz')){
    return Types.Zip;
  }
  return Types.Unkown;
}

enum Types{
  Audio,
  Bt,
  Folder,
  Html,
  Image,
  Pdf,
  Ppt,
  Txt,
  Unkown,
  Video,
  Word,
  Xls,
  Zip,
}

</script>