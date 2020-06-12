<template>
    <div class="up">
        <slot name="file">
             
        </slot>

        <div class="progress" v-show="proVisible">
            <div class="progress-mask"></div>
            <div class="progress-wrap">
                <canvas class="progress-canvas" width="60" height="60" ref="canvas"></canvas>
                <div class="progress-tips">
                    <p>视频正在上传中</p>
                    <span>不要急着退出哦~</span>
                </div>
            </div>
        </div>

        <div class="gly" v-show="swipeVisible">
            <div class="gly-bg"></div>
            <div class="gly-scroll-wrap">
                <div class="gly-container" >
                    <div class="gly-top-bar">
                        <div class="gly-esc">
                          <i class="gly-icon gly-icon-esc" @click="resetUpload"></i>  
                        </div>
                        <div class="gly-counter">{{swiper.swiperActionIndex}}/{{files.length}}</div>
                        <button class="gly-button gly-button-active" title="Next" @click="nextStep">下一步</button>
                    </div>
                    <div class="gly-show-main" id="gly-show-main" >
                      <template v-if="upload.type == 'video'">
                        <div class="video-mian" ref="videoMain">
                            <div class="video-content" id="video-player-box">
                                <video-player  
                                    ref="videoPlayer"
                                    :options="playerOptions"
                                    :playsinline="true"
                                    @play="onPlayerPlay($event)"
                                    @pause="onPlayerPause($event)"
                                    @ended="onPlayerEnded($event)"
                                    @loadeddata="onPlayerLoadeddata($event)"
                                    @statechanged="playerStateChanged($event)"
                                    @ready="playerReadied"
                                    style="display:block;height:100%"
                                    >
                                </video-player>
                            </div>
                        </div>
                        <div class="video-swiper" id="video-swiper">
                            <swiper :options="swiper.videoSwiperOption">
                                <swiper-slide v-for="(item, index) in files" :class="index == swiper.videoActionIndex ? 'video-swiper-active' : '' " :index="index" @click.stop="changeVideo">
                                    <img  :src="item.img" :alt="item.alt" :index="index" width="100%"/>
                                    <time class="duration" v-text="item.duration + 's'"></time>
                                </swiper-slide>
                            </swiper>
                        </div>
                    </template>

                    <template v-else>
                      <div class="image-swiper">
                            <swiper :options="swiper.imageSwiperOption" ref="imageSwiper">
                                <swiper-slide v-for="(item, index) in files">
                                    <img :src="item.img" :alt="item.alt" width="100%" />
                                </swiper-slide>
                            </swiper>
                        </div>
                    </template>
                    </div>
                   <div class="gly-foot-tool"></div>
                </div>
            </div>
        </div>

        <div class="form" v-show="formVisible">
            <div class="form-header">
                <div class="back">
                    <i class="mini-icon mini-icon-back" @click="outForm"></i>
                </div>
            </div>
            <form class="form-conent">
                <div class="form-field">
                    <div class="media-box">
                        <swiper :options="swiperOption">
                            <template v-if="upload.type == 'image'">
                                <swiper-slide v-for="(item,index) in files">
                                    <img @click="editImage(index)" :src="item.img" :alt="item.alt" width="60" height="60" style="border-radius:5px"/>
                                </swiper-slide>
                            </template>
                            <template v-else >
                                <swiper-slide v-for="(item,index) in files" v-if="index == swiper.videoActionIndex" >
                                    <img @click="editVideo" :src="item.img" :alt="item.alt" width="60" height="60" style="border-radius:5px"/>
                                </swiper-slide>
                            </template>

                            <swiper-slide >
                                <div id="uploadBtn">+</div>
                            </swiper-slide>

                        </swiper>
                    </div>
                </div>
                <div class="form-field">
                    <mt-field  placeholder="添加标题会有更多赞哦~" class="mint-bot" v-model="form.moments_title"></mt-field>
                </div>
                <div class="form-field">
                    <mt-field  placeholder="添加正文" type="textarea" rows="4" class="mint-bot" v-model="form.moments_content"></mt-field>
                </div>
                <div class="form-field" @click="chooseTopic">
                    <mt-field  placeholder="参与话题~" type="input" class="mint-bot" readonly v-model="form.moments_tag_name.join(',')" @focus.native.capture="stopFocus" ref="topic">
                        <img src="../assets/topic.png" width="25" />
                        <i class="mint-icon mint-icon-topic"></i>
                    </mt-field>
                    <div class="input-mask"></div>
                </div>
                <div class="form-field" @click="chooseArea">
                    <mt-field  placeholder="添加地点" type="input" class="mint-bot"  readonly  v-model="form.moments_area_name" @focus.native.capture="stopFocus" ref="area" >
                        <img src="../assets/area.png" width="25" />
                        <i class="mint-icon mint-icon-area"></i>
                     </mt-field>
                     <div class="input-mask"></div>
                </div>
                <div class="form-field" @click="chooseProduct" v-show="producShow">
                    <mt-field  placeholder="添加商品" type="input" class="mint-bot"  readonly v-model="form.moments_product_id" @focus.native.capture="stopFocus" ref="product">
                        <img src="../assets/product.png" width="25" />
                        <i class="mint-icon mint-icon-product"></i>
                    </mt-field>
                    <div class="input-mask"></div>
                </div>
                <div class="form-field form-bot">
                    <mt-button type="danger" size="normal" class="mint-button--large" @click="submitForm">发布笔记</mt-button>
                </div>
            </form>

            <mt-popup
                position="bottom"
                v-model="topicVisible"
                modal="false"
                class="mint-popup-1"
                >
                <div ref="topic" class="topic-box">
                  <div class="search-top" v-bind:style="{height:searchHeigth}">
                      <my-search 
                          v-model="search.tag_name"  
                          @input="topicSearch" 
                          placeholder="搜索"
                          ref="topic-search"
                          @cancle="topicVisible = !topicVisible" >


                          <div class="cell-lists" :style="{height:scrollHeight - 120 + 'px',marginBottom:2 + 'rem'}" v-if="tags.items.length > 0 "
                            v-infinite-scroll="loadMoreTags"
                            infinite-scroll-disabled="tagsLoading"
                            infinite-scroll-immediate-check="check"
                            infinite-scroll-distance="10"
                          >
                              
                                <div class="mint-spinner-load" v-show="loadVisible">
                                    <mt-spinner type="fading-circle"></mt-spinner>
                                </div>
                                <div class="cell-item mint-bot" @click="pickTopic( index )" v-for="(item,index) in tags.items" >
                                  <mt-cell>
                                    <span slot="title" style="font-size:.6rem;font-weight: 600;padding:1.2rem 0.25rem;display:inline-block">
                                      {{item.tag_name}}
                                      <mt-badge size="small" color="#888">{{item.tag_count}}</mt-badge>
                                    </span>
                                    
                                    <img slot="icon" src="../assets/topic.png" width="15" height="15" style="margin-left:.5rem" />
                                  </mt-cell>
                                </div>

                                <div class="mint-spinner-bottom" v-show="loadBotVisible">
                                    <mt-spinner type="fading-circle"></mt-spinner>
                                </div>


                              
                          </div>

                          <div class="cell-item mint-bot" @click="addTag" v-if="tags.items.length == 0 ">
                              <mt-cell>
                                <div class="mint-title-content" slot="title">
                                    <span style="font-size:12px;color:#999">没有想参与的话题？</span>
                                    </br>
                                    <span style="font-size:12px;color:#999">创建新话题:{{search.tag_name}}</span>
                                </div>
                              </mt-cell>
                          </div>

                      </my-search>

                  </div>

                  <div class="cell-lists">
                    <div class="pick-box">
                        <ul class="pick-list">
                          <li class="pick-item" v-for="(item,index) in form.moments_tag_id" :key="item" @click="rmPickTopic(item)">
                            <span>{{form.moments_tag_name[index]}} <i class="icon icon-del"></i> </span>
                          </li>
                        </ul>
                    </div>
                  </div>

                  <div class="cell-lists">
                      <div class="media-box" style="padding:10px">
                          <swiper :options="swiperOption2" ref="tagCategorySwiper">
                              <swiper-slide v-for="(item,index) in tag_categorys">
                                  <img  :src="item.tag_category_album" :alt="item.tag_category_name" :index="index" :class="index == tagCategoryActionIndex ? 'scale' : '' " width="80" height="50" style="border-radius:5px"/>
                                  <span :index="index" v-text="item.tag_category_name" ></span>
                              </swiper-slide>
                          </swiper>
                      </div>
                  </div>


                  <div class="cell-lists" :style="{height:scrollHeight - 120 + 'px',marginBottom:2 + 'rem'}" 
                    v-infinite-scroll="loadMoreTags"
                    infinite-scroll-disabled="tagsLoading"
                    infinite-scroll-immediate-check="check"
                    infinite-scroll-distance="10"
                  >                     
                      <div class="mint-spinner-load" v-show="loadVisible">
                          <mt-spinner type="fading-circle"></mt-spinner>
                      </div>
                      <div class="cell-item mint-bot" @click="pickTopic( index )" v-for="(item,index) in tags.items" >
                        <mt-cell>
                          <span slot="title" style="font-size:.6rem;font-weight: 600;padding:.8rem 0.25rem;display:inline-block">
                            {{item.tag_name}}
                            <mt-badge size="small" color="#888">{{item.tag_count}}</mt-badge>
                          </span>
                          
                          <img slot="icon" src="../assets/topic.png" width="15" height="15" style="margin-left:.5rem" />
                        </mt-cell>
                      </div>
                      <div class="mint-spinner-bottom" v-show="loadBotVisible">
                          <mt-spinner type="fading-circle"></mt-spinner>
                      </div>                     
                  </div>

                  <div class="confirm-foot" @click="confirmTopic">
                    <mt-button size="large" type="danger" >确定</mt-button>
                  </div>

                </div>
            </mt-popup>


            <mt-popup
                position="bottom"
                v-model="areaVisible"
                modal="false"
                class="mint-popup-1">
                <div ref="area" class="area-box">
                    <div class="search-top" v-bind:style="{height:searchHeigth}">
                        <my-search 
                            @input="areaSearch" 
                            placeholder="搜索"
                            :show="search.show"
                            v-model="search.area_name" 
                            @cancle="areaVisible = !areaVisible"
                            ref="area-search" >

                          <div class="cell-lists"  :style="{height:scrollHeight + 'px'}" 
                              v-infinite-scroll="loadMoreAreas"
                              infinite-scroll-disabled="areasLoading"
                              infinite-scroll-immediate-check="check"
                              infinite-scroll-distance="10"
                          >                           
                            <div class="mint-spinner-load" v-show="loadVisible">
                                <mt-spinner type="fading-circle"></mt-spinner>
                            </div>

                            <div class="cell-item mint-bot" @click="pickArea( index )" v-for="(item,index) in areas.items" >
                              <mt-cell>
                                <div class="mint-title-content" slot="title">
                                  <h4>{{item.name}}</h4>
                                  <span>{{item.address}}</span>
                                </div>
                              </mt-cell>
                            </div>

                            <div class="mint-spinner-bottom" v-show="loadBotVisible">
                                <mt-spinner type="fading-circle"></mt-spinner>
                            </div>
                        </div>

                        </my-search>
                    </div>
                    <div class="cell-lists"  :style="{height:scrollHeight + 'px'}"
                      v-infinite-scroll="loadMoreAreas"
                      infinite-scroll-disabled="areasLoading"
                      infinite-scroll-immediate-check="check"
                      infinite-scroll-distance="10"
                    >                        
                        <div class="mint-spinner-load" v-show="loadVisible">
                            <mt-spinner type="fading-circle"></mt-spinner>
                        </div>

                        <div class="cell-item mint-bot" @click="pickArea( index )" v-for="(item,index) in areas.items" >
                          <mt-cell>
                            <div class="mint-title-content" slot="title">
                              <h4>{{item.name}}</h4>
                              <span>{{item.address}}</span>
                            </div>
                          </mt-cell>
                        </div>

                        <div class="mint-spinner-bottom" v-show="loadBotVisible">
                            <mt-spinner type="fading-circle"></mt-spinner>
                        </div>
                    </div>
                    
                </div>                
            </mt-popup>


            <mt-popup
                position="bottom"
                v-model="productVisible"
                modal="false"
                class="mint-popup-1"
            >
                <div ref="product" class="product-box">
                    <div class="search-top" v-bind:style="{height:searchHeigth}">
                        <my-search 
                            @input="productSearch" 
                            placeholder="搜索"
                            :show="search.show"
                            v-model="search.product_name" 
                            @cancle="productVisible = !productVisible"
                            ref="product-search" >
                          
                          <div class="cell-lists" :style="{height:scrollHeight - 41 + 'px'}"
                            v-infinite-scroll="loadProducts"
                            infinite-scroll-disabled="productLoading"
                            infinite-scroll-immediate-check="check"
                            infinite-scroll-distance="10"
                          >
                             
                              <div class="mint-spinner-load" v-show="loadVisible">
                                  <mt-spinner type="fading-circle"></mt-spinner>
                              </div>


                             
                              <mt-checklist
                                align="right"
                                v-model="form.moments_product_id"
                                :options="options"
                                style="font-size:.6rem"
                                v-if="upload.type === 'image'"
                              >
                              </mt-checklist>

                              <mt-radio
                                v-model="form.moments_product_id[0]"
                                :options="options"
                                style="font-size:.6rem"
                                v-else 
                              >
                              </mt-radio>

                              <div class="mint-spinner-bottom" v-show="loadBotVisible">
                                  <mt-spinner type="fading-circle"></mt-spinner>
                              </div>

                            
                          </div>

                        </my-search>
                    </div>
                    <div class="cell-lists" :style="{height:scrollHeight - 41 + 'px'}" 
                      v-infinite-scroll="loadProducts"
                      infinite-scroll-disabled="productLoading"
                      infinite-scroll-immediate-check="check"
                      infinite-scroll-distance="10"
                    >
                        <div class="mint-spinner-load" v-show="loadVisible">
                            <mt-spinner type="fading-circle"></mt-spinner>
                        </div>

                        <mt-checklist
                            align="right"
                            v-model="form.moments_product_id"
                            :options="options"
                            style="font-size:.6rem"
                            v-if="upload.type === 'image'"
                          >
                          </mt-checklist>

                          <mt-radio
                            align="right"
                            v-model="form.moments_product_id[0]"
                            :options="options"
                            style="font-size:.6rem"
                            v-else 
                          >
                          </mt-radio>

                        <div class="mint-spinner-bottom" v-show="loadBotVisible">
                            <mt-spinner type="fading-circle"></mt-spinner>
                        </div>

                    </div>
                    
                    <div class="confirm-foot" @click="pickProduct">
                        <mt-button size="large" type="danger" >确定</mt-button>
                    </div>
                </div>                
            </mt-popup>

            <mt-actionsheet
                :actions="actions"
                :cancelText="cancelText"
                v-model="sheetVisible">
            </mt-actionsheet>
        </div>
    </div>
