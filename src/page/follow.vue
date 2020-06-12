<template>
    <div class="page">
        <div class="header">
            <div class="header-back" @click="goBack"></div>
            <h1 class="header-title header-title-top" v-if="user_id == uid">
                我的关注
            </h1>
            <h1 class="header-title header-title-top" v-else>
                TA的关注
            </h1>

            <div class="header-nav">
                <div class="nav-inner">
                    <div class="nav-inner-item" v-bind:class="active == 'tab-container1' ? 'selected' : ''" @click="renderTab('tab-container1')"><span>用户</span></div>
                    <div class="nav-inner-item" v-bind:class="active == 'tab-container2' ? 'selected' : ''" @click="renderTab('tab-container2')"><span>商家</span></div>
                    <div class="nav-inner-item" v-bind:class="active == 'tab-container3' ? 'selected' : ''" @click="renderTab('tab-container3')"><span>话题</span></div>
                </div>
            </div>
        </div>

        <div class="tab-container" style="top:3.1rem">
           
            <my-tab-container class="page-tabbar-tab-container" v-model="active" :swipeable = "swipeable"  >
                    <mt-tab-container-item id="tab-container1" ref="tab-container1">
                        <section>
                          <div class="section-container">
                              <div class="section-title">
                                  <h3>你可能有兴趣的人</h3>
                                  <div class="right-more" @click="more">
                                      <span>查看更多</span>
                                      <i class="icon icon-right-arrow"></i>
                                  </div>
                              </div>
                              <div class="section-wrapper" >                              
                                  <ul class="section-lists" ref="">
                                      <li class="section-item" v-for="(item,index) in data.tab1.recommend">
                                         <div class="section-content">
                                              <router-link :to="uid == item.user_id ? '/home' : '/user/' + item.user_id"  >
                                                  <div class="album-block">
                                                      <img :src="item.user_avatar" />
                                                  </div>
                                                  <div class="info-block">
                                                      <h3>{{item.user_nickname}}</h3>
                                                      <span>你可能感兴趣</span>
                                                  </div>
                                              </router-link>
                                          </div>
                                          <div class="section-btn">
                                              <span class="btn-followed" @click="rmFollow(item.follow_id,index,'recommend')" v-if="item.is_follow">已关注</span>
                                              <span class="btn-follow"   @click="doFollow(item.user_id,index,'recommend')" v-else>关注</span>
                                          </div>
                                      </li>
                                  </ul>                             
                              </div>
                          </div>
                          
                        </section>

                        <section>
                          <div class="section-container" v-if="data.tab1.items.length > 0">
                            <div class="section-title">
                                <h3>正在关注</h3>
                            </div>
                            <div class="section-wrapper">
                              <ul class="section-lists" 
                                  v-infinite-scroll="loadMore"
                                  infinite-scroll-disabled="loading"
                                  infinite-scroll-distance="10"
                                  infinite-scroll-immediate-check="check"
                                  :style="{height:scrollHeight + 'px'}"
                                  ref="wrapper1">
                                    <li class="section-item" v-for="(item,index) in data.tab1.items" >
                                        <div class="section-content">
                                            <router-link :to="uid == item.up_user_id ? '/home' : '/user/' + item.up_user_id"  >
                                              <div class="album-block">
                                                  <img :src="item.user_avatar" />
                                              </div>
                                              <div class="info-block">
                                                  <h3>{{item.user_nickname}}</h3>
                                                  <span>你可能感兴趣</span>
                                              </div>
                                            </router-link>
                                        </div>
                                        <div class="section-btn">
                                            <span class="btn-followed" @click="rmFollow(item.follow_id,index,'follow')" v-if="item.is_follow">已关注</span>
                                            <span class="btn-follow" @click="doFollow(item.up_user_id,index,'follow')" v-else>关注</span>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                          </div>

                          <div class="no-record" v-else :style="{height:scrollHeight + 'px'}">
                            <div class="no-record-content">
                                <div class="no-record-bg">
                                    <img src="../assets/img/follow.png" style="width:60px"/>
                                </div>
                                <p>您还有没关注的up主哦~~</p>
                            </div>
                          </div>

                        </section>

                        


                    </mt-tab-container-item>

                    <mt-tab-container-item id="tab-container2">
                        <section>
                          <div class="section-container">
                            <div class="section-title">
                                <h3>你可能有兴趣的商家</h3>
                                <div class="right-more" @click="more">
                                    <span>查看更多</span>
                                    <i class="icon icon-right-arrow"></i>
                                </div>
                            </div>
                            <div class="section-wrapper">
                                <ul class="section-lists">
                                    <li class="section-item" v-for="(item,index) in data.tab2.recommend">
                                        <div class="section-content" @click="store(item.store_id)">
                                            <div class="album-block">
                                                <img :src="item.store_logo" />
                                            </div>
                                            <div class="info-block">
                                                <h3>{{item.store_name}}</h3>
                                                <span>你可能感兴趣</span>
                                            </div>
                                        </div>
                                        <div class="section-btn">
                                            <span class="btn-followed" @click="rmFollow(item.follow_id,index,'recommend')" v-if="item.is_follow">已关注</span>
                                            <span class="btn-follow" @click="doFollow(item.store_id,index,'recommend')" v-else>关注</span>
                                        </div>
                                    </li>

                                </ul>
                            </div>
                          </div>
                        </section>

                        <section >
                          <div class="section-container" v-if="data.tab2.items.length > 0">
                            <div class="section-title">
                                <h3>正在关注</h3>
                               
                            </div>
                            <div class="section-wrapper">
                              <ul class="section-lists" 
                                  v-infinite-scroll="loadMore"
                                  infinite-scroll-disabled="loading"
                                  infinite-scroll-distance="10"
                                  infinite-scroll-immediate-check="check"
                                  :style="{height:scrollHeight + 'px'}"
                                  ref="wrapper2">
                                    <li class="section-item" v-for="(item,index) in data.tab2.items" >
                                        <div class="section-content" @click="store(item.store_id)">
                                            <div class="album-block">
                                                <img :src="item.store_logo" />
                                            </div>
                                            <div class="info-block">
                                                <h3>{{item.store_name}}</h3>
                                                <span>你可能感兴趣</span>
                                            </div>
                                        </div>
                                        <div class="section-btn">
                                            <span class="btn-followed" @click="rmFollow(item.follow_id,index,'follow')" v-if="item.is_follow">已关注</span>
                                            <span class="btn-follow" @click="doFollow(item.store_id,index,'follow')" v-else>关注</span>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                          </div>
                          <div class="no-record" v-else :style="{height:scrollHeight + 'px'}">
                              <div class="no-record-content">
                                  <div class="no-record-bg">
                                      <img src="../assets/img/store.png" style="width:60px"/>
                                  </div>
                                  <p>您还有没关注的商家哦~~</p>
                              </div>
                          </div>                        
                        </section>

                        

                    </mt-tab-container-item>

                    <mt-tab-container-item id="tab-container3">
                        <section>
                          <div class="section-container">
                            <div class="section-title">
                                <h3>你可能有兴趣的话题</h3>
                                <div class="right-more" @click="more">
                                    <span>查看更多</span>
                                    <i class="icon icon-right-arrow"></i>
                                </div>
                            </div>
                            <div class="section-wrapper">
                                <ul class="section-lists">
                                    <li class="section-item" v-for="(item,index) in data.tab3.recommend">
                                        <div class="section-content">
                                            <router-link :to="'/tag/' + item.tag_id"  >
                                                <div class="album-block">
                                                    <img :src="item.tag_album" />
                                                </div>
                                                <div class="info-block">
                                                    <h3>{{item.tag_name}}</h3>
                                                    <span>你可能感兴趣</span>
                                                </div>
                                            </router-link>
                                        </div>
                                        <div class="section-btn">
                                            <span class="btn-followed" @click="rmFollow(item.follow_id,index,'recommend')" v-if="item.is_follow">已关注</span>
                                            <span class="btn-follow" @click="doFollow(item.tag_id,index,'recommend')" v-else>关注</span>
                                        </div>
                                    </li>

                                </ul>
                            </div>
                          </div>
                        </section>

                        <section>
                          <div class="section-container" v-if="data.tab3.items.length > 0">
                            <div class="section-title">
                                <h3>正在关注</h3>
                               
                            </div>
                            <div class="section-wrapper">
                              <ul class="section-lists"
                                  v-infinite-scroll="loadMore"
                                  infinite-scroll-disabled="loading"
                                  infinite-scroll-distance="10"
                                  infinite-scroll-immediate-check="check"
                                  :style="{height:scrollHeight + 'px'}"
                                  ref="wrapper3"
                              >
                                    <li class="section-item" v-for="(item,index) in data.tab3.items" >
                                        <div class="section-content">
                                            <router-link :to="'/tag/' + item.tag_id"  >
                                                <div class="album-block">
                                                    <img :src="item.tag_album" />
                                                </div>
                                                <div class="info-block">
                                                    <h3>{{item.tag_name}}</h3>
                                                    <span>你可能感兴趣</span>
                                                </div>
                                            </router-link>
                                        </div>
                                        <div class="section-btn">
                                            <span class="btn-followed" @click="rmFollow(item.follow_id,index,'follow')" v-if="item.is_follow">已关注</span>
                                            <span class="btn-follow" @click="doFollow(item.tag_id,index,'follow')" v-else>关注</span>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                          </div>
                          <div class="no-record" v-else :style="{height:scrollHeight + 'px'}">
                            <div class="no-record-content">
                                <div class="no-record-bg">
                                    <img src="../assets/img/tag.png" style="width:60px"/>
                                </div>
                                <p>您还有没关注的话题哦~~</p>
                            </div>
                          </div>
                        </section>


                        

                    </mt-tab-container-item>

            </my-tab-container>

            <div class="mint-spinner-bottom" v-show="loadBotVisible">
                  <mt-spinner type="fading-circle"></mt-spinner>
            </div>

        </div>
        
    </div>
