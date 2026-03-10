import axios from "axios";
import hostname from "./hostname";
import store from "./store";

interface LoginResponse{
  ok: boolean,
  msg: string,
}

export async function checkAuth(): Promise<boolean>{
  
  const token=localStorage.getItem("token");
  if(token!=null && token.length!=0){
    store().token=token;
  }

  const {data: auth}=await axios.get(`${hostname}/api/auth`);

  if(!auth.useAuth){
    return true;
  }

  if(store().token.length==0){
    return false;
  }

  if((await tokenLogin(store().token)).ok){
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