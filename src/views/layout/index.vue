<template>
  <div class="layout-container">
    <!-- 路由入口 -->
    <router-view></router-view>
    <!-- 主路由的底部导航 -->
    <van-tabbar v-model="active" class="layout-tabbar" route>
      <van-tabbar-item to="/index">
        <i slot="icon" class="iconfont iconshouye"></i>
        <span>首页</span>
      </van-tabbar-item>
      <van-tabbar-item>
        <i slot="icon" class="iconfont iconwenda"></i>
        <span>问答</span>
      </van-tabbar-item>
      <van-tabbar-item>
        <i slot="icon" class="iconfont iconshipin"></i>
        <span>视频</span>
      </van-tabbar-item>
      <van-tabbar-item to="/my">
        <i slot="icon" class="iconfont iconwode"></i>
        <span>{{$store.state.userData ? "我的":'未登录'}}</span>
      </van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script>
export default {
  data() {
    return {
      active: 0,
    };
  },
};
</script>

<style scoped lang="less">
.layout-container {
  .layout-tabbar {
    .iconfont {
      font-size: 40px;
    }
    span {
      font-size: 20px;
    }
  }
}
</style>