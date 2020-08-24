<template>
  <div>
    <!-- list列表 -->
    <van-list
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
      :error.sync="error"
      error-text="请求失败，点击重新加载"
    >
      <van-cell v-for="item in newslist" :key="item.art_id" :title="item.title" />
    </van-list>
  </div>
</template>

<script>
import { newsList } from "@/api/user";
export default {
  name: "artic",
  props: {
    channel: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      //   list列列表数据
      newslist: [],
      loading: false,
      finished: false,
      //请求下一页数据的时间戳
      timestamp: null,
      error: false,
    };
  },
  methods: {
    async onLoad() {
      /*
        1.请求数据
        2.设置loading的状态,false为继续加载下一页的数据
        3.设置时间戳,当前的时间戳可以通俗理解为当前页,timestamp可以理解为下一页
        4.根据数组的length判断是否加载结束
        */

      // 初始化或滚动到底部的时候会触发调用 onLoad
      const { data } = await newsList({
        channel_id: this.channel.id,
        timestamp: this.timestamp || Date.now(),
        with_top: 0,
      });
      try {
        // console.log(data);
        // this.newslist = data.data.results;
        this.newslist.push(...data.data.results);
      } catch {
        // this.$toast("数据获取失败,请稍后重试!");
        this.error = true;
        this.loading = false;
      }
      this.loading = false; //loading 关闭以后才能触发下一次的加载更多 表示加载结束
      if (data.data.results) {
        //  更新获取下一页的数据
        this.timestamp = data.data.pre_timestamp;
      } else {
        // 没有数据了，设置加载状态结束，不再触发上拉加载更多了
        this.finished = true;
      }
    },
  },
};
</script>

<style scoped lang='less'>
.van-list {
  margin-bottom: 100px;
}
</style>