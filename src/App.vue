<template>
  <div id="app">
  <keep-alive>
    <router-view v-if="$route.meta.keepAlive"></router-view>
  </keep-alive>
  <router-view v-if="!$route.meta.keepAlive" :key="key"></router-view>



  </div>
</template>

<script>

export default {
  name: 'App',

  data(){
    return {
          src: 'http://img1.vued.vanthink.cn/vued0a233185b6027244f9d43e653227439a.png',
          data:{},
    }
  },
  methods: {
     
  },
  computed:{
      key(){
          return this.$route.path + Math.random();
      }
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
