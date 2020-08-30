<template>
  <div class="article-container">
    <!-- 导航栏 -->
    <van-nav-bar class="page-nav-bar" left-arrow title="黑马头条" @click-left="$router.back()"></van-nav-bar>
    <!-- /导航栏 -->

    <div class="main-wrap">
      <!-- 加载中 -->
      <div class="loading-wrap" v-if="loading">
        <van-loading color="#3296fa" vertical>加载中</van-loading>
      </div>
      <!-- /加载中 -->

      <!-- 加载完成-文章详情 -->
      <div class="article-detail" v-else-if="userInfo.title">
        <!-- 文章标题 -->
        <h1 class="article-title">{{ userInfo.title }}</h1>
        <!-- /文章标题 -->

        <!-- 用户信息 -->
        <van-cell class="user-info" center :border="false">
          <van-image
            class="avatar"
            slot="icon"
            round
            fit="cover"
            src="https://img.yzcdn.cn/vant/cat.jpeg"
          />
          <div slot="title" class="user-name">{{ userInfo.aut_name }}</div>
          <div slot="label" class="publish-date">{{ userInfo.pubdate | relativeTime }}</div>
          <attention-user
            :userFollow="userInfo.is_followed"
            :userId="userInfo.aut_id"
            v-model="userInfo.is_followed"
          ></attention-user>
        </van-cell>
        <!-- /用户信息 -->

        <!-- 文章内容 -->
        <div ref="articleContent" class="article-content markdown-body" v-html="userInfo.content"></div>
        <van-divider>正文结束</van-divider>
        <!-- 评论回复区域 -->
        <comment-user
          :source="articleId"
          @commentCount="comCount = $event"
          :list="commentList"
          @reply-click="replyCommentClick"
        />
        <!-- 底部区域 -->
        <div class="article-bottom">
          <van-button class="comment-btn" type="default" round size="small" @click="showPopup">写评论</van-button>
          <van-icon name="comment-o" :info="comCount" color="#777" />
          <!-- 收藏 -->
          <collected-user
            v-model="userInfo.is_collected"
            @input="userInfo.is_collected = $event"
            :collectedArticleId="userInfo.art_id"
          ></collected-user>
          <!-- 点赞 -->
          <attitude-user
            v-model="userInfo.attitude"
            :attitudeArticleId="userInfo.art_id"
            @input="userInfo.attitude = $event"
          />
          <van-icon name="share" color="#777777"></van-icon>
        </div>
        <!-- /底部区域 -->
      </div>
      <!-- /加载完成-文章详情 -->
      <!-- 加载失败：其它未知错误（例如网络原因或服务端异常） -->
      <div class="error-wrap" v-else-if="status">
        <van-icon name="failure" />
        <p class="text">内容加载失败！</p>
        <van-button class="retry-btn" @click="getArticle()">点击重试</van-button>
      </div>
      <!-- /加载失败：其它未知错误（例如网络原因或服务端异常） -->
      <!-- 加载失败：404 -->
      <div class="error-wrap" v-else>
        <van-icon name="failure" />
        <p class="text">该资源不存在或已删除！</p>
      </div>
      <!-- /加载失败：404 -->
    </div>
    <!-- 弹出层 -->
    <!-- 弹出层 -->
    <van-popup v-model="popupShow" position="bottom" :style="{ height: '20%' }">
      <!-- 发表评论框 -->
      <van-field
        v-model="message"
        rows="2"
        autosize
        clearable
        type="textarea"
        maxlength="50"
        placeholder="优质评论将会被优先展示"
        show-word-limit
      />
      <span class="submitComment" @click="submitCommentEvent">发布</span>
    </van-popup>
    <!-- 评论回复的弹出层 -->
    <van-popup
      v-model="replypopupShow"
      position="bottom"
      :style="{ height: '90%' }"
      @close="closereplyComment"
      @open="openreplyComment"
    >
      <reply-comment
        :currentComment="currentComment"
        :articleId="articleId"
        :commentReplyData="commentReplyData"
      />
    </van-popup>
  </div>
</template>
<script>
import "@/styles/github-markdown.css";
import {
  getArticleDetail,
  addCommentContent,
  commentReply,
} from "@/api/article";
// 引入图片预览
import { ImagePreview } from "vant";
import attentionUser from "@/components/attention.vue";
import collectedUser from "@/components/collected.vue";
import attitudeUser from "@/components/attitude.vue";
import commentUser from "./components/comment.vue";
import replyComment from "./components/replypopup.vue";