</template>
<script>
import Vue from 'vue'
import qs from 'qs'
import { Indicator } from 'mint-ui';
import { MessageBox } from 'mint-ui';
import { Toast } from 'mint-ui';
import plupload from 'plupload'
import VueAwesomeSwiper from 'vue-awesome-swiper'
import 'swiper/dist/css/swiper.css'
import VueVideoPlayer from 'vue-video-player'
import 'video.js/dist/video-js.css'

import loadBMap from '../assets/loadBMap.js'
import search from './search'
Vue.use(VueVideoPlayer)
Vue.use(VueAwesomeSwiper)

import BScroll from 'better-scroll'

export default {
  name:'upload',
  components:{
    'my-search' : search
  },
  data(){
    return {
      uploader : {},
      upload:{
          total:0,
          loaded:0,
          speed:0,
          progress:0,
          status:0,
          type:'image',
          success:false
      },
      swiper:{
        type:'image',
        swiperActionIndex:1,
        imageSwiperOption:{
           pagination: {
            el: '.swiper-pagination',
            type: 'fraction',
               },
              on:{
                  slideChange:(e) => {
                      let index = this.$refs.imageSwiper.swiper.activeIndex
                      this.swiper.swiperActionIndex = index + 1;
                  },
              },
        },
        videoSwiperOption:{
            slideToClickedSlide: true,
            slidesPerView: 3,
            spaceBetween: 30,
            on:{
              tap:(e) => {
                
                let swiper = this.$refs.videoSwiper;
               
                let index = Number(e.target.getAttribute('index'));

                if( this.swiper.videoActionIndex != index ){
                  var file = this.files[index];
                  this.swiper.videoActionIndex = index;
                      this.swiper.swiperActionIndex = index + 1;
                      this.fileActionIndex = index;
                  this.setPlayerOptions( file );
                }

              },
            },
        },
        videoActionIndex:0,
      },
      playerOptions: {

      },
      fileActionIndex:0,
      tagCategoryActionIndex:-1,
      upVisible:true,
      proVisible:false,
      swipeVisible:false,
      topicVisible:false,
      areaVisible:false,
      productVisible:false,
      formVisible:false,
      sheetVisible:false,
      searchHeigth:'50px',
      swiperOption: {
        slidesPerView: 5,
        spaceBetween: 10,
      },
      swiperOption2: {
        slidesPerView: 4,
        spaceBetween: 3,
        slideToClickedSlide: true,
        on:{
            tap:(e) => {
                let index = Number(e.target.getAttribute('index'));
                this.tagCategoryActionIndex = index;
               
                this.refreshTag( this.tag_categorys[index].tag_category_id );
            }
        },
      },
      areas:{
          page:0,
          records:0,
          total:0,
          more:true,
          items:[],
      },
      tags:{
          page:1,
          records:0,
          total:0,
          more:true,
          items:[],
      },
      products:{
          page:1,
          records:0,
          total:0,
          more:true,
          items:[],
      },
      options:[
      ],
      tag_categorys:[],
      search:{
          tag_category_id : 0,
          tag_name : '',
          area_name : '',
          product_name : '',
          location:'',
          show:false
      },
      actions:[
      {
          name:'保存为草稿',
          method:this.draft
      },
      {
          name:'不保存',
          method:this.out
        }
      ],
      cancelText:'取消',
      tagsLoading:true,
      areasLoading:true,
      productsLoading:true,
      check:false,
      scrollHeight:0,
      loadVisible:false,
      loadBotVisible:false,
      hold:false,
      producShow:false,
    }
  },
  props: {
    browse_button: {
      type:Array,
      default: function () {
        return []
      }
    },
    container: String,
    files: {
      type:Array,
      default: function () {
        return []
      }
    },
    uptype:String,
    form: {
      type:Object,
      default: function () {
        return { 
          moments_id:0,
          moments_title:'',
          moments_content:'',
          moments_tag_id:[],
          moments_area_id:0,
          moments_product_id:[],
          moments_image:[],
          moments_video:[],
          moments_tag_name:[],
          moments_area_name : '',
          moments_draft:1,
          moments_latitude:0,
          moments_longitude:0
        }
      }
    }
  },
  computed:{
      uploadStatus(){
        return this.upload.status;
      },
      player() {
        return this.$refs.videoPlayer.player
      },
      videoSwiper(){

      },
      imageSwiper(){

      }
  },
  methods:{
      out(){

          if( this.upload.type === 'video' ){
            this.$refs.videoPlayer.dispose();
          }
          

          this.upVisible = false;
          this.formVisible = false;
          this.proVisible = false;
          this.swipeVisible = false;
          this.upload = {
              total:0,
              loaded:0,
              speed:0,
              progress:0,
              status:0,
              success:false,
              type:'image',
          };
          this.areas.items = [];
          this.tags.items = [];
          this.search = {
              tag_name : '',
              area_name : '',
              product_name : '',
              location:'',
              show:false
          }
          
          this.$emit('upout');
      },
      resetUpload(){
          MessageBox.confirm('关闭后将不会保存').then(action => {
             this.out();
          });
      },
      initUploader(){
          var self = this;
         
          this.uploader = new plupload.Uploader({
              runtimes : 'html5,flash,silverlight,html4',
              browse_button : self.browse_button,
              container: self.container,
              max_file_size : '100mb',
              url: ApiUrl + "/index.php?ctl=Media&met=uploadMoments&typ=json",
              flash_swf_url: '../assets/plupload/Moxie.swf',
              silverlight_xap_url: '../assets/plupload/Moxie.xap',
              filters : [
                {title: "Files", extensions: "avi,jpg,jpeg,png,zip,mp4,mov,mkv,rmvb,fly,mpg"}
              ],
              file_data_name:'upfile',
              unique_names:true,
              // resize: {
              //     width: 1080,
              //     height: 1436,
              //     crop: true,
              //     quality: 90,
              //     preserve_headers: false
              // },
              init: {
                  PostInit() {
                      
                  },
                  FilesAdded(up, files) {

                      //通过添加的第一个文件来判断文件类型
                      if( files[0] ){
                        self.upload.type = files[0].type.split('/')[0];
                      }

                      let fileTypes = [];
                      let total = 0;

                      if( self.upload.type === 'image' && self.files.length >= 9 ){
                        Toast('上传图片不能超过9张');
                        return;
                      }

                      let file_length = self.files.length;
                      let l = 9 - file_length;
                     
                      for( let i in files ){

                        let filetype = files[i].type.split('/')[0];
                        if( filetype !== self.upload.type || i >= l ){
                          up.removeFile( files[i] );
                        } else {
                          total += files[i].size
                        }
                         
                      }
                      up.start();
                      self.upload.total = total;
                  },
                  FilesRemoved(up, file){

                  },
                  UploadFile(up, file){
                      
                  },
                  UploadProgress(up, file) {
                      self.upload.loaded = up.total.loaded;
                      self.upload.speed = up.total.bytesPerSec;
                      self.upload.progress = up.total.percent;
                      if( self.upload.type == 'video' ){
                          self.draw(self.upload.status,self.upload.progress);
                      } else {
                          self.upload.status = up.total.percent;
                          if( self.upload.status == 100 ){
                              Indicator.close();
                              Indicator.open({
                                text: '图片加载中...',
                                spinnerType: 'fading-circle'
                              });

                          }
                      }
                  },
                  FileUploaded(up, file,info ){
                      let res = eval("(" + info.response + ")");
                      if (res.status != 200)
                      {
                          alert(res.msg);
                      }
                      else
                      { 
                        if( res.data.state == 'SUCCESS' ){
                          if( res.data.type == '.mp4' || res.data.type == '.avi' || res.data.type == '.mov'  || res.data.type == '.mkv' || res.data.type == '.rmvb' || res.data.type == '.fly' || res.data.type == '.mpg' ){
                            var item = {
                                  img: res.data.cover,
                                  src: res.data.url,
                                  alt: res.data.title,
                                  title: res.data.title,
                                  width:res.data.width,
                                  height:res.data.height,
                                  type:res.data.type,
                                  duration:res.data.duration
                              }
                          } else {
                            var item = {
                                  img: res.data.url,
                                  src: res.data.url,
                                  alt: res.data.title,
                                  title: res.data.title,
                                  type:res.data.type
                                }
                          }
                          self.files.push( item );
                        }
                      }
                  },
                  UploadComplete(up,files){
                      self.upload.success = true;
                      if( self.upload.type == 'video' ){
                        self.$nextTick( () => {
                          self.setPlayerOptions( self.files[0] )
                            Indicator.close()
                          }  
                        )
                      } else {
                        Indicator.close()
                      }
                  },
                  Error(up, err) {
                  }
              }
          });
          this.uploader.init()
      },
      draw( status,percent ){
          /*
            @status  : 开始状态
            @percent：绘制圆环百分比, 范围[0, 100]
          */
          var element  = this.$refs.canvas;
          var context  = element.getContext("2d");
          var center_x = element.width / 2;
          var center_y = element.height / 2;
          var rad = Math.PI*2/100; 
          var speed = status;

          // 绘制背景圆圈
          function backgroundCircle(){
              context.save();
              context.beginPath();
              context.lineWidth = 4; //设置线宽
              var radius = center_x - context.lineWidth;
              context.lineCap = "round";
              context.strokeStyle = "#999999";
              context.arc(center_x, center_y, radius, 0, Math.PI*2, false);
              context.stroke();
              context.closePath();
              context.restore();
          }

          //绘制运动圆环
          function foregroundCircle(n){
              context.save();
              context.strokeStyle = "#ffffff";
              context.lineWidth = 4;
              context.lineCap = "round";
              var radius = center_x - context.lineWidth;
              context.beginPath();
              context.arc(center_x, center_y, radius , -Math.PI/2, -Math.PI/2 +n*rad, false); //用于绘制圆弧context.arc(x坐标，y坐标，半径，起始角度，终止角度，顺时针/逆时针)
              context.stroke();
              context.closePath();
              context.restore();
          }
        
          //绘制文字
          function text(n){

              var n = Number(n);
              context.save(); //save和restore可以保证样式属性只运用于该段canvas元素
              context.fillStyle = "#ffffff";
              var font_size = 12;
              context.font = font_size + "px Helvetica";
              var text_width = context.measureText(n.toFixed(0)+"%").width;
              context.fillText(n.toFixed(0)+"%", center_x-text_width/2, center_y + font_size/2);
              context.restore();
          }

          window.requestAnimationFrame = (function(){
              return  window.requestAnimationFrame       || 
                  window.webkitRequestAnimationFrame || 
                  window.mozRequestAnimationFrame    || 
                  window.oRequestAnimationFrame      || 
                  window.msRequestAnimationFrame     || 
                  function( callback ){
                    window.setTimeout(callback, 1000 / 60);
                  };
          })();


          var self = this;
          function drawFrame(){
              context.clearRect(0, 0, element.width, element.height);
              backgroundCircle();
              text(speed);
              foregroundCircle(speed);
            
              if( speed < percent ){
                  window.requestAnimationFrame(drawFrame);
              }

              self.upload.status = speed;
              speed += 1;
          }

          window.requestAnimationFrame(drawFrame);
      },
      setPlayerOptions( file ){
          //计算尺寸
          let vw = document.body.clientWidth;
          let vh = document.getElementById('gly-show-main').offsetHeight - document.getElementById('video-swiper').offsetHeight;
          
          console.log( this.$refs.videoMain );

          let fw = file.width;
          let fh = file.height;

         
          if( fw / fh > vw / vh ){
              var w = vw;
              var h = fh / fw * vw;
          } else {
              var h = vh;
              var w = fw / fh * vh;
          }
          
          document.getElementById('video-player-box').style.width = w + 'px';
          document.getElementById('video-player-box').style.height = h + 'px';
        
          this.playerOptions = {
              controls:true,
              autoplay:true,
              muted: false,
              loop:true,
              language: 'en',
              preload:'auto',
              fluid:false,
              width:w,
              height:h,
              sources: [{
                  type: "video/mp4",
                  src: file.src
              }],
              poster: file.img,
        }
      },
      onPlayerPlay(player) {
        // console.log('player play!', player)
      },
      onPlayerPause(player) {
        // console.log('player pause!', player)
      },
      onPlayerEnded(player){

      },
      onPlayerLoadeddata(player){

      },
      // ...player event

      // or listen state event
      playerStateChanged(playerCurrentState) {
        // console.log('player current update state', playerCurrentState)
      },
      // player is ready
      playerReadied(player) {
        console.log('the player is readied', player)
        // you can use it to do something...
        // player.[methods]
      },
      nextStep(){
          this.swipeVisible = false;
          this.formVisible = true;
          if( this.upload.type === 'video' ){
            this.$refs.videoPlayer.player.pause();
          }
      },
      outForm(){
          this.actions = [
          {
              name:'保存为草稿',
              method:this.draft
          },
          {
              name:'不保存',
              method:this.out
            }
          ];
          this.sheetVisible = true;
      },
      editVideo(){
          this.actions = [
          {
              name:'预览视频',
              method:this.stepBack
          },
          {
              name:'删除视频',
              method:this.delFile
          }
          ];

          this.sheetVisible = true;
      },
      editImage( index ){
          this.actions = [
          {
              name:'编辑',
              method:this.stepBack
          },
          {
              name:'删除',
              method:this.delFile
          }
          ];

          this.sheetVisible = true;
          this.fileActionIndex = index;
      },
      stepBack(){
          this.formVisible = false;
          this.swipeVisible = true;
      },
      stopFocus( e ){
        e.srcElement.blur();
      },
      delFile( e ){
          this.files.splice(this.fileActionIndex,1);
      },
      config(){
        return new Promise((resolve, reject) => {        //做一些异步操作
            this.$http.get(SYS.URL.moments.config).then( (res) => {
               this.producShow = !res.data.data.moments_bind_product ? false : true;
               resolve(res);
            })
        });
      },
      chooseArea(){
        this.initBMap();
        this.areaVisible = true;
        this.loadVisible = true;
      },
      chooseTopic:function(){

          this.loadTagCategorys().then( () => {
            this.tags = {
              page:1,
              records:0,
              total:0,
              more:true,
              items:[],
            };
            this.loadTags();
          });
          this.topicVisible = true;
          this.loadVisible = true;
      },
      chooseProduct:function(){
          this.products = {
            page:1,
            records:0,
            total:0,
            more:true,
            items:[],
          };
          this.loadProducts();
          this.productVisible = true;
          this.loadVisible = true;
      },
      pickTopic( index ){

        this.search.tag_name = '';
        //this.topicVisible = false;
        let name = this.tags.items[index].tag_name;
        let id   = this.tags.items[index].tag_id;

      
        if( this.form.moments_tag_id.indexOf(id) == -1 ){
          this.form.moments_tag_id.push( id );
          this.form.moments_tag_name.push( name );
        }


        this.$nextTick( () => {
          let width = 0;
          let wrapper_items = document.querySelectorAll('.pick-item');
          if( wrapper_items.length == 0 ){
            return true;
          }

          for( let i = 0; i < wrapper_items.length; i++ ){

              width += wrapper_items[i].offsetWidth;
          }
          document.querySelector('.pick-list').style.width = width + 20 + 'px';
        })

        
        let scroll = new BScroll(document.querySelector('.pick-box'),{
          scrollX:0,
          click:true,
          scrollX:true,
          scrollY:false,
          eventPassthrough:'vertical',
        })

      },
      rmPickTopic( id ){
        var index = this.form.moments_tag_id.indexOf(id);
        if( index > -1 ){
           this.form.moments_tag_name.splice(index,1);
          this.form.moments_tag_id.splice(index,1);
        }
        return;
      },
      confirmTopic(){
        this.topicVisible = false;
      },
      pickArea( id ){
        this.search.area_name = '';
        this.areaVisible = false;
        this.form.moments_area_name = this.areas.items[id].name;
        this.form.moments_area_id   = this.areas.items[id].district_id;
        this.form.moments_longitude = this.areas.items[id].location.lng;
        this.form.moments_latitude = this.areas.items[id].location.lat;
      },
      pickProduct( id ){
          this.search.product_name = '';
          this.productVisible = false;
      },
      loadTagCategorys(){
          return new Promise((resolve, reject) => {        //做一些异步操作

              this.$http.get(SYS.URL.moments.tag_category_lists).then( (res) => {
                  var data = res.data;
                  if (data.status === 200) {
                      this.tag_categorys = data.data.items;
                      this.search.tag_category_id = data.data.items[0].tag_category_id;
                      
                  }
                  resolve(res);
              })
          });
      },
      loadMoreTags(){
        this.loadBotVisible = true;
        this.loadTags().then(()=>{
          this.loadBotVisible = false;
        });
      },
      loadTags(){
        this.tagsLoading = true;
       
        var params = {'tag_name':this.search.tag_name,'tag_category_id':this.search.tag_category_id,'page':this.tags.page,'rows':10};
        return new Promise((resolve, reject) => {
            if( !this.tags.more ){
                this.loadVisible = false;
                this.loadBotVisible = false;
                resolve(res);
                return;
            }
            this.$http.get(SYS.URL.moments.tag_lists,{params:params}).then((res) => {
                var data = res.data;
                if (data.status === 200) {
                    this.tags.page = data.data.page + 1;
                    this.tags.records = data.data.records;
                    this.tags.total = data.data.total;
                    this.tags.loaded = true;
                    if( data.data.total == data.data.page ){
                      this.tags.more = false;
                    }
                  
                    this.tags.items.push.apply(this.tags.items,data.data.items);
                }
                this.loadVisible = false;
                this.tagsLoading = false;

                resolve(res);
            })
        });
      },
      refreshTag( tag_category_id ){
       
        this.search.tag_category_id = tag_category_id;
        this.tags = {
          page:1,
          records:0,
          total:0,
          more:true,
          items:[],
        };
        this.loadVisible = true;
        this.loadTags();
      },
      addTag(){
          var params = qs.stringify({
                'tag_name':this.search.tag_name,
                'tag_category':this.search.tag_category_id,
                'tag_album': this.files[0].img
              });

          return new Promise((resolve, reject) => {
            if( !this.tags.more ){
                return;
            }
            this.$http.post(SYS.URL.moments.tag_add,params).then((res) => {
                var data = res.data;
                if (data.status === 200) {
                 
                  this.form.moments_tag_id.push( data.data.tag_id );
                  this.form.moments_tag_name.push( data.data.tag_name );
                  this.search.tag_name = '';
                  
                }
                this.loading = false;

                resolve(res);
            })
          });
      },
      initBMap(){
        loadBMap('Yi9XWlwa7sUGSuKGDiPBrS261bMeu6YF')
          .then(() => {
            // 百度地图API功能
            var geolocation = new BMap.Geolocation();
            var geoc = new BMap.Geocoder();
            var self = this;

            geolocation.getCurrentPosition(function(r){
                if(this.getStatus() == BMAP_STATUS_SUCCESS){
                  // console.log( r );
                 //    window.location = {'lng':r.point.lng, lat:r.point.lat};
                    self.location = r.point.lat + ',' + r.point.lng;

                    self.areas = {
                      page:1,
                      records:0,
                      total:0,
                      more:true,
                      items:[],
                    };

                    self.loadAreas();
                } else {
                    alert('failed'+this.getStatus());
                }
            },{enableHighAccuracy: true})
            
          })
          .catch(err => {
            console.log('失败')
          })
      },
      loadMoreAreas(){
        this.loadBotVisible = true;
        this.loadAreas().then(()=>{
          this.loadBotVisible = false;
        });
      },
      loadAreas(){
        this.areasLoading = true;

        return new Promise((resolve, reject) => {
            if( !this.areas.more ){
                this.loadVisible = false;
                this.loadBotVisible = false;
                resolve(res);
                return;
            }

            var params = {
                'page':this.areas.page,
                'location':this.location,
                'area_name' : this.search.area_name
            };

            this.$http.get(SYS.URL.moments.nearbyArea,{params:params}).then((res) => {
                var data = res.data;
                if (data.status === 200) {
                    this.areas.page = data.data.page + 1;
                    this.areas.loaded = true;
                    if( data.data.items.length == 0 ){
                      this.areas.more = false;
                    }
                   
                    this.areas.items.push.apply(this.areas.items,data.data.items);

                }
                this.loadVisible = false;
                this.areasLoading = false;
                resolve(res);
            })
        });
      },
      loadProducts(){
          this.productLoading = true;
          var params = {
                  'product_name' : this.search.product_name,
                  'page':this.products.page,
              };
          return new Promise((resolve, reject) => {
            if( !this.products.more ){
                this.loadVisible = false;
                this.loadBotVisible = false;
                resolve(res);
                return;
            }
            this.$http.get(SYS.URL.moments.product,{params:params}).then((res) => {
                var data = res.data;
                if (data.status === 200) {
                    this.products.page = data.data.page + 1;
                    this.products.records = data.data.records;
                    this.products.total = data.data.total;
                    this.products.loaded = true;
                    if( data.data.total == data.data.page ){
                      this.products.more = false;
                    }
                   
                    this.products.items.push.apply(this.products.items,data.data.items);

                    var products = this.products.items;
                    for( let i in products ){
                        this.options.push({
                            label: products[i].product_name,
                            value: products[i].product_id,
                            disabled: false
                        })
                    }
                }
                this.loadVisible = false;
                this.productLoading = false;

                resolve(res);
            })
        });
      },
      areaSearch( val ){
          if( val ){
              this.searchHeigth = '100%';
          } else {
              this.searchHeigth = '50px';
          }
          this.areas = {
              page:1,
              records:0,
              total:0,
              more:true,
              items:[],
          };
          this.loadVisible = true;
          this.loadAreas();
      },
      topicSearch( val ){
          if( val ){
              this.searchHeigth = '100%';
          } else {
              this.searchHeigth = '50px';
          }
          this.tags = {
            page:1,
            records:0,
            total:0,
            more:true,
            items:[],
          }
          this.loadVisible = true;
          this.loadTags();

      },
      productSearch( val ){
          if( val ){
              this.searchHeigth = '100%';
          } else {
              this.searchHeigth = '50px';
          }
          this.products ={
            page:1,
            records:0,
            total:0,
            more:true,
            items:[],
          };
          this.loadVisible = true;
          this.loadProducts();
      },
     
      draft(){
          this.form.moments_draft = 0;
          this.submitForm();
      },
      submitForm(){

          if( this.hold ){
            return;
          }
          this.hold = true;
         
          event.preventDefault();

          if( this.files.length === 0 ){
              this.hold = false;
              return Toast('上传文件不能为空');
          }

          if( !this.form.moments_title ){
            this.hold = false;
            return Toast('请填写动态标题');
          }

          if( !this.form.moments_content ){
            this.hold = false;
            return Toast('请填写动态内容');
          }

          if( !this.form.moments_tag_id ){
            this.hold = false;
            return Toast('请填写动态话题');
          }

          let formData = new FormData();
          formData.append('moments_id', this.form.moments_id);
          formData.append('moments_title', this.form.moments_title);
          formData.append('moments_content', this.form.moments_content);
          formData.append('moments_area_id', this.form.moments_area_id);
          formData.append('moments_area_name', this.form.moments_area_name);
          formData.append('moments_tag_id', this.form.moments_tag_id.join(','));
          formData.append('moments_draft', this.form.moments_draft);
          formData.append('moments_product_id', this.form.moments_product_id);
          formData.append('moments_longitude', this.form.moments_longitude);
          formData.append('moments_latitude', this.form.moments_latitude);
         
          if( this.upload.type == 'image' ){
              var moments_image = [];
              for( let i in this.files ){
                    moments_image.push( this.files[i].src );
              }
              formData.append('moments_image', moments_image);
              formData.append('moments_type', 1);
          }
          if( this.upload.type == 'video' ){
              var moments_video = this.files[this.swiper.videoActionIndex].src;
              var moments_image = this.files[this.swiper.videoActionIndex].img;

            // for( let i in this.files ){
            //  formData.append('moments_video[]', this.files[i].src);
           //        formData.append('moments_image[]', this.files[i].img);
            // }
              formData.append('moments_video', moments_video);
              formData.append('moments_image', moments_image);
              formData.append('moments_type', 4);
            
          }

          let config = {
              headers: {
                  'Content-Type': 'mulmomentsart/form-data'
              }
          }
          let url;
          if( this.form.moments_id ){
            url = SYS.URL.moments.edit
          } else {
            url = SYS.URL.moments.add
          }
          this.$http.post(url, formData, config).then( (res) => {
              var data = res.data;
              if (data.status === 200) {
                  this.out();
                  this.$emit('upout');
              } else {
                  return Toast(data.msg);
              }

              this.hold = false;
          })
      }
  },
  watch:{
    uploadStatus(newValue, oldValue){
        if( this.upload.type == 'image' ){
          if( oldValue == 0 ){
              Indicator.open();
          }

          if( newValue == 100 ){
              Indicator.close();
              this.swipeVisible = true;
          }

        }


        if( this.upload.type == 'video' ){
          if( oldValue == 0 ){
              this.proVisible = true;
          }
          if( newValue == 100 ){
              this.proVisible = false; 
              this.swipeVisible = true;

              if( !this.upload.success ){
                  Indicator.open({
                    text: '视频加载中...',
                    spinnerType: 'fading-circle'
                  });
              }
          }
        }
    },
    productVisible(newValue, oldValue){
        if( newValue ){
            this.productLoading = false; 
        } else {
          this.productLoading = true;
        }
    },
    topicVisible(newValue, oldValue){
        if( newValue ){
            this.tagsLoading = false; 
        } else {
          this.tagsLoading = true;
        }
    },
    areaVisible(newValue, oldValue){
      if( newValue ){
          this.areasLoading = false; 
      } else {
          this.areasLoading = true;
      }
    },
    uptype( newValue ){
      this.upload.type = newValue;
    }
  },
  mounted(){
      var viewportHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight || 0;
      this.scrollHeight = viewportHeight - 50;
  },
  created(){
      this.config();
  },
  beforeDestroy(){
     
  }
}
</script>
<style scoped>
    
</style>
