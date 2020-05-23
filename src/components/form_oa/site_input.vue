<template>
    <div>
        <div class="choose_box">
            <span class="title"><a v-if="info.req==1">*</a>{{info.title}}</span>
            <p @click="go_select">
                <span class="nullValue">{{info.value?info.value:'请选择'}}</span>
                <svg class="icon icon-back" aria-hidden="false">
                        <use xlink:href="#icon-right"></use>
                </svg>
            </p>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {

            }
        },
        props:["info"],
        methods:{
            go_select(){
                this.$emit('go_map')
            }
        }
    }
</script>

<style lang="stylus" scoped>
    .choose_box{
        height 0.44rem;
        line-height 0.44rem;
        background-color #fff;
        padding 0 0.15rem;
        border-bottom:0.01rem solid #ebebeb;


        .title{
            font-size 0.15rem;
            color #666;
            font-weight:bold;

            a{
                color:#fd545c;
            }
        }

        p{
            float:right;
            line-height 0.44rem;
        }

        .nullValue{
            color:#666;
            font-size 0.14rem;
        }
    }
</style>