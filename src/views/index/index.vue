<template>
  <div class="index-container">
    <!-- 搜索区域 -->
    <!-- 登录区域 -->
    <van-nav-bar class="login-nav-bar">
      <van-button slot="title" round class="search-button" icon="search">搜索</van-button>
    </van-nav-bar>
    <!-- 输入框 -->
    <van-tabs v-model="active" swipeable animated>
      <van-tab :key="i" v-for="(channel,i) in tabsListData" :title="channel.name">
        <!-- 通过循环为每个item项创建一个组件的实例来保存自身的数据 -->
        <artic-view :channel="channel"></artic-view>
      </van-tab>
      <div slot="nav-right" class="placeholder"></div>
      <!-- 汉堡按钮 -->
      <div slot="nav-right" class="hamburger-btn">
        <i class="iconfont icongengduo"></i>
      </div>
    </van-tabs>
  </div>
</template>

<script>
import { articleList } from "@/api/user";
import articView from "@/components/articleList.vue";
export default {
  data() {
    name: "index";
    return {
      active: 0,
      //tabs栏的数据
      tabsListData: [],
    };
  },
  async created() {
    const { data } = await articleList();
    try {
      this.tabsListData = data.data.channels;
    } catch {
      this.$toast("获取数据失,请稍后重试!");
    }
  },
  components: {
    articView,
  },
};
</script>

<style scoped lang='less'>
.index-container {
  .login-nav-bar {
    background-color: #3d9afb;
    .search-button {
      width: 555px;
      height: 64px;
      background-color: #64acfc;
      border: unset;
      color: #fff;
      font-size: 28px;
    }
  }
  /deep/.van-nav-bar__title {
    max-width: unset !important;
  }
  .van-icon-search {
    color: #fff;
    font-size: 32px;
  }
  /deep/.van-tab {
    height: 82px;
    border-right: 1px solid #fafafa;
  }
  /deep/.van-tabs__nav--line {
    padding-bottom: 0;
  }
  /deep/.van-tabs__line {
    background-color: #3d9afb !important;
    width: 31px !important;
    height: 6px;
    bottom: 8px;
  }
  .placeholder {
    width: 66px;
    height: 82px;
    flex-shrink: 0;
  }
  .hamburger-btn {
    position: fixed;
    right: 0;
    width: 66px;
    height: 82px;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #fff;
    opacity: 0.96;
    .icongengduo {
      font-size: 40px;
    }
    &::before {
      content: "";
      position: absolute;
      left: 0;
      background-size: contain;
      width: 1px;
      height: 100%;
      background-image: url(../../assets/gradient-gray-line.png);
    }
  }
}
</style>