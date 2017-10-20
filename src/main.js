import Vue from 'vue'
import App from './App'
import search from './components/Search'
import axios from 'axios'
import VueAxios from 'vue-axios'
import qs from 'qs'
import VeeValidate from 'vee-validate'
// import 'font-awesome/css/font-awesome.css'

Vue.use(VeeValidate); 
Vue.use(VueAxios, axios);
Vue.use(qs);


Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  render: h => h(App)
})
