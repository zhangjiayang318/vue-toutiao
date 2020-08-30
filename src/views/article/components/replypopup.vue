<template>
  <div>
    <van-nav-bar left-text="返回" left-arrow @click-left="$router.back()">
      <span slot="title">{{currentComment.reply_count}}条回复</span>
    </van-nav-bar>
    <van-list>
      <van-cell>
        <van-image
          slot="icon"
          round
          width="30"
          height="30"
          style="margin-right: 10px;"
          src="https://img.yzcdn.cn/vant/cat.jpeg"
        />
        <span style="color: #466b9d;" slot="title">{{ currentComment.aut_name }}</span>
        <div slot="label">
          <p style="color: #363636;">{{ currentComment.content }}</p>
          <p>
            <span style="margin-right: 10px;">
              {{
              currentComment.pubdate | relativeTime
              }}
            </span>
            <van-button
              size="mini"
              type="default"
              @click="replyCommentshow = true;"
            >回复 {{ currentComment.reply_count }}</van-button>
          </p>
        </div>
        <van-icon
          :class="{ like: currentComment.is_liking }"
          slot="right-icon"
          :name="currentComment.is_liking ? 'good-job' : 'good-job-o'"
        >{{ currentComment.like_count > 0 ? currentComment.like_count : "赞" }}</van-icon>
      </van-cell>
    </van-list>
    <!-- 分割线 -->
    <van-divider>评论回复</van-divider>
    <van-list :key="i" v-for="(item,i) in commentReplyData">
      <van-cell>
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
              @click="childCommentReply(item)"
            >回复 {{ item.reply_count }}</van-button>
          </p>
        </div>
        <van-icon
          @click="islikeCommentReply(item,i)"
          :class="{ like: item.is_liking }"
          slot="right-icon"
          :name="item.is_liking ? 'good-job' : 'good-job-o'"
        >{{ item.like_count > 0 ? item.like_count : "赞" }}</van-icon>
      </van-cell>
    </van-list>
    <!-- 回复的弹层 -->
    <van-popup v-model="replyCommentshow" position="bottom" :style="{ height: '30%' }">
      <van-field
        v-model="replymessage"
        rows="2"
        label="回复:"
        type="textarea"
        maxlength="50"
        placeholder="请输入评论"
        show-word-limit
      ></van-field>
      <van-button type="info" @click="replyUserComment">发布</van-button>
    </van-popup>
    <!-- 子评论弹出框 -->
    <van-popup v-model="childCommentshow" position="bottom" :style="{ height: '20%' }">
      <van-field
        v-model="childCommentmessage"
        rows="1"
        autosize
        label="回复:"
        type="textarea"
        placeholder="请输入留言"
      ></van-field>
      <van-button type="info" @click="childCommentReplyClick">发布</van-button>
    </van-popup>
  </div>
</template>
<script>
import attitudeComment from "@/components/attitude.vue";
import {
  commentReply,
  addCommentReplyLike,
  deleteCommentReplyLike,
  addCommentContent,
} from "@/api/article";
export default {
  name: "replyComment",
  props: {
    currentComment: {
      type: Object,
      required: true,
    },
    articleId: {
      type: [Number, String, Object],
      required: true,
    },
    //评论回复的数据
    commentReplyData: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      // 回复的弹出层
      replyCommentshow: false,
      //回复内容
      replymessage: "",
      // 子评论弹出层
      childCommentshow: false,
      //子评论留言
      childCommentmessage: "",
    };
  },
  methods: {
    //对评论回复点赞
    async islikeCommentReply(comment, index) {
      console.log(1);
      try {
        if (comment.is_liking) {
          //  已点赞
          await deleteCommentReplyLike(comment.com_id);
          this.commentReplyData[index].like_count--;
          this.$toast.success("取消点赞成功!");
        } else {
          const res = await addCommentReplyLike({
            target: comment.com_id,
          });
          console.log(res);
          this.commentReplyData[index].like_count++;
          this.$toast.success("点赞成功!");
        }
        this.commentReplyData[index].is_liking = !this.commentReplyData[index]
          .is_liking;
      } catch (err) {
        console.log(11);
      }
    },
    // 回复评论
    async replyUserComment() {
      try {
        const { data } = await addCommentContent({
          target: this.currentComment.com_id,
          content: this.replymessage,
          art_id: this.articleId, //	文章id，对评论内容发表回复时，需要传递此参数，表明所属文章id。对文章进行评论，不要传此参数。
        });
        console.log(data);
        this.commentReplyData.unshift(data.data.new_obj);
        this.replyCommentshow = false;
      } catch (err) {
        this.$toast.fail("操作失败,请重试");
      }
    },
    // 子评论回复
    childCommentReply(item) {
      this.childCommentshow = true;
    },
    childCommentReplyClick() {
      //发送请求(子评论的id...)
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
/deep/ .van-icon-good-job {
  color: #ff6700;
}
.van-field {
  background-color: #f5f7f9;
  height: 300px;
}
.van-popup--bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
