import Vue from 'vue'
import Router from 'vue-router'

// views 页面
import AppLevel from '../views/app-level.vue'

Vue.use(Router)

var router = new Router({
	routes: [
		{ 
			path: '/',
			redirect: to => {
				/*let hash = location.hash;
				if(hash.indexOf('award') > 0){
					return '/award'
				}else{
					return '/index'
				}*/
				return '/index'
			}
		},
		{
			path: '/index',
			name: 'index',
			// component: AppIndex
			components: {
				// 多个视图
				view: AppLevel
			}
		},
		{ path: '*', redirect: '/index' }
		
  	]
});

export default router;
