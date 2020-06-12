
<template>
    <div class="page">
        <div class="header header-bd">
          <div class="header-back" @click="goBack"></div>
          <h3 class="header-title" style="height:2rem;">{{userInfo.user_nickname}}</h3>
          <div class="header-share" @click="share" v-show="isApp"></div>
        </div>

        <div class="user">
            <div class="user-card">
                <div class="user-img">
                   <a href="javascript:;">
                       <img :src="userInfo.user_avatar" :alt="userInfo.user_nickname"  preview="0"/>
                   </a>
              </div>
              <div class="user-info">
                      <div class="info-wrapper">
                        <div class="follow">
                            <router-link :to="{path:'/follow/' + this.user_id}">
                                <div >{{userInfo.follow_count}}</div>
                                <div style="font-size: .5rem">关注</div>
                            </router-link>
                        </div>
                        <div class="fans">
                            <router-link :to="{path:'/fans/' + this.user_id }">
                                <div>{{userInfo.fan_count}}</div>
                                <div style="font-size: .5rem">粉丝</div>
                            </router-link>
                        </div>
                        <div class="likes">
                            <div>{{userInfo.like_count + userInfo.collect_count}}</div>
                            <div style="font-size: .5rem">获赞与收藏</div>
                        </div>
                      </div>
                      <div class="edit-information">
                        <div class="edit followed" v-if="userInfo.is_follow" @click="rmFollow(userInfo.is_follow)">
                            已关注
                        </div>
                        
                        <div class="edit follow" @click="doFollow(userInfo.user_id)" v-else >
                            关注
                        </div>

                      </div>
              </div>
            </div>
            
        </div>

        <div class="nav-bar">
            <div class="nav-inner">
                <div class="nav-inner-item" v-bind:class="active == 'tab-container1' ? 'selected' : ''" @click="renderTab('tab-container1')"><span>动态</span></div>
                <div class="nav-inner-item" v-bind:class="active == 'tab-container2' ? 'selected' : ''" @click="renderTab('tab-container2')"><span>收藏</span></div>
                
            </div>
        </div>
        

        <div class="tab-container">
            <mt-loadmore :top-method="loadTop" :maxDistance="maxDistance" ref="loadmore">
                <div slot="top" class="mint-spinner-top">
                  <mt-spinner type="fading-circle"></mt-spinner>
                </div>

                <my-tab-container class="page-tabbar-tab-container" v-model="active" :swipeable = "swipeable" @end-move="endMove" @start-move="startMove" >
                    <mt-tab-container-item id="tab-container1">
                        <div class="moments-scroll" v-show="data.tab1.loaded"
                          v-infinite-scroll="loadMore"
                          infinite-scroll-disabled="loading"
                          infinite-scroll-distance="10"
                          infinite-scroll-immediate-check="check"
                          :style="{height:scrollHeight + 'px'}"
                          ref="wrapper1"
                        >
                            <div class="moments-list effect-1" id="waterfull0" v-if="data.tab1.items.length > 0">
                                <template>
                                    <div class="moments-item" :index="item.index" v-for="(item,index) in data.tab1.items" :class="item.shown ? 'shown animate' : '' ">
                                      <div class="moments-wrap">
                                          <div class="moments-media" v-bind:style="{height: item.image_heigth + 'px',maxHeight: maxHeight + 'px' }">
                                            <router-link :to=" item.moments_status == 1 ? '/detail/'+item.moments_id : '/edit/'+item.moments_id " v-if="item.moments_type==1">
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

                                            <p v-html="item.moments_title.toString()" v-else @click="jumpVideoPlay(item.moments_id)"></p>

                                        </div>


                                          <div class="moments-info">
                                              <div class="moments-uper">
                                                <div class="uper-avatar">
                                                  <img :alt="item.user_avatar" :src="item.user_avatar" class="" style="display:block" />
                                                </div>
                                                <div class="uper-nickname">
                                                    {{item.user_nickname}}
                                                </div>
                                              </div>
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
                                    <p>TA还没有发布的动态哦~</p>
                                </div>
                            </div>

                            
                        </div>
                    </mt-tab-container-item>

                    <mt-tab-container-item id="tab-container2">
                        <div class="moments-scroll" v-show="data.tab2.loaded"
                          v-infinite-scroll="loadMore"
                          infinite-scroll-disabled="loading"
                          infinite-scroll-distance="10"
                          infinite-scroll-immediate-check="check"
                          :style="{height:scrollHeight + 'px'}"
                          ref="wrapper2"
                        >
                            <div class="moments-list effect-1" id="waterfull1" v-if="data.tab2.items.length > 0">
                                <template>
                                    <div class="moments-item" :index="item.index" v-for="(item,index) in data.tab2.items" :class="{ 'shown': item.shown, 'animate': item.animate}">
                                        <div class="moments-wrap">
                                            <div class="moments-media" v-bind:style="{height: item.image_heigth + 'px',maxHeight: maxHeight + 'px' }">
                                                <router-link :to=" item.moments_status == 1 ? '/detail/'+item.moments_id : '/edit/'+item.moments_id " v-if="item.moments_type==1">
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

                                                <p v-html="item.moments_title.toString()" v-else @click="jumpVideoPlay(item.moments_id)"></p>

                                            </div>


                                            <div class="moments-info">
                                                <div class="moments-uper">
                                                  <div class="uper-avatar">
                                                    <img :alt="item.user_avatar" :src="item.user_avatar" class="" style="display:block" />
                                                  </div>
                                                  <div class="uper-nickname">
                                                      {{item.user_nickname}}
                                                  </div>
                                                </div>
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
                                    <p>TA还没有收藏的动态哦~</p>
                                </div>
                            </div>

                        </div>
                    </mt-tab-container-item>

                 

                </my-tab-container>

                <div class="mint-spinner-bottom" v-show="loadBotVisible">
                    <mt-spinner type="fading-circle"></mt-spinner>
                </div>
            </mt-loadmore>
        </div>


        <foot-nav></foot-nav>

        <div class="page-load" v-show="loadPageVisible">
          <mt-spinner type="fading-circle"></mt-spinner>
        </div>
    </div>
