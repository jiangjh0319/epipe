<template>
    <div>
        <div class="choose_box" >
            <span class="title"><a v-if="info.req==1">*</a>{{info.title}}</span>
            <p @click="openPopup(1)">
                <span class="nullValue">{{info.value?info.value:'请选择'}}</span>
                <svg class="icon icon-back" aria-hidden="false">
                        <use xlink:href="#icon-right"></use>
                </svg>
            </p>
        </div>
        <div class="choose_box" >
            <span class="title">{{info.secondTitle}}</span>
            <p @click="openPopup(2)">
                <span class="nullValue">{{info.endVal?info.endVal:'请选择'}}</span>
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
        props:["info",'indexs'],
        methods:{
            openPopup(type){
                this.info.selectType = type
                this.$emit('openPopup')
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
        display: flex;
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
            line-height 0.44rem;
            flex:1;
            text-align right 
        }

        .nullValue{
            color:#666;
            font-size 0.14rem;
        }
    }
</style>