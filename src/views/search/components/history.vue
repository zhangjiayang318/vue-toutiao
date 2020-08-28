<template>
  <div>
    <!-- 删除区域 -->
    <van-cell title="删除当前历史记录">
      <div class="remove">
        <span v-show="isDelete" @click="$emit('remove')">删除全部</span>
        &nbsp;&nbsp;
        <span v-show="isDelete" @click="isDelete = false">完成</span>
        &nbsp;&nbsp;
        <van-icon slot="default" name="delete" @click="isDelete = !isDelete"></van-icon>
      </div>
    </van-cell>
    <!-- 搜索历史 -->
    <van-cell :title="item" :key="index" v-for="(item, index) in historyData">
      <van-icon
        slot="default"
        name="cross"
        v-show="isDelete"
        @click="$emit('remove-history', index)"
      />
    </van-cell>
  </div>
</template>

<script>
import { getUserHistory } from "@/api/search";
export default {
  props: {
    historyData: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      // 控制删除
      isDelete: false,
    };
  },
  methods: {},
};
</script>

<style scoped lang="less"></style>
