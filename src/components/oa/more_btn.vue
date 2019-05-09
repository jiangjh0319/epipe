<template>
    <div  class="dialog" @touchmove.prevent @click="show">
        <div class="dialog_box" :style="{'height':(myself?'2rem':'1.2rem')}">
            <div class="dialog_option" @click="approveBack">退回</div>
            <div class="dialog_option" @click="deliverTo">转交</div>
            <div class="dialog_option" v-if="myself" @click="urge">催办</div>
            <div class="dialog_option" v-if="myself" @click="revocation">撤销</div>
            <div class="dialog_option" @click="print">打印</div>
        </div>
    </div>
</template>

<script>
    export default {
        methods:{
            approveBack(){ //退回
                this.$emit('approveBack')
            },
            deliverTo(){ //转交
                this.$emit('deliverTo')
            },
            show(){
                this.$emit('isShow')
            },
            revocation(){
                this.$emit('revocation')
            },
            urge(){
                this.$emit('urge')
            },
            print(){
                this.$emit('print')
            }
        },
        props:['myself']
    }
</script>

<style scoped lang="stylus">

     .dialog{
            position fixed;
            width 100%;
            height 100%;
            top 0;
            z-index 5;
            font-size 0.18rem;
            background-color rgba(0,0,0,0.5)

            .dialog_box{
                width 2.7rem;
                position absolute;
                left 0;
                right 0;
                top 0;
                bottom 0;
                margin auto;
                background #fff;
                text-align center;
                border-radius 4px;
            }

             .dialog_option{
                height 0.4rem;
                line-height 0.4rem;
                position relative;
                font-size:0.16rem;
                border-bottom 0.01rem solid #f5f5f5

                &:last-child{
                    border none
                }

            }

        }

</style>