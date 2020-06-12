<template>
    <div class="page">
        <div class="search-container">
            <div class="search-wrap">
                <div class="search-header" v-bind:style="{height:height}">
                    <my-search 
                        @input="search" 
                        v-model="keyword"  
                        placeholder="搜索"
                        ref="search"
                        @cancle="cancle" >
                        <div class="cell-item" @click="goBack" v-for="(item,index) in data.items">
                            <mt-cell :title="item.moments_title"></mt-cell>
                        </div>
                    </my-search>
                </div>
                
                <div class="search-content">
                    <div class="search-block" v-if="hot.length > 0">
                        <h4>热门搜索
                          
                        </h4>
                        <div class="search-list">

                            <div class="search-ceil" v-for="item in hot" @click="goKeyword(item)">{{item}}</div>
                        </div>
                    </div>    

                    <div class="search-block" v-if="history.length > 0">
                        <h4>
                          历史记录
                          <i class="icon icon-remove" @click="remove"></i>
                        </h4>
                        <div class="search-list">
                            <div class="search-ceil" v-for="item in history" @click="goKeyword(item)">{{item}}</div>
                        </div>
                    </div>
                </div>
            </div>
           
        </div>
    </div>
</template>

<script>
import Vue from 'vue'
import mySearch from '../components/search'
import {delLocalStorage} from '../assets/js/utils'

export default {
  name:'search',
  components:{
    'my-search' : mySearch
  },
  data(){
      return {
          height:'2rem',
          keyword:'',
          visible:true,
          loadVisible:false,
          tab:'',
          data:{
            page:1,
            records:0,
            total:0,
            more:true,
            items:[],
          },
          hot:[],
          history:[],
      }
  },
  methods:{
      search( val ){
          if( val ){
              this.height = '100%';
          } else {
              this.height = '2rem';
          }

          this.loadVisible = true;
          this.loadSearch();
      },
      cancle(){
          this.keyword = '';
          this.$router.push({
            path: `/index/${this.tab}`,
          })
      },
      initSearch(){
        var self = this;
        this.$http.get(SYS.URL.search_hot_info).then(function (res) {
            var data = res.data;
            if (data.status === 200) {
                self.hot = data.data.search_hot_words;
                self.history = data.data.search_history_words;
                
            }
        })
      },
      loadSearch(){
          var params = {
              'keyword':this.keyword,
              'page':1,
              'rows':10
          };
          return new Promise((resolve, reject) => {
              this.$http.get(SYS.URL.moments.lists,{params:params}).then((res) => {
                  var data = res.data;
                  if (data.status === 200) {
                    this.data.page = data.data.page + 1;
                    this.data.records = data.data.records;
                    this.data.total = data.data.total;
                    this.data.loaded = true;
                    if( data.data.total == data.data.page || data.data.total == 0 ){
                        this.data.more = false;
                    }
                    this.data.items = data.data.items;
                    
                  }
                  resolve(res);
              })
          });
          
      },
      remove(){
        this.$http.get(SYS.URL.search_history_del).then( (res)=> {
            var data = res.data;
            if (data.status === 200) {
               this.history = [];
            }
        })

        
      },
      goKeyword( k ){
          this.keyword = k;
          this.goBack();
      },
      goBack(){
          this.$router.push({
            path: `/index/${this.tab}/${this.keyword}`,
          })
      },
  },
  mounted(){
      this.tab = this.$route.params.tab;
      this.initSearch();
  },

}
</script>

<style scoped>
  .page {
      background: #ffffff;
      position: fixed;
      width: 100%;
      top: 0;
      bottom: 0;
  }
</style>