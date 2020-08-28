import Vue from "vue";
import dayjs from "dayjs";
import "dayjs/locale/zh-cn";
dayjs().format();
// 导入相对时间处理插件
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);
dayjs.locale("zh-cn"); // 使用本地化语言
// 定义全局的过滤器
Vue.filter("relativeTime", (value) => {
  return dayjs().to(dayjs(value)); // 2 年以前
});
