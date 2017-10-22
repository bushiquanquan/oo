<template>
    <div class="main">
        {{test}}
        <p>world</p>
        <img src="statics/favicon.ico">
    </div>
</template>
<style rel="stylesheet/css" lang="scss" scoped>
    .main{
        padding: 10px 20px;
        p {
            color: darkgreen;
        }
    }
</style>

<script>
    export default {
        data () {
            let a = '';
            console.log(a);
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

        }
    };
</script>
