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