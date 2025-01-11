import { getList } from "./request";
import type { FileItem } from "./store";
import store from "./store";

export async function clickHanlder(item: FileItem){
  if(item.isDir){
    store().loading=true;
    store().path.push(item.name);
    await getList();
    store().loading=false;
  }
}