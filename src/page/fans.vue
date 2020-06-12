<template>
    <div class="page">
        <div class="header">
            <div class="header-back" @click="goBack"></div>
            <h1 class="header-title" v-if="user_id == uid">
                我的粉丝
            </h1>
            <h1 class="header-title" v-else>
                TA的粉丝
            </h1>
        </div>
        <div class="container">
          <div 
          v-infinite-scroll="loadMore"
          infinite-scroll-disabled="loading"
          infinite-scroll-distance="10"
          :style="{height:scrollHeight + 'px'}"
          v-if="data.items.length > 0"
          >
            <div class="card" v-for="(item,index) in data.items" >
                <div class="card-title">
                    <div class="card-info">
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
                    <div class="card-button">
                        <span class="btn-followed" @click="rmFollow(item.follow_id,index)" v-if="item.is_follow">已关注</span>
                        <span class="btn-follow" @click="doFollow(item.user_id,index)" v-else>关注</span>
                    </div>
                </div>

                <div class="card-wrapper" ref="wrapper">
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

          </div>
          

          <div class="no-record" v-if="data.items.length == 0" :style="{height:scrollHeight + 'px'}" >
              <div class="no-record-content">
                  <div class="no-record-bg">
                      <img src="../assets/img/fans.png" style="width:60px"/>
                  </div>
                  <p>暂无相关数据哦~~</p>
              </div>
          </div>

          <div class="mint-spinner-bottom" v-show="loadBotVisible">
              <mt-spinner type="fading-circle"></mt-spinner>
          </div>
        </div>
        
    </div>
</template>

<script>
import qs from 'qs'
import BScroll from 'better-scroll'

export default {
  name:'fans',
  components:{
  },
  data(){
      return {
          user_id:0,
          loading:false,
          loadBotVisible:false,
          botStatus:'',
          scrollHeight:0,
          data:{
            page:1,
            rows:5,
            records:0,
            total:0,
            more:true,
            items:[],
          },
      }
  },
  methods:{
      initPage(){
        this.loadList().then(()=>{
          return this.scroll();
        });
      },
      loadList(){
          let url = SYS.URL.moments.follow_fans;
          var params = {
              'page':this.data.page,
              'rows':this.data.rows,
              'user_id':this.user_id
          };
          return new Promise((resolve, reject) => {
              if( !this.data.more ){
                  this.loadBotVisible = false;
                  return;
              }
              this.$http.get(url,{params:params}).then((res) => {
                  var data = res.data;
                  if (data.status === 200) {
                      
                      this.data.page = data.data.page + 1;
                      this.data.records = data.data.records;
                      this.data.total = data.data.total;
                      if( data.data.total == data.data.page || data.data.total == 0 ){
                        this.data.more = false;
                      }
                      this.data.items.push.apply(this.data.items,data.data.items);
                  }
                  this.loadBotVisible = false;
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
      loadBottom() {
        this.initPage();
        this.$refs.loadmore.onBottomLoaded();
      },
      handleBotChange( status ){
        this.botStatus = status;
      },
      scroll(){
        let items = this.data.items;
        let wrapper_width = 0;
        for( let i in items ){
          let width = 0;
          let wrapper = this.$refs.wrapper[0];
        
          let wrapper_lists = wrapper.querySelector('.card-lists');
          let wrapper_items = wrapper.querySelectorAll('.card-item');
          if( wrapper_items.length == 0 ){
            return;
          }
          width += wrapper_items[0].offsetWidth * wrapper_items.length;
          wrapper_lists.style.width= width + 20 + 'px';
          let scroll = new BScroll(wrapper,{
            // scrollX:0,
            // click:true,
            scrollX:true,
            // scrollY:false,
            // eventPassthrough:'vertical',

          })
        }
      },
      doFollow( id,index,type ){

        let url = SYS.URL.moments.follow_add;
        let params = {};
        params.up_user_id = id;
        return new Promise((resolve, reject) => {
            this.$http.post(url,qs.stringify(params)).then((res) => {
                var data = res.data;

                if (data.status === 200) {
                    
                    this.data.items[index].is_follow = true;
                    this.data.items[index].follow_id = data.data.follow_id;
                    
                }

                resolve(res);
            })
        });
      },
      rmFollow( id,index,type ){
        let url = SYS.URL.moments.follow_remove;
        let params = qs.stringify({follow_id:id});
        return new Promise((resolve, reject) => {
            this.$http.post(url,params).then((res) => {
                var data = res.data;
                if (data.status === 200) {
                    
                    this.data.items[index].is_follow = false;
                    
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
    this.initPage();

    var viewportHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight || 0;
    var headHeight = document.querySelector('.header').offsetHeight;
    this.scrollHeight = viewportHeight - headHeight;

  },
  created() {
      this.user_id = this.$route.params.user_id ? this.$route.params.user_id : uid;
  }

}
</script>

<style scoped>
  .no-record {
    position: relative;
  }
</style>