</template>
<script>
  import qs from 'qs'
  import Masonry from 'masonry-layout'
  import imagesLoaded from 'imagesloaded'
  import { Indicator } from 'mint-ui';
  import { Toast } from 'mint-ui';
  import footnav from '../components/footer.vue';
  import tabContainer from '../components/tab-container.vue';
  import share from '../components/share.vue'


    export default {
        components:{
            'foot-nav':footnav,
            'my-tab-container':tabContainer,
            'share' : share
        },
        data () {
            return {
                user_id:0,
                userInfo:{},
                loadBotVisible:false,
                loadPageVisible:true,
                swipeable:true,
                kind:'',
                menuVisible: false,
                active: 'tab-container1',
                activeIndex:1,
                align: 'left',
                maxHeight:'',
                maxWidth:'',
                maxDistance:0,
                scrollHeight:0,
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
                }
            }
        },
        methods:{
           getUserInfo(){
            this.$http.get(SYS.URL.moments.user + '&user_id=' + this.user_id).then( (res) => {
                var data = res.data;
                if (data.status === 200) {
                    this.userInfo = data.data;
                }

                this.loadPageVisible = false;
            })
          },
          tabIndex( id ){
              var index;
              if( id === 'tab-container1' ){
                  index = 0;
              }

              if( id === 'tab-container2' ){
                  index = 1;
              }

              if( id === 'tab-container3' ){
                  index = 2;
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
                this.getKind();
                this.loadMoments( this.kind ).then(() => {
                  return this.masonry();
                });
            } else {
              
            }
            this.tabstate[this.activeIndex] = 1;
        },
          getKind(){
              var kind = '';
              if( this.activeIndex === 0 ){
              
              }

              if( this.activeIndex === 1 ){
                  kind = 'collect';
              }


              this.kind = kind;
          },
          loadTab(){
            this.loadMoments( this.kind ).then(() => {
                return this.masonry();
            });
          },
          loadTop() {
            var tabId = this.tabId();
            var params = {
                'kind': this.kind,
                'last_time':this.data[tabId].items[0].moments_time,
                'keyword':this.keyword,
                'user_id':this.user_id
            };
            new Promise((resolve, reject) => {
                this.$http.get(SYS.URL.moments.lists,{params:params}).then((res) => {
                    var data = res.data;
                    this.$refs.loadmore.onTopLoaded();

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
              return this.masonry();
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
                  'keyword':this.keyword,
                  'user_id':this.user_id
              };
              return new Promise((resolve, reject) => {
                  if( !this.data[tabId].more ){
                      this.loadBotVisible = false;
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
                      this.loadBotVisible = false;
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
        doFollow( id ){
          let params = {};
          params.up_user_id = id;
          return new Promise((resolve, reject) => {
              this.$http.post(SYS.URL.moments.follow_add,qs.stringify(params)).then((res) => {
                  var data = res.data;

                  if (data.status === 200) {
                      let tabId = this.tabId();
                      this.userInfo.is_follow = data.data.follow_id;
                  }

                  resolve(res);
              })
          });
      },
      rmFollow( id ){
        let params = qs.stringify({follow_id:id});
        return new Promise((resolve, reject) => {
            this.$http.post(SYS.URL.moments.follow_remove,params).then((res) => {
                var data = res.data;
                if (data.status === 200) {
                    let tabId = this.tabId();
                    this.userInfo.is_follow = 0;
                    
                }
                resolve(res);
            })
        });
      },
          dealData( data ){
            var tabId = this.tabId();
            this.data[tabId].page = data.page + 1;
            this.data[tabId].records = data.records;
            this.data[tabId].total = data.total;
            this.data[tabId].loaded = true;
            if( data.total == data.page || data.total == 0){
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
                }
                
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
          share(){
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
          }
        },
        mounted: function() {
          this.getUserInfo();

          var self = this;
          this.maxWidth = (document.documentElement.clientWidth) / 2;
          this.maxHeight = Math.ceil(this.maxWidth * 1.33);

          this.keyword = this.$route.params.keyword;
          this.active = this.$route.params.tab ? this.$route.params.tab : 'tab-container1';
          this.renderTab(this.active);
          var viewportHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight || 0;
          var headHeight = document.querySelector('.header').offsetHeight;
          var userHeight = document.querySelector('.user').offsetHeight;
          var navHeight = document.querySelector('.nav-bar').offsetHeight;
          var footHeight = document.querySelector('.footnav').offsetHeight;
          this.scrollHeight = viewportHeight - headHeight - userHeight - navHeight - footHeight;

          this.$nextTick( () => {
            console.log( document.querySelector('.pswp__caption__center--opt'));
          })

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
          this.user_id = this.$route.params.user_id;
      }
    }
</script>
<style lang="scss" scoped>


</style>

