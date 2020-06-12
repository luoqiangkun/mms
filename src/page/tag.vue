
<template>
  <div class="page" id="tag">  

    <div class="header " :class="showTitle ? '' : 'header-transparent' ">
      <div class="header-back" @click="goBack"></div>
      <h3 class="header-title" style="height:2rem;">{{ showTitle ? tagData.tag_name : ''}}</h3>
      <div class="header-share" @click="share" v-show="isApp"></div>
    </div>

    <div 
      class="container"
      style="overflow: auto;top:0"
      v-infinite-scroll="loadMore"
      infinite-scroll-disabled="loading"
      infinite-scroll-distance="10"
      infinite-scroll-immediate-check="check"
      :style="{height:scrollHeight + 'px'}"
    >
      <div class="banner">
          <div class="banner-album">
              <img :src="tagData.tag_album ? tagData.tag_album : 'https://shop.xunyoutest.com/image.php/shop/data/upload/media/plantform/file/20190903/1567498245171301.jpg'" />
          </div>

          <div class="banner-content">
              <div class="banner-info">
                  <div class="banner-title">
                    <i class="icon icon-tag"></i>{{tagData.tag_name}}
                  </div>
                  <div class="banner-desc">
                    {{tagData.tag_content}}
                  </div>
              </div>

              <div class="banner-tool">
                <span>{{tagData.tag_count}}人参与</span>

                <span>{{tagData.tag_view_count}}人浏览</span>

              </div>

              <div class="banner-button">
              
                <span class="btn-followed" @click="rmFollow(tagData.is_follow)" v-if="tagData.is_follow">已关注</span>
                <span class="btn-follow" @click="doFollow(tagData.tag_id)" v-else>关注</span>

              </div>
          </div>
         
      </div>  

      <div class="nav-container" :style="{height:navHeight + 'px'}">
        <div class="nav-bar" :class="fixed ? 'nav-fixed' : '' ">
            <div class="nav-inner" style="width:30%">
                <div class="nav-inner-item" v-bind:class="active == 'tab-container1' ? 'selected' : ''" @click="renderTab('tab-container1')"><span>最新</span></div>
                <div class="nav-inner-item" v-bind:class="active == 'tab-container2' ? 'selected' : ''" @click="renderTab('tab-container2')"><span>最热</span></div>
                
            </div>
        </div>
      </div>      

      <div class="tab-container">
          <div class="mint-spinner-load" v-show="loadVisible">
              <mt-spinner type="fading-circle"></mt-spinner>
          </div>
          <div class="tab-wrapper">
             <my-tab-container class="page-tabbar-tab-container" v-model="active" :swipeable = "swipeable" @end-move="endMove" @start-move="startMove" >
              <mt-tab-container-item id="tab-container1">
                  <div class="moments-scroll" v-show="data.tab1.loaded" ref="wrapper1" style="overflow: hidden;">
                    <mt-loadmore :top-method="loadTop" :maxDistance="maxDistance" ref="loadmore1">
                      <div slot="top" class="mint-spinner-top">
                        <mt-spinner type="fading-circle"></mt-spinner>
                      </div>

                      <div class="moments-list effect-1" id="waterfull0" v-if="data.tab1.items.length > 0">
                          <template >
                              <div class="moments-item" :index="item.index" v-for="(item,index) in data.tab1.items" :class="item.shown ? 'shown animate' : '' ">
                                <div class="moments-wrap">
                                    <div class="moments-media" v-bind:style="{height: item.image_heigth + 'px',maxHeight: maxHeight + 'px' }">
                                        <router-link :to="'/detail/'+item.moments_id" v-if="item.moments_type==1">
                                            <img v-lazy="item.moments_image[0]" style="width:100%;display:block;"></img>
                                        </router-link>

                                           
                                        <template  v-else-if="item.moments_type==4">
                                            <img v-lazy="item.moments_image[0]" style="width:100%;display:block" @click="jumpVideoPlay(item.moments_id)"/>
                                            <i class="icon icon-video" ></i>
                                        </template>


                                    </div>
                                    <div class="moments-content">
                                        <router-link :to="'/detail/'+item.moments_id" style="display:block" v-if="item.moments_type==1">
                                              <p v-html="item.moments_title.toString()"></p>
                                        </router-link>

                                        <p v-html="item.moments_title.toString()" v-else-if="item.moments_type==4" @click="jumpVideoPlay(item.moments_id)"></p>
                                    </div>

                                    <div class="moments-info">
                                        <router-link :to="uid == item.user_id ? '/home' : '/user/' + item.user_id" style="display:block">
                                            <div class="moments-uper">
                                              <div class="uper-avatar">
                                                <img :alt="item.user_avatar" :src="item.user_avatar" class="" style="display:block" />
                                              </div>
                                              <div class="uper-nickname">
                                                  {{item.user_nickname}}
                                              </div>
                                            </div>
                                        </router-link>
                                        <div class="moments-collect">
                                            <i class="icon icon-liked" @click="rmLike(item.is_like,index)" v-if="item.is_like"></i>
                                            <i class="icon icon-like" @click="doLike(item.moments_id,index)" v-else></i>

                                            <span>{{item.moments_like_count}}</span>
                                        </div>
                                    </div>        
                                </div>                           
                              </div>
                          </template>
                            
                      </div>

                      <div class="no-record" v-else>
                          <div class="no-record-content">
                              <div class="no-record-bg">
                                  <img src="../assets/img/tiezi.png" style="width:60px"/>
                              </div>
                              <p>暂无相关的数据哦~</p>
                          </div>
                      </div>
                    </mt-loadmore>
                      
                  </div>
              </mt-tab-container-item>

              <mt-tab-container-item id="tab-container2">
                  <div class="moments-scroll" v-show="data.tab2.loaded" ref="wrapper2" style="overflow: hidden;">
                    <mt-loadmore :top-method="loadTop" :maxDistance="maxDistance" ref="loadmore2">
                      <div slot="top" class="mint-spinner-top">
                        <mt-spinner type="fading-circle"></mt-spinner>
                      </div>
                      <div class="moments-list effect-1" id="waterfull1" v-if="data.tab2.items.length > 0">
                          <template>
                              <div class="moments-item" :index="item.index" v-for="(item,index) in data.tab2.items" :class="{ 'shown': item.shown, 'animate': item.animate}">
                                  <div class="moments-wrap">
                                      <div class="moments-media" v-bind:style="{height: item.image_heigth + 'px',maxHeight: maxHeight + 'px' }">
                                        <router-link :to="'/detail/'+item.moments_id" v-if="item.moments_type==1">
                                            <img v-lazy="item.moments_image[0]" style="width:100%;display:block;"></img>
                                        </router-link>

                                           
                                        <template  v-else-if="item.moments_type==4">
                                            <img v-lazy="item.moments_image[0]" style="width:100%;display:block" @click="jumpVideoPlay(item.moments_id)"/>
                                            <i class="icon icon-video" ></i>
                                        </template>

                                      </div>
                                      <div class="moments-content">
                                        <router-link :to="'/detail/'+item.moments_id" style="display:block" v-if="item.moments_type==1">
                                            <p v-html="item.moments_title.toString()"></p>
                                        </router-link>

                                        <p v-html="item.moments_title.toString()" v-else-if="item.moments_type==4" @click="jumpVideoPlay(item.moments_id)"></p>
                                      </div>

                                      <div class="moments-info">
                                          <router-link :to="uid == item.user_id ? '/home' : '/user/' + item.user_id" style="display:block">
                                              <div class="moments-uper">
                                                <div class="uper-avatar">
                                                  <img :alt="item.user_avatar" :src="item.user_avatar" class="" style="display:block" />
                                                </div>
                                                <div class="uper-nickname">
                                                    {{item.user_nickname}}
                                                </div>
                                              </div>
                                          </router-link>
                                          <div class="moments-collect">
                                              <i class="icon icon-liked" @click="rmLike(item.is_like,index)" v-if="item.is_like"></i>
                                              <i class="icon icon-like" @click="doLike(item.moments_id,index)" v-else></i>

                                              <span>{{item.moments_like_count}}</span>
                                          </div>
                                      </div>        
                                  </div>                           
                              </div>
                          </template>
                          
                      </div>

                      <div class="no-record" v-else>
                          <div class="no-record-content">
                              <div class="no-record-bg">
                                  <img src="../assets/img/tiezi.png" style="width:60px"/>
                              </div>
                              <p>暂无相关的数据哦~</p>
                          </div>
                      </div>
                    </mt-loadmore>
                  </div>
              </mt-tab-container-item>
          </my-tab-container>

          <div class="mint-spinner-bottom" v-show="loadBotVisible">
              <mt-spinner type="fading-circle"></mt-spinner>
          </div>
          </div>
         
          
      </div>
    </div>

    <upload  ref="upload" :files="files" :container="container" :browse_button="browse_button" :form="form" @upout="upOut">
      <div slot="file"  class="btn btn-upload" id="browse">
          <i class="icon icon-join"></i>
          <span style="font-size:.5rem;font-weight:600">立即参与</span>
      </div>
    </upload>
    <share ref="share" :share="shareData"></share>
  </div>
