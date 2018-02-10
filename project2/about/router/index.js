import Vue from 'vue'
import Router from 'vue-router'

// views 页面
import AppIndex from '../views/app-index.vue'
import AppIssue from '../views/app-issue.vue'
import AppContact from '../views/app-contact.vue'
import AppProtocol from '../views/app-protocol.vue'
import AppHunter from '../views/app-hunter.vue'

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
				view: AppIndex
			}
		},
		{
			path: '/issue',
			name: 'issue',
			// component: AppAward
			components: {
				// 多个视图
				view: AppIssue
			}
		},
		{
			path: '/contact',
			name: 'contact',
			// component: AppAward
			components: {
				// 多个视图
				view: AppContact
			}
		},
		{
			path: '/protocol',
			name: 'protocol',
			// component: AppAward
			components: {
				// 多个视图
				view: AppProtocol
			}
		},
		{
			path: '/hunter',
			name: 'hunter',
			// component: AppAward
			components: {
				// 多个视图
				view: AppHunter
			}
		},
		{ path: '*', redirect: '/index' }
		
  	]
});

export default router;
