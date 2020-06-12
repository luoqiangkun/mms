<template>
  <div class="container_box" id="video-detail">
    <div class="van_swipe">
      <div class="header">
        <div class="back" @click="goback">
          <a href="javascript:;">
            <img
              src="../assets/img/left_arrow_white.png"
              alt
              style="width: 12px ;height: 16px;margin-left: .5rem"
            />
          </a>
        </div>
        <div class="share">
          <a href="javascript:;">
            <img src="../assets/share.png" alt @click="share" />
          </a>
        </div>
      </div>
      <!--vant van-swipe 滑动组件 -->
      <swiper :options="swiperOption" ref="videoSwiper" class="videoSwiper">
        <swiper-slide v-for="(item, index) in moments.items" :key="index" class="product_swiper">
          <div class="video_container">
            <!--video属性
                    webkit-playsinline ios 小窗播放，使视频不脱离文本流，安卓则无效
                    微信内置x5内核，
                    x5-video-player-type="h5" 启用H5播放器,是wechat安卓版特性，添加此属性，微信浏览器会自动将视频置为全屏
                    x5-video-player-fullscreen="true" 全屏设置，设置为 true 是防止横屏
                    x5-video-orientation 控制横竖屏 landscape 横屏，portrain竖屏； 默认portrain
                    x5-playsinline="" 使安卓实现h5同层播放，实现与ios同样效果，但兼容部分机型
                    poster：封面
                    src：播放地址
            -->
            <video
              class="video_box"
              width="100%"
              height="100%"
              webkit-playsinline="true"
              
              x5-playsinline
              x5-video-player-fullscreen="true"
              playsinline
              :src="item.moments_video"
              :poster="item.moments_image[0]"
              preload="auto"
              autoplay="autoplay"
              :playOrPause="playOrPause"
              x-webkit-airplay="allow"
              x5-video-orientation="portrait"
              @click="pauseVideo"
              @ended="onPlayerEnded($event)"
              loop="loop"
            ></video>

            <!-- 封面 -->
            <img v-show="isVideoShow" class="play" @click="playvideo" :src="item.moments_image[0]"  />
            <!-- 播放暂停按钮 -->
            <img
              v-show="iconPlayShow"
              class="icon_play"
              @click="playvideo"
              src="../assets/icon_play.png"
            />
          </div>
          <!-- 绑定商品 -->
          <div
            v-if="item.moments_product.length>0"
            class="product-tag"
            @click="goProduct(item.moments_product[0].product_id)"
          >
            <img src="../assets/car.png" alt />
            <span>{{item.moments_product[0].product_name}}</span>
            <img src="../assets/right_arrow.png" alt />
          </div>
          <!-- 图片信息 -->
          <div class="imgInfo">
            <div class="avator">
              <div class="avator-img">
                <img :src="item.user_avatar" />
              </div>
              <div class="avator-info">{{item.user_nickname}}</div>
              <div class="followed" v-if="item.is_follow" @click="rmFollow(item.user_id)">已关注</div>
              <div class="follow" @click="addFollow(item.user_id)" v-else>关注</div>
            </div>
            <div class="title">{{item.moments_title}}</div>
          </div>
          <!--  底部评论/点赞/收藏-->
          <div class="comment-bar">
            <div class="cmtBar-left" @click="gocomment">说点什么...</div>
            <div class="cmtBar-right">
              <a href="javascript:;">
                <i class="icon icon-liked" @click="rmLike(item.is_like)" v-if="item.is_like"></i>
                <i class="icon icon-like" @click="doLike(item.moments_id)" v-else></i>
                <span class="likes">{{item.moments_like_count}}</span>
              </a>

              <a href="javascript:;">
                <i
                  class="icon icon-collected"
                  @click="rmCollect(item.is_collect)"
                  v-if="item.is_collect"
                ></i>
                <i class="icon icon-collect" @click="doCollect(item.moments_id)" v-else></i>
                <span class="collection">{{item.moments_collection_count}}</span>
              </a>

              <a href="javascript:;" @click="changeShare(item.moments_id)">
                <i class="icon icon-comment"></i>
                <span class="message">{{comments.records}}</span>
              </a>
            </div>
          </div>
        </swiper-slide>
      </swiper>

      <share ref="share"></share>

      <div :class="['modal',isTrue==0? 'show' : '']" ref="modal">
        <div class="zhanwei" @click="clickModal()"></div>
        <div :class="['modal-content',isComment==0? 'show' : '']">
          <input
            type="text"
            name="fabiao"
            v-model="fabiaodata"
            ref="fabiao"
            id="fabiao"
            placeholder="说点什么..."
          />
          <input type="button" @click="submit" value="发表" />
        </div>
      </div>

      <div class="share_box" :class="showShareBox?'share_active':''">
        <div class="share_tips">共{{comments.records}}条评论</div>
                       <div class="comment" id="comment">
          <div class="comment-count" v-if="comments.records!=0">共{{comments.records}}条评论</div>
          <div class="comment-count" v-else>还没有评论</div>

          <!-- 评论 -->
          <div class="send-comment">
            <div class="my-avator common-avator">
              <!-- <img :src="imgDetailData.user_avatar" /> -->
            </div>
            <div class="send-comment-bar" @click="showInput">说点什么...</div>
            <!-- 列表 -->

            <div class="comment-list">
              <div
                class="comment-item"
                v-for="(item,index) in comments.items"
                :key="item.comments_id"
              >
                <div class="comment-wrapper">
                  <div class="comment-avator common-avator">
                    <router-link :to="uid == item.user_id ? '/home' : '/user/' + item.user_id">
                      <img :src="item.user_avatar" />
                    </router-link>
                  </div>
                  <div class="comment-mid">
                    <div class="avator-name gray">
                      <router-link
                        :to="uid == item.user_id ? '/home' : '/user/' + item.user_id"
                      >{{item.user_nickname}}</router-link>
                    </div>
                    <div class="comment-content" @click="showSheet(item.comment_id,0,index)">
                      <span style="margin-right:.25rem;">{{item.comment_content}}</span>
                      <span class="comment-time">{{item.comment_time}}</span>
                    </div>
                  </div>

                  <div class="likes-right">
                    <i
                      class="icon icon-small icon-liked"
                      @click="rmCommentLike(item.is_like,index)"
                      v-if="item.is_like"
                    ></i>
                    <i
                      class="icon icon-small icon-like"
                      @click="doCommentLike(item.comment_id,index)"
                      v-else
                    ></i>
                  </div>
                </div>

                <div class="reply-list" v-if="item.moments_comment_reply">
                  <div
                    class="reply-item"
                    v-for="row in item.moments_comment_reply.items"
                    :key="row.comment_reply_id"
                  >
                    <div class="reply-avator common-avator">
                      <router-link :to="uid == row.user_id ? '/home' : '/user/' + row.user_id">
                        <img :src="row.user_avatar" />
                      </router-link>
                    </div>
                    <div class="reply-mid">
                      <div class="avator-name gray">
                        <router-link
                          :to="uid == row.user_id ? '/home' : '/user/' + row.user_id"
                        >{{row.user_name }}</router-link>
                      </div>

                      <div
                        class="reply-content"
                        @click="showSheet(item.comment_id,row.comment_reply_id,index)"
                      >
                        <span>
                          回复
                          <router-link
                            :to="uid == row.user_id ? '/home' : '/user/' + row.user_id"
                            class="user-name-to"
                          >@{{row.user_name_to}}</router-link>
                        </span>
                        <span style="margin-right:.25rem;">{{row.comment_reply_content}}</span>
                        <span class="reply-time">{{row.comment_reply_time}}</span>
                      </div>
                    </div>
                  </div>

                  <div
                    class="getmore"
                    v-show="moreVisible"
                    v-if="item.moments_comment_reply.more"
                    style="margin-left:.8rem;text-align:left"
                    @click="loadReply(item.comment_id,index)"
                  >
                    <a
                      href="javascript:;"
                      v-if="item.moments_comment_reply.records / item.moments_comment_reply.page > 5 "
                    >展开{{item.moments_comment_reply.records - item.moments_comment_reply.page * 5}}条回复</a>
                    <a href="javascript:;" v-else>展开回复 ( {{item.moments_comment_reply.records}} )</a>
                  </div>
                </div>
              </div>
            </div>

            <div class="mint-spinner-bottom" v-show="loadBotVisible">
              <mt-spinner type="fading-circle"></mt-spinner>
            </div>

            <div class="getmore" ref="getmore" v-if="comments.more">
              <a href="javascript:;" @click="getmore">加载更多</a>
            </div>
          </div>

          <!-- 输入框 -->
          <div :class="['modal',isTrue==0? 'show' : '']" ref="modal">
            <div class="zhanwei" @click="clickModal()"></div>
            <div class="modal-content">
              <input type="text" v-model="input_content" ref="fabiao1" placeholder="说点什么..." />
              <input type="button" @click="submit" value="发表" />
            </div>
          </div>
        </div>

        <!-- <div class="share_cancel" @click="cancelShare">取消</div> -->
      </div>
      <div :class="['vModal',isShow==0? 'show' : '']" @click="clear"></div>

    </div>
  </div>
