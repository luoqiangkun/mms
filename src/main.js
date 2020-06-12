// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Router from 'vue-router'
import App from './App'
import router from './router'
import axios from 'axios'
import qs from 'qs'
import MintUI from 'mint-ui'
import VueVideoPlayer from 'vue-video-player'
import {getCookie,setCookie,getQueryString} from './assets/js/utils'
import store from './assets/js/store'
import 'mint-ui/lib/style.css'
import './assets/css/reset.css'
import './assets/css/base.css'
import preview from 'vue-photo-preview'
import 'vue-photo-preview/dist/skin.css'

var options = {
	addCaptionHTMLFn: function(item, captionEl, isFake) {
      	captionEl.children[0].innerHTML = '<div id="pswp__caption__center--opt" class="pswp__caption__center--opt">' +item.title+ '</div>';
    	return true;
  	},
}
Vue.use(preview,options)
Vue.use(Router)
Vue.use(VueVideoPlayer)
Vue.use(MintUI)

Vue.prototype.$http = axios
axios.defaults.baseURL = ApiUrl   //加前缀
Vue.prototype.$axios = axios
global.$axios = axios    //全局化
Vue.config.productionTip = false
var uid = getCookie('uid');
Vue.prototype.uid = uid
global.uid = uid
var isApp = getCookie('isapp');
Vue.prototype.isApp = isApp
global.isApp = isApp

if( !uid ){

	window.location.href = WapSiteUrl+'/tmpl/member/login.html' + '?callback=' + encodeURIComponent(window.location.href);
}


/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})


