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

interface MutliData{
  path: string,
  files: string[]
}

export function downloadHandler(){
  if(selector().selectedFile.length==1){
    let data=store().pathResolve+selector().selectedFile[0].name;
    const link=`${hostname}/api/download?path=${encodeURIComponent(data)}&token=${store().token}`;
    window.location.href=link;
  }else{
    let data: MutliData={
      path: store().pathResolve,
      files: selector().selectedFile.map((item)=>item.name)
    }
    const link=`${hostname}/api/multidownload?data=${encodeURIComponent(JSON.stringify(data))}&token=${store().token}`;
    window.location.href=link;
  }
}