import Vue from 'vue'; 
import Vuex from 'vuex';
Vue.use(Vuex); 

const store = new Vuex.Store({ 
  state: { 
    count: 5,
    index : {
      position: [0,0,0,0]
    },
    home : {
      position : [0,0,0]
    },
    user : {
      position : [0,0]
    },
    tag : {
      position : [0,0]
    }
  },
  getters: {
    getState(state) {
      return state.count > 0 ? state.count : 0;
    }
  },
  mutations: { 
    setPosition: (state,data) => { 

       console.log( data )
       
      state[data.page].position[data.index] = data.position

     
    }
  } 
});

export default store