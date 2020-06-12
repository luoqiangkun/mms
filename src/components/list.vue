<template>
 <div class="moments-scroll">
    <div class="moments-list effect-1" id="waterfull" v-if="lists.items.length > 0">
        <template >
            <div class="moments-item" :index="item.index" v-for="(item,index) in lists.items" :class="{ 'shown': item.shown, 'animate': item.animate}">
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
                        <router-link :to="'/detail/'+item.moments_id" v-if="item.moments_type==1">
                            <p v-html="item.moments_title.toString()"></p>
                        </router-link>

                        <p v-html="item.moments_title.toString()" v-else @click="jumpVideoPlay(item.moments_id)"></p>
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

</div>
</template>

<script>
import qs from 'qs'
import Masonry from 'masonry-layout'
import imagesLoaded from 'imagesloaded'

export default {
  name:'list',
  components:{
    
  },
  data(){
      return {
        maxHeight:'',
        maxWidth:'',
      }
  },
  props:{
    lists: {
      type:Object,
      default: function () {
        return { 
          page:1,
          records:0,
          total:0,
          more:true,
          items:[],
          loaded:false,
        }
      }
    }
  },
  methods:{
      doLike( id,index ){
          var params = qs.stringify({
                  'moments_id':id,
              });
          this.$http.post(SYS.URL.moments.like_add,params).then((res) => {
              var data = res.data;
              if (data.status === 200) {
                  
                  this.lists.items[index].is_like = data.data.like_id;
                  this.lists.items[index].moments_like_count++;
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
                  
                  this.lists.items[index].is_like = 0;
                  this.lists.items[index].moments_like_count--;
              }
          })
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
            if( document.querySelector('#waterfull') ){
              new Masonry( '#waterfull', {
                itemSelector: '.moments-item',
                transitionDuration : 0,
                'resize' : false
              });
              
              this.lists.items.forEach( (el, i) =>{
                  this.lists.items[i].shown = true;
                  this.lists.items[i].animate = true;
              });
            }
            
            resolve(this);
        });
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
  created(){
    this.maxWidth = (document.documentElement.clientWidth) / 2;
      this.maxHeight = Math.ceil(this.maxWidth * 1.33);
  },
  mounted(){
      

     
  },
  watch: {
    lists: {
  　　　　handler(newValue, oldValue) {
  　　　　　　 this.$nextTick( () => {
            return this.masonry();
          })
  　　　　},
  　　　　deep: true
  　　}

  },
}
</script>

<style>
  
     
</style>