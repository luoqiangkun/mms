<template>
    <div class="page">
        <div class="header">
            <div class="header-back" @click="goBack"></div>
            <h1 class="header-title header-title-top">
                推荐关注
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
            <div class="mint-spinner-load" v-show="loadTopVisible">
              <mt-spinner type="fading-circle"></mt-spinner>
            </div>

           <my-tab-container class="page-tabbar-tab-container" v-model="active" :swipeable = "swipeable"  >
                <mt-tab-container-item id="tab-container1">
                    <div class="card-scroll"  
                      v-infinite-scroll="loadMore"
                      infinite-scroll-disabled="loading"
                      infinite-scroll-distance="10"
                      infinite-scroll-immediate-check="check"
                      :style="{height:scrollHeight + 'px'}"
                      ref="wrapper1">
                      <div class="card" v-for="(item,index) in data.tab1.items" v-if="data.tab1.items.length > 0">
                          <div class="card-title">
                              <div class="card-info">
                                  <router-link :to="uid == item.user_id ? '/home' : '/user/' + item.user_id"  >
                                      <div class="album-block">
                                          <img v-lazy="item.user_avatar" />
                                      </div>
                                      <div class="info-block">
                                          <h3>{{item.user_nickname}}</h3>
                                          <span>你可能感兴趣</span>
                                      </div>
                                  </router-link>
                              </div>
                              <div class="card-button">
                                  <span class="btn-followed" @click="rmFollow(item.follow_id,index)" v-if="item.is_follow">已关注</span>
                                  <span class="btn-follow" @click="doFollow(item.user_id,index)" v-else>关注</span>
                              </div>
                          </div>

                          <div class="card-wrapper" :ref="'tab1_card_' + index">
                              <ul class="card-lists">
                                <li class="card-item" style="margin-right:10px" v-for="moments in item.moments">
                                    <template v-if="moments.moments_type==4">
                                        <div class="card-item-album" @click="jumpVideoPlay(moments.moments_id)">
                                             <img v-lazy="moments.moments_image[0]" />
                                        </div>
                                        <div class="card-item-info" @click="jumpVideoPlay(moments.moments_id)">
                                            <div class="moments_title">{{moments.moments_title}}</div>
                                          
                                        </div>
                                    </template>



                                    <router-link :to="'/detail/'+moments.moments_id" v-else="item.moments_type==1">
                                        <div class="card-item-album">
                                             <img v-lazy="moments.moments_image[0]" />
                                        </div>
                                        <div class="card-item-info">
                                            <div class="moments_title">{{moments.moments_title}}</div>
                                          
                                        </div>
                                    </router-link>

                                </li>
                               
                            </ul>

                          </div>
                      </div>

                      <div class="no-record" v-if="data.tab1.items.length == 0">
                          <div class="no-record-content">
                              <div class="no-record-bg">
                                  <img src="../assets/img/store.png" style="width:60px"/>
                              </div>
                              <p>暂无相关数据哦~~</p>
                          </div>
                      </div>
                    </div>
                    

                </mt-tab-container-item>

                <mt-tab-container-item id="tab-container2">
                  <div class="card-scroll" v-infinite-scroll="loadMore"
                      infinite-scroll-disabled="loading"
                      infinite-scroll-distance="10"
                      infinite-scroll-immediate-check="check"
                      :style="{height:scrollHeight + 'px'}"
                      ref="wrapper2">
                    <div class="card" v-for="(item,index) in data.tab2.items" v-if="data.tab2.items.length > 0">
                      <div class="card-title">
                            <div class="card-info" @click="store('item.store_id')">
                                <div class="album-block" >
                                    <img v-lazy="item.store_logo" />
                                </div>
                                <div class="info-block">
                                    <h3>{{item.store_name}}</h3>
                                    <span>你可能感兴趣</span>
                                </div>
                            </div>
                            <div class="card-button">
                                <span class="btn-followed" @click="rmFollow(item.follow_id,index)" v-if="item.is_follow">已关注</span>
                                <span class="btn-follow" @click="doFollow(item.store_id,index)" v-else>关注</span>
                            </div>
                      </div>
                      <div class="card-wrapper" :ref="'tab2_card_' + index">
                        <ul class="card-lists">
                              <li class="card-item" style="margin-right:10px" v-for="product in item.products" @click="productDetail('product.product_id')">
                                  <div class="card-item-album">
                                       <img v-lazy="product.product_image" />
                                  </div>
                                  <div class="card-item-info">
                                      <div class="product_name">{{product.product_name}}</div>
                                      <span class="product_price">￥{{product.product_unit_price}}</span>
                                  </div>
                              </li>

                          </ul>
                      </div>
                    </div>

                    <div class="no-record" v-if="data.tab2.items.length == 0">
                        <div class="no-record-content">
                            <div class="no-record-bg">
                                <img src="../assets/img/store.png" style="width:60px"/>
                            </div>
                            <p>暂无相关数据哦~~</p>
                        </div>
                    </div>
                  </div>
                </mt-tab-container-item>

                <mt-tab-container-item id="tab-container3">
                    <section :style="{height:scrollHeight + 'px'}">

                      <div class="section-container" v-if="data.tab3.items.length > 0">
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
                                                <img v-lazy="item.tag_album" />
                                            </div>
                                            <div class="info-block">
                                                <h3>{{item.tag_name}}</h3>
                                                <span>你可能感兴趣</span>
                                            </div>
                                        </router-link>
                                    </div>
                                    <div class="section-btn">
                                        <span class="btn-followed" @click="rmFollow(item.follow_id,index)" v-if="item.is_follow">已关注</span>
                                        <span class="btn-follow" @click="doFollow(item.tag_id,index)" v-else>关注</span>
                                    </div>
                                </li>
                            </ul>
                        </div>
                      </div>

                      <div class="no-record" v-else >
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
import BScroll from 'better-scroll'

