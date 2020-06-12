<template>
    <div class="page" id="page">
       <div class="page-nav-container">
          <div class="page-inner-container">
              <div class="page-inner-item" v-bind:class="active == 'tab-container1' ? 'selected' : ''" @click="renderTab('tab-container1')"><span>关注</span></div>
              <div class="page-inner-item" v-bind:class="active == 'tab-container2' ? 'selected' : ''" @click="renderTab('tab-container2')"><span>发现</span></div>
              <div class="page-inner-item" v-bind:class="active == 'tab-container3' ? 'selected' : ''" @click="renderTab('tab-container3')"><span>本地</span></div>
              <div class="page-inner-item" v-bind:class="active == 'tab-container4' ? 'selected' : ''" @click="renderTab('tab-container4')"><span>视频</span></div>
          </div>

          <div class="page-search-container">
              <div class="page-search-inner" @click="toSearch">
                  <i class="icon icon-search"></i>
                  <input v-model="keyword" type="search" placeholder="请输入搜索关键字" class="mint-searchbar-core" readonly/>
                  <div class="input-mask"></div>
              </div>
          </div>
      </div>


      <div class="page-tab-container">
          <div class="mint-spinner-load" v-show="loadVisible">
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
                    ref="wrapper1">
                      <mt-loadmore :top-method="loadTop" :maxDistance="maxDistance" ref="loadmore1">
                        <div slot="top" class="mint-spinner-top">
                          <mt-spinner type="fading-circle"></mt-spinner>
                        </div>


                        <div class="moments-list effect-1" id="waterfull0"  v-if="data.tab1.items.length > 0">
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

                        <div class="no-record" v-if="data.tab1.items.length == 0">
                            <div class="no-record-content">
                                <div class="no-record-bg">
                                    <img src="../assets/img/follow.png" style="width:60px"/>
                                </div>
                                <p>您还有没关注的up主哦~~</p>
                            </div>
                        </div>
                      </mt-loadmore>
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
                      <mt-loadmore :top-method="loadTop" :maxDistance="maxDistance" ref="loadmore2">
                        <div slot="top" class="mint-spinner-top">
                          <mt-spinner type="fading-circle"></mt-spinner>
                        </div>

                        <div class="moments-list effect-1" id="waterfull1" v-if="data.tab2.items.length > 0">

                            <template >
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
                                <p>暂无相关的动态哦~</p>
                            </div>
                        </div>
                       </mt-loadmore>
                  </div>
              </mt-tab-container-item>

              <mt-tab-container-item id="tab-container3">
                  <div class="moments-scroll" v-show="data.tab3.loaded" 
                    v-infinite-scroll="loadMore"
                    infinite-scroll-disabled="loading"
                    infinite-scroll-distance="10"
                    infinite-scroll-immediate-check="check"
                    :style="{height:scrollHeight + 'px'}"
                     ref="wrapper3"
                  > 
                    <mt-loadmore :top-method="loadTop" :maxDistance="maxDistance" ref="loadmore3">
                      <div slot="top" class="mint-spinner-top">
                        <mt-spinner type="fading-circle"></mt-spinner>
                      </div>
                      <div class="moments-list effect-1" id="waterfull2" v-if="data.tab3.items.length > 0" ref="waterfull2">
                          <div id="size" style="position: absolute;top: 0;"></div>
                          <template >
                              <div class="moments-item" :index="item.index" v-for="(item,index) in data.tab3.items" :class="{ 'shown': item.shown, 'animate': item.animate}">
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
                                              <i class="icon icon-area"></i>
                                              
                                              <span>{{item.distance}}</span>
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
                                  <p>暂无相关的动态哦~</p>
                              </div>
                      </div>
                    </mt-loadmore>
                  </div>
              </mt-tab-container-item>

              <mt-tab-container-item id="tab-container4">
                  <div class="moments-scroll" v-show="data.tab4.loaded" 
                    v-infinite-scroll="loadMore"
                    infinite-scroll-disabled="loading"
                    infinite-scroll-distance="10"
                    infinite-scroll-immediate-check="check"
                    :style="{height:scrollHeight + 'px'}"
                    ref="wrapper4"
                  > 
                    <mt-loadmore :top-method="loadTop" :maxDistance="maxDistance" ref="loadmore4">
                      <div slot="top" class="mint-spinner-top">
                        <mt-spinner type="fading-circle"></mt-spinner>
                      </div>

                      <div class="moments-list effect-1" id="waterfull3" v-if="data.tab4.items.length > 0">
                          <template >
                              <div class="moments-item" :index="item.index" v-for="(item,index) in data.tab4.items" :class="{ 'shown': item.shown, 'animate': item.animate}">
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
                                  <p>暂无相关的动态哦~</p>
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

      <foot-nav></foot-nav>

  
    </div>
