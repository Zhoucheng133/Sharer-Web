import type { FileItem } from "./store";
import store from "./store";
import preview from '../hooks/preview';
import selector from "./selector";
import hostname from "./hostname";
import axios from "axios";

export async function getList(){
  const {data: response}=await axios.post(`${hostname}/api/list`, {
    "path": store().pathResolve
  }, {
    headers: {
      token: store().token
    }
  });
  const list=response.ok ? response.items:[];
  store().fileList=list.map((item: any)=>{
    return {
      ...item,
      selected: false,
    }
  })
  
}

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
  selector().selectAll=false;
  selector().selectedFile=[];
  selector().indeterminate=false;
  await getList();
  store().loading=false;
}

interface MutliData{
  path: string,
  files: string[]
}

export function downloadHandler(item?: FileItem){
  if(item){
    let data=store().pathResolve+item.name;
    const link=`${hostname}/api/download?path=${encodeURIComponent(data)}&token=${store().token}`;
    window.location.href=link;
    return;
  }
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

export function delHandler(event: any, confirm: any, toast: any){
  confirm.require({
    target: event.currentTarget,
    message: '你确定要删除吗',
    icon: 'pi pi-exclamation-triangle',
    rejectProps: {
      label: '取消',
      severity: 'secondary',
      outlined: true
    },
    acceptProps: {
      label: '删除',
      severity: 'danger'
    },
    accept: async () => {
      const {data: response}=await axios.post(`${hostname}/api/del`, {
        path: store().pathResolve,
        files: selector().selectedFile.map((item)=>item.name),
      }, {
        headers: {
          token: store().token,
        }
      })
      if(response.ok){
        toast.add({ severity: 'success', summary: '操作成功', detail: "已删除文件(夹)", life: 2000 });
        selector().selectAll=false;
        selector().indeterminate=false;
        selector().selectedFile=[];
        getList();
      }else{
        toast.add({ severity: 'error', summary: '删除失败', detail: response.msg, life: 2000 });
      }
    },
  });
}