import request from "@/tools/request";
// 获取新闻文章详情
export const getArticleDetail = (id) => {
  return request({
    method: "GET",
    url: `/app/v1_0/articles/${id}`,
  });
};
// 关注用户
export const followUser = (q) => {
  return request({
    method: "POST",
    url: `/app/v1_0/user/followings`,
    data: {
      target: q,
    },
  });
};
// 取消关注用户
export const unFollowUser = (q) => {
  return request({
    method: "DELETE",
    url: `/app/v1_0/user/followings/${q}`,
  });
};
// 对文章收藏
export const addCollected = (q) => {
  return request({
    method: "POST",
    url: `/app/v1_0/article/collections`,
    data: {
      target: q,
    },
  });
};
// 对文章不收藏
export const deleteCollected = (q) => {
  return request({
    method: "DELETE",
    url: `/app/v1_0/article/likings/${q}`,
  });
};
// 对文章点赞
export const addAttitude = (q) => {
  return request({
    method: "POST",
    url: `/app/v1_0/article/likings`,
    data: {
      target: q,
    },
  });
};
// 对文章取消点赞
export const deleteAttitude = (q) => {
  return request({
    method: "DELETE",
    url: `/app/v1_0/article/likings/${q}`,
  });
};
// 文章评论
export const getComment = (params) => {
  return request({
    method: "GET",
    url: `/app/v1_0/comments`,
    params,
  });
};
// 评论点赞
export const addCommentLike = (q) => {
  return request({
    method: "POST",
    url: `/app/v1_0/comment/likings`,
    data: {
      target: q,
    },
  });
};
// 取消评论点赞
export const deleteCommentLike = (q) => {
  return request({
    method: "DELETE",
    url: `/app/v1_0/comment/likings/${q}`,
  });
};
// 添加评论
export const addCommentContent = (data) => {
  return request({
    method: "POST",
    url: `/app/v1_0/comments`,
    data,
  });
};
// 回复内容
export const commentReply = (params) => {
  return request({
    method: "GET",
    url: `/app/v1_0/comments`,
    params,
  });
};
// 对评论或评论回复点赞
export const addCommentReplyLike = (data) => {
  return request({
    method: "POST",
    url: `/app/v1_0/comment/likings`,
    data,
  });
};
// 取消对评论或评论回复点赞
export const deleteCommentReplyLike = (data) => {
  return request({
    method: "DELETE",
    url: `/app/v1_0/comment/likings/${data}`,
  });
};
