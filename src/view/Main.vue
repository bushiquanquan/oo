<template>
    <div class="main">
        {{test}}
    </div>
</template>
<style rel="stylesheet/css" scoped>
    .main{
        padding: 10px 20px;
    }
</style>

<script>
    export default {
        data () {
            return {
                test: 'hello world1264'
            }
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

        }
    }
</script>
