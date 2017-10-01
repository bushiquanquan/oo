/**
 * @file https://vuex.vuejs.org/zh-cn/actions.html  Action 类似于 mutation，不同在于：

 Action 提交的是 mutation，而不是直接变更状态。
 Action 可以包含任意异步操作。
 * @author yuanhuihui  2017/9/30
 */
import {INIT_STATE} from './mutation-types';

export default {
    async initState ({ commit }) {
        let userInfo = {id: '22222'};
        commit(INIT_STATE, {userInfo});
    }
};
/**
 * 分发Action 通过 this.$store.dispatch('initState') 方法触发，
 *一个 store.dispatch 在不同模块中可以触发多个 action 函数。在这种情况下，只有当所有触发函数完成后，返回的 Promise 才会执行。
 *
 * */