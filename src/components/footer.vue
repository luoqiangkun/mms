<template>
    <div id="footnav" class="footnav clearfix">
        <ul class="ul-nav">
            <li>
               <router-link :to="{path:'/index'}"><span>首页</span></router-link>
            </li>
            <li>
               
               <span @click="toShop">商城</span>

            </li>
            <li>
               <span>+</span>
            </li>
            <li>
             
               <router-link :to="'/message'"><span>消息</span></router-link>

            </li>
            <li>
               <router-link :to="'/home'"><span>我</span></router-link>
            </li>
        </ul>

        <upload  ref="upload" :files="files" :container="container" :browse_button="browse_button" @upout="upOut">
            <span slot="file"  class="btn btn-upload" id="browse">+</span>
        </upload>

    </div>
</template>
<script>

import upload from '../components/upload.vue'

export default {
    name:'footnav',
    components:{
      'upload' : upload
    },
    data(){
      return {
        browse_button: ['browse','uploadBtn'],
        container: 'footnav',
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
        }
      }
    },
    methods:{
      toShop(){
          window.location.href = WapSiteUrl;
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
      }
    },
    mounted(){
      this.$nextTick( () => {
        this.$refs.upload.initUploader();
      })
    },

}
</script>
<style scoped>
    
</style>