</template>
<script>
import Vue from "vue";
// import { Swipe, SwipeItem } from "vant";
// Vue.use(Swipe).use(SwipeItem);
import { Toast } from "mint-ui";
  import share from '../components/share.vue'

export default {
  name: "videoChild",
  data() {
    let u = navigator.userAgent;
    return {
      isShow: 1,
      getId: "",
            comment_id:0,
      comment_index:0,
      comment_reply_id:0,
      inputType:"comment",
            loadPageVisible:true,

      loadBotVisible: false,
      moreVisible:true,
      sheetVisible:false,
      input_content: "",
      // swiper数据
      swiperOption: {
        direction: "vertical",
        slidesPerView: 1,
        height: window.innerHeight,
        mousewheel: true,
        pagination: {
          el: ".swiper-pagination"
        },
        on: {
          slideChangeTransitionStart: () => {
            this.loadData(1);
            this.onChange(this.$refs.videoSwiper.swiper.activeIndex);
            this.getcmtItem(this.getId);
            this.actionIndex = this.$refs.videoSwiper.swiper.activeIndex;
          },
          click: function() {}
        }
      },
      //
      isTrue: 1,
      videoArr: [],
      id: this.$route.params.id,
      isComment: 1,
      fabiaodata: "",
      commentCount: 0,
      actionIndex: 0,
      moments_tag_id: "",

      moments: {
        page: 1,
        records: 0,
        total: 0,
        more: true,
        items: []
      },
      comments: {
        page: 1,
        records: 0,
        total: 0,
        more: true,
        items: []
      },
      current: 0,
      isVideoShow: true,
      playOrPause: true,
      video: null,
      iconPlayShow: true,
      isAndroid: u.indexOf("Android") > -1 || u.indexOf("Adr") > -1, // android终端
      isiOS: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), // ios终端
      tabIndex: 0,
      // 是否展示弹窗
      showShareBox: false
    };
  },
  methods: {
        // 返回
    goback() {
      this.$router.go(-1);
    },
    share() {
      this.$refs.share.showShare();
    },
    //展示评论弹窗
    changeShare(getId) {

      this.showShareBox = true;
      this.getId = getId;
      console.log(getId);
      document.getElementById("video-detail").classList.add("overhiden");
      // this.getcmtItem(getId);
      this.getCommentData(getId)
                  this.isShow = 0;

    },
     //取消
    cancelShare() {
      this.showShareBox = false;
    },
    //滑动改变播放的视频
    onChange(index) {
      //改变的时候 暂停当前播放的视频
      let video = document.querySelectorAll("video")[this.current];
      video.pause();
      this.playOrPause = false;
      this.current = index;
      if (this.isiOS) {
        //ios切换直接自动播放下一个
        this.isVideoShow = false;
        this.pauseVideo();
      } else {
        //安卓播放时重置显示封面。图标等
        this.isVideoShow = true;
        this.iconPlayShow = true;
      }
    },

    playvideo(event) {
      let video = document.querySelectorAll("video")[this.current];
      console.log("playvideo：" + this.current);
      this.isVideoShow = false;
      this.iconPlayShow = false;
      video.play();
      window.onresize = function() {
        video.style.width = window.innerWidth + "px";
        video.style.height = window.innerHeight + "px";
      };
    },
    pauseVideo() {
      //暂停\播放
      let video = document.querySelectorAll("video")[this.current];
      console.log("pauseVideo" + this.current);
      if (this.playOrPause) {
        video.pause();
        this.iconPlayShow = true;
      } else {
        video.play();
        this.iconPlayShow = false;
      }
      this.playOrPause = !this.playOrPause;
    },
    onPlayerEnded(player) {
      //视频结束
      this.isVideoShow = true;
      this.current += this.current;
    },
    //复制当前链接
    copyUrl() {
      let httpUrl = window.location.href;
      var oInput = document.createElement("input");
      oInput.value = httpUrl;
      document.body.appendChild(oInput);
      oInput.select(); // 选择对象
      document.execCommand("Copy"); // 执行浏览器复制命令
      oInput.className = "oInput";
      oInput.style.display = "none";
      Toast("链接复制成功");
    },
    // 初始化视频
    initDetail() {
      // this.$axios
      //   .get(
      //     "https://shop.xunyoutest.com/index.php?mdu=moments&ctl=Base&met=detail&typ=json&moments_id=" +
      //       this.id
      //   )
      //   .then(res => {
      //     console.log(res);
      //     this.moments.items.push(res.data.data);
      //     console.log(this.moments.items);
      //   });
            var self = this;
      return new Promise(function(resolve, reject) {
        self.$axios
          .get(
            SYS.URL.moments.detail + "&moments_id=" +
              self.id
          )
          .then(res => {
            console.log(res);
            self.moments.items.push.apply(self.moments.items, [res.data.data]);

            self.moments_tag_id = res.data.data.moments_tag_id;
            resolve(res);
          });
      });
    },
    // 获取视频
    loadData(rows) {
      var self = this;
      return new Promise(function(resolve, reject) {
        if (!self.moments.more) {
          return;
        }
        var params = {
          page: self.moments.page,
          rows: rows,
          moments_id: self.id,
          // moments_tag_id :self.moments_tag_id
        };
        self.$axios
          .get(
            SYS.URL.moments.lists + "&kind=video",
            { params: params }
          )
          .then(res => {
            var data = res.data;
            console.log(self.moments.items);
            self.moments.items.push.apply(self.moments.items, data.data.items);
            self.moments.page = data.data.page + 1;
            self.moments.records = data.data.records;
            self.moments.total = data.data.total;
            if (data.data.total == data.data.page) {
              self.moments.more = self;
            }

            resolve(res);
          });
      });
    },
    // 底部点击弹出
    gocomment() {
      this.isTrue = 0;
      console.log("gocomment");
      this.$nextTick(()=>{
                this.$refs.fabiao1.focus();

      })
    },
    // 底部移除喜欢
    rmLike(islike) {
      this.$axios
        .post(
          SYS.URL.moments.like_remove,
          { like_id: islike },
          { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
        )
        .then(res => {
          console.log("rmlike");

          console.log(res);
          if (res.data.status == 200) {
            this.moments.items[this.actionIndex].is_like = 0;
            this.moments.items[this.actionIndex].moments_like_count--;
          }
        });
    },
    // 喜欢
    doLike(id) {
      this.$axios
        .post(
          SYS.URL.moments.like_add,
          { moments_id: id },
          { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
        )
        .then(res => {

          if (res.data.status == 200) {
            this.moments.items[this.actionIndex].is_like =
              res.data.data.like_id;
            this.moments.items[this.actionIndex].moments_like_count++;
          }
        });
    },
    rmCollect(id) {
      this.$axios
        .post(
           SYS.URL.moments.collection_remove,
          { collection_id: id },
          { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
        )
        .then(res => {
          if (res.data.status == 200) {

            this.moments.items[this.actionIndex].is_collect = 0;
            this.moments.items[this.actionIndex].moments_collection_count--;
          }
        });
    },
    doCollect(id) {
      this.$axios
        .post(
          SYS.URL.moments.collection_add,
          { moments_id: id },
          { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
        )
        .then(res => {
          if (res.data.status == 200) {
            this.moments.items[this.actionIndex].is_collect =
              res.data.data.collection_id;
            this.moments.items[this.actionIndex].moments_collection_count++;
          }
        });
    },

    // 绑定商品去对应页面
    goProduct(id) {
      window.location.href =
        WapSiteUrl + "/tmpl/product_detail.html?product_id=" + id;
    },

    getcmtItem(getId) {
      // return;
      this.$axios
        .post(
          SYS.URL.moments.comment_lists,
          { moments_id: getId },
          { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
        )
        .then(res => {
          this.comments.items = res.data.data.items;
        });
    },
    clickModal() {
      this.isTrue = 1;
    },

    // 移除关注
    rmFollow(id) {
      this.$axios
        .post(
          SYS.URL.moments.follow_remove,
          { up_user_id: id },
          { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
        )
        .then(res => {
          if (res.data.status == 200) {
            this.imgDetailData.is_follow = 0;
          }
        });
    },
    // 关注
    addFollow(id) {
      this.$axios
        .post(
          SYS.URL.moments.follow_add,
          { up_user_id: id },
          { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
        )
        .then(res => {
          if (res.data.status == 200) {
            this.imgDetailData.is_follow = res.data.data.follow_id;
          }
        });
    },

    showInput(type) {
      this.inputType = "comment";
      this.hideEdit();
    },
    // 遮罩层
    hideEdit() {
      this.isTrue = 0;

      this.$nextTick(() => {
        this.$refs.fabiao1.focus();
      });
    },
    submit() {

      if (this.inputType == "comment") {
        this.addComment();
      } else {
        this.addReply();
      }
    },
    addComment() {
      console.log(88888);
      if (this.input_content.trim().length == 0) {
        return;
      }
      this.$axios
        .post(
          SYS.URL.moments.comment_add,
          { moments_id: this.id, comment_content: this.input_content },
          { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
        )
        .then(res => {
          let data = res.data;
          this.comments.items.unshift([data.data]);

          Toast("发表成功");
        });

      this.isTrue = 1;
    },
    addReply() {
      if (this.input_content.trim().length == 0) {
        return;
      }

      this.$axios
        .post(
          SYS.URL.moments.comment_reply_add,
          {
            comment_reply_parent_id: this.comment_reply_id,
            comment_reply_content: this.input_content,
            comment_id: this.comment_id
          },
          { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
        )
        .then(res => {
          let data = res.data;

          this.comments.items[this.comment_index].moments_comment_reply[
            "items"
          ].push(data.data);
          Toast("发表成功");
        });

      this.isTrue = 1;
    },
    getCommentData(getId) {
      return new Promise((resolve, reject) => {
        if (!this.comments.more) {
          this.loadBotVisible = false;
          return;
        }
        let params = {
          moments_id: getId,
          page: this.comments.page,
          rows: 10
        };

        this.$http
          .get(SYS.URL.moments.comment_lists, { params: params })
          .then(res => {
            var data = res.data;
            if (data.status === 200) {
              this.comments.page = data.data.page + 1;
              this.comments.records = data.data.records;
              this.comments.total = data.data.total;
              if (data.data.total == data.data.page || data.data.total == 0) {
                this.comments.more = false;
              }

              for (let i in data.data.items) {
                data.data.items[i].moments_comment_reply.items = [];

                if (data.data.items[i].moments_comment_reply.records > 0) {
                  data.data.items[i].moments_comment_reply.more = true;
                } else {
                  data.data.items[i].moments_comment_reply.more = false;
                }
              }
              this.comments.items.push.apply(
                this.comments.items,
                data.data.items
              );
            }
            this.moreVisible = true;
            this.loadBotVisible = false;
            resolve(res);
          });
      });
    },
    // 加载更多
    getmore() {
      // this.getDataList();
      this.moreVisible = false;
      this.loadBotVisible = true;
      this.getCommentData(this.getId);
    },
        showSheet( comment_id,comment_reply_id,index ){
      
      this.comment_id = comment_id;
      this.comment_reply_id = comment_reply_id;
      this.comment_index = index;
      this.sheetVisible = true;
      this.inputType = 'reply';
    },
        loadReply( id,index ){
      this.moreVisible = false;
      this.loadBotVisible = true;
      return new Promise((resolve, reject) => {
          if( !this.comments.items[index].moments_comment_reply.more ){
              this.loadBotVisible = false;
              return;
          }
          
          let params = {
              'comment_id':id,
              'page':this.comments.items[index].page,
              'rows':5,
          };

          this.$http.get(SYS.URL.moments.comment_reply_lists,{params:params}).then((res) => {
              var data = res.data;
              if (data.status === 200) {
                  
                  this.comments.items[index].moments_comment_reply.page = data.data.page + 1;
                  this.comments.items[index].moments_comment_reply.records = data.data.records;
                  this.comments.items[index].moments_comment_reply.total = data.data.total;
                  if( data.data.total == data.data.page || data.data.total == 0 ){
                    this.comments.items[index].moments_comment_reply.more = false;
                  }

                  this.comments.items[index].moments_comment_reply.items.push.apply(this.comments.items[index].moments_comment_reply.items,data.data.items);  
              }
              this.loadBotVisible = false;
              this.moreVisible = false;
              resolve(res);
          })
      });

    },
    clear(){
      this.isShow=1;
            this.showShareBox = false;

    }
  },
  created() {
    this.initDetail().then(() => {
      return this.loadData(2);
    });
    // this.getcmtItem();
    // this.getSearch()
  },
  filters: {
    timeID: function(data) {
      var Time = new Date(data);
      var T = Time.toLocaleDateString();
      return T;
    }
  },
  components: {
    share
  }
};
</script>
<style scoped lang="scss">
.clear {
  clear: both;
}

.video-player {
  height: 100vh;
  width: 100vw;
}

.product_swiper {
  width: 100vw;
  height: 100vh;
}

.van_swipe {
  width: 100vw;
  height: 100vh;
}

.van-swipe {
  width: 100%;
  height: 100%;
}

.container_box {
  width: 100vw;
  height: 100vh;
}

.video_box {
  object-fit: fill !important;
  z-index: 999;
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
  overflow: hidden;
}

video {
  object-position: 0 0;
}

.icon_play {
  position: absolute;
  top: 44%;
  right: 0;
  left: 0;
  bottom: auto;
  margin: auto;
  z-index: 999;
  height: 60px;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 50%;
}

.play,
.platStart {
  position: absolute;
  margin: auto;
  top: 0;
  left: 0;
  z-index: 999;
  width: 100%;
  height: 100%;
}

/* 点赞，转发 */
.tools_right {
  z-index: 1001;
  position: absolute;
  right: 16px;
  bottom: 238px;
}

.tools_r_li {
  margin-bottom: 20px;
  color: #fff;
  font-size: 14px;
}

.tools_r_li:last-child {
  margin-bottom: 0px;
}

.icon_right {
  margin-bottom: 5px;
  font-size: 42px;
  display: block;
  text-shadow: 0px 0px 10px #9d9d9d;
  /*transition: .5s;*/
}

.production_box {
  z-index: 1001;
  position: absolute;
  /* right: 16px; */
  bottom: 60px;
  text-align: left;
  padding: 0 15px 15px 15px;
  color: #fff;
  width: 100%;
  left: 0;
  box-sizing: border-box;
  background: -webkit-linear-gradient(
    top,
    rgba(0, 0, 0, 0.2),
    rgba(0, 0, 0, 0)
  );
  /* Safari 5.1 - 6.0 */
  background: -o-linear-gradient(top, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0));
  /* Opera 11.1 - 12.0 */
  background: -moz-linear-gradient(top, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0));
  /* Firefox 3.6 - 15 */
  background: linear-gradient(to top, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0));
  /* 标准的语法 */
}

.production_name {
  font-weight: 700;
  font-size: 18px;
  margin-bottom: 10px;
}

.production_des {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  min-height: 62px;
}

//  .container_bottom {
//         position: fixed;
//         bottom: 0;
//         width: 100%;
//         background: rgba(0, 0, 0, 0.2);
//         height: 60px;
//         border-top: 1px solid rgba(255, 255, 255, 0.7);
//     }

/* 底部 */
.comment-bar {
  position: absolute;
  bottom: 0;
  height: 2rem;
  // border-top: 1px solid #f5f5f5;
  display: flex;
  align-items: center;
  background-color: rgba(0, 0, 0, 0);
  width: 100%;
  font-size: 0.6rem;
  z-index: 999;
  .cmtBar-left {
    background-color: lightgray;
    border-radius: 1rem;
    padding: 0.2rem 1rem;
    padding-left: 0.5rem;
    width: 40%;
    margin-left: 0.5rem;
  }
  .cmtBar-right {
    a {
      display: flex;
      align-items: center;
      color: #fff;
    }
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-around;
    padding-left: 1rem;
  }
}
.production_top {
  display: inline-block;
  padding: 6px;
  margin-bottom: 5px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 6px;
  margin-top: 5px;
}

.product_go {
  color: #fbdd21;
}

.production_title {
  margin-left: 4px;
}

/* .bottom_tab {
        width: 50%;
        text-align: center;
        float: left;
        color: #c9c9c9;
        padding: 10px 0;
    } */

/* .bottom_tab_span {
        line-height: 38px;
        border-bottom: 2px solid transparent;
        font-weight: 600;
        font-size: 16px;
        display: inline-block;
        padding: 0 4px;
        transition: .5s all;
    } */

/* .tab_active .bottom_tab_span {
        border-bottom: 2px solid #fff;
        color: #fff;
    } */

.icon-shoucang {
  transition: 0.5s all;
}

.follow_active {
  color: #f44;
  animation: showHeart 0.5s ease-in-out 0s;
}

/*animation-name：用来调用@keyframes定义好的动画，与@keyframes定义的动画名称一致*/
/*animation-duration ：指定元素播放动画所持续的时间*/
/*animatino-timing-function ： 和transition中的transition-timing-function 中的值一样。根据上面@keframes中分析的animation中可能存在多个小动画，因此这里的值设置是针对每一个小动画所在时间范围内的属性变换速率。*/
/*animation-delay：定义在浏览器开始执行动画之前等待的时间，这里是指整个animation执行之前的等待时间，而不是上面说的多个小动画*/
/*animation-iteration-count：定义动画的播放次数，其通常为整数，默认是1,；取值为infinite，动画将无限次的播放。*/
/*animation-direction：主要用来设置动画播放方向*/
@keyframes showHeart {
  0% {
    color: #f44;
    transform: scale(1);
  }

  25% {
    color: #fff;
    transform: scale(0);
  }

  80% {
    color: #f44;
    transform: scale(1.2);
  }

  100% {
    color: #f44;
    transform: scale(1);
  }
}

/*分享样式*/
.share_hover {
  position: fixed;
  display: none;
}

.share_box {
  position: fixed;
  bottom: -300px;
  width: 100%;
  z-index: 1002;
  background: #fff;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  transition: 0.5s;
  max-height: 12rem;
  overflow-y: scroll;
}

.share_tips {
  text-align: center;
  line-height: 38px;
  color: #333;
  font-size: .6rem;
}

.share_ul {
  box-sizing: border-box;
  padding: 0 25px 25px;
  border-bottom: 1px solid #e8e8e8;
}

.share_li {
  float: left;
  width: 33%;
  text-align: center;
}

.share_li i {
  font-size: 44px;
}

.share_cancel {
  text-align: center;
  line-height: 48px;
  color: #777;
  text-align: center;
}

.pengyouquan {
  color: #47d000;
}

.pengyouquan_li {
  animation: rotating 8s linear infinite;
}

@keyframes rotating {
  from {
    transform: rotate(0);
  }

  to {
    transform: rotate(360deg);
  }
}

.weixin {
  color: #20ca2e;
}

.lianjie {
  color: #cdcdcd;
}

.share_active {
  bottom: 0px;
}

// 添加底部icon图标
.icon {
  width: 1rem;
  height: 1rem;
  display: inline-block;
  opacity: 0.7;
  margin-right: 0.1rem;
}
.icon-video {
  background: url("../assets/img/video.png");
  background-repeat: no-repeat;
  background-size: 100%;
  background-position: 50% 50%;
  position: absolute;
  top: 0.3rem;
  right: 0.3rem;
}
@keyframes like {
  0% {
    transform: scale(1);
    background: url("../assets/img/liked.png");
    background-repeat: no-repeat;
    background-size: 80%;
    background-position: 50% 50%;
  }
  50% {
    transform: scale(0);
    background: url("../assets/img/like_white.png");
    background-repeat: no-repeat;
    background-size: 80%;
    background-position: 50% 50%;
  }
  100% {
    transform: scale(1);
    background: url("../assets/img/like_white.png");
    background-repeat: no-repeat;
    background-size: 80%;
    background-position: 50% 50%;
  }
}
.icon-like {
  background: url("../assets/img/liked.png");
  background-repeat: no-repeat;
  background-size: 80%;
  background-position: 50% 50%;
  -webkit-animation-name: like;
  -webkit-animation-timing-function: ease-in-out;
  -webkit-animation-iteration-count: 1;
  -webkit-animation-duration: 0.5s;
  -webkit-animation-fill-mode: forwards;
}

@keyframes liked {
  0% {
    transform: scale(1);
    background: url("../assets/img/like_white.png");
    background-repeat: no-repeat;
    background-size: 80%;
    background-position: 50% 50%;
  }
  50% {
    transform: scale(0);
    background: url("../assets/img/like_white.png");
    background-repeat: no-repeat;
    background-size: 80%;
    background-position: 50% 50%;
  }
  100% {
    transform: scale(1);
    background: url("../assets/img/liked.png");
    background-repeat: no-repeat;
    background-size: 80%;
    background-position: 50% 50%;
  }
}
.icon-liked {
  background: url("../assets/img/like_white.png");
  background-repeat: no-repeat;
  background-size: 80%;
  background-position: 50% 50%;
  -webkit-animation-name: liked;
  -webkit-animation-timing-function: ease-in-out;
  -webkit-animation-iteration-count: 1;
  -webkit-animation-duration: 0.3s;
  -webkit-animation-fill-mode: forwards;
}
@keyframes collect {
  0% {
    transform: scale(1);
    background: url("../assets/img/collected.png");
    background-repeat: no-repeat;
    background-size: 80%;
    background-position: 50% 50%;
  }
  50% {
    transform: scale(0);
    background: url("../assets/img/collect_white.png");
    background-repeat: no-repeat;
    background-size: 80%;
    background-position: 50% 50%;
  }
  100% {
    transform: scale(1);
    background: url("../assets/img/collect_white.png");
    background-repeat: no-repeat;
    background-size: 80%;
    background-position: 50% 50%;
  }
}
.icon-collect {
  -webkit-animation-name: collect;
  -webkit-animation-timing-function: ease-in-out;
  -webkit-animation-iteration-count: 1;
  -webkit-animation-duration: 0.3s;
  -webkit-animation-fill-mode: forwards;
}

@keyframes collected {
  0% {
    transform: scale(1);
    background: url("../assets/img/collect.png");
    background-repeat: no-repeat;
    background-size: 80%;
    background-position: 50% 50%;
  }
  50% {
    transform: scale(0);
    background: url("../assets/img/collect.png");
    background-repeat: no-repeat;
    background-size: 80%;
    background-position: 50% 50%;
  }
  100% {
    transform: scale(1);
    background: url("../assets/img/collected.png");
    background-repeat: no-repeat;
    background-size: 80%;
    background-position: 50% 50%;
  }
}
.icon-collected {
  -webkit-animation-name: collected;
  -webkit-animation-timing-function: ease-in-out;
  -webkit-animation-iteration-count: 1;
  -webkit-animation-duration: 0.3s;
  -webkit-animation-fill-mode: forwards;
}
.icon-comment {
  background: url("../assets/img/comment_white.png");
  background-repeat: no-repeat;
  background-size: 80%;
  background-position: 50% 50%;
}

// 图片信息
.imgInfo {
  position: absolute;
  bottom: 3rem;
  width: 100%;
  z-index: 1001;
  font-size: 16px;
  // background: rgba(0, 0, 0, 0.6);
  color: #fff;
  .avator {
    display: flex;
    align-items: center;
    .avator-img {
      width: 1.6rem;
      height: 1.6rem;
      margin-left: 0.5rem;
      margin-right: 0.5rem;
      display: flex;
      img {
        width: 100%;
        object-fit: cover;
        max-height: 100%;
        border-radius: 50%;
      }
    }
    .avator-info {
      color: #fff;
      font-size: 0.6rem;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
      margin-right: 0.5rem;
    }
    .follow,
    .followed
     {
      color: #fff;
      font-size: 0.5rem;
      padding: 0.2rem 0.3rem;
      border-radius: 1rem;
      margin-right: 0.5rem;
      border: 1px solid #fff;
      opacity: 0.8;
    }
  }
  .title {
    padding-left: 0.5rem;
    width: 100%;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    text-align: left;
    font-size: 0.6rem;
    margin-top: 0.5rem;
  }
}

//   绑定信息
.product-tag {
  position: absolute;
  bottom: 6.2rem;
  width: 7rem;
  z-index: 1002;
  font-size: 0.5rem;
  color: #fff;
  left: 0.5rem;
  border-radius: 5px;
  background: rgba(0, 0, 0, 0.3);
  padding: 0.2rem 0.2rem;
  display: flex;
  align-items: center;
  span {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    max-width: 6rem;
    display: inline-block;
  }
  img {
    width: 15px !important;
    height: 15px !important;
  }
}

//
.header {
  display: flex;
  align-items: center;
  position: relative;
  padding: 0.3rem 0.5rem;
  flex-wrap: wrap;
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 9;
  padding: 1.5rem 0;
  background: rgba(0, 0, 0, 0);
  img {
    width: 15px;
    height: 15px;
  }
  .back {
    margin-right: 0.5rem;
    position: absolute;
    left: 0;
  }
  .share {
    position: absolute;
    right: 0.5rem;
  }
}
.modal {
  display: none;
  position: fixed;
  top: 100%;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 110;
  background-color: rgba(0, 0, 0, 0.7);
  .zhanwei {
    position: absolute;
    width: 100%;
    height: 100%;
  }
  .modal-content {
    position: absolute;
    bottom: 0;
    width: 100%;
    display: flex;
    background-color: #fff;
    padding: 0.2rem;
    input[type="text"] {
      width: 90%;
      border: 1px solid #aaa;
      border-radius: 20px;
      text-indent: 3px;
      padding: 0.2rem 1rem;
      margin-right: 3px;
      font-size: 0.6rem;
    }
  }
  .modal-reply {
    position: absolute;
    bottom: 0;
    width: 100%;
    background-color: #fff;
    p {
      text-align: center;
      padding: 0.5rem 0;
    }
  }
}
.modal.show {
  top: 0;
  display: block;
}
// .comment-list.show {
//   top: 0;
//   display: block;
// }
.overhiden {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
}
// .comment-list {
//   display: none;
//   position: fixed;
//   top: 100%;
//   bottom: 0;
//   left: 0;
//   right: 0;
//   z-index: 110;
//   background-color: rgba(0, 0, 0, 0.7);
//   .zhanwei {
//     position: absolute;
//     width: 100%;
//     height: 100%;
//   }
//   .comment-content {
//     position: absolute;
//     bottom: 0;
//     width: 100%;
//     // display: flex;
//     background-color: #fff;
//     padding: 0.2rem;
//     height: 40%;
//     overflow-x: hidden;
//     .comment-item {
//       display: flex;
//       position: relative;
//       align-items: center;
//       padding: 0.3rem 0;
//       h3 {
//         font-size: 0.6rem;
//       }
//       .comment-avator {
//       }
//       .comment-mid {
//         flex: 1;
//         padding: 0.8rem 0;

//         padding-right: 2rem;

//         word-wrap: break-word;
//         word-break: break-all;
//         overflow: hidden;
//         border-bottom: 1px solid #f5f5f5;
//         text-align: left;
//         .avator-name {
//           //   color: #aaa;
//           font-size: 0.6rem;
//         }
//         .comment-content {
//           color: #000;
//           font-size: 0.8rem;
//           h3 {
//             font-size: 0.6rem;
//           }
//           .comment-time {
//             font-size: 0.5rem;
//             color: #aaa;
//           }
//         }
//       }
//       .likes-right {
//         position: absolute;
//         right: 0.5rem;
//         .likes-count {
//           text-align: center;
//         }
//       }
//     }
//   }
// }
.getmore {
  width: 100%;
  text-align: center;
  padding: 0.5rem 0;
  a {
    color: #000;
    font-size: 0.6rem;
  }
}
.common-avator {
  width: 1.9rem;
  height: 1.9rem;
  //    margin-left: 0.8rem;
  margin-right: 0.5rem;
  img {
    width: 100%;
    object-fit: cover;
    max-height: 100%;
    border-radius: 50%;
  }
}
input {
  background: none;
  outline: none;
  border: none;
  font-size: 0.6rem;
  :focus {
    outline: none;
  }
}
h3 {
  font-size: 0.6rem !important;
}
.comment {
  padding: 0 0.5rem;
  overflow: hidden;
  // max-height: 12rem;
  // overflow-y: scroll;
  .comment-count {
    text-align: left;
    font-size: 0.5rem;
    color: #777;
  }
  .gray {
    color: gray;
    font-size: 0.5rem;
    a {
      color: gray;
    }
  }
  .send-comment {
    display: flex;
    align-items: center;
    // padding: 0 0.5rem;
    padding-left: 0;
    margin: 0.5rem 0 0 0;
    flex-wrap: wrap;
    .common-avator {
      width: 1.3rem;
      height: 1.3rem;
      //    margin-left: 0.8rem;
      margin-right: 0.5rem;
      display: flex;
      img {
        width: 100%;
        object-fit: cover;
        max-height: 100%;
        border-radius: 50%;
      }
    }
    .send-comment-bar {
      background-color: #f5f5f5;
      border-radius: 1rem;
      padding: 0.35rem 1rem;
      padding-left: 0.5rem;
      width: 40%;
      flex: 1;
      text-align: left;
      font-size: 0.5rem;
      color: #ccc;
    }
    .comment-list {
      width: 100%;
      margin-top: 0.3rem;
      .comment-item {
        border-bottom: 1px solid #f5f5f5;
        padding: 0.6rem 0 0;
        .comment-wrapper {
          display: flex;
          position: relative;
          align-items: flex-start;
        }
        .comment-avator {
        }
        .comment-mid {
          flex: 1;

          padding-right: 2rem;

          word-wrap: break-word;
          word-break: break-all;
          overflow: hidden;
          padding-bottom: 0.25rem;

          text-align: left;
          .avator-name {
            //   color: #aaa;
            //   font-size: .6rem;
          }
          .comment-content {
            margin-top: 0.15rem;
            color: #333;
            font-size: 0.55rem;
            line-height: 1rem;
            .comment-time {
              font-size: 0.5rem;
              color: #aaa;
            }
          }
        }
        .likes-right {
          position: absolute;
          right: 0;
          .likes-count {
            text-align: center;
          }
        }
      }
      .comment-item:last-child {
        border-bottom: 0;
      }
    }
    .getmore {
      width: 100%;
      text-align: center;
      height: 1.5rem;
      line-height: 1.5rem;
      a {
        color: #26a2ff;
        font-weight: 600;
        font-size: 0.5rem;
      }
    }

    .reply-list {
      width: 100%;
      padding-left: 1rem;
      .reply-item {
        display: flex;
        position: relative;
        align-items: flex-start;
        padding: 0.6rem 0 0;
        .reply-avator {
        }
        .reply-mid {
          flex: 1;

          padding-right: 2rem;

          word-wrap: break-word;
          word-break: break-all;
          overflow: hidden;
          padding-bottom: 0.25rem;

          text-align: left;
          .avator-name {
            //   color: #aaa;
            //   font-size: .6rem;
          }
          .reply-content {
            margin-top: 0.15rem;
            color: #333;
            font-size: 0.55rem;
            line-height: 1rem;
            span {
              display: inline-block;
              a {
                color: #26a2ff;
              }
            }
            .reply-time {
              font-size: 0.5rem;
              color: #aaa;
            }
          }
        }
        .likes-right {
          position: absolute;
          right: 0;
          .likes-count {
            text-align: center;
          }
        }
      }
    }
  }
}
.vModal.show{
      position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    opacity: 0.5;
    background: #000;
    z-index: 10;
}
</style>