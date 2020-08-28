<template>
  <div class="popup-contanier">
    <!-- 弹出层 -->
    <van-popup v-model="popup" position="bottom" :style="{ height: '100%' }" closeable>
      <!-- 我的频道 -->
      <van-cell-group :border="false">
        <van-cell title="我的频道" value="内容" class="mychannel">
          <van-button
            type="danger"
            round
            size="mini"
            @click="isedit = !isedit"
          >{{ isedit ? "完成" : "编辑" }}</van-button>
        </van-cell>
      </van-cell-group>
      <van-grid gutter="10">
        <van-grid-item
          :text="item.name"
          :key="i"
          v-for="(item, i) in myChannels"
          :class="{ active: active == i }"
          @click="removeBtn(item, i)"
        >
          <!-- 删除按钮 -->
          <van-icon slot="icon" name="clear" v-show="isedit && !fixedChannels.includes(item.id)"></van-icon>
        </van-grid-item>
      </van-grid>
      <!-- 频道推荐 -->
      <van-cell-group :border="false">
        <van-cell title="推荐频道" class="recommondChannel"></van-cell>
      </van-cell-group>
      <van-grid gutter="10">
        <van-grid-item
          :text="item.name"
          :key="i"
          v-for="(item, i) in mychannelAll"
          @click="addChannels(item, i)"
        />
      </van-grid>
    </van-popup>
  </div>
</template>

<script>
import { getAllChannel, addUserChannel, deleteUserChannel } from "@/api/user";
import { mapState } from "vuex";
import { setItem } from "@/tools/storage";
export default {
  name: "popup",
  props: {
    myChannels: {
      type: Array,
      require: true,
    },
    active: {
      type: Number,
      require: true,
    },
  },
  data() {
    return {
      //   全部频道
      allChannels: [], //27
      //   控制删除按钮
      isedit: false,
      //  不需要删除的频道
      fixedChannels: [0],
    };
  },
  methods: {
    //   获取全部频道
    async getAllChannels() {
      try {
        const { data } = await getAllChannel();
        this.allChannels = data.data.channels;
      } catch (err) {}
    },
    // 删除操作
    async removeBtn(item, i) {
      if (this.isedit) {
        if (this.fixedChannels.includes(item.id)) {
          return;
        }
        // 判断当前是删除状态还是编辑状态
        // 删除状态
        // 解决索引变化的问题
        if (i <= this.active) {
          this.$emit("updateActive");
        }
        this.$emit("remove", i);
        // 判断用户是否登录
        if (this.userData) {
          try {
            //用户已登录
            const res = await deleteUserChannel({ channels: item.id });
          } catch (err) {
            this.$toast("删除失败,请稍后再试!");
          }
        } else {
          // 用户未登录
          setItem("userChannel", this.myChannels);
        }
      } else {
        // 编辑状态
        this.$emit("activeIndex", i);
        // 跳转
        this.$store.state.popup = false;
      }
    },
    // 添加操作
    async addChannels(item, i) {
      this.myChannels.push(item);
      // 判断用户是登录状态还是未登录状态
      if (this.userData) {
        try {
          // 1.发起请求把数据保存到数据库
          await addUserChannel({
            channels: [
              {
                id: item.id,
                seq: this.myChannels.length,
              },
            ],
          });
        } catch (err) {
          this.$toast("添加失败,请稍后再试!");
        }
      } else {
        // 2.把数据保存在本地存储
        setItem("userChannel", this.myChannels);
      }
    },
  },
  created() {
    this.getAllChannels();
  },
  computed: {
    mychannelAll() {
      return this.allChannels.filter((item) => {
        return !this.myChannels.find((ele) => {
          return item.id === ele.id;
        });
      });
    },
    popup: {
      get() {
        return this.$store.state.popup;
      },
      set(v) {
        // 使用vuex中的mutations中定义好的方法来改变
        this.$store.commit("isPopup", v);
      },
    },
    ...mapState(["userData"]),
  },
};
</script>

<style scoped lang="less">
/deep/.mychannel {
  margin-top: 100px;
}
.my-channel-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
/deep/.van-grid-item {
  width: 100px;
  height: 50px;
  margin-bottom: 30px;
  .van-grid-item__content {
    background-color: #f3f5f7;
  }
  .van-icon-clear {
    position: absolute;
    top: -10px;
    right: -10px;
    font-size: 30px;
    /* background-color: #ccc; */
    color: #ccc;
    z-index: 2;
  }
  .van-grid-item__text {
    margin-top: 0;
  }
  /deep/ .recommondChannel {
    margin-top: 0 !important;
  }
}
/deep/.active {
  .van-grid-item__content {
    .van-grid-item__text {
      color: orangered;
    }
  }
}
/deep/.van-grid-item__icon-wrapper {
  position: unset;
}
</style>