export default {
  name: "comment-list",
  props: {
    articleId: {
      type: [Number, String, Object],
      required: true,
    },
  },
  data() {
    return {
      active: 0,
      // 用户的信息
      userInfo: {},
      status: false,
      // 控制loading效果
      loading: true,
      // 评论总数
      comCount: 0,
      // 控制弹出层
      popupShow: false,
      message: "",
      commentList: [],
      replypopupShow: false, //评论回复弹出层
      currentComment: {},
      // 子组件数据
      commentReplyData: [],
    };
  },
  methods: {
    async getArticle() {
      this.loading = true;
      try {
        const { data } = await getArticleDetail(this.articleId);
        this.userInfo = data.data;
        this.loading = false;
        setTimeout(() => {
          // console.log();
          const imgArr = [];
          const articleImg = this.$refs.articleContent;
          const images = articleImg.querySelectorAll("img");
          console.log(images);
          images.forEach((item, index) => {
            imgArr.push(item.src);
            item.onclick = () => {
              ImagePreview({
                images: imgArr,
                startPosition: index,
              });
            };
          });
          // ImagePreview({
          //   images: imgArr,
          //   startPosition: 1,
          // });
        }, 0);
      } catch (err) {
        console.log(err);
        this.status = true;
        this.loading = false;
      }
    },
    // 控制子组件显示弹出层
    showPopup() {
      this.popupShow = true;
    },
    async submitCommentEvent() {
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
          target: this.articleId, //评论的目标id（评论文章即为文章id，对评论进行回复则为评论id）
          content: this.message,
          //    art_id, //文章id，对评论内容发表回复时，需要传递此参数，表明所属文章id。对文章进行评论，不要传此参数。
        });
        console.log(data);
        this.$toast.success("发表成功");
        this.popupShow = false;
        this.commentList.unshift(data.data.new_obj);
        // 渲染到页面中
      } catch (err) {
        this.$toast.fail("发表失败,请重试!");
      }
    },
    replyCommentClick(comment) {
      this.currentComment = comment;
      this.replypopupShow = true;
    },
    //关闭弹出层时,清空数组
    closereplyComment() {
      this.commentReplyData = [];
    },
    //打开弹出层
    async openreplyComment() {
      // 获取评论的回复
      const { data } = await commentReply({
        type: "c",
        source: this.currentComment.com_id.toString(),
      });
      this.commentReplyData = data.data.results;
    },
  },
  watch: {},
  computed: {},
  created() {},
  mounted() {
    this.getArticle();
  },
  components: {
    [ImagePreview.Component.name]: ImagePreview.Component,
    attentionUser,
    collectedUser,
    attitudeUser,
    commentUser,
    replyComment,
  },
};
</script>
<style scoped lang="less">
.article-container {
  .main-wrap {
    position: fixed;
    left: 0;
    right: 0;
    top: 92px;
    bottom: 88px;
    overflow-y: scroll;
    background-color: #fff;
  }
  .article-detail {
    .article-title {
      font-size: 40px;
      padding: 50px 32px;
      margin: 0;
      color: #3a3a3a;
    }

    .user-info {
      padding: 0 32px;
      .avatar {
        width: 70px;
        height: 70px;
        margin-right: 17px;
      }
      .van-cell__label {
        margin-top: 0;
      }
      .user-name {
        font-size: 24px;
        color: #3a3a3a;
      }
      .publish-date {
        font-size: 23px;
        color: #b7b7b7;
      }
      .follow-btn {
        width: 170px;
        height: 58px;
      }
    }

    .article-content {
      padding: 55px 32px;
      /deep/ p {
        text-align: justify;
      }
    }
  }

  .loading-wrap {
    padding: 200px 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #fff;
  }

  .error-wrap {
    padding: 200px 32px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: #fff;
    .van-icon {
      font-size: 122px;
      color: #b4b4b4;
    }
    .text {
      font-size: 30px;
      color: #666666;
      margin: 33px 0 46px;
    }
    .retry-btn {
      width: 280px;
      height: 70px;
      line-height: 70px;
      border: 1px solid #c3c3c3;
      font-size: 30px;
      color: #666666;
    }
  }

  .article-bottom {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    justify-content: space-around;
    align-items: center;
    box-sizing: border-box;
    height: 88px;
    border-top: 1px solid #d8d8d8;
    background-color: #fff;
    .comment-btn {
      width: 282px;
      height: 46px;
      border: 2px solid #eeeeee;
      font-size: 30px;
      line-height: 46px;
      color: #a7a7a7;
    }
    .van-icon {
      font-size: 40px;
      .van-info {
        font-size: 16px;
        background-color: #e22829;
      }
    }
  }
}
.van-field {
  background-color: #f5f7f9;
}

.submitComment {
  width: 240px;
  margin-left: 50px;
  color: #ccc;
  font-size: 30px;
  font-weight: normal;
}
</style>
