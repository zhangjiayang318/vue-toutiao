<template>
  <van-icon
    color="#777"
    :name="value ? 'star':'star-o'"
    :class="{like:value}"
    @click="oncollected"
  />
</template>
<script>
import { addCollected, deleteCollected } from "@/api/article";
export default {
  props: {
    value: {
      type: Boolean,
      required: true,
    },
    collectedArticleId: {
      type: [Number, String, Object],
      required: true,
    },
  },
  data() {
    return {};
  },
  methods: {
    async oncollected() {
      try {
        if (this.value) {
          //已点赞,取消点赞
          await deleteCollected(this.collectedArticleId);
          this.$toast("已取消收藏!");
        } else {
          //未点赞
          // 发送请求
          const res = await addCollected(this.collectedArticleId);
          console.log(res);
          this.$toast("收藏成功!");
        }
        this.$emit("input", !this.value);
      } catch (err) {
        this.$toast("发生错误,请稍后重试!");
      }
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
.like {
  color: #ff6700 !important;
}
</style>
