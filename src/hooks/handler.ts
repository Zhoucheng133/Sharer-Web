import { getList } from "./request";
import type { FileItem } from "./store";
import store from "./store";
import preview from '../hooks/preview';
import selector from "./selector";

export async function clickHanlder(item: FileItem){
  if(item.isDir){
    store().loading=true;
    store().path.push(item.name);
    await getList();
    store().loading=false;
    selector().selectedFile=[];
    selector().indeterminate=false;
    selector().selectAll=false;
  }else{
    preview().previewFile=item.name;
  }
}

export async function pathHandler(index?: number){
  store().loading=true;
  if(index==undefined){
    store().path=[];
    
  }else{
    store().path.splice(index+1);
  }
  await getList();
  store().loading=false;
}