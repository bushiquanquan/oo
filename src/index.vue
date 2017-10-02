<template>
    <div class="page-wrap">
        <transition name="router-fade" mode="out-in">
            <router-view></router-view>
        </transition>
    </div>
</template>

<script>
    import { mapState, mapGetters} from 'vuex';
    export default {
        components: {
        },
        computed: {
            // 使用对象展开运算符将 getter 混入 computed 对象中
            ...mapGetters([
                'account'
            ]),
            // 当映射的计算属性的名称与state 的子节点名称相同时，我们也可以给 mapState 传一个字符串数组 ...mapState(['userInfo'])
            ...mapState({
                userInfo: state => state.userInfo
            })
        }
    };
</script>

<style lang="scss" scoped>
    .router-fade-enter-active, .router-fade-leave-active {
        transition: opacity 0.3s;
    }
    .router-fade-enter, .router-fade-leave-active {
        opacity: 0;
    }

    .page-wrap {
        height: 100%;
    }
</style>
