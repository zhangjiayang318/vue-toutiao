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
    url: "/app/v1_0/user/channels",
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
// 请求全部频道
export const getAllChannel = () => {
  return request({
    method: "GET",
    url: "/app/v1_0/channels",
  });
};
// 增加用户选择的频道
export const addUserChannel = (channel) => {
  return request({
    method: "PATCH",
    url: "/app/v1_0/user/channels",
    data: channel,
  });
};
//删除指定用户频道
export const deleteUserChannel = (channel) => {
  return request({
    method: "DELETE",
    url: "/app/v1_0/user/channels",
    data: channel,
  });
};
