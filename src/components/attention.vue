<template>
  <van-button
    v-if="value"
    class="follow-btn"
    type="info"
    color="#ff6700"
    round
    size="small"
    :loading="FollowLoading"
    @click="follow"
  >已关注</van-button>
  <van-button
    v-else
    class="follow-btn"
    type="info"
    color="#3296fa"
    round
    size="small"
    icon="plus"
    :loading="FollowLoading"
    @click="follow"
  >关注</van-button>
</template>

<script>
import { followUser, unFollowUser } from "@/api/article";
export default {
  props: {
    value: {
      type: Boolean,
      required: true,
    },
    userId: {
      type: [Number, String, Object],
      required: true,
    },
  },
  data() {
    return {
      FollowLoading: false,
    };
  },
  methods: {
    // 关注用户
    async follow() {
      this.FollowLoading = true;
      try {
        if (this.value) {
          // 已关注,取消关注
          await unFollowUser(this.userId);
          this.$toast("取消关注成功!");
        } else {
          // 未关注,添加关注
          await followUser(this.userId);
          this.$toast("关注成功!");
        }
        this.$emit("input", !this.value);
      } catch (err) {
        const message = "关注失败!";
        if (err.response && err.response.status === 400) {
          this.$toast("你不能关注你自己!");
        }
        this.$toast(message);
      }
      this.FollowLoading = false;
    },
  },
  watch: {},
  computed: {},
  created() {},
  mounted() {},
  components: {},
};
</script>

<style scoped lang="less">
</style>
