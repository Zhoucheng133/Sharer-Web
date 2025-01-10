import axios from "axios";
import hostname from "./hostname";
import { useRouter } from "vue-router";

export async function checkAuth(home: boolean){
  const router=useRouter();
  const {data: auth}=await axios.get(`${hostname}/api/auth`);
  if(auth.useAuth){
    if(home){
      router.replace("/login");
    }
  }else{
    if(!home){
      router.replace("/");
    }
  }
}