</template>

<script>

import qs from 'qs'
import Masonry from 'masonry-layout'
import imagesLoaded from 'imagesloaded'
import footnav from '../components/footer.vue';
import { Indicator } from 'mint-ui';
import tabContainer from '../components/tab-container.vue';
import { Toast } from 'mint-ui';
import loadBMap from '../assets/loadBMap.js'
export default {
  name:'index',
  components:{
    'foot-nav':footnav,
    'my-tab-container':tabContainer
  },
  data(){
      return {
          browse_button: ['browse','uploadBtn'],
          container: 'page',
          files: [],
          form: {
            moments_title:'',
            moments_content:'',
            moments_tag_id:[],
            moments_tag_name:[],
            moments_area_id:'',
            moments_product_id:[],
            moments_area_name : '',
            moments_draft:1
          },

          loading:false,
          check:false,
          loadVisible:false,
          loadBotVisible:false,
          scrollHeight:0,
          swipeable:true,
          active: 'tab-container2',
          activeIndex:1,
          kind:'',
          keyword:'',
          align: 'left',
          isBusy: false,
          maxHeight:'',
          maxWidth:'',
          maxDistance:0,
          coordinate:{
            lng:0,
            lat:0
          },
          items:{
            items1:[],
            items2:[],
            items3:[],
            items4:[],
          },
          tabstate:[0,0,0,0],
          data:{
            tab1:{
              page:1,
              records:0,
              total:0,
              more:true,
              items:[],
              loaded:false,
            },
            tab2:{
              page:1,
              records:0,
              total:0,
              more:true,
              items:[],
              loaded:false,
            },
            tab3:{
              page:1,
              records:0,
              total:0,
              more:true,
              items:[],
              loaded:false,
            },
            tab4:{
              page:1,
              records:0,
              total:0,
              more:true,
              items:[],
              loaded:false,
            },
          }
      }
  },
  methods:{
      toSearch(){
          this.$router.push({
              path: `/search/${this.active}`,
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

          if( id === 'tab-container4' ){
              index = 3;
          }
          return index;
      },
      tabId(){
        return 'tab' + (this.activeIndex + 1);
      },
      renderTab( id ){
          let scrollTop = this.$refs['wrapper' + (this.activeIndex + 1)].scrollTop;
          this.$store.commit("setPosition",{page:'index',index:this.activeIndex,position:scrollTop})

          this.active = id;
          this.activeIndex = this.tabIndex( id );
          if( !this.tabstate[this.activeIndex] ){
              
              let tabId = this.tabId();

              this.data[tabId] = {
                page:1,
                records:0,
                total:0,
                more:true,
                items:[],
                loaded:false,
              };

              this.loadVisible = true;

              this.getKind();
              
              this.loadTab();
          } else {
            
          }
          this.tabstate[this.activeIndex] = 1;


          this.$refs['wrapper' + (this.activeIndex + 1)].scrollTop = this.$store.state.index.position[this.activeIndex];
      },
      getKind(){
          var kind = '';
          if( this.activeIndex === 0 ){
              kind = 'follow';
          }

          if( this.activeIndex === 2 ){
              kind = 'location';
          }

          if( this.activeIndex === 3 ){ 
              kind ='video';
          }

          this.kind = kind;
      },
      loadTab(){
        if( this.kind === 'location'){
          this.position().
          then(()=>{
            return this.loadMoments( this.kind );
          }).
          then(() => {
            this.$nextTick( () => {
              return this.masonry();
            })
          }).
          then(()=>{
            this.loadBotVisible = false;
            this.loadVisible = false;
            return this.loading = false;
          });
        } else {
          this.loadMoments( this.kind ).
          then(() => {
            this.$nextTick( () => {
                return this.masonry();
              })
          }).
          then(()=>{
            this.loadBotVisible = false;
            this.loadVisible = false;
            return this.loading = false;
          });
        }
        
      },
      loadTop() {
        var tabId = this.tabId();
        var params = {
            'kind': this.kind,
            'keyword':this.keyword
        };
        if( this.data[tabId].items.length > 0 ){
          params.last_time = this.data[tabId].items[0].moments_time;
        }
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
        }).
        then(()=>{
          return this.masonry();
        }).
        then(()=>{
         
          this.loadBotVisible = false;
          this.loadVisible = false;
          this.loading = false;
        
          this.$refs['loadmore' + (this.activeIndex + 1)].onTopLoaded();


          return;
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
              'rows':10,
          };

          if(this.kind === 'location' ){
            params.latitude = this.coordinate.lat;
            params.longitude = this.coordinate.lng;
          }
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
            // if( document.querySelector('#waterfull' + this.activeIndex) ){
            //   imagesLoaded( document.querySelector('#waterfull' + this.activeIndex), () => {
            //     new Masonry( '#waterfull' + this.activeIndex, {
            //       itemSelector: '.moments-item',
            //       transitionDuration : 0,
            //       'resize' : false
            //     });
            //     var tabId = this.tabId();
            //     this.data[tabId].items.forEach( (el, i) =>{
            //         this.data[tabId].items[i].shown = true;
            //         this.data[tabId].items[i].animate = true;
            //     });
            //   });
            // }
            

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
            
            resolve(this);
        });
      },
      startMove(){
        this.maxDistance = 0.001;
      },
      endMove(){
        this.maxDistance = 0;
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
      initBMap(){
       
      },

      position(){
        return new Promise((resolve, reject) => {
          loadBMap('Yi9XWlwa7sUGSuKGDiPBrS261bMeu6YF')
          .then(() => {
              // 百度地图API功能
              var geolocation = new BMap.Geolocation();
              var geoc = new BMap.Geocoder();
              var self = this;
              geolocation.getCurrentPosition(function(r){
                  if(this.getStatus() == BMAP_STATUS_SUCCESS){
                      self.coordinate = {
                        lng:r.point.lng,
                        lat:r.point.lat
                      };                      
                  } else {
                      alert('failed'+this.getStatus());
                  }
                  resolve();
              },{enableHighAccuracy: true})            
          })
          
        });
        
      },
      upOut(){
        this.form = {
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
        };
        this.files = [];
    },

  },
  created(){
  },
  mounted(){

      this.maxWidth = (document.documentElement.clientWidth) / 2;
      this.maxHeight = Math.ceil(this.maxWidth * 1.33);

      this.keyword = this.$route.params.keyword;
      this.active  = this.$route.params.tab ? this.$route.params.tab : 'tab-container2';
      this.renderTab(this.active);


      var viewportHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight || 0;
      var headHeight = document.querySelector('.page-nav-container').offsetHeight;

      this.scrollHeight = viewportHeight - headHeight;

     
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
  beforeRouteEnter(to,from,next){
    next(vm => {

      if( vm.$route.params.keyword != vm.keyword ){
         vm.keyword = vm.$route.params.keyword;
         vm.tabstate[vm.tabIndex(vm.active)] = false;
         vm.renderTab(vm.active);
      }

      for( let i = 0; i < 4; i++ ){

        vm.$refs['wrapper' + (i + 1)].scrollTop = vm.$store.state.index.position[i];
      }
     
    });
  },
  beforeRouteLeave(to,from,next){
    let scrollTop = this.$refs['wrapper' + (this.activeIndex + 1)].scrollTop;
    this.$store.commit("setPosition",{page:'index',index:this.activeIndex,position:scrollTop})
    next();
  } 
}
</script>

<style>

  .page {
      font-size:.6rem;
  }
  .page-nav-container {
      width: 100%;
      position: fixed;
      left: 0;
      top: 0;
      z-index: 2;
      background-color:#ffffff;
      box-shadow: 0 0.08rem 0.12rem rgba(0,0,0,.1);
  }
  .page-inner-container {
      display:flex;
      width:70%;
      margin:0 auto;
  }
  .page-inner-item {
      width:25%;
      font-size: .65rem;
      color: #888;
      display: inline-block;
      padding:.35rem 0;
  }
  .page-inner-item span {
      display: inline-block;
      padding: .2rem 0;
  }
  .selected span{
     font-weight: 600;
      color: #333;
      border-bottom: 2px solid red;
  }
  .page-search-container{

  }
  .page-search-inner {
      -webkit-box-align: center;
          -ms-flex-align: center;
              align-items: center;
      background-color: #efefef;
      border-radius: 2px;
      display: -webkit-box;
      display: -ms-flexbox;
      display: flex;
      -webkit-box-flex: 1;
          -ms-flex: 1;
              flex: 1;
          height: 1.2rem;
    padding: .2rem .5rem;
    border-radius: 1.2rem;
    width: 90%;
    margin: auto;
    position: relative;
    margin-bottom: .3rem;
  }
  .page-search-inner input {
      font-size: .5rem;
    color: #bdbaba;
  }
  
  .page-tab-container {
      position: relative;
      top: 3.4rem;
      padding-bottom:2rem;
  }
</style>