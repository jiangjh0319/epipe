<template>
    <div>
        <div class="input_box">
            <p class="title"><a v-if="info.req==1">*</a>{{info.title}}</p>
            <textarea v-model.trim="info.value" @input="textCount()" name="" maxlength="5000" id="" cols="30" rows="10" placeholder="请输入备注,限定1000字">

            </textarea>
            <div class="record_box">
                    <span>{{info.value.length}}/5000</span>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                textNum:0,
            }
        },
        created(){
        },
        props:['info'],
        methods: {
            textCount(){
                this.textNum = this.info.value.length;
            }
        },
        watch:{
        }
    }
</script>

<style lang="stylus" scoped>

 .input_box{
     padding 0 0.15rem 0.1rem;
    //  padding-top 0;
    border-bottom:0.01rem solid #ebebeb;
    background-color #fff;
 }

 textarea{
        width 100%;
        height 1.2rem;
        line-height 0.2rem;
        border none;
        resize none;
        outline none;
        color #666;
    //  padding 0.15rem;
        font-size 0.15rem;
        word-wrap: break-word;
        word-break: break-all;
    }

.title{
    line-height 0.44rem;
    font-size 0.15rem;
    color #333;
    font-weight:bold;

    a{
                color:#fd545c;
            }
}

.record_box{
    overflow hidden;
    // margin-bottom 0.08rem;
    font-size 0.12rem;


    span{
        float right;
        color: rgb(96, 158, 247);
    }
}

</style>