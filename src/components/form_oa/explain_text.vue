<template>
    <div>
        <div class="content">
            <p v-if="info.link==''">{{info.textnote}}</p>
            <a :href="info.link" v-else>{{info.textnote}}</a>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {

            }
        },
        props:['info']
    }
</script>

<style lang="stylus" scoped>

    .content{
        margin 0.1rem 0;
    }

    p{
        color #999;
    }

    a{
        color #ff8800
    }
</style>