<template>
  <div class="article-comments">
    <!-- 评论列表 -->
    <van-list :finished="finished" finished-text="没有更多了" @load="onLoad">
      <van-cell v-for="(item, i) in list" :key="i">
        <van-image
          slot="icon"
          round
          width="30"
          height="30"
          style="margin-right: 10px;"
          src="https://img.yzcdn.cn/vant/cat.jpeg"
        />
        <span style="color: #466b9d;" slot="title">{{ item.aut_name }}</span>
        <div slot="label">
          <p style="color: #363636;">{{ item.content }}</p>
          <p>
            <span style="margin-right: 10px;">
              {{
              item.pubdate | relativeTime
              }}
            </span>
            <van-button
              size="mini"
              type="default"
              @click="$emit('reply-click',item)"
            >回复 {{ item.reply_count }}</van-button>
          </p>
        </div>
        <van-icon
          :class="{ like: item.is_liking }"
          @click="onlike(item, i)"
          slot="right-icon"
          :name="item.is_liking ? 'good-job' : 'good-job-o'"
        >{{ item.like_count > 0 ? item.like_count : "赞" }}</van-icon>
      </van-cell>
    </van-list>
    <!-- 评论列表 -->

    <!-- 发布评论 -->
    <van-cell-group class="publish-wrap">
      <van-field clearable placeholder="请输入评论内容" v-model="message">
        <van-button slot="button" size="mini" type="info" @click="submitComment">发布</van-button>
      </van-field>
    </van-cell-group>
    <!-- /发布评论 -->
  </div>
</template>

<script>
import { getComment, addCommentLike, deleteCommentLike } from "@/api/article";
import { addCommentContent } from "@/api/article";
export default {
  name: "comment",
  props: {
    source: {
      type: [Number, String, Object],
      required: true,
    },
    list: {
      type: Array,
      default: () => {
        return [];
      },
    },
  },
  data() {
    return {
      // list: [],
      loading: false,
      finished: false,
      offset: null, //下次请求的文章的id
      message: "",
    };
  },
  methods: {
    async onLoad() {
      // 异步更新数据
      try {
        // 1.发送请求
        const { data } = await getComment({
          type: "a",
          source: this.source.toString(), //源id，文章id或评论id
          offset: this.offset, //获取评论数据的偏移量，值为评论id，表示从此id的数据向后取，不传表示从第一页开始读取数据
          limit: 10, //获取的评论数据个数，不传表示采用后端服务设定的默认每页数据量
        });
        console.log(data);
        this.offset = data.data.last_id;
        this.$emit("commentCount", data.data.total_count);
        this.list.push(...data.data.results);
        this.loading = false;
        if (!data.data.results.length) {
          this.finished = true;
        }
      } catch (err) {
        this.$toast("加载失败,请重试!");
        this.loading = true;
      }
    },
    // 点赞功能
    async onlike(item, index) {
      try {
        if (item.is_liking) {
          //已点赞取消点赞
          await deleteCommentLike(item.com_id);
          //更新试图
          this.list[index].like_count--;
          this.$toast("取消点赞成功!");
        } else {
          // 未点赞
          await addCommentLike(item.com_id);
          this.list[index].like_count++;
          this.$toast("点赞成功!");
        }
        this.list[index].is_liking = !this.list[index].is_liking;
      } catch (err) {
        this.$toast("操作失败,请重试!");
      }
    },
    // 发表评论
    async submitComment() {
      // 非空校验
      if (!this.message) {
        this.$toast.fail("内容不能为空!");
        return;
      }
      //   持续展示发布中
      this.$toast.loading({
        duration: 0, // 持续展示 toast
        message: "发布中...",
        forbidClick: true, // 是否禁止背景点击
      });
      try {
        // 点击发布按钮的时候发表评论
        const { data } = await addCommentContent({
          target: this.source, //评论的目标id（评论文章即为文章id，对评论进行回复则为评论id）
          content: this.message,
          //    art_id, //文章id，对评论内容发表回复时，需要传递此参数，表明所属文章id。对文章进行评论，不要传此参数。
        });
        this.$toast.success("发表成功");
        this.$emit("input", false);
        this.list.unshift(data.data.new_obj);
        this.message = "";
        // 渲染到页面中
      } catch (err) {
        this.$toast.fail("发表失败,请重试!");
      }
    },
  },
  watch: {},
  computed: {},
  created() {
    this.onLoad();
  },
  mounted() {},
  components: {},
};
</script>

<style scoped lang="less">
.like {
  color: #ff6700 !important;
}
</style>
