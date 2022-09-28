import { nextTick } from 'vue';
import { createRouter, createWebHashHistory } from 'vue-router'
import store from '../store'


const routes = [
    {
        path: '/login',
        name: 'login',
        component: () => import(/* webpackChunkName: "Login" */ '@/views/Login.vue'),
    }
    ,{
        path: '/index',
        name: 'index',
       component: () => import(/* webpackChunkName: "Index" */ '@/views/Index.vue'),
    }
  ]

 const router = createRouter({
    history: createWebHashHistory(),
    routes
})

router.beforeEach((to,from)=>{
    if(to.path === '/login'){
        return true;
    }
    console.log(store);
    console.log(store.getters);
    let getToken = store.getters['getToken'];
    console.log("getToken=",getToken);
    if(getToken){
        return true;
    }
    router.push('/login');
    return false;
});


export default router;
