<template>
  <div class="page">
    <header>
      <!-- 头部 -->
      <div class="header-left">
        <a href="javascript:;" @click="goback" class="back">
          <img src="../assets/back2.png" alt />
        </a>
        <router-link class="avator-img" :to="uid == imgDetailData.user_id ? '/home' : '/user/' + imgDetailData.user_id" tag="div">
          <img :src="imgDetailData.user_avatar" />
        </router-link>
        <router-link class="avator-info" :to="uid == imgDetailData.user_id ? '/home' : '/user/' + imgDetailData.user_id" tag="div">{{imgDetailData.user_nickname}}</router-link>
      </div>
      <div class="header-right" >
        <template v-if="uid != imgDetailData.user_id">
        <div
          class="followed"
          v-if="imgDetailData.is_follow"
          @click="rmFollow(imgDetailData.is_follow)"
        >已关注</div>
        <div class="follow" @click="addFollow(imgDetailData.user_id)" v-else>关注</div>
        </template>

        <a href="javascript:;" class="share" @click="share" v-show="isApp">
          <img src="../assets/share2.png" alt />
        </a>
      </div>
    </header>

    <div class="container">
        <!-- 轮播图 -->
        <div class="video-wrapper" :style="{height:imgDetailData.media_rows[0].height / imgDetailData.media_rows[0].width * maxWidth * 2 + 'px'}" v-if="imgDetailData.moments_type === 4">
          <video-player  class="video-player vjs-custom-skin"
            ref="videoPlayer"
            :playsinline="true"
            :options="{ autoplay: false, 
                        muted: false, 
                        loop: false, 
                        preload: 'auto', 
                        language: 'zh-CN',
                        sources: [{
                          type: 'video/mp4',
                          src: imgDetailData.moments_video
                        }],
                        poster: imgDetailData.moments_image[0], 
                        height: imgDetailData.media_rows[0].height / imgDetailData.media_rows[0].width * maxWidth * 2,
                        width: maxWidth * 2}"
            @play="onPlayerPlay($event)"
            @pause="onPlayerPause($event)"
          >
          </video-player>
          <div class="video-player-icon" @click="play">
            <img src="../assets/img/play.png" />
          </div>
        </div>

        <swiper :options="swiperOption" v-else>
          <swiper-slide v-for="(slide, index) in imgDetailData.moments_image" :key="index">
            <div class="img-count">{{index+1}}/{{imgDetailData.moments_image.length}}</div>
            <img :src="slide" alt preview="0"/>
          </swiper-slide>
          <div class="swiper-pagination" slot="pagination"></div>
        </swiper>

        <!-- 图片详情 -->
        <div class="detail-info">
          <div class="detail-wrapper">
            <h1>{{imgDetailData.moments_title}}</h1>
            <div class="detail-content">{{imgDetailData.moments_content}}</div>
            <div class="dynamic-tag">
               <router-link :to="'/tag/'+tag.tag_id" v-for="tag in imgDetailData.moments_tag" style="margin-right:.25rem">
                <i class="icon icon-tag"></i>
                {{tag.tag_name}}
              </router-link>
            </div>
            <div class="release-time">{{imgDetailData.moments_time}}</div>
          </div>
        </div>
        <!-- 拉取评论 -->

        <div class="comment" id="comment">
          <div class="comment-count" v-if="comments.records!=0">共{{comments.records}}条评论</div>
          <div class="comment-count" v-else>还没有评论</div>

          <!-- 评论 -->
          <div class="send-comment">
            <div class="my-avator common-avator">
              <img :src="imgDetailData.user_avatar" />
            </div>
            <div class="send-comment-bar" @click="showInput">说点什么...</div>
            <!-- 列表 -->

           <div class="comment-list">


            <div class="comment-item" v-for="(item,index) in comments.items" :key="item.comments_id">

              <div class="comment-wrapper">
                  <div class="comment-avator common-avator">
                  <router-link :to="uid == item.user_id ? '/home' : '/user/' + item.user_id">
                    <img :src="item.user_avatar"/>
                  </router-link>
                  </div>
                  <div class="comment-mid">
                    <div class="avator-name gray">
                      <router-link :to="uid == item.user_id ? '/home' : '/user/' + item.user_id">
                        {{item.user_nickname}}
                      </router-link>
                      <span class="author-sign" v-if="imgDetailData.user_id == item.user_id">作者</span>
                    </div>
                    <div class="comment-content" @click="showSheet(item.user_id,item.comment_id,index)">
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
                    <i class="icon icon-small icon-like" @click="doCommentLike(item.comment_id,index)" v-else></i>
                   
                  </div>
              </div>
              

              <div class="reply-list" v-if="item.moments_comment_reply">
                <div class="reply-item" v-for="row in item.moments_comment_reply.items" :key="row.comment_parent_id">

                 <div class="reply-avator common-avator">
                    <router-link :to="uid == row.user_id ? '/home' : '/user/' + row.user_id">
                        <img :src="row.user_avatar"/>
                    </router-link>
                  </div>
                  <div class="reply-mid">
                    <div class="avator-name gray">
                        <router-link :to="uid == row.user_id ? '/home' : '/user/' + row.user_id">
                             {{row.user_nickname }}
                        </router-link>
                    </div>

                    <div class="reply-content" @click="showSheet(row.user_id,item.comment_id,index,row.comment_id)">
                      <span v-if="row.comment_parent_id > 0 ">回复 
                          <router-link :to="uid == row.user_id ? '/home' : '/user/' + row.user_id" class="user-name-to">
                          @{{row.to_user_nickname}}
                          </router-link>
                      </span>
                      <span style="margin-right:.25rem;">{{row.comment_content}}</span>
                      <span class="reply-time">{{row.comment_time}}</span>
                    </div>

                    <div class="likes-right">
                    
                    <i
                      class="icon icon-small icon-liked"
                      @click="rmCommentLike(row.is_like,index)"
                      v-if="row.is_like"
                    ></i>

                    <i class="icon icon-small icon-like" @click="doCommentLike(row.comment_id,index)" v-else></i>
                   
                  </div>

                  </div>

                </div>

                <div class="getmore" v-show="moreVisible" v-if="item.moments_comment_reply.more" style="margin-left:1.8rem;text-align:left" @click="loadReply(item.comment_id,index)">
                  <a href="javascript:;" v-if="item.moments_comment_reply.page == 1 ">
                    展开{{ item.moments_comment_reply.records >= 6 ? 6 : item.moments_comment_reply.records}}条回复
                  </a>
                  <a href="javascript:;" v-else>展开更多回复</a>
                </div>

              </div>
              



            </div>

          </div>

           
            <div class="mint-spinner-bottom" v-show="loadBotVisible">
                <mt-spinner type="fading-circle"></mt-spinner>
            </div>

            <div class="getmore" ref="getmore" v-show="!loadBotVisible" v-if="comments.more">
              <a href="javascript:;" @click="getmore" >加载更多</a>
            </div>
          </div>

          <!-- 输入框 -->
          <div :class="['modal',isTrue==0? 'show' : '']" ref="modal">
            <div class="zhanwei" @click="clickModal()"></div>
            <div class="modal-content">
              <input
                type="text"
                v-model="input_content"
                ref="fabiao1"
                placeholder="说点什么..."
              />
              <input type="button" @click="submit" value="发表" />
            </div>
          </div>
        </div>

     
        <div class="product" v-if="imgDetailData.moments_product_count > 0 ">
          <div class="title">相关商品</div>
          <div class="product-wrapper">
              <ul class="product-content">
                  <div class="product-item" :style="{width:maxWidth + 'px'}" v-for="product in imgDetailData.moments_product" @click="productDetail(product.product_id)">
                      <div class="product-album" :style="{width:maxWidth + 'px',height:maxWidth + 'px'}">
                        <img v-lazy="product.product_image" />
                      </div>
                      <div class="product-info">
                        <p class="product-name">{{product.product_name}}</p>
                        <span class="product-desc">{{product.product_tips}}</span>
                        <span class="product-price">￥{{product.product_unit_price}}</span>
                      </div>                 
                  </div>
                </ul>
          </div>
        </div>


        

        <div class="recommend">
          <div class="title">相关推荐</div>
          <list :lists="lists"></list>
        </div>


        <!-- 底部固定评论 -->
        <div class="comment-bar">
          <div class="cmtbar-left" @click="showInput">
              <span>
                <i class="icon icon-edit"></i>
                说点什么
              </span>
          </div>
          <div class="cmtbar-right">
            <a href="javascript:;" @click="rmLike(imgDetailData.is_like)">
              <i
                class="icon icon-liked"
                
                v-if="imgDetailData.is_like"
              ></i>
              <i class="icon icon-like" @click="doLike(imgDetailData.moments_id)" v-else></i>
              <span>{{imgDetailData.moments_like_count}}</span>
            </a>

            <a href="javascript:;" @click="rmCollect(imgDetailData.is_collect)">
              <i
                class="icon icon-collected"
                
                v-if="imgDetailData.is_collect"
              ></i>
              <i class="icon icon-collect" @click="doCollect(imgDetailData.moments_id)" v-else></i>
              <span>{{imgDetailData.moments_collection_count}}</span>
            </a>

            <a href="javascript:;" @click="scrollTo()">
              <i class="icon icon-comment"></i>
              <span>{{comments.records}}</span>
            </a>
          </div>
        </div>
    </div>
  


    <mt-actionsheet
        :actions="actions"
        :cancelText="cancelText"
        v-model="sheetVisible">
    </mt-actionsheet>
      

     <!-- 投诉 -->
    <complaint :comment_id="comment_id" ref="complaint"></complaint>

    <share ref="share" :share="shareData"></share>


    <div class="page-load" v-show="loadPageVisible">
        <mt-spinner type="fading-circle"></mt-spinner>
    </div>



  </div>
