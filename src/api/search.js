import request from "@/tools/request";
// 发送搜索联想
export const searchSuggestion = (q) => {
  return request({
    method: "GET",
    url: "/app/v1_0/suggestion",
    params: {
      q,
    },
  });
};
// 获取用户的搜索历史
export const getUserHistory = () => {
  return request({
    method: "GET",
    url: "/app/v1_0/search/histories",
  });
};
// 获取搜索的结果
export const getUserResult = (q) => {
  return request({
    method: "GET",
    url: "/app/v1_0/search",
    params: q,
  });
};
