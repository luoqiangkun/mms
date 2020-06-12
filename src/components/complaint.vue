<template>
   <mt-popup
      v-model="popupVisible"
      position="right"
      modal="modal"
      class="mint-popup-3"
      >    
    <div class="complaint">
        <slot name="header">
            <div class="header">
                <div class="left" >
                    <div @click="popupVisible = !popupVisible" >
                        <i class="icon icon-back"></i>
                    </div>
                </div>
                <div class="mid">
                    <h3>举报评论</h3>
                </div>
            </div>
        </slot>

        <div class="complaint-form">
            <div class="form-content">
                <mt-radio
                  align="right"
                  title="请选择举报原因"
                  v-model="complaint_reason_id"
                  :options="options">
                </mt-radio>

                <div class="submit-btn" @click="submit">
                    <mt-button size="large" :type="type" :style="complaint_reason_id ? 'background:#ef4f4f;color:#ffffff' : 'background:#ccc;color:#ffffff'">提交</mt-button>
                </div>

            </div>
            
            
        </div>
    </div>
</mt-popup>
</template>
<script>
import Vue from 'vue'
import { Toast } from 'mint-ui';

export default {
    name:'complaint',
    components:{
      
    },
    data(){
      return {
        complaint_reason_id:'',
        type:'default',
        modal:true,
        popupVisible:false,
        loaded:false,
        options: []
      }
    },
    props:{
      comment_id:Number
    },
    methods:{
      init(){
        this.popupVisible = true;
        if( !this.loaded ){
          this.loadData();
        }
        
      },
      loadData(){
        return new Promise((resolve, reject) => {
            this.$http.get(SYS.URL.moments.complaint_reason).then((res) => {
                var data = res.data;
               
                if (data.status === 200) {
                  for( let i in data.data.items ){
                    this.options.push({label:data.data.items[i].complaint_reason_name,value:data.data.items[i].complaint_reason_id.toString()})
                  }
                }

                this.loaded = true;
                resolve(res);
            })
        });
      },
      submit(){
        return new Promise((resolve, reject) => {
            if( !this.complaint_reason_id ){
              return;
            }
            this.$axios
            .post(
              SYS.URL.moments.complaint_add,
              { complaint_reason_id: this.complaint_reason_id,comment_id:this.comment_id},
              { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
            )
            .then(res => {
                let data = res.data;
                if (res.data.status == 200) {
                  Toast('提交成功');
                  this.popupVisible = false;
                }
            });
        });
      },
      goBack(){
        this.$emit('back');
      }
    },
    mounted(){
      
    },
    created(){
      
    }
}
</script>
<style lang="scss" scoped>
  .header {
    position: fixed;
    top: 0;
    left: 0;
    display: flex;
    box-sizing: border-box;
    width: 100%;
    height: 2rem;
    align-items: center;
    background-color: #fff;
    z-index:1;
    .left {
        position: absolute;
        left: .5rem;     
    }
    .mid{
        width: 80%;
        margin: 0 10%;
        text-align: center;
        h3{
            color: #000;
            font-size: .7rem;
        }
    }

    .icon {
        display:block;
        width:1rem;
        height:1rem;
    }

    .icon-back {
        background:url('../assets/img/left_arrow.png');
        background-size: 70%;
        background-position: 50% 50%;
        background-repeat: no-repeat;
    }
  }
  .complaint-form {
    text-align: left;
    position: relative;
    top: 2.1rem;

    .submit-btn {
      padding:0 .5rem;
      margin-top:0.5rem;
    }
  }

  .mint-popup-3 {
    width:100%;
    height:100%;
    background-color: #f5f8fa;
  }
</style>