</template>

<script>
import qs from 'qs'
import footnav from '../components/footer.vue';
import tabContainer from '../components/tab-container.vue';
import { InfiniteScroll } from 'mint-ui';

export default {
  name:'follow',
  components:{
    'foot-nav':footnav,
    'my-tab-container':tabContainer
  },
  data(){
      return {
          user_id:0,
          loading:false,
          check:false,
          swipeable:true,
          loadBotVisible:false,
          active: 'tab-container1',
          maxDistance:0,
          scrollHeight:0,
          botStatus:'',
          tabstate:[0,0,0],
          data:{
            tab1:{
              page:1,
              records:0,
              total:0,
              more:true,
              items:[],
              recommend:[],
            },
            tab2:{
              page:1,
              records:0,
              total:0,
              more:true,
              items:[],
              recommend:[],
            },
            tab3:{
              page:1,
              records:0,
              total:0,
              more:true,
              items:[],
              recommend:[],
            }
          }
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
          this.getKind();
          if( !this.tabstate[this.activeIndex] ){
              
              this.loadVisible = true;
              this.loadTab();
              
          } else {
            
          }
          this.tabstate[this.activeIndex] = 1;
      },
      getKind(){
          var kind = '';
          if( this.activeIndex === 0 ){
              kind = 'user';
          }

          if( this.activeIndex === 1 ){
              kind = 'store';
          }

          if( this.activeIndex === 2 ){ 
              kind ='tag';
          }

          this.kind = kind;
      },
      getUrl( type ){
        let url;
        if( this.kind === 'user' ){

          if( type === 'recommend' ){
            url = SYS.URL.moments.follow_recommend
          }

          if( type === 'follow' ){
            url = SYS.URL.moments.follow_user
          }

          if( type === 'add') {
            url = SYS.URL.moments.follow_add
          }

          if( type === 'remove'){
            url = SYS.URL.moments.follow_remove
          }
        }

        if( this.kind === 'store' ){
          if( type === 'recommend' ){
            url = SYS.URL.moments.store_follow_recommend
          }

          if( type === 'follow' ){
            url = SYS.URL.moments.store_follow
          }

          if( type === 'add') {
            url = SYS.URL.moments.store_follow_add
          }

          if( type === 'remove'){
            url = SYS.URL.moments.store_follow_remove
          }
        }

        if( this.kind === 'tag' ){
          if( type === 'recommend' ){
            url = SYS.URL.moments.tag_follow_recommend
          }

          if( type === 'follow' ){
            url = SYS.URL.moments.tag_follow
          }

          if( type === 'add') {
            url = SYS.URL.moments.tag_follow_add
          }

          if( type === 'remove'){
            url = SYS.URL.moments.tag_follow_remove
          }

        }

        return url;
      },
      loadTab(){
        this.loadRecommend().
        then(()=>{
            var viewportHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight || 0;
            var headHeight = document.querySelector('.header').offsetHeight;
            var sectionHeight = document.querySelectorAll('.mint-tab-container-item')[this.activeIndex].getElementsByTagName('section')[0].offsetHeight;
            this.scrollHeight = viewportHeight - headHeight - sectionHeight;
        });
        this.loadList();
      },
      loadRecommend(){
          let url = this.getUrl('recommend');
          var params = {
              'page':1,
              'rows':3
          };
          return new Promise((resolve, reject) => {
              this.$http.get(url,{params:params}).then((res) => {
                  var data = res.data;
                  if (data.status === 200) {
                      let tabId = this.tabId();
                      this.data[tabId].recommend = data.data.items;
                  }
                  resolve(res);
              })
          });
      },
      loadList(){
          let tabId = this.tabId();
          let url   = this.getUrl('follow');
          var params = {
              'page':this.data[tabId].page,
              'rows':5,
              'user_id' : this.user_id,
          };
          return new Promise((resolve, reject) => {
              if( !this.data[tabId].more ){
                  resolve(true);
                  return;
              }
              this.$http.get(url,{params:params}).then((res) => {
                  var data = res.data;
                  if (data.status === 200) {
                      
                      this.data[tabId].page = data.data.page + 1;
                      this.data[tabId].records = data.data.records;
                      this.data[tabId].total = data.data.total;
                      if( data.data.total == data.data.page || data.data.total == 0 ){
                        this.data[tabId].more = false;
                      }
                      this.data[tabId].items.push.apply(this.data[tabId].items,data.data.items);
                     
                  }
                  
                  resolve(res);
              })
          });
      },
      loadMore() {
        this.loading = true;
        this.loadBotVisible = true;

        this.loadList().
        then(() => {
            this.loadBotVisible = false;
            this.loading = false;
            return;
        });
      },
      doFollow( id,index,type ){

        let url = this.getUrl('add');
        let params = {};

        if( this.kind == 'user' ){
          params.up_user_id = id;
        }

        if( this.kind == 'store' ){
          params.store_id = id;
        }

        if( this.kind == 'tag' ){
          params.tag_id = id;
        }

   
        return new Promise((resolve, reject) => {
            this.$http.post(url,qs.stringify(params)).then((res) => {
                var data = res.data;

                if (data.status === 200) {
                    let tabId = this.tabId();
                    if( type === 'recommend' ){
                      this.data[tabId].recommend[index].is_follow = true;
                      this.data[tabId].recommend[index].follow_id = data.data.follow_id;
                    } else {
                      this.data[tabId].items[index].is_follow = true;
                      this.data[tabId].items[index].follow_id = data.data.follow_id;
                    }
                    
                }

                resolve(res);
            })
        });
      },
      rmFollow( id,index,type ){
        let url = this.getUrl('remove');
        let params = qs.stringify({follow_id:id});
        return new Promise((resolve, reject) => {
            this.$http.post(url,params).then((res) => {
                var data = res.data;
                if (data.status === 200) {
                    let tabId = this.tabId();
                    if( type === 'recommend' ){
                      this.data[tabId].recommend[index].is_follow = false;
                    } else {
                      this.data[tabId].items[index].is_follow = false;
                    }
                    
                }
                resolve(res);
            })
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
      store(id){
        window.location.href = WapSiteUrl + '/tmpl/store.html?store_id='+id
      },
      more(){
        this.$router.push({path:'/recommend/' + this.active})
      },
      startMove(){
        this.maxDistance = 0.001;
      },
      endMove(){
        this.maxDistance = 0;
      }
  },
  mounted(){
      this.active  = this.$route.params.tab ? this.$route.params.tab : 'tab-container1';
      this.renderTab(this.active);

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
      this.user_id = this.$route.params.user_id ? this.$route.params.user_id : uid;
  }

}
</script>

<style scoped>
 
  .no-record {
      position:relative;
      min-height:200px;
  }
 
</style>