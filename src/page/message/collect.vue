<template>
    <div class="page">
        <div class="header">
            <div class="header-back" @click="goBack"></div>
            <h1 class="header-title">
                收藏和点赞
            </h1>
        </div>

        <div class="container">
           <div class="wrapper" v-if="data.items.length > 0 ">
              <ul class="content" 
                  v-infinite-scroll="loadMore"
                  infinite-scroll-disabled="loading"
                  infinite-scroll-distance="10"
                  infinite-scroll-immediate-check="check"
                  >
                  <li class="content-item" v-for="(item,index) in data.items" >
                    <router-link :to="{path:'/detail/' + item.moments_id}">
                      <div class="content-cell">
                        <div class="content-cell-left">
                           <div class="album-block">
                                <img :src="item.user_avatar" />
                            </div>
                            <div class="info-block">
                                <h3>{{item.user_nickname}} <label style="font-weight: 100;font-style: normal;">{{ type === 1 ? '收藏' : '点赞'}}了你的动态</label></h3>
                                <span class="time">{{item.time}}</span>
                            </div>
                        </div>

                        <div class="content-cell-right">
                          <div class="album-block">
                                <img :src="item.moments_image[0]" />
                            </div>
                        </div>
                      </div>
                    </router-link>
                  </li>

              </ul>

              


              <div class="mint-spinner-bottom" v-show="loadBotVisible">
                    <mt-spinner type="fading-circle"></mt-spinner>
              </div>
           </div>

           <div class="no-record" v-if="data.items.length == 0 " style="position:fixed">
              <div class="no-record-content">
                  <div class="no-record-bg">
                      <img src="../../assets/img/message.png" style="width:60px"/>
                  </div>
                  <p>暂无消息</p>
              </div>
            </div>

        </div>
        
         <foot-nav></foot-nav>

        <div class="page-load" v-show="loadPageVisible">
            <mt-spinner type="fading-circle"></mt-spinner>
        </div>


    </div>
</template>

<script>
import qs from 'qs'
import footnav from '../../components/footer.vue';
import { InfiniteScroll } from 'mint-ui';

export default {
  name:'msg_collect',
  components:{
    'foot-nav':footnav
  },
  data(){
      return {
        width:0,
        loading:false,
        check:false,
        loadBotVisible:false,
        loadPageVisible:true,
        scrollHeight:0,
        data:{
          page:1,
          records:0,
          total:0,
          more:true,
          items:[],
        }
      }
  },
  methods:{
      loadList(){
          let url   = SYS.URL.moments.msg_collect_and_like;
          var params = {
             'page':this.data.page,
          };
          return new Promise((resolve, reject) => {
              if( !this.data.more ){
                  resolve(true);
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
      goBack(){
        if (window.history.length <= 1) {
            this.$router.push({path:'/'})
            return false
        } else {
            this.$router.go(-1)
        }
      }
  },
  mounted(){
      this.loadList().then(()=>{
        this.loadPageVisible = false;
      });
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
 
</style>