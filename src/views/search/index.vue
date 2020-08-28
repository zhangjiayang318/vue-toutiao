<template>
  <div class="search-container">
    <!-- 搜索框 -->
    <form action="/" class="form-search">
      <van-search
        @focus="onfocus"
        v-model="searchvalue"
        show-action
        background="#4fc08d"
        placeholder="请输入搜索关键词"
        @search="onSearch"
        @cancel="onCancel"
      />
    </form>
    <!-- 搜索结果 -->
    <search-result v-if="witchShow" :resultValue="searchvalue"></search-result>
    <!-- 搜索联想 -->
    <search-suggest v-else-if="searchvalue" :searchSuggestValue="searchvalue" @search="onSearch"></search-suggest>
    <!-- 搜索历史 -->
    <search-history
      v-else
      :historyData="searchHistory"
      @remove-history="deleteHandler"
      @remove="searchHistory = []"
    ></search-history>
  </div>
</template>

<script>
import searchSuggest from "./components/suggest";
import searchResult from "./components/result";
import searchHistory from "./components/history";
import { getUserHistory } from "@/api/search";
import { setItem, getItem } from "@/tools/storage";
export default {
  name: "search",
  data() {
    return {
      searchvalue: "",
      witchShow: false,
      // 联想的数据
      suggestOptions: [],
      // 搜索记录的数据
      searchHistory: [],
    };
  },
  components: {
    searchSuggest,
    searchResult,
    searchHistory,
  },
  watch: {
    // 监听保存历史数据的数组的变化
    searchHistory(val) {
      setItem("userHistory", val);
    },
  },
  methods: {
    onSearch(val) {
      this.searchvalue = val;
      //  在搜索结果显示之前把数据存入搜索记录之中,过滤重复的搜索数据(根据indexOf方法找到就返回元素所在的索引,如果找不到就返回-1)
      const index = this.searchHistory.indexOf(val);
      if (index !== -1) {
        // 说明已经存在
        this.searchHistory.splice(index, 1);
      }
      this.searchHistory.unshift(val);
      this.witchShow = true;
    },
    onCancel() {
      this.$router.back();
    },
    onfocus() {
      // 让联想框重新展示
      this.witchShow = false;
    },
    // 删除操作
    deleteHandler(index) {
      this.searchHistory.splice(index, 1);
    },
  },
  created() {
    if (getItem("userHistory")) {
      this.searchHistory = getItem("userHistory");
    } else {
      return;
    }
  },
};
</script>

<style scoped lang="less">
.form-search {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1;
  min-width: 100%;
}
.search-container {
  padding-top: 110px;
}
</style>
