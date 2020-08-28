<template>
  <div class="index-container">
    <!-- 搜索区域 -->
    <!-- 登录区域 -->
    <van-nav-bar class="login-nav-bar">
      <van-button slot="title" round class="search-button" icon="search" to="/search">搜索</van-button>
    </van-nav-bar>
    <!-- 输入框 -->
    <van-tabs swipeable animated v-model="active" class="channel-tabs">
      <van-tab :key="i" v-for="(channel, i) in tabsListData">
        <span slot="title">{{ channel.name }}</span>
        <!-- 通过循环为每个item项创建一个组件的实例来保存自身的数据 -->
        <artic-view :channel="channel"></artic-view>
      </van-tab>
      <div slot="nav-right" class="placeholder"></div>
      <!-- 汉堡按钮 -->
      <div slot="nav-right" class="hamburger-btn" @click="isPopupShow">
        <i class="iconfont icongengduo"></i>
      </div>
    </van-tabs>
    <!-- 弹出层位置 -->
    <popup-view
      :myChannels="tabsListData"
      :active="active"
      @remove="remove"
      @activeIndex="activeIndex"
      @updateActive="updateActive"
    ></popup-view>
  </div>
</template>

<script>
import { articleList } from "@/api/user";
import articView from "@/components/articleList.vue";
import popupView from "@/components/popup.vue";
import { getItem } from "@/tools/storage";
import { mapState } from "vuex";
export default {
  data() {
    name: "index";
    return {
      active: 0,
      //tabs栏的数据
      tabsListData: [],
      // 控制弹出层
      showPopup: true,
    };
  },
  methods: {
    isPopupShow() {
      this.$store.commit("isPopup", this.showPopup);
    },
    // 删除操作
    remove(i) {
      this.tabsListData.splice(i, 1);
    },
    // 修改active的值
    activeIndex(i) {
      this.active = i;
    },
    updateActive() {
      this.active = this.active - 1;
    },
  },

  // computed: {
  //   isPopupShow() {
  //     return this.$store.commit("isPopup", this.showPopup);
  //   },
  // },
  // 获取频道列表数据
  async created() {
    // 判断用户是否登录
    if (this.userData) {
      try {
        //用户登录
        const { data } = await articleList();
        this.tabsListData = data.data.channels;
      } catch {
        this.$toast("获取数据失,请稍后重试!");
      }
    } else {
      //用户未登录
      const localData = getItem("userChannel");
      if (localData) {
        //有本地的数据
        this.tabsListData = localData;
      } else {
        // 获取默认列表
        const { data } = await articleList();
        this.tabsListData = data.data.channels;
      }
    }
  },
  computed: {
    ...mapState(["userData"]),
  },
  components: {
    articView,
    popupView,
  },
};
</script>

<style scoped lang="less">
.index-container {
  padding-bottom: 100px;
  padding-top: 174px;
  .login-nav-bar {
    position: fixed;
    top: 0;
    width: 100%;
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
  /deep/ .channel-tabs {
    .van-tabs__wrap {
      position: fixed;
      top: 92px;
      z-index: 1;
      left: 0;
      right: 0;
      height: 82px;
    }
  }
  /deep/.van-tabs__line {
    background-color: #3d9afb !important;
    width: 31px !important;
    height: 6px;
    bottom: 8px;
  }
  /deep/.van-tab--active {
    color: blue !important;
  }
  .placeholder {
    flex-shrink: 0;
    width: 66px;
    height: 82px;
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
