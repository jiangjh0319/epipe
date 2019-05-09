<template>
        <div class="dialog"  @touchmove.prevent>
            <div class="dialog_box">
                <div class="dialog_content" v-html="content"></div>
                <div class="dialog_btn">
                    <a class="confirm_btn" @click="lfClick">{{lfText}}</a>
                    <a class="cancel_btn" @click="rgClick">{{rgText}}</a>
                </div>
            </div>
        </div>
</template>

<script>
    export default {
        data() {
            return {

            }
        },
        methods:{
            lfClick(){
                this.$emit('lfClick')
            },
            rgClick(){
                this.$emit('rgClick')
            }
        },
        props:['lfText','rgText','isShow','content']
        
    }
</script>

<style scoped lang="stylus">

.dialog {
    position: fixed;
    width: 100%;
    height: 100%;
    top: 0;
    z-index: 5;
    font-size: 0.16rem;
    background-color: rgba(0, 0, 0, 0.5);

    .dialog_box {
        width: 2.7rem;
        height: 1.5rem;
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        margin: auto;
        background: #fff;
        text-align: center;
        border-radius 0.06rem;
    }

    .dialog_content {
        height: 1rem;
        line-height: 1rem;
        color: #333;
        border-bottom: 0.01rem solid #e6e6e6;
    }

    .dialog_btn {
        height: 0.5rem;
        line-height: 0.5rem;
        display: flex;

        a {
            flex: 1;
            touch-action: none;
            cursor: pointer;
        }
    }

    .confirm_btn {
        color: #0fc37c;
        border-right 0.01rem solid #e6e6e6;
    }

    .cancel_btn {
        ciolor: #666;
    }
}

</style>