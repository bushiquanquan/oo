/**
 * @file 处理多个组件共享状态 https://vuex.vuejs.org/zh-cn/intro.html
 * @author yuanhuihui  2017/9/30
 */
import Vue from 'vue';
import Vuex from 'vuex';
import actions from './actions';
import getters from './getters';
import mutations from './mutations';

Vue.use(Vuex);

// 定义共享的状态信息
const state = {
    userInfo: {}
};


export default new Vuex.Store({
    state,
    getters, // 使用时：this.$store.getters.account
    actions,
    mutations
});


