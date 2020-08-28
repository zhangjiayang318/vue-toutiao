<template>
  <div>
    <!--下拉刷新 -->
    <van-pull-refresh
      v-model="isLoading"
      @refresh="onRefresh"
      :success-text="successText"
      success-duration="1500"
    >
      <!-- list列表 -->
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
        :error.sync="error"
        error-text="请求失败，点击重新加载"
      >
        <van-cell
          v-for="(item, i) in newslist"
          :key="i"
          :title="item.title"
          class="newslist"
          is-link
          :to="{
            name: 'article',
            params: {
              articleId: item.art_id,
            },
          }"
        >
          <!-- 插槽 -->
          <div class="van-multi-ellipsis--l2" slot="title">
            {{ item.title }}
          </div>
          <div slot="label" v-if="item.cover.type === 3">
            <van-image
              class="cover-img"
              fit="cover"
              src="https://img.yzcdn.cn/vant/cat.jpeg"
            />
            <van-image
              class="cover-img"
              fit="cover"
              src="https://img.yzcdn.cn/vant/cat.jpeg"
            />
            <van-image
              class="cover-img"
              fit="cover"
              src="https://img.yzcdn.cn/vant/cat.jpeg"
            />
          </div>
          <span class="aut_name" slot="label">{{ item.aut_name }}</span>
          <span class="count" slot="label">评论</span>
          <span class="pubdate" slot="label">{{
            item.pubdate | relativeTime
          }}</span>
          <!-- 封面区域 -->
          <div slot="default" class="cover-item" v-if="item.cover.type === 1">
            <van-image
              class="cover-img"
              fit="cover"
              src="https://img.yzcdn.cn/vant/cat.jpeg"
            />
          </div>
        </van-cell>
      </van-list>
    </van-pull-refresh>
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
      isLoading: false,
      successText: "",
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
    // 刷新时触发的事件
    async onRefresh() {
      // 发送请求,更新最新的数据
      const { data } = await newsList({
        channel_id: this.channel.id,
        timestamp: Date.now(), //更新最近的数据
        with_top: 0,
      });
      try {
        this.newslist.unshift(...data.data.results);
        this.successText = `刷新成功!更新了${data.data.results.length}条数据`;
        this.isLoading = false;
      } catch (err) {
        this.successText = "更新失败,请稍后重试!";
      }
    },
  },
};
</script>

<style scoped lang="less">
.van-list {
  margin-bottom: 100px;
}
.cover-img {
  width: 180px;
}
.van-cell__value {
  flex: unset;
  width: 232px;
  height: 146px;
}
.newslist {
  span.count {
    margin-left: 20px;
  }
  span.pubdate {
    margin-left: 20px;
  }
  .cover-img {
    &:nth-child(2) {
      margin-left: 20px;
    }
    &:nth-child(3) {
      margin-left: 20px;
    }
  }
  /deep/ .van-image__img {
    width: 160px !important;
    height: 160px !important;
  }
}
</style>
