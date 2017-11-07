import Vue from 'vue';
import Router from 'vue-router';
import routerBeforeCallback from './router-hook/router-before-hook';
import routerAfterHook from './router-hook/router-after-hook';
import store from '../store';

// views
import Index from '../index.vue';
import Main from '../view/Main.vue';
import Sick from '../view/sick/sick.vue';
import VueComp from '../view/vue-class/vuComp.vue';

Vue.use(Router);

let router = new Router({
    routes: [
        {
            path: '/room',
            component: Index,
            redirect: '/room',
            children: [
                {
                    path: '/',
                    name: 'vv-main',
                    component: Main,
                    meta: {
                        canEnter: true
                    }
                }
            ]
        },
        {
            path: '/sick',
            component: Index,
            children: [
                {
                    path: '/',
                    name: 'sick',
                    component: Sick,
                    meta: {
                        canEnter: true
                    }
                }
            ]
        },
        {
            path: '/demo',
            component: Index,
            children: [
                {
                    path: '/',
                    name: 'vueComp',
                    component: VueComp,
                    meta: {
                        canEnter: true
                    }
                }
            ]
        }
    ]
});

let routerBeforeHook = routerBeforeCallback(store);
router.afterEach(routerAfterHook);
router.beforeEach(routerBeforeHook);

export default router;