</template>
<script>
  import qs from 'qs'
  import Masonry from 'masonry-layout'
  import imagesLoaded from 'imagesloaded'
  import { Indicator } from 'mint-ui';
  import { Toast } from 'mint-ui';
  import { MessageBox } from 'mint-ui';

  import tabContainer from '../components/tab-container.vue';
  import upload from '../components/upload.vue'
  import share from '../components/share.vue'
    export default {
        components:{
            'my-tab-container':tabContainer,
            'upload' : upload,
            'share' : share
        },  
        data () {
            return {
                tag_id:0,
                tag_name:'',
                tagData:{},
                loading:false,
                check:false,
                fixed:false,
                showTitle:false,
                loadVisible:false,
                loadBotVisible:false,
                swipeable:true,
                kind:'',
                menuVisible: false,
                active: 'tab-container1',
                activeIndex:1,
                align: 'left',
                maxHeight:'',
                maxWidth:'',
                navHeight:0,
                scrollHeight:0,
                maxDistance:0,
                tabstate:[0,0,0],
                data:{
                  tab1:{
                    page:1,
                    records:0,
                    total:0,
                    more:true,
                    items:[],
                  },
                  tab2:{
                    page:1,
                    records:0,
                    total:0,
                    more:true,
                    items:[],
                  }
                },
                browse_button: ['browse','uploadBtn'],
                container: 'tag',
                files: [],
                form: {
                  moments_id:0,
                  moments_title:'',
                  moments_content:'',
                  moments_tag_id:[],
                  moments_area_id:0,
                  moments_product_id:[],
                  moments_tag_name:[],
                  moments_area_name : '',
                  moments_draft:1
                },
                shareData:{}
            }
        },
        methods:{
          tabIndex( id ){
              var index;
              if( id === 'tab-container1' ){
                  index = 0;
              }

              if( id === 'tab-container2' ){
                  index = 1;
              }

              return index;
          },
          tabId(){
            return 'tab' + (this.activeIndex + 1);
          },
           renderTab( id ){
            this.active = id;
            this.activeIndex = this.tabIndex( id );
            if( !this.tabstate[this.activeIndex] ){
                this.loadVisible = true;
                this.getKind();
                this.loadTab();
            } else {
              
            }
            this.tabstate[this.activeIndex] = 1;
        },
          getKind(){
              var kind = '';
              if( this.activeIndex === 0 ){
                  kind = 'latest';
              }

              if( this.activeIndex === 1 ){
                  kind = 'hot';
              }

              this.kind = kind;
          },
          loadTab(){

            this.loadMoments( this.kind ).
            then(() => {
              return this.masonry();
            }).
            then(()=>{
              this.loadBotVisible = false;
              this.loadVisible = false;
              this.loading = false;
              return;
            });
          },
          loadTop() {
            var tabId = this.tabId();
            var params = {
                'kind': this.kind,
                'last_time':this.data[tabId].items[0].moments_time,
                'tag_id':this.tag_id
            };
            new Promise((resolve, reject) => {
                this.$http.get(SYS.URL.moments.lists,{params:params}).then((res) => {
                    var data = res.data;
                    
                    if (data.status === 200) {
                        if( data.data.total  > 0 ){
                          this.dealData( data.data );
                          var items = this.fixItems(data.data.items);
                          this.data[tabId].items = items.concat(this.data[tabId].items);
                          
                        } else {
                          Toast({
                            message: '没有最新的动态了哦~',
                            position: 'top',
                            duration: 2000
                          });
                        }
                    }
                    resolve(res);
                })
            }).then(()=>{
              this.loadBotVisible = false;
              this.loadVisible = false;
              this.loading = false;
              this.$refs['loadmore' + (this.activeIndex + 1)].onTopLoaded();
              return this.masonry();
            });        
          },
          loadTagData(){
            return new Promise((resolve, reject) => {
                this.$http.get( SYS.URL.moments.tag_detail + '&tag_id=' + this.tag_id).then((res) => {
                    var data = res.data;
                    if (data.status === 200) {
                        this.tagData = data.data;
                        this.form.moments_tag_id.push( data.data.tag_id );
                        this.form.moments_tag_name.push( data.data.tag_name );


                        this.shareData = {
                          title:data.data.tag_name,
                          desc:data.data.tag_content,
                          link:window.location.href,
                          type:'link',
                          imgUrl:data.data.tag_album,
                          dataUrl:window.location.href
                        }

                    }
                    
                    resolve(res);
                })
            });
          },
          loadMore() {
            this.loading = true;
            this.loadBotVisible = true;
            this.loadTab();
          },
          loadMoments( kind ){
              var tabId = this.tabId();
              var params = {
                  'kind':kind,
                  'page':this.data[tabId].page,
                  'tag_id':this.tag_id
              };
              return new Promise((resolve, reject) => {
                  if( !this.data[tabId].more ){
                      resolve(true);
                      return;
                  }
                  this.$http.get(SYS.URL.moments.lists,{params:params}).then((res) => {
                      var data = res.data;
                      if (data.status === 200) {
                          var tabId = this.tabId();
                          this.dealData( data.data );
                          var items = this.fixItems(data.data.items);
                          this.data[tabId].items.push.apply(this.data[tabId].items,items);
                          // this.data[tabId].items.sort((t,e) => {
                          //   return !(t.id-e.id)
                          // })
                      }
                      
                      resolve(res);
                  })
              });
              
          },
          doLike( id,index ){
              var params = qs.stringify({
                      'moments_id':id,
                  });
              this.$http.post(SYS.URL.moments.like_add,params).then((res) => {
                  var data = res.data;
                  if (data.status === 200) {
                      var tabId = this.tabId();
                      this.data[tabId].items[index].is_like = data.data.like_id;
                      this.data[tabId].items[index].moments_like_count++;
                  }
              })
          },
          rmLike( id,index ){
              var params = qs.stringify({
                      'like_id':id,
                  });
              this.$http.post(SYS.URL.moments.like_remove,params).then((res) => {
                  var data = res.data;
                  if (data.status === 200) {
                      var tabId = this.tabId();
                      this.data[tabId].items[index].is_like = 0;
                      this.data[tabId].items[index].moments_like_count--;
                  }
              })
          },
          doFollow( id,index ){
            let params = {};
            params.tag_id = id;
            return new Promise((resolve, reject) => {
                this.$http.post(SYS.URL.moments.tag_follow_add,qs.stringify(params)).then((res) => {
                    var data = res.data;

                    if (data.status === 200) {
                        let tabId = this.tabId();
                        this.tagData.is_follow = data.data.follow_id;
                    }

                    resolve(res);
                })
            });

          },
        rmFollow( id ){
          MessageBox.confirm('确定取消关注吗?').then(action => {  

              let params = qs.stringify({follow_id:id});
              return new Promise((resolve, reject) => {
                  this.$http.post(SYS.URL.moments.tag_follow_remove,params).then((res) => {
                      var data = res.data;
                      if (data.status === 200) {
                          let tabId = this.tabId();
                          this.tagData.is_follow = 0;
                          
                      }
                      resolve(res);
                  })
              });
            });
        },
        dealData( data ){
            var tabId = this.tabId();
            this.data[tabId].page = data.page + 1;
            this.data[tabId].records = data.records;
            this.data[tabId].total = data.total;
            this.data[tabId].loaded = true;
            if( data.total == data.page || data.total == 0 ){
              this.data[tabId].more = false;
            }
            
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
          masonry(){
            return new Promise((resolve,reject) => {

                if( document.querySelector('#waterfull' + this.activeIndex) ){
                  imagesLoaded( document.querySelector('#waterfull' + this.activeIndex), () => {
                    new Masonry( '#waterfull' + this.activeIndex, {
                      itemSelector: '.moments-item',
                      transitionDuration : 0,
                      'resize' : false
                    });
                    var tabId = this.tabId();
                    this.data[tabId].items.forEach( (el, i) =>{
                        this.data[tabId].items[i].shown = true;
                        this.data[tabId].items[i].animate = true;
                    });
                  });
                }

                // if( document.querySelector('#waterfull' + this.activeIndex) ){
                //   new Masonry( '#waterfull' + this.activeIndex, {
                //     itemSelector: '.moments-item',
                //     transitionDuration : 0,
                //     'resize' : false
                //   });
                //   var tabId = this.tabId();
                //   this.data[tabId].items.forEach( (el, i) =>{
                //       this.data[tabId].items[i].shown = true;
                //       this.data[tabId].items[i].animate = true;
                //   });
                // }
                
                this.load = true;

                resolve(this);
            });
          },
          goBack(){
              if (window.history.length <= 1) {
                  this.$router.push({path:'/'})
                  return false
              } else {
                  this.$router.go(-1)
              }
          },
          startMove(){
            this.maxDistance = 0.001;
          },
          endMove(){
            this.maxDistance = 0;
          },
          upOut(){
            this.files = [];
            this.form = {
                moments_title:'',
                moments_content:'',
                moments_tag_id:[],
                moments_tag_name:[],
                moments_area_id:'',
                moments_area_name : '',
                moments_product_id:[],
                moments_draft:1
            };
          },
          share(){
            if( isApp ){
              let title = this.tagData.tag_name;
              let describe = this.tagData.tag_content;
              let url = window.location.href;
              let imgUrl = this.tagData.tag_album;
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
          jumpVideoPlay( id ){
      
            if( isApp ){
                if( isApp === 'android' ){
                    android.jumpVideoPlay(id,this.getKind());
                } 
                if( isApp === 'ios' ){
                    var str  = {"moments_id":id,"kind":this.getKind()};
                    var params = JSON.stringify(str);
                    window.webkit.messageHandlers.jumpVideoPlay.postMessage(params);
                } 

              } else {
                this.$router.push({
                    path: `/detail/${id}`,
                })

              }
          },
        },
        mounted: function() {
          
          this.$refs.upload.initUploader();

          this.maxWidth = (document.documentElement.clientWidth) / 2;
          this.maxHeight = Math.ceil(this.maxWidth * 1.33);

          this.active = this.$route.params.tab ? this.$route.params.tab : 'tab-container1';
          this.renderTab(this.active);
          
          var viewportHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight || 0;
          var headerHeight = document.querySelector('.header').offsetHeight;
          var bannerHeight = document.querySelector('.banner').offsetHeight;
          var navHeight  = document.querySelector('.nav-bar').offsetHeight;
          this.scrollHeight = viewportHeight;
          this.navHeight = navHeight;
          var fixedHeight = bannerHeight - headerHeight; 
          window.addEventListener('scroll', () => {
            var scrollHeight = document.querySelector('.container').scrollTop;
            if( scrollHeight >= fixedHeight ){
              this.fixed = true;
              this.showTitle = true;
            } else {
              this.fixed = false;
              this.showTitle = false;
            }
          },true)

      },
      watch:{
          active: {
            handler(newVal) {
                this.renderTab( newVal );
                this.maxDistance = 0;
            },
            deep: true
          }
      },
      created(){
          this.tag_id = this.$route.params.tag_id;
          
          this.loadTagData();
      },
      beforeRouteEnter(to,from,next){
        next(vm => {
          for( let i = 0; i < 2; i++ ){
           
            vm.$refs['wrapper' + (i + 1)].scrollTop = vm.$store.state.tag.position[i];
          }
         
        });
      },
      beforeRouteLeave(to,from,next){
        let scrollTop = this.$refs['wrapper' + (this.activeIndex + 1)].scrollTop;

        this.$store.commit("setPosition",{page:'tag',index:this.activeIndex,position:scrollTop})

        next();
      } 
    }
</script>
<style lang="scss" scoped>
    .page {
        .btn-upload {
          height: 1.2rem;
          position: fixed;
          bottom: .5rem;
          display: -webkit-box;
          display: -ms-flexbox;
          display: flex;
          -webkit-box-align: center;
          -ms-flex-align: center;
          align-items: center;
          background: #ff2442;
          color: #fff;
          border-radius: 1rem;
          padding: 0 0.5rem;
          left: 50%;
          transform: translate(-50%, 0%);
        }
    }
      
</style>

