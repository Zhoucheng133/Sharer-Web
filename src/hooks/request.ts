import axios from "axios";
import hostname from "./hostname";
import store from "./store";

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