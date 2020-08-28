import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "../src/assets/icon/iconfont.css";
import "amfe-flexible";
// 引入全局的样式
import "../src/styles/global.less";
// 引入vant
import Vant from "vant";
import "vant/lib/index.css";
import "./tools/dayjs.js";

Vue.use(Vant);

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
