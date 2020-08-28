<template>
  <div>
    <!-- 登录区域 -->
    <van-nav-bar
      title="登录"
      class="login-nav-bar"
      left-arrow
      left-text="返回"
      @click-left="$router.back()"
    />
    <!-- 输入框 -->

    <!-- <i slot="left-icon" class="iconfont iconshouji"></i> -->
    <van-form @submit="onSubmit">
      <van-field
        v-model="user.mobile"
        placeholder="请输入手机号"
        :rules="rulesForm.mobile"
        type="number"
        name="mobie"
        maxlength="11"
        ref="moblieRef"
      >
        <i slot="left-icon" class="iconfont iconshouji"></i>
      </van-field>
      <van-field
        v-model="user.code"
        name="code"
        placeholder="请输入验证码"
        :rules="rulesForm.code"
        type="number"
        maxlength="6"
      >
        <i slot="left-icon" class="iconfont iconyanzhengma"></i>
        <!-- 短信验证码按钮 -->
        <template #button>
          <!-- 通过变量来控制button和验证码按钮的显示 -->
          <van-button
            v-if="isCutdownVisible"
            size="small"
            type="primary"
            @click="sendCode"
            native-type="button"
          >发送验证码</van-button>
          <!-- 倒计时组件 -->
          <van-count-down v-else :time="10 * 1000" format=" ss  s" @finish="isCutdownVisible=true" />
        </template>
      </van-field>
      <div style="margin: 16px;">
        <van-button round block type="info" native-type="submit">提交</van-button>
      </div>
    </van-form>
  </div>
</template>

<script>
import { login, sendMsg } from "@/api/login.js";
export default {
  data() {
    return {
      user: {
        mobile: "18251813394",
        code: "246810",
      },
      //   表单验证的规则
      rulesForm: {
        mobile: [
          { required: true, message: "验证码不能为空" },
          { pattern: /^1(3|4|5|6|7|8|9)\d{9}$/, message: "手机号格式不正确" },
        ],
        code: [
          { required: true, message: "验证码不能为空" },
          { pattern: /^\d{6}$/, message: "验证码格式不正确" },
        ],
      },
      // 控制倒计时和验证码的显示
      isCutdownVisible: true,
    };
  },
  methods: {
    async onSubmit() {
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true, //防止背景点击
        duration: 0, //持续时间
      });
      try {
        // 表单提交事件发送请求
        const { data } = await login(this.user);
        this.$toast.success("登录成功");
        this.$store.commit("setUser", data.data);
        // 登录成功跳转到首页
        this.$router.back();
      } catch (err) {
        this.$toast("登录失败,请稍后重试");
      }
    },
    // 验证手机号,发送验证码
    async sendCode() {
      try {
        const a = await this.$refs.moblieRef.validate("mobile");
        console.log(a);
      } catch (err) {
        this.$toast("验证失败!", err);
      }
      // 如果走到这里表示验证成功
      //验证成功,显示倒计时
      this.isCutdownVisible = false;
      // 发送请求接口,请求验证码
      await sendMsg(this.user.mobile);
    },
  },
};
</script>

<style lang='less' scoped>
.login-nav-bar {
  background-color: lightblue;
}
.iconfont {
  font-size: 37px !important;
}
</style>