import type { FileItem } from "./store";

export function calSize(file: FileItem){
  if(file.isDir){
    return "";
  }
  if(file.size==0){
    return "0 B";
  }
  const units = ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
  const k = 1024;
  const i = Math.floor(Math.log(file.size) / Math.log(k));
  const value = (file.size / Math.pow(k, i)).toFixed(2);
  return `${value} ${units[i]}`;
}

export enum Types{
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

function extName(name: string, ...exts: string[]){
  for (const element of exts) {
    const ext=`.${element}`;
    if(name.toLowerCase().endsWith(ext)){
      return true;
    }
  }
  return false;
}


export function getFileType(name: string): Types{
  if(extName(name, 'mp3', 'flac', 'acc', 'wav', 'ogg', 'm4a')){
    return Types.Audio;
  }else if(extName(name, 'bt')){
    return Types.Bt;
  }else if(extName(name, 'html')){
    return Types.Html;
  }else if(extName(name, 'png', 'jpeg', 'jpg', 'gif', 'svg', 'webp')){
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

function getType(file: FileItem){
  if(file.isDir){
    return Types.Folder;
  }
  const name: string=file.name;
  return getFileType(name);
}

export function getAsset(file: FileItem){
  switch (getType(file)) {
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