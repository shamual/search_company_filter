import Vue from 'vue'
import App from './App'
import search from './components/Search'
import axios from 'axios'
import VueAxios from 'vue-axios'
import qs from 'qs'
 
Vue.use(VueAxios, axios);
Vue.use(qs);

Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  render: h => h(App)
})
