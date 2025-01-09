import {createRouter, createWebHistory} from "vue-router";
import Home from "../views/Home.vue";
import Login from "../views/Login.vue";

export default createRouter({
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

