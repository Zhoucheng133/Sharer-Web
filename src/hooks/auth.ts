import axios from "axios";
import hostname from "./hostname";
import { useRouter } from "vue-router";
import store from "./store";

interface LoginResponse{
  ok: boolean,
  msg: string,
}

export async function checkAuth(home: boolean): Promise<boolean>{
  
  const token=localStorage.getItem("token");
  if(token!=null && token.length!=0){
    store().token=token;
  }

  const router=useRouter();
  const {data: auth}=await axios.get(`${hostname}/api/auth`);

  if(!auth.useAuth){
    if(!home){
      router.replace("/");
    } 
    return true;
  }

  if(store().token.length==0){
    if(home){
      router.replace("/login");
    }
    return false;
  }

  if((await tokenLogin(store().token)).ok){
    if(!home){
      router.replace("/");
    }
    return true;
  }

  if(home){
    router.replace("/login");
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