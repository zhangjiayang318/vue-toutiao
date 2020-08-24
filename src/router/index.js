import Vue from "vue";
import VueRouter from "vue-router";
import login from "../views/login";
import layout from "@/views/layout";
import my from "@/views/my";
import index from "@/views/index";
Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    component: layout,
    children: [
      { path: "/my", component: my },
      { path: "/index", component: index },
    ],
  },
  { path: "/login", component: login },
];

const router = new VueRouter({
  routes,
});

export default router;