export default {
  name:'recommend',
  components:{
    'foot-nav':footnav,
    'my-tab-container':tabContainer
  },
  data(){
      return {
          loadTopVisible:false,
          loadBotVisible:false,
          loading:false,
          swipeable:true,
          check:false,
          active: 'tab-container1',
          maxDistance:0,
          scrollHeight:0,
          botStatus:'',
          tabstate:[0,0,0],
          data:{
            tab1:{
              page:1,
              rows:5,
              records:0,
              total:0,
              more:true,
              items:[],
            },
            tab2:{
              page:1,
              rows:5,
              records:0,
              total:0,
              more:true,
              items:[],
            },
            tab3:{
              page:1,
              rows:10,
              records:0,
              total:0,
              more:true,
              items:[],
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
              
              this.loadTopVisible = true;

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
        
        this.loadList().then(()=>{
           
           if( this.kind === 'tag'){
              return true;
           } 
          let tabId = this.tabId();
          let items = this.data[tabId].items;
          let wrapper_width = 0;

          for( let i in items ){
            let width = 0;
            let wrapper = this.$refs['tab' + (this.activeIndex + 1) + '_card_' + i][0];
            console.log( wrapper );
            let wrapper_lists = wrapper.querySelector('.card-lists');
            let wrapper_items = wrapper.querySelectorAll('.card-item');
            if( wrapper_items.length > 2 ){
              width += wrapper_items[0].offsetWidth * wrapper_items.length;
              wrapper_lists.style.width= width + 20 + 'px';
             
              let scroll = new BScroll(wrapper,{
                scrollX:0,
                click:true,
                scrollX:true,
                scrollY:false,
                eventPassthrough:'vertical',

              })
              scroll.on('beforeScrollStart', (pos) => {
                  this.swipeable = false;
              });

              scroll.on('scrollStart', (pos) => {
                  this.swipeable = false;
              });

              scroll.on('scrollEnd', (pos) => {
                  this.swipeable = true;
              });
            }

            
          }
          
          return true;
         
        }).then(()=>{
          this.loading = false;
          this.loadTopVisible = false;
          this.loadBotVisible = false;
        });
      },
      loadList(){
          let tabId = this.tabId();
          let url   = this.getUrl('recommend');
          var params = {
              'page':this.data[tabId].page,
              'rows':this.data[tabId].rows,
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
                      if( data.data.total == data.data.page || data.data.total == 0){
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
                    this.data[tabId].items[index].is_follow = true;
                    this.data[tabId].items[index].follow_id = data.data.follow_id;
                    
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
                    this.data[tabId].items[index].is_follow = false;
                    
                }
                resolve(res);
            })
        });
      },
      store(id){
        window.location.href = WapSiteUrl + '/tmpl/store.html?store_id='+id
      },
      productDetail(id){
        window.location.href = WapSiteUrl + '/tmpl/product_detail.html?product_id='+id
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
  mounted(){
      this.active  = this.$route.params.tab ? this.$route.params.tab : 'tab-container1';
      this.renderTab(this.active);

      var viewportHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight || 0;
      var headHeight = document.querySelector('.header').offsetHeight;
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
  created() {
      
  }

}
</script>

<style scoped>

</style>