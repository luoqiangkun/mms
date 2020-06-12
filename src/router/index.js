import Vue from 'vue'
import Router from 'vue-router'
import index from '../page/index'

const search = r => require.ensure([],() => r(require('../page/search')),'search')
const home = r => require.ensure([],() => r(require('../page/home')),'home')
const follow = r => require.ensure([],() => r(require('../page/follow')),'follow')
const fans = r => require.ensure([],() => r(require('../page/fans')),'fans')
const user = r => require.ensure([],() => r(require('../page/user')),'user')
const tag = r => require.ensure([],() => r(require('../page/tag')),'tag')
const recommend = r => require.ensure([],() => r(require('../page/recommend')),'recommend')
const edit = r => require.ensure([],() => r(require('../page/edit')),'edit')
const detail = r => require.ensure([],() => r(require('../page/detail')),'detail')
const message = r => require.ensure([],() => r(require('../page/message')),'message')
const msg_collect = r => require.ensure([],() => r(require('../page/message/collect')),'collect')
const msg_follow = r => require.ensure([],() => r(require('../page/message/follow')),'message/follow')
const msg_comment = r => require.ensure([],() => r(require('../page/message/comment')),'message/comment')


// import index from '../page/index'
// import search from '../page/search'
// import home from '../page/home'
// import follow from '../page/follow'
// import fans from '../page/fans'
// import user from '../page/user'
// import tag from '../page/tag'
// import recommend from '../page/recommend'
// import edit from '../page/edit'
// import detail from '../page/detail'
// import message from '../page/message'
// import msg_collect from '../page/message/collect'
// import msg_follow from '../page/message/follow'

Vue.use(Router)
export default new Router({
  routes: [
  	{path: '/',redirect: '/index'},
  	{ path: '/index/:tab?/:keyword?', name:'index',component: index ,meta: { pageTitle: '首页',keepAlive: true}},
  	{ path: '/search/:tab', name:'search',component: search },
  	{ path: '/home', name:'home',component: home,meta: { pageTitle: '个人中心',keepAlive: false} },
	  { path: '/follow/:user_id?', name:'follow',component: follow },
    { path: '/recommend/:tab?', name:'recommend',component: recommend },
    { path: '/fans/:user_id?', name:'fans',component: fans },
    { path: '/user/:user_id', name:'user',component: user,meta: { pageTitle: '用户中心',keepAlive: false}},
    { path: '/tag/:tag_id', name:'tag',component: tag,meta: { pageTitle: '标签',keepAlive: false} },
    { path: '/edit/:id', name:'edit',component: edit },
    { path: '/detail/:id', name:'detail',component: detail,meta: { pageTitle: '详情',keepAlive: false} },
    { path: '/message', name:'message',component: message,meta: { pageTitle: '消息',keepAlive: false} },
    { path: '/msg_collect', name:'msg_collect',component: msg_collect },
    { path: '/msg_follow', name:'msg_follow',component: msg_follow },
    { path: '/msg_comment', name:'msg_comment',component: msg_comment }
  ],
  linkActiveClass: 'link-active'
})
