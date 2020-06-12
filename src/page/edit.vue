<template>
     <upload :files="files" :form="form" :container="container" :browse_button="browse_button" :uptype="uptype" @upout="upOut"  ref="upload" >
      
    </upload>
</template>

<script>

import upload from '../components/upload.vue'

export default {
    name:'edit',
    components:{
      'upload' : upload
    },
    data(){
      return {
        modal:false,
        browse_button: '',
        container: '',
        visible:true,
        files: [],
        uptype:'image',
        form: {
          moments_id:0,
          moments_title:'',
          moments_content:'',
          moments_tag_id:[],
          moments_tag_name:[],
          moments_area_id:'',
          moments_area_name:'',
          moments_product_id:[],
          moments_image:[],
          moments_video:[],
          moments_draft:1
        }
      }
    },
    methods:{
      upOut(){
          if (window.history.length <= 1) {
              this.$router.push({path:'/'})
              return false
          } else {
              this.$router.go(-1)
          }
      },
      loadData(){
         var params = {
              'moments_id':this.moments_id
          };
        return new Promise((resolve, reject) => {
            this.$http.get(SYS.URL.moments.detail,{params:params}).then((res) => {
                var data = res.data;
                if (data.status === 200) {
                    if( data.data.moments_type === 4 ){
                      this.uptype = 'video';
                    } else {
                      this.uptype = 'image';
                    }
                    this.files = data.data.media_rows;
                    this.form.moments_id = data.data.moments_id;
                    this.form.moments_title = data.data.moments_title;
                    this.form.moments_content = data.data.moments_content;
                    this.form.moments_area_id = data.data.moments_area_id;
                    this.form.moments_area_name = data.data.moments_area_name;
                    this.form.moments_product_id = data.data.moments_product_id ? data.data.moments_product_id : [];

                    let tag_id = [];
                    let tag_name = [];
                    for( let i in data.data.moments_tag ){
                      tag_id.push( data.data.moments_tag[i].tag_id );
                      tag_name.push( data.data.moments_tag[i].tag_name )
                    }
                    this.form.moments_tag_id   = tag_id;
                    this.form.moments_tag_name = tag_name;
                }

                this.$refs.upload.formVisible = true;
                resolve(res);
            })
        });
      }
    },
    mounted(){
      this.visible = true;
    },
    created(){
      this.moments_id = this.$route.params.id
      this.loadData();
    }
} 
</script>

<style scoped>
 .mint-popup-1 {
    width: 100% !important;
    top:0;
  } 
</style>