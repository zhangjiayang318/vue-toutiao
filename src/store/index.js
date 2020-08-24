import Vue from "vue";
import Vuex from "vuex";
import { getItem, setItem } from "@/tools/storage.js";

Vue.use(Vuex);
export default new Vuex.Store({
  state: {
    // 一个对象,保存当前登录的用户信息(token数据)
    userData: getItem("token"),
  },
  mutations: {
    setUser(state, data) {
      state.userData = data;
      setItem("token", state.userData);
    },
  },
  actions: {},
  modules: {},
});
