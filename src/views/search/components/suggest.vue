<template>
  <div>
    <van-cell
      icon="search"
      :key="i"
      v-for="(item, i) in searchSuggest"
      @click="$emit('search', item)"
    >
      <div v-html="(highLight(item,searchSuggestValue))"></div>
    </van-cell>
  </div>
</template>

<script>
import { searchSuggestion } from "../../../api/search";
import { debounce } from "lodash";
export default {
  name: "suggest",
  props: {
    searchSuggestValue: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      searchSuggest: [],
      // 关键字高亮
    };
  },
  watch: {
    searchSuggestValue: {
      handler: debounce(function (value) {
        this.suggestInfo(value);
      }, 200),
      immediate: true, //还函数会在监听之后立即被调用
    },
  },
  methods: {
    async suggestInfo(val) {
      console.log(val);
      if (!val) {
        return;
      }
      try {
        //  监听输入框的内容发生变化
        const { data } = await searchSuggestion(val);
        this.searchSuggest = data.data.options;
      } catch (err) {
        this.$toast("发生错误,请稍后重试!");
      }
    },
    // 处理高亮显示
    highLight(item1, item2) {
      const reg = RegExp(this.searchSuggestValue, "gi");
      return item1.replace(reg, `<span style='color:red'>${item2}</span>`);
    },
  },
};
</script>

<style scoped lang="less"></style>
