webpackJsonp([12],{c3Ac:function(t,e){},l7PD:function(t,e,a){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var o=a("//Fk"),n=a.n(o),m={name:"edit",components:{upload:a("hYS1").a},data:function(){return{modal:!1,browse_button:"",container:"",visible:!0,files:[],uptype:"image",form:{moments_id:0,moments_title:"",moments_content:"",moments_tag_id:[],moments_tag_name:[],moments_area_id:"",moments_area_name:"",moments_product_id:[],moments_image:[],moments_video:[],moments_draft:1}}},methods:{upOut:function(){if(window.history.length<=1)return this.$router.push({path:"/"}),!1;this.$router.go(-1)},loadData:function(){var t=this,e={moments_id:this.moments_id};return new n.a(function(a,o){t.$http.get(SYS.URL.moments.detail,{params:e}).then(function(e){var o=e.data;if(200===o.status){4===o.data.moments_type?t.uptype="video":t.uptype="image",t.files=o.data.media_rows,t.form.moments_id=o.data.moments_id,t.form.moments_title=o.data.moments_title,t.form.moments_content=o.data.moments_content,t.form.moments_area_id=o.data.moments_area_id,t.form.moments_area_name=o.data.moments_area_name,t.form.moments_product_id=o.data.moments_product_id?o.data.moments_product_id:[];var n=[],m=[];for(var s in o.data.moments_tag)n.push(o.data.moments_tag[s].tag_id),m.push(o.data.moments_tag[s].tag_name);t.form.moments_tag_id=n,t.form.moments_tag_name=m}t.$refs.upload.formVisible=!0,a(e)})})}},mounted:function(){this.visible=!0},created:function(){this.moments_id=this.$route.params.id,this.loadData()}},s={render:function(){var t=this.$createElement;return(this._self._c||t)("upload",{ref:"upload",attrs:{files:this.files,form:this.form,container:this.container,browse_button:this.browse_button,uptype:this.uptype},on:{upout:this.upOut}})},staticRenderFns:[]};var i=a("VU/8")(m,s,!1,function(t){a("c3Ac")},"data-v-1f19fc22",null);e.default=i.exports}});