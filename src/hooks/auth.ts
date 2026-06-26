import axios from "axios";
import hostname from "./hostname";
import store from "./store";
import { storeToRefs } from "pinia";

interface LoginResponse{
  ok: boolean,
  msg: string,
}

export async function checkAuth(): Promise<boolean>{

  const s=store();
  let { token: t } = storeToRefs(s);
  
  const token=localStorage.getItem("token");
  if(token!=null && token.length!=0){
    t.value=token;
  }

  const {data: auth}=await axios.get(`${hostname}/api/auth`);

  if(!auth.useAuth){
    return true;
  }

  if(t.value.length==0){
    return false;
  }

  if((await tokenLogin(t.value)).ok){
    return true;
  }
  return false;
}

async function tokenLogin(token: string): Promise<LoginResponse>{
  try {
    const {data: response} = await axios.get(`${hostname}/api/token`, {
      headers: {
        token: token
      }
    });
    return response;
  } catch (error: any) {
    return error.response.data;
  }
}

export async function loginHandler(username: string, password: string): Promise<LoginResponse>{
  try {
    const {data: response} = await axios.post(`${hostname}/api/login`, {
      username: username,
      password: password
    });
    console.log(response);
    
    return response;
  } catch (error: any) {
    return error.response.data;
  }
}