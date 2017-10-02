<template>
    <div>
        <canvas id="myCanvas" style="position: absolute; z-index: 2; left: 0px; top: 0px; width: 1440px; height: 150px;" resize="true" width="2880" height="300"></canvas>
    </div>
</template>
<style rel="stylesheet/css" lang="scss" scoped>
    .main{
        padding: 10px 20px;
    }
</style>

<script>
    // import all from '@/libs';
    export default {
        data () {
            return {
                test: 'hello'
            };
        },
        beforeRouteEnter (to, from, next) {
            if (to.meta.canEnter) {
                next();
            } else {
                next({path: '/unauthorized'});
            }
        },
        methods: {
        },
        mounted () {
            window.init('myCanvas', window.Piece, window.Config);
        }
    };
</script>
