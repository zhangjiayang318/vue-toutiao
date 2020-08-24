import request from "@/tools/request";
// 发送个人信息的请求
export const userInfo = () => {
  return request({
    method: "GET",
    url: "/app/v1_0/user",
  });
};
// 发送请求tabs标签信息的请求
export const articleList = () => {
  return request({
    method: "GET",
    url: "/app/v1_0/channels",
  });
};
// 请求新闻列表数据
export const newsList = (params) => {
  return request({
    method: "GET",
    url: "/app/v1_1/articles",
    params,
  });
};
