import type { FileItem } from "./store";

export const uploadButtons=[
  {
    label: '上传文件夹',
    command: () => {
      // TODO 上传文件夹
    }
  },
];

export function calSize(file: FileItem){
  if(file.isDir){
    return "";
  }
  if(file.size==0){
    return "0 Bytes"
  }
  const units = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
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