<template>
    <div>
        <input v-model="msg">
        <p>prop: {{propMessage}}</p>
        <p>msg: {{msg}}</p>
        <p>helloMsg: {{helloMsg}}</p>
        <p>computed msg: {{computedMsg}}</p>
        <button @click="greet">Greet</button>
    </div>
</template>

<script>
    import Vue from 'vue';
    /** https://www.npmjs.com/package/vue-class-component
     * 1 methods，钩子都可以直接写作class的方法
     * 2 computed属性可以直接通过get来获得
     * 3 初始化data可以声明为class的属性
     * 4 其他的都可以放到Component装饰器里
     */
    import Component from 'vue-class-component'

    @Component({
        props: {
            propMessage: String
        }
    })
    export default class VueComp extends Vue {
        // initial data
        msg = 123

        // use prop values for initial data
        helloMsg = 'Hello, ' + this.propMessage

        // lifecycle hook
        mounted () {
            this.greet()
        }

        // computed
        get computedMsg () {
            return 'computed ' + this.msg
        }

        // method
        greet () {
            alert('greeting: ' + this.msg)
        }
    }
</script>

