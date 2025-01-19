import type { FileItem } from "./store";
import store from "./store";
import preview from '../hooks/preview';
import selector from "./selector";
import hostname from "./hostname";
import axios from "axios";
import dialogs from "./dialogs";
import { nanoid } from "nanoid";
import progress from "./progress";

export async function getList(){
  const {data: response}=await axios.post(`${hostname}/api/list`, {
    "path": store().pathResolve
  }, {
    headers: {
      token: store().token
    }
  });
  const list=response.ok ? (response.items ==null ? []: response.items) : [];
  
  store().fileList=list.map((item: any)=>{
    return {
      ...item,
      selected: false,
    }
  })
  
}

export async function clickHanlder(item: FileItem){
  if(item.isDir){
    store().path.push(item.name);
    await getList();
    selector().selectedFile=[];
    selector().indeterminate=false;
    selector().selectAll=false;
  }else{
    preview().previewFile=item.name;
  }
}

export async function pathHandler(index?: number){
  if(index==undefined){
    store().path=[];
  }else{
    store().path.splice(index+1);
  }
  selector().selectAll=false;
  selector().selectedFile=[];
  selector().indeterminate=false;
  await getList();
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

export function delHandler(item: FileItem){
  dialogs().selectName=item.name;
  dialogs().showDelDialog=true;
}

export function menuDelHandler(event: any, confirm: any, toast: any, item?: FileItem){
  if(!item && selector().selectedFile.length==0){
    return;
  }
  let files= item ? [item.name] : selector().selectedFile.map((item)=>item.name);
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
        files: files,
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

function uploadHandler(fileUploader: any){
  fileUploader.click();
}

export function uploadFiles(files: FileList, toast: any) {
  const formData = new FormData();
  for (const file of files) {
    formData.append('files', file);
  }
  const id=nanoid();
  if(progress().panelHeight==50){
    progress().togglePanel();
  }
  
  axios.post(`${hostname}/api/upload`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      token: store().token,
    },
    params: {
      path: encodeURIComponent(store().pathResolve),
    },
    onUploadProgress: (progressEvent: any) => {
      let index=progress().uploadList.findIndex((item)=>item.id==id);
      const count=files.length;
      if(index==-1){
        let totalSize = 0;
        for (const file of files) {
            totalSize += file.size;
        }
        progress().uploadList.push({
          id: id,
          name: count==1 ? files[0].name : `${files[0].name}等文件`,
          progress: Math.round((progressEvent.loaded * 100) / progressEvent.total),
          size: totalSize
        })
      }else{
        progress().uploadList[index]={
          ...progress().uploadList[index],
          progress: Math.round((progressEvent.loaded * 100) / progressEvent.total)
        }
      }
    },
  })
  .then(_ => {
    toast.add({ severity: 'success', summary: '上传成功', detail: '已上传所有文件', life: 2000 });
    getList();
  })
  .catch(error => {
    toast.add({ severity: 'error', summary: '上传失败', detail: error, life: 2000 });
  });
}

export function uploadFolderHandler(toast: any){
  toast.add({ severity: 'info', summary: '未完成的功能', detail: 'TODO', life: 2000 });
}

export function renameHandler(file: FileItem){
  dialogs().selectName=file.name;
  dialogs().showRenameDialog=true;
}

export function mkdirHandler(){
  dialogs().showMkdirDialog=true;
}

export const addItems=(toast: any, fileUploader: any)=>{
  return [
    {
      label: '添加',
      items: [
        {
          label: '上传文件',
          icon: 'pi pi-file',
          command: ()=>uploadHandler(fileUploader)
        },
        {
          label: '上传文件夹',
          icon: 'pi pi-folder',
          command: ()=>uploadFolderHandler(toast)
        },
        {
          label: '新建文件夹',
          icon: 'pi pi-folder-plus',
          command: ()=>mkdirHandler()
        }
      ]
    }
  ]
}

export async function refresh(toast: any){
  await getList();
  toast.add({ severity: 'success', summary: '刷新成功', detail: '已重新加载文件列表', life: 2000 });
}