import request from "../tools/request.js";
// 登录请求
export const login = (data) => {
  return request({
    method: "post",
    url: "/app/v1_0/authorizations",
    data,
  });
};
// 获取验证码请求
export const sendMsg = (mobile) => {
  return request({
    method: "GET",
    url: `/app/v1_0/sms/codes/${mobile}`,
  });
};
