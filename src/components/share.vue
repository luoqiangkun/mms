<template>
 
    <mt-popup
      v-model="popupVisible"
      position="bottom"
      :modal="modal"
      class="mint-popup-2"
      >

      <div class="share_box share_active">
          <div class="share_tips">使用微信分享或者复制网页链接</div>
            <ul class="share_ul">
                <li class="share_li" :data-clipboard-text="this.location" id="clip" @click="copyUrl">
                    <i class="icon icon-link"></i>
                </li>
                <div class="clear"></div>
            </ul>
          <div class="share_cancel" @click="cancelShare">取消</div>
      </div>
      

    </mt-popup>


      

  
</template>
<script>

import { Toast } from 'mint-ui'
import Clipboard from 'clipboard'
import { getLocalStorage,isWeixin,loadJs } from '../assets/js/utils'

export default {
    name:'share',
    data(){
      return {
        popupVisible: false,
        modal:true,
        location:'',
      }
    },
    props:{
      share: {
        type:Object,
        default: function () {
          return { 
            title:'迅有MMS',
            desc:'迅有MMS',
            link:this.location,
            type:'link',
            imgUrl:'',
            dataUrl:'',
          }
        }
      }
    },
    methods:{
      wxConfig(){
        return new Promise((resolve, reject) => {
            this.$http.get(SYS.URL.wx.config,{params:{href: this.href}}).then((res) => {
              wx.ready(function () {
                wx.onMenuShareTimeline({
                    title: this.share.title, //分享标题
                    link: this.share.link, //分享链接
                    imgUrl: this.share.imgUrl, //分享图标
                    success: function () {
                    },
                    cancel: function () {
                    }
                });

                wx.onMenuShareAppMessage({
                    title: this.share.title, //分享标题
                    desc: this.share.desc, //分享描述
                    link: this.share.link, //分享链接
                    imgUrl: this.share.imgUrl, //分享图标
                    type: this.share.imgUrl,
                    dataUrl: '',
                    success: function () {
                    },
                    cancel: function () {
                    }
                });

                wx.onMenuShareQQ({
                    title: this.share.title, //分享标题
                    desc: this.share.desc, //分享描述
                    link: this.share.link, //分享链接
                    imgUrl: this.share.imgUrl, //分享图标
                    success: function () {
                    },
                    cancel: function () {
                    }
                });

                wx.onMenuShareWeibo({
                    title: this.share.title, //分享标题
                    desc: this.share.desc, //分享描述
                    link: this.share.link, //分享链接
                    imgUrl: this.share.imgUrl, //分享图标
                    success: function () {
                    },
                    cancel: function () {
                    }
                });

                wx.onMenuShareQZone({
                    title: this.share.title, //分享标题
                    desc: this.share.desc, //分享描述
                    link: this.share.link, //分享链接
                    imgUrl: this.share.imgUrl, //分享图标
                    success: function () {
                    },
                    cancel: function () {
                    }
                });
              });
              resolve(res);
            })
        });
      },
      //复制当前链接
      copyUrl() {
          
          var clipboard = new Clipboard('#clip');  

          Toast({
            message: '复制链接成功',
            position: 'middle',
            duration: 5000
          });

      },
      //取消分享
      cancelShare() {
          this.popupVisible = false
      },
      showShare(){
          this.popupVisible = true
      }
    },
    created(){
      this.location = window.location.href;

      if( isWeixin() ){
        loadJs()
        this.wxConfig()
      }
    }
}
</script>
<style scoped>
    .mint-popup-2 {
      width:100%;
      border-top-left-radius: .5rem;
      border-top-right-radius: .5rem;
    }
   
    .share_box {
        width: 100%;
        z-index: 1002;
        background: #fff;
        border-top-left-radius: 10px;
        border-top-right-radius: 10px;
        transition: .5s;
    }
    .share_tips {
        text-align: center;
        line-height: 38px;
        color: #333;
        font-size:.5rem;
        color:#999;
    }
    .share_ul {
        box-sizing: border-box;
        border-bottom: 1px solid #e8e8e8;
        display:flex;
        justify-content: center;
        padding-bottom:.5rem;
    }
    .share_li {
        text-align: center;
        
    }
    .share_cancel {
        text-align: center;
        line-height: 48px;
        color: #777;
        text-align: center;
        font-size:.6rem;
    }
   

    .icon {
      width: 2rem;
      height: 2rem;
      display: inline-block;
      opacity: 1;
    }
  .icon-link {
      background:url('../assets/img/link.png');
      background-repeat: no-repeat;
      background-size: 60%;
      background-position: 50% 50%;
      background-color: #ccc;
      border-radius: 50%;
  }
</style>
