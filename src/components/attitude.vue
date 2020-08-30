<template>
  <van-icon
    color="#777"
    :name="value!==-1 ? 'good-job':'good-job-o'"
    :class="{like:value!==-1}"
    @click="onattitude"
  />
</template>

<script>
import { addAttitude, deleteAttitude } from "@/api/article";
export default {
  props: {
    value: {
      type: Number,
      required: true,
    },
    attitudeArticleId: {
      type: [Number, Object, String],
      required: true,
    },
  },
  data() {
    return {};
  },
  methods: {
    async onattitude() {
      if (this.value === -1) {
        // 未点赞,即将点赞
        await addAttitude(this.attitudeArticleId);
        this.$toast("点赞成功!");
        this.$emit("input", 1);
      } else {
        await deleteAttitude(this.attitudeArticleId);
        this.$toast("已取消点赞!");
        this.$emit("input", -1);
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
  color: green !important;
}
</style>
