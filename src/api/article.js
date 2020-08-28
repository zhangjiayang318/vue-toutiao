import request from "@/tools/request";
// 获取新闻文章详情
export const getArticleDetail = (id) => {
  return request({
    method: "GET",
    url: `/app/v1_0/articles/${id}`,
  });
};