</template>
<script>
import { MessageBox } from 'mint-ui';
import { Toast } from 'mint-ui';
import list from '../components/list.vue'
import complaint from '../components/complaint.vue'
import VueVideoPlayer from 'vue-video-player'
import 'vue-video-player/src/custom-theme.css'
import share from '../components/share.vue'

import BScroll from 'better-scroll'

export default {
  components:{
      'list' : list,
      'complaint':complaint,
      'share' : share
  },  
  data() {
    return {
      id: this.$route.params.id,
      comment_id:0,
      comment_index:0,
      comment_parent_id:0,
      inputType:"comment",
      loadPageVisible:true,
      loadBotVisible:false,
      moreVisible:true,
      sheetVisible:false,
      loadReplyVisible:false,
      input_content: "",
      isShow: 1,
      //
      imgDetailData: [],
      // 遮罩层
      isTrue: 1,
      // 轮播图
      swiperOption: {
        pagination: {
          el: ".swiper-pagination"
        }
      },
      comments: {
        page: 1,
        records: 0,
        total: 0,
        more: true,
        items: []
      },
      lists: {
        page: 1,
        records: 0,
        total: 0,
        more: true,
        items: []
      },
      actions:[
      {
          name:'回复',
          method:this.hideEdit
      },
      {
          name:'举报',
          method:this.complaint
      }
      ],
      cancelText:'取消',
      playerVisible:true,
      playerOptions: {
//        playbackRates: [0.7, 1.0, 1.5, 2.0], //播放速度
        autoplay: false, //如果true,浏览器准备好时开始回放。
        muted: false, // 默认情况下将会消除任何音频。
        loop: false, // 导致视频一结束就重新开始。
        preload: 'auto', // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
        language: 'zh-CN',
        sources: [{
          type: "video/mp4",
          src: "" //你的视频地址（必填）
        }],
        poster: "", //你的封面地址
        width: document.documentElement.clientWidth,
        notSupportedMessage: '此视频暂无法播放，请稍后再试', //允许覆盖Video.js无法播放媒体源时显示的默认信息。
//        controlBar: {
//          timeDivider: true,
//          durationDisplay: true,
//          remainingTimeDisplay: false,
//          fullscreenToggle: true  //全屏按钮
//        }
      },
      shareData:{}
    };
  },
  created() {
    this.maxWidth = (document.documentElement.clientWidth) / 2;
    this.maxHeight = Math.ceil(this.maxWidth * 1.33);
    this.id = this.$route.params.id;
    this.getImgDetail().then(()=>{
      this.loadPageVisible = false;
      
      this.$nextTick( () =>{

        if( this.imgDetailData.moments_product_count == 0 ){
          return;
        }
        let wrapper = document.querySelector('.product-wrapper');
        let wrapper_lists = wrapper.querySelector('.product-content');
        let wrapper_items = wrapper.querySelectorAll('.product-item');
        if( wrapper_items.length == 0 ){
          return true;
        }
        let width = wrapper_items[0].offsetWidth * wrapper_items.length;
        wrapper_lists.style.width= width + 20 + 'px';
        
        let scroll = new BScroll(wrapper,{
          scrollX:0,
          click:true,
          scrollX:true,
          scrollY:false,
          eventPassthrough:'vertical',

        })
      })

      return this.loadRecommend();
    });
    // this.getDataList();
    this.getCommentData();
    
  },
  mounted() {
    
  },
  
  computed: {
    player() {
      return this.$refs.videoPlayer.player
    }
  },
  methods: {
    onPlayerPlay(player) {
     
    },
    onPlayerPause(player){
      
    },
    play(){
       
      this.$refs.videoPlayer.player.play();
      document.querySelector('.video-player-icon').style.opacity = 0
      //this.playerVisible = false;
    },
    // 返回上一层
    goback() {
      this.$router.go(-1);
    },
    // 请求数据
    getImgDetail() {
      console.log( this.$route.params )
      return new Promise((resolve, reject) => {
         this.$axios
        .get(
          SYS.URL.moments.detail + "&moments_id=" +
            this.id
        )
        .then(res => {
          
          this.imgDetailData = res.data.data;

          this.shareData = {
            title:res.data.data.moments_title,
            desc:res.data.data.moments_content,
            link:window.location.href,
            type:'link',
            imgUrl:res.data.data.moments_image[0],
            dataUrl:window.location.href
          }
          
          resolve(res);
        });
      });

    },
    showInput( type ){
      this.inputType = 'comment'
      this.comment_id = 0
      this.hideEdit();
    },
    // 遮罩层
    hideEdit() {
      
      this.isTrue = 0;

      this.$nextTick( () =>{
       this.$refs.fabiao1.focus();
      })

    },
    addComment() {
      if (this.input_content.trim().length == 0) {
        return;
      }
      this.$axios
      .post(
        SYS.URL.moments.comment_add,
        { moments_id: this.id, comment_content: this.input_content,comment_parent_id:this.comment_id },
        { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
      )
      .then(res => {
          let data = res.data;
          if (res.data.status == 200) {
            if( this.inputType === 'reply' ){
              this.comments.items[this.comment_index].moments_comment_reply['items'].push(data.data);
            } else {
              this.comments.items.unshift(data.data);
              Toast('发表成功');
            }
          } else {
              Toast(res.data.msg);
          }

          this.input_content = '';
      });

      this.isTrue = 1;
    },
    rmComment() {
      
      MessageBox.confirm('确定删除评论吗?').then(action => {  
        let comment_id;

        if( this.rmType === 'reply' ){
          comment_id = this.reply_id
        } else {
          comment_id = this.comment_id
        }
        this.$axios
          .post(
            SYS.URL.moments.comment_remove,
            { comment_id: comment_id
             },
            { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
          )
          .then(res => {
              let data = res.data;
              if (res.data.status == 200) {
                if( this.rmType === 'reply' ) {
                 
                  for( let i in this.comments.items[this.comment_index].moments_comment_reply['items'] ){
                      if( this.comments.items[this.comment_index].moments_comment_reply['items'][i].comment_id == res.data.data.comment_id ){
                          this.comments.items[this.comment_index].moments_comment_reply['items'].splice(i,1);
                      }
                  }
                } else {
                  for( let i in this.comments.items ){
                   
                      if( this.comments.items[i].comment_id == res.data.data.comment_id ){
                          this.comments.items.splice(i,1);
                      }
                  }
                }
              }
          });     
      });

      
    },
    // 移除like
    rmLike(islike) {
      this.$axios
        .post(
          SYS.URL.moments.like_remove,
          { like_id: islike },
          { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
        )
        .then(res => {
          console.log(res);
    
          if (res.data.status == 200) {
            this.imgDetailData.is_like = 0;
            this.imgDetailData.moments_like_count--;
            console.log('移除')
          }
        });
    },
    // like
    doLike(id) {
      this.$axios
        .post(
          SYS.URL.moments.like_add,
          { moments_id: id },
          { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
        )
        .then(res => {
          if (res.data.status == 200) {
            this.imgDetailData.is_like = res.data.data.like_id;
            this.imgDetailData.moments_like_count++;
          }
        });
    },
    // 移除收藏
    rmCollect(id) {
      this.$axios
        .post(
           SYS.URL.moments.collection_remove,
          { collection_id: id },
          { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
        )
        .then(res => {
          if (res.data.status == 200) {
            console.log("rmCollect");

            this.imgDetailData.is_collect = 0;
            this.imgDetailData.moments_collection_count--;
          }
        });
    },
    // 关注
    doCollect(id) {
      this.$axios
        .post(
          SYS.URL.moments.collection_add,
          { moments_id: id },
          { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
        )
        .then(res => {
          console.log("ok");
          if (res.data.status == 200) {
            this.imgDetailData.is_collect = res.data.data.collection_id;
            this.imgDetailData.moments_collection_count++;
          }
        });
    },
    // 移除关注
    rmFollow(id) {
      this.$axios
        .post(
          SYS.URL.moments.follow_remove,
          { follow_id: id },
          { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
        )
        .then(res => {
          console.log(res);
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
    // 移除like
    rmCommentLike(islike,index) {
      this.$axios
        .post(
          SYS.URL.moments.comment_like_remove,
          { like_id: islike },
          { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
        )
        .then(res => {
  
          if (res.data.status == 200) {
            if( this.comments.items[index].is_like === res.data.data.like_id ){
              this.comments.items[index].is_like = 0;
            } else {
              for( let i in this.comments.items[index].moments_comment_reply['items'] ){

                  if( this.comments.items[index].moments_comment_reply['items'][i].is_like == res.data.data.like_id ){

                      this.comments.items[index].moments_comment_reply['items'][i].is_like = 0;
                  }
              }
            }
            
          }
        });
    },
    // like
    doCommentLike(id,index) {
      this.$axios
        .post(
          SYS.URL.moments.comment_like_add,
          { comment_id: id },
          { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
        )
        .then(res => {
          if (res.data.status == 200) {
            if( this.comments.items[index].comment_id === res.data.data.comment_id ){
                this.comments.items[index].is_like = res.data.data.like_id;
            } else {
                for( let i in this.comments.items[index].moments_comment_reply['items'] ){
                    if( this.comments.items[index].moments_comment_reply['items'][i].comment_id == res.data.data.comment_id ){
                        this.comments.items[index].moments_comment_reply['items'][i].is_like = res.data.data.like_id;
                    }
                }
            }
          }
        });
    },
    getCommentData() {
      return new Promise((resolve, reject) => {
          if( !this.comments.more ){
              this.loadBotVisible = false;
              return;
          }
          let params = {
              'moments_id':this.id,
              'page':this.comments.page,
              'rows':10,
          };

          this.$http.get(SYS.URL.moments.comment_lists,{params:params}).then((res) => {
              var data = res.data;
              if (data.status === 200) {
                  
                  this.comments.page = data.data.page + 1;
                  this.comments.records = data.data.records;
                  this.comments.total = data.data.total;
                  if( data.data.total == data.data.page || data.data.total == 0 ){
                    this.comments.more = false;
                  }

                  for( let i in data.data.items ){
                    // data.data.items[i].moments_comment_reply.items = [];

                     

                    if( data.data.items[i].moments_comment_reply.page ==  data.data.items[i].moments_comment_reply.total || data.data.items[i].moments_comment_reply.total == 0  ){
                      data.data.items[i].moments_comment_reply.more = false;
                    } else {
                      data.data.items[i].moments_comment_reply.more = true;
                    }
                      
                  }
                  this.comments.items.push.apply(this.comments.items,data.data.items);
                 
              }
              this.moreVisible = true;
              this.loadBotVisible = false;
              
              resolve(res);
          })
      });

    },
    // 加载更多
    getmore() {
      // this.getDataList();
      this.moreVisible = false;
      this.loadBotVisible = true;
      this.getCommentData();
    },
    clickModal() {
      this.isTrue = 1;

      this.input_content = '';
    },
    share() {
    
      if( isApp ){
       
        let title = this.imgDetailData.moments_title;
        let describe = this.imgDetailData.moments_content;
        let url = window.location.href;
        let imgUrl = this.imgDetailData.moments_image[0];

        if( isApp === 'android' ){
           
            android.share( title,describe,url,imgUrl )
        } 
        if( isApp === 'ios' ){
            var str    = {"title":title,"describe":describe,"url":url,"imgUrl":imgUrl };
            var params = JSON.stringify(str);
            window.webkit.messageHandlers.share.postMessage( params );
        } 
      } else {

      }
      //this.$refs.share.showShare();
    },
    back(e) {
      if (this.$refs.fb_box == e.target) {
        this.isShow = 1;
      }
    },
    cancel(){
              this.isShow = 1;

    },
    submit(){
        this.addComment();
    },
    showSheet( user_id,comment_id,index,reply_id ){
      
      if( uid == user_id ){
        this.actions[1] = {name:'删除',method:this.rmComment }
      } else {
        this.actions[1] = {name:'举报',method:this.complaint}
      }

      this.comment_id = comment_id;
      this.reply_id = reply_id ? reply_id : 0;
      this.comment_index = index;
      this.sheetVisible = true;
     
      this.inputType = 'reply';
      if( reply_id ){
        this.rmType = 'reply';
      } else {
        this.rmType = 'comment';
      }
    },
  
    loadReply( id,index ){
      this.moreVisible = false;
      
      return new Promise((resolve, reject) => {
          if( !this.comments.items[index].moments_comment_reply.more ){
            
              return;
          }

        
          let params = {
              'comment_id':this.comments.items[index].moments_comment_reply.items[0].comment_id,
              'comment_parent_id':id,
              'page':this.comments.items[index].moments_comment_reply.page,
              'rows':5
          };
          this.$http.get(SYS.URL.moments.comment_lists,{params:params}).then((res) => {
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
            
              this.moreVisible = false;
              resolve(res);
          })
      });

    },
    loadRecommend(){
        var params = {
            'moments_id':this.id,
            'page':1,
            'rows':10,
            'tag_id':this.imgDetailData.moments_tag_id[0]
        };
        return new Promise((resolve, reject) => {
            this.$http.get(SYS.URL.moments.lists,{params:params}).then((res) => {
                var data = res.data;
                if (data.status === 200) {
                  this.lists.page = data.data.page + 1;
                  this.lists.records = data.data.records;
                  this.lists.total = data.data.total;
                  this.lists.loaded = true;
                  if( data.data.total == data.data.page || data.data.total == 0 ){
                      this.lists.more = false;
                  }

                  this.lists.items.push.apply(this.lists.items,this.fixItems(data.data.items));
                }
                resolve(res);
            })
        });
        
    },
    fixItems( items ){
        items.forEach( (item, i) => {
            let image_width  = this.maxWidth;
            let image_heigth = item.image_heigth / item.image_width * this.maxWidth;
            image_heigth = Math.min(image_heigth,this.maxHeight);
            // image_heigth = Math.max(image_heigth,image_width);

            items[i].image_width  = image_width;
            items[i].image_heigth = image_heigth;
            items[i].shown        = false;
            items[i].animate      = false;
        })

        
        return items;
    },
    productDetail(id){
      window.location.href = WapSiteUrl + '/tmpl/product_detail.html?product_id='+id
    },
    complaint(){
      this.$refs.complaint.init();
    },
    scrollAnimation(currentY, targetY){
      let needScrollTop = targetY - currentY
      let _currentY = currentY
      setTimeout(() => {
        // 一次调用滑动帧数，每次调用会不一样
        const dist = Math.ceil(needScrollTop / 10)
        _currentY += dist
        window.scrollTo(_currentY, currentY)
        // 如果移动幅度小于十个像素，直接移动，否则递归调用，实现动画效果
        if (needScrollTop > 10 || needScrollTop < -10) {
          this.scrollAnimation(_currentY, targetY)
        } else {
          window.scrollTo(_currentY, targetY)
        }
      }, 1)

    },
    scrollTo(){
      let currentY = document.body.scrollTop|| document.documentElement.scrollTop;
      let targetY = document.querySelector('.comment').offsetTop;
      console.log( targetY );
      this.scrollAnimation(currentY, targetY);

    }
  },

  // components: {
  //   comment
  // }
  filters: {
    timeID: function(data) {
      var Time = new Date(data);
      var T = Time.toLocaleDateString();
      return T;
    }
  }

};
</script>
<style lang="scss" scoped>
body {
      background-color: #f5f8fa;
}
.page {
  position: relative;
  z-index: 7;
  background: #fff;
  header {
    display: flex;
    align-items: center;
    height:2rem;
    padding:0 .5rem;
    border-bottom: 1px solid #f5f5f5;
    position: fixed;
    z-index: 999;
    background: #fff;
    width: 100%;
    top: 0;
    .header-left {
      display: flex;
      align-items: center;
      .back {
        img {
          width: 15px;
          height: 15px;
        }
      }
      .avator-img {
        width: 1.3rem;
        height: 1.3rem;
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
        color: #333;
        white-space: nowrap;
        text-overflow: ellipsis;
        width: 5rem;
        overflow: hidden;
        text-align: left;
        font-size: 0.6rem;
        font-weight:600;
      }
    }
    .header-right {
      position: absolute;
      right: 0.5rem;
      display: flex;
      align-items: center;
      img {
        width: 20px;
        height: 20px;
        vertical-align: middle;
      }
      .follow {
        border: 1px solid #ff2741;
        color: #ff2741;
        font-size: 0.5rem;
        padding: 0.2rem 0.4rem;
        border-radius: 1rem;
        margin-right: 0.5rem;
        font-weight:600;
      }
      .followed {
        border: 1px solid #999;
        color: #aaa;
        font-size: 0.5rem;
        padding: 0.2rem 0.4rem;
        border-radius: 1rem;
        margin-right: 0.5rem;
        background:transparent;
      }
    }
  }
  .container {
        position: relative;
    background: #fff;
    z-index: 5;
  }
  .swiper-container {
    overflow-y: scroll;
    .swiper-slide {
      position: relative;
      font-size: 0;
      overflow: hidden;
      .img-count {
        position: absolute;
        right: 0.5rem;
        top: .5rem;
        z-index: 999;
        background: red;
        font-size: 12px;
        background: rgba(0, 0, 0, 0.3);
        border-radius: 1rem;
        color: #fff;
        padding: .25rem;
      }
      img {
        width: 100%;
        object-fit: cover;
        max-height: 21rem;
        // margin: 0 5%;
      }
    }
  }
  .detail-info {
    padding: 0.5rem;
    text-align: left;
    .detail-wrapper {
      padding-bottom: .5rem;
      border-bottom: 1px solid #f5f5f5;
    }
    h1 {
      font-weight: 500;
      color: #000;
      font-size: 0.65rem;
      padding:.2rem 0;
    }
    .detail-content {
      color: #555;
      font-size: 0.6rem;
      margin-top:.15rem;
      line-height:.8rem;
    }
    .dynamic-tag {
      padding: 0.3rem 0;
      a {
        display: inline-block;
        background: #f5f5f5;
        color: #26a2ff;
        border-radius: 1rem;
        padding: .2rem .35rem;
        font-size:.45rem;
        font-weight:600;
        margin-bottom:.25rem;
      }
    }

    .icon-tag {
        width:.5rem !important;
        height:.5rem !important;
        background:url('../assets/img/tag_white.png');
        background-size: 60%;
        background-position: 50% 50%;
        background-repeat: no-repeat;
        background-color: #26a2ff;
        border-radius: 50%;
        opacity: 1 !important;
        vertical-align: middle;
        
    }
  }
  .about-recommend {
    background-color: #f5f5f5;
    height: 100%;
    padding-bottom: 2rem;
    .img-info {
      padding: 0.5rem;
      padding-right: 0;
      .info-title {
        color: #333;
        margin: 0 auto;
        font-weight: 500;
        font-size: 0.8125rem;
        overflow: hidden;
        -o-text-overflow: ellipsis;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        margin-bottom: 0.5rem;
      }
      .avatar-likes {
        display: flex;
        justify-content: space-between;
        .avatar-left {
          flex: 1;
          display: flex;
          align-items: center;
          a {
            width: 1.563rem;
            height: 1.563rem;
            img {
              width: 100%;
              object-fit: cover;
              max-height: 100%;
              border-radius: 50%;
            }
          }
          h3 {
            color: #333;
            font-size: 0.22rem;
            margin-left: 0.2rem;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            width: 70%;
          }
        }
        .likes-right {
          display: flex;
          flex: 1;
          align-items: center;
          justify-content: center;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          .icon-count {
          }
        }
      }
    }
  }
  .comment-bar {
    position: fixed;
    bottom: 0;
    padding: 0.25rem 0;
    border-top: 1px solid #f5f5f5;
    display: flex;
    align-items: center;
    background-color: #fff;
    width: 100%;
    height:1.65rem;
    z-index:2;
    .cmtbar-left {
      
      border-radius: 1rem;
      padding: 0.2rem 0 .2rem .5rem;
      width: 50%;
      text-align: left;
      font-size: 0.5rem;
      opacity:.7;
      span {
        background-color: #f5f5f5;
        display: block;
        padding: .3rem;
        border-radius: 1rem;
      }
      .icon-edit {
         width:.7rem !important;
        height:.7rem !important;
        background:url('../assets/img/edit.png');
        background-size: 100%;
        background-position: 50% 50%;
        background-repeat: no-repeat;
        border-radius: 50%;
        opacity: 1 !important;
        vertical-align: middle;
      }
    }
    .cmtbar-right {
      a {
        display: flex;
        align-items: center;
        color: #666;
        font-size: 0.6rem;
      }
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: .5rem;
     
    }
  }
}
.author-sign {
  color: #333;
  display: inline-block;
  border-radius: .5rem;
  background: #f5f8fa;
  padding: .1rem .25rem;
  font-size: .45rem;
}
.icon {
  width: .9rem;
  height: .9rem;
  display: inline-block;
  opacity: 1;
  margin-right: 0.1rem;
}
.icon-small {
  width: .7rem;
  height: .7rem;
}

.release-time {
  font-size: 0.45rem;
  color:#999999;
}

.scroll-wrapper {
    position: relative;
    width:100%;
    height: 100%;
    overflow: hidden;
    background: #fff;
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
    padding: .3rem 0.5rem;
    font-size: 0.6rem;
    input[type="text"] {
      width: 90%;
      border: 1px solid #aaa;
      border-radius: 20px;
      text-indent: 3px;
      padding: 0.3rem 1rem;
      margin-right: 3px;
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
input {
  background: none;
  outline: none;
  border: none;
  :focus {
    outline: none;
  }
}

.show.fb_box {
  top: 0;
}


.recommend {
  background-color: #f5f8fa;
}
.title {
  height:1.8rem;
  line-height:1.8rem;
  padding-left:.5rem;
  text-align: left;
}
.cancel {
      position: absolute;
    bottom: 0;
    width: 100%;
    padding: .5rem 0;
    border-top: 1px solid #f5f5f5;
}

  .mint-spinner-load,
  .mint-spinner-top,
  .mint-spinner-bottom {
      height: 1.5rem;
      line-height: 1.5rem;
      margin:0 auto;
      display: flex;
      justify-content: center;
      align-items: center;
  }

  .mint-spinner-top {
      margin-top: -1.8rem;
  }

  .mint-spinner-load span,
  .mint-spinner-top span,
  .mint-spinner-bottom span {
      display: inline-block;
      
  }
  .page-load {
      position: fixed;
      z-index: 999;
      width: 100%;
      top: 0;
      left: 0;
      bottom: 0;
      background-color: #fff;
  }
  .page-load span {
      position:absolute;
      left: 50%;
      top: 50%;
      transition: -50%;
      transform: translate(-50%, -50%);
  }
  .video-wrapper {
    width:100%;
    position:relative;
  }
  .video-player {
    width:100%;
    height:100%;
  }
  .video-player-icon {
    position: absolute;
    width: 2.5rem;
    height: 2.5rem;
    top: 50%;
    left: 50%;
    margin-left: -1.25rem;
    margin-top: -1.25rem;
    background-color: rgba(0, 0, 0, 0.45);
    font-size: 3.5em;
    line-height: 2.5rem !important;
    display: flex;
    justify-content: center;
    align-items: center;
    border: 2px solid #ffffff;
    border-radius: 50%;
  }
  .video-player-icon img {
    width:1rem;
    height:1rem;
  }
</style>
