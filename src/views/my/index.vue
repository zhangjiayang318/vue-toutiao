<template>
  <div class="login-container">
    <!--已登录 -->
    <div v-if="userData" class="logined-top header">
      <div class="userinfo">
        <div class="avatar">
          <van-image class="avatar-img" :src="userInfoData.photo" round fit="cover" />
          <div class="nickname">{{userInfoData.name}}</div>
        </div>
        <div class="editinfo">
          <van-button round size="mini">编辑资料</van-button>
        </div>
      </div>
      <!--用户数据 -->
      <div class="user-data">
        <div class="user-item">
          <div class="user-count">{{userInfoData.art_count}}</div>
          <div class="user-text">头条</div>
        </div>
        <div class="user-item">
          <div class="user-count">{{userInfoData.follow_count}}</div>
          <div class="user-text">关注</div>
        </div>
        <div class="user-item">
          <div class="user-count">{{userInfoData.fans_count}}</div>
          <div class="user-text">粉丝</div>
        </div>
        <div class="user-item">
          <div class="user-count">{{userInfoData.like_count}}</div>
          <div class="user-text">获赞</div>
        </div>
      </div>
    </div>
    <!-- 未登录页顶部 -->
    <div v-else class="header not-login-top" @click="$router.push('/login')">
      <div class="login-logo">
        <img src="~@/assets/mobile.png" alt />
      </div>
      <span>登录 / 注册</span>
    </div>

    <!-- 空格区域 -->
    <van-grid :column-num="2" class="grid-nav" clickable>
      <van-grid-item class="grid-item">
        <span slot="icon" class="iconfont iconshoucang"></span>
        <span slot="text" class="text">收藏</span>
      </van-grid-item>
      <van-grid-item class="grid-item">
        <span slot="icon" class="iconfont iconlishi"></span>
        <span slot="text" class="text">历史</span>
      </van-grid-item>
    </van-grid>
    <!-- 消息通知,小智同学 -->
    <div class="message">
      <van-cell is-link>
        <!-- 使用 title 插槽来自定义标题 -->
        <template #title>
          <span class="custom-title">消息通知</span>
        </template>
      </van-cell>
      <van-cell is-link>
        <!-- 使用 title 插槽来自定义标题 -->
        <template #title>
          <span class="custom-title">小智同学</span>
        </template>
      </van-cell>
    </div>
    <van-button v-if="userData" class="backlogin" block @click="onlogout">退出登录</van-button>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { userInfo } from "@/api/user.js";
export default {
  data() {
    return {
      userInfoData: {},
    };
  },
  methods: {
    onlogout() {
      this.$dialog
        .confirm({
          title: "确认退出?",
        })
        .then(() => {
          // on confirm
          //   清除vuex里面的userdata数据,试图会跟随变化,因为本地的存储是根据setUser这个函数的,因此不需要额外清除
          this.$store.commit("setUser", null);
        })
        .catch(() => {
          // on cancel
        });
    },
  },
  computed: {
    //   把vuex里面的数据映射到这个,供本页面来使用
    ...mapState(["userData"]),
  },
  async created() {
    //   发起个人信息的请求
    const { data: res } = await userInfo();
    try {
      this.userInfoData = res.data;
      console.log(res.data);
    } catch {
      this.$toast("登录失败,请稍后再试!");
    }
  },
};
</script>

<style scoped lang='less'>
.login-container {
  .not-login-top {
    height: 361px;
    background: url(../../assets/banner.png);
    background-size: cover;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    .login-logo {
      img {
        width: 132px;
      }
      margin-bottom: 20px;
    }
    span {
      color: #fff;
      font-size: 28px;
    }
  }
}
.logined-top {
  background: url(../../assets/banner.png);
  background-size: cover;
  .userinfo {
    padding: 76px 32px 23px;
    height: 231px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-sizing: border-box;
    .avatar {
      display: flex;
      align-items: center;
    }
  }
  .avatar-img {
    width: 132px;
    height: 132px;
    border: 4px solid #fff;
  }
  .nickname {
    margin-left: 23px;
    font-size: 30px;
    color: #fff;
  }
  .user-data {
    display: flex;
    .user-item {
      height: 130px;
      flex: 1;
      display: flex;
      justify-content: center;
      flex-direction: column;
      align-items: center;
      .user-count {
        color: #fff;
        font-size: 36px;
      }
      .user-text {
        color: #fff;
        font-size: 23px;
      }
    }
  }
}
.grid-nav {
  .grid-item {
    height: 141px;
    .iconshoucang {
      font-size: 45px;
      color: #eb5253;
    }
    .text {
      font-size: 28px;
    }
    .iconlishi {
      font-size: 45px;
      color: #ff9d1d;
    }
  }
}
.message {
  margin-top: 10px;
}
.backlogin {
  margin-top: 15px;
  color: red;
}
</style>