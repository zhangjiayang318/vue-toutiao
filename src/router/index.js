import Vue from "vue";
import VueRouter from "vue-router";
import login from "../views/login";
import layout from "@/views/layout";
import my from "@/views/my";
import index from "@/views/index";
import search from "@/views/search";
Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    redirect: "/index",
    component: layout,
    children: [
      { path: "/my", component: my },
      { path: "/index", component: index },
    ],
  },
  { path: "/login", component: login },
  {
    path: "/search",
    component: search,
  },
  {
    path: "/article/:articleId",
    name: "article",
    component: () => import("@/views/article"),
    // 使用props属性进行解耦,把当前的路由参数映射到组件的props属性中
    props: true,
  },
];

const router = new VueRouter({
  routes,
});

export default router;
