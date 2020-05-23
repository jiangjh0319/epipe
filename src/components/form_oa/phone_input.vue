<template>
    <div class="main">
        <div class="input_div">
            <span><a v-if="info.req==1">*</a>{{info.title}}</span>
            <input type="tel" v-model="info.value" @input="getVal"  :placeholder="info.tip">
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
            }
        },
        props:['value','info'],
        methods:{
            getVal(){
                 this.$emit('input',this.value);
            }
        }
    }
</script>

<style lang="stylus" scoped>

.input_div{
    display flex;
    height 0.44rem;
    line-height 0.44rem;
    background-color #fff
    padding 0 0.15rem;
    border-radius 0.02rem;
    border-bottom:0.01rem solid #ebebeb;

    span{
        font-size 0.15rem;
        color #666;
        font-weight:bold;

        a{
                color:#fd545c;
            }
    }

    input{
        flex 1;
        outline none;
        text-align:right;
        text-indent 0.15rem;
        font-size 0.15rem;
        color #666;
    }

    input::-webkit-input-placeholder{
        color:999;
        font-size:0.15rem;

    }
}
    
</style>