<template>
    <div class="page">
        <div class="header">
            <div class="header-content">
                <h1 class="header-title">
                    消息
                </h1>
            </div>
        </div>

        <div class="nav">
            <div class="nav-cell">
              <router-link :to="{path:'/msg_collect/'}">
                <div class="nav-cell-bg bg-red">
                   <img src="../assets/img/heart.png" />
                </div>
               
                <p>赞和收藏</p>
              </router-link>
            </div>
            <div class="nav-cell">
              <router-link :to="{path:'/msg_follow/'}">
                <div class="nav-cell-bg bg-blue">
                   <img src="../assets/img/friends.png" />
                </div>

                
                <p>粉丝</p>
                </router-link>
            </div>
            <div class="nav-cell ">
              <router-link :to="{path:'/msg_comment/'}">
                <div class="nav-cell-bg bg-green">
                   <img src="../assets/img/pinlun.png" />
                </div>

                
                <p>评论</p>
              </router-link>
            </div>
        </div>
        <div class="container">
         <div class="wrapper" >
            <ul class="content" 
                v-infinite-scroll="loadMore"
                infinite-scroll-disabled="loading"
                infinite-scroll-distance="10"
                infinite-scroll-immediate-check="check"
                ref="wrapper1"
                v-if="data.items.length > 0 "
            >
                  <li class="content-item" v-for="(item,index) in data.items" @click="detail(item.user_other_id,item.user_other_nickname)">
                     <mt-cell-swipe
                      :right="[
                        {
                          content: '删除',
                          style: { background: 'red', color: '#fff' },
                          handler: () => { delMessage( item.user_other_id ,index) }
                        }
                      ]">
                      <div class="content-cell" :style="{width:width + 'px'}">
                        <div class="content-cell-left">
                           <div class="album-block">
                                <img :src="item.user_other_avatar" />
                            </div>
                            <div class="info-block">
                                <h3>{{item.message_type}}</h3>
                                <span>{{item.message_content}}</span>
                            </div>
                        </div>

                        <div class="content-cell-right">
                          <span class="time">{{item.message_time}}</span>
                        </div>

                      </div>
                      

                      </mt-cell-swipe>
                  </li>
            </ul>

            <div class="mint-spinner-bottom" v-show="loadBotVisible">
                  <mt-spinner type="fading-circle"></mt-spinner>
            </div>

         </div>

          <div class="no-record" v-if="data.items.length == 0 ">
            <div class="no-record-content">
                <div class="no-record-bg">
                    <img src="../assets/img/message.png" style="width:60px"/>
                </div>
                <p>暂无消息</p>
            </div>
          </div>

        </div>
        
         <foot-nav></foot-nav>
    </div>
</template>

<script>
import qs from 'qs'
import footnav from '../components/footer.vue';
import { InfiniteScroll } from 'mint-ui';

export default {
  name:'follow',
  components:{
    'foot-nav':footnav
  },
  data(){
      return {
        width:0,
        loading:false,
        check:false,
        loadBotVisible:false,
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
          let url   = SYS.URL.user.msg_user_lists;
          var params = {
            'page':this.data.page,
            recent:1
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
      delMessage( user_other_id,index){
        return new Promise((resolve, reject) => {
          this.$axios
          .post(
            SYS.URL.user.msg_remove_user,
            { user_other_id: user_other_id },
            { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
          )
          .then(res => {
            if (res.data.status == 200) {
              this.data.items.splice(index,1);
            }
          });
       
      });
    },
    detail(user_other_id,user_other_nickname){
      window.location.href = WapSiteUrl + '/tmpl/member/chat_info.html?user_other_id=' + user_other_id + '&user_other_nickname=' + user_other_nickname;
    }
  },
  mounted(){
      this.loadList();

       this.width = document.querySelector('.wrapper').offsetWidth - 20
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
      position:fixed;
      width: 100%;
      top:0;
      bottom: 0;
  }
  .no-record-content {
      width: 8rem;
      text-align: center;
      position: absolute;
      left: 50%;
      top: 50%;
      transition: -50%;
      transform: translate(-50%, -50%);
  }
  .no-record-bg {
      width:100%;
      opacity:.2;
  }
  .no-record-content p {
      color: #b3b3b3;
      font-size: .6rem;
      line-height: 1.2rem;
  }

</style>