import {createRouter, createWebHistory} from "vue-router";
import Home from "../views/Home.vue";
import Login from "../views/Login.vue";
import { checkAuth } from "../hooks/auth.ts";

const router=createRouter({
  history: createWebHistory(),
  routes: [
    {
      name: "主页",
      path: "/",
      component: Home
    },
    {
      name: "登录",
      path: "/login",
      component: Login
    },
  ]
})

router.beforeEach(async (to) => {
  const ok=await checkAuth();
  if (!ok) {
    if (to.path !== "/login") {
      return "/login";
    }
    return true;
  }
  if (ok && to.path === "/login") {
    return "/";
  }
  return true;
})

export default router;