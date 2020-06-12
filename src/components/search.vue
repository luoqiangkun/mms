<template>
  <div class="mint-search">
    <div class="mint-searchbar">
      <div class="mint-searchbar-inner">
        <i class="mintui mintui-search"></i>
        <input
        ref="input"
        type="search"
        v-model="currentValue"
        :placeholder="placeholder"
        class="mint-searchbar-core" />
      </div>
      <a
        class="mint-searchbar-cancel"
        @click="cancle"
        v-text="cancelText">
      </a>
    </div>
    <div class="mint-search-list" v-show="show || currentValue">
      <div class="mint-search-list-warp">
        <slot>
          <mt-cell v-for="(item, index) in result" :key="index" :title="item"></mt-cell>
        </slot>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import { Cell } from 'mint-ui';

export default {
  name: 'mt-search',

  data() {
    return {
      visible: false,
      currentValue: this.value
    };
  },

  methods:{
      cancle(val){
        this.$emit('cancle', val);
      } 
  },

  watch: {
    currentValue(val) {
      this.$emit('input', val);
    },

    value(val) {
      this.currentValue = val;
    }
  },

  props: {
    value: String,
    autofocus: Boolean,
    show: Boolean,
    cancelText: {
      default: '取消'
    },
    placeholder: {
      default: '搜索'
    },
    result: Array
  },

  mounted() {
    this.autofocus && this.$refs.input.focus();
  }
};
</script>

<style scoped>
.mint-search {
    height: 100%;
    height: 100vh;
    overflow: hidden;
}
.mint-searchbar {
    position: relative;
    -webkit-box-align: center;
        -ms-flex-align: center;
            align-items: center;
    box-sizing: border-box;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    padding: 10px 15px;
    z-index: 1;
    box-shadow: 0 0.05rem 0.8rem 0 rgba(0,0,0,.04);
    background:#fff;
}
.mint-searchbar-inner {
    -webkit-box-align: center;
        -ms-flex-align: center;
            align-items: center;
    background-color: #efefef;
    border-radius: 2px;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-flex: 1;
        -ms-flex: 1;
            flex: 1;
    height: 1.2rem;
    padding: .2rem .5rem;
    border-radius: 1.2rem;
    font-size:.5rem;
}
.mint-searchbar-inner .mintui-search {
    font-size: .6rem;
    color: #d9d9d9;
}
.mint-searchbar-core {
    -webkit-appearance: none;
       -moz-appearance: none;
            appearance: none;
    border: 0;
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    outline: 0;
    background: transparent;
}
.mint-searchbar-cancel {
    color: #333333;
    margin-left: 15px;
    text-decoration: none;
    font-size:.5rem;
}
.mint-search-list {
    overflow: auto;
    padding-top: 44px;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    position: absolute;
}
</style>
