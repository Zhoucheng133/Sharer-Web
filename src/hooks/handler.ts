import { getList } from "./request";
import type { FileItem } from "./store";
import store from "./store";
import preview from '../hooks/preview';
import selector from "./selector";
import hostname from "./hostname";

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

export function downloadHandler(){
  if(selector().selectedFile.length==1){
    const link=`${hostname}/api/download?path=${store().pathResolve}${selector().selectedFile[0].name}&token=${store().token}`;
    window.location.href=link;
  }
}