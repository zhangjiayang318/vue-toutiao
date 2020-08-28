/**
 * 封装 axios 请求模块
 */
import axios from "axios";
import store from "@/store";
// import "@/store";
import jsonBig from "json-bigint";

const request = axios.create({
  baseURL: "http://ttapi.research.itcast.cn/", // 基础路径
  transformResponse: [
    function(data) {
      // Do whatever you want to transform the data
      try {
        // 如果转换成功则返回转换的数据结果
        return jsonBig.parse(data);
      } catch (err) {
        // 如果转换失败，则包装为统一数据格式并返回
        return {
          data,
        };
      }
    },
  ],
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
