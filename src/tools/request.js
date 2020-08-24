/**
 * 封装 axios 请求模块
 */
import axios from "axios";
import store from "@/store";
// import "@/store";

const request = axios.create({
  baseURL: "http://ttapi.research.itcast.cn/", // 基础路径
});
// 封装每次发请求的时候需要请求头的问题
request.interceptors.request.use((config) => {
  // 判断是否有token
  const { userData } = store.state;
  if (userData && userData.token) {
    config.headers.Authorization = `Bearer ${userData.token}`;
  }
  return config;
});

export default request;
