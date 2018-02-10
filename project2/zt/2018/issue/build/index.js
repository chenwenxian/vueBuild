import 'es6-promise/auto';
import Vue from 'vue';
import App from '../pages/index.vue';
import apm from 'apm_v2';
Vue.config.productionTip = false;
Vue.use(apm);
window.winVue = new Vue({el: '#root', template: '<App/>',components: { App } });
