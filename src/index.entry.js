import Vue from 'vue'
import store from './store'
import router from './router';

function lanchVue () {
    new Vue({
        router,
        store  // 把 store 对象提供给 “store” 选项，这可以把 store 的实例注入所有的子组件
    }).$mount('#app');
}

lanchVue();
