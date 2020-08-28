<template>
  <div>
    <van-list
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
    >
      <van-cell
        :title="item.title"
        icon="search"
        :key="i"
        v-for="(item, i) in resultData"
      />
    </van-list>
  </div>
</template>

<script>
import { getUserResult } from "@/api/search";
export default {
  props: {
    resultValue: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      // 搜索结果的数据
      resultData: [],
      // list的数据
      list: [],
      loading: false,
      finished: false,
      // 请求参数
      page: 1,
      perPage: 20,
    };
  },
  methods: {
    async onLoad() {
      // 异步更新数据
      try {
        const { data } = await getUserResult({
          page: this.page,
          per_page: this.perPage,
          q: this.resultValue,
        });
        console.log(data);
        this.resultData.push(...data.data.results);
      } catch (err) {
        console.log("错误");
      }
      // 加载状态结束
      this.loading = false;
      if (this.resultData.length) {
        this.page++;
      } else {
        // 数据全部加载完成
        this.finished = true;
      }
    },
  },
  created() {},
};
</script>

<style scoped lang="less"></style>
