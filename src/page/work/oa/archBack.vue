<template>
   <div>
    <van-nav-bar
    title="归还"
    left-arrow
    @click-left="onClickLeft"
    />
    <div>
        <van-field
        v-model="valDate"
        label="实际归还日期"
        placeholder="请选择日期"
        right-icon="arrow-down"
        input-align="right"
        @click="handlerShowPicker"
            />
    </div>
    <div>
        <div style="margin:0.15rem"><p>借阅档案资料明细（1）</p></div>
        <div class="bor_bottom">
            <van-field v-model="objList.archNum" clearable input-align="right" label="档案编号" placeholder="请输入档案编号" />
        </div>   
        <div class="bor_bottom">
            <van-field v-model="objList.archName" clearable input-align="right" label="档案名称" placeholder="请输入档案名称" />
        </div>  
        <div style="margin-top:0.2rem">        
            <div class="bor_bottom">
                <van-field v-model="objList.original" clearable input-align="right" label="原存放位置" placeholder="请输入原存放位置" />
            </div>   
            <div class="bor_bottom">
                <van-field v-model="objList.archAdmin" clearable input-align="right" label="档案管理员" placeholder="请输入档案管理员" />
            </div>   
            <div class="bor_bottom">
                <van-field v-model="objList.arcPlace" clearable input-align="right" label="归还存放位置" placeholder="请输入归还后存放位置" />
            </div>   
        </div> 
    </div>
    <div class="styles" style="padding:0 0.15rem;">
        <p class="title">归还说明</p>
        <textarea v-model.trim="backInstructions" name="" maxlength="1000" id="" cols="30" rows="10" placeholder="请输入备注,限定1000字">

        </textarea>
        <div class="record_box">
                <span>{{textNum}}/1000</span>
        </div>
    </div>
    <div class="btn">确定</div>
    <van-popup v-model="showPickerTime"  position="bottom">
        <van-datetime-picker
        v-model="currentDate"
        type="date"
        title="选择年月日"
        :min-date="minDate"
        :max-date="maxDate"
        @confirm="onConfirmTime"
        />
    </van-popup> 
   </div>
</template>

<script>

export default {
    data(){
        return {
            showPickerTime:false,
            minDate: new Date(1690, 0, 1),
            currentDate: new Date(),
            objList:{},
            backInstructions:'',
            textNum : 0,
        }
    },
    watch: {
             backInstructions : function(){
                if(this.backInstructions.length>1000){
                    this.$toast("最多输入1000字~")
                    this.backInstructions = this.backInstructions.slice(0,1000)
                    return
                }
                this.textNum = this.backInstructions.length
            }
        },
    methods:{
        onClickLeft(){

        },
        handlerShowPicker(){
            this.showPickerTime = true;
        },
        format(date, index){
        date = new Date(date);
        return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
        },
        onConfirmTime(value){
            this.valDate =this.format(value);
            this.showPickerTime = false;
        },
    }
 
}
</script>

<style scoped lang="stylus">
.van-nav-bar {
    background-color: #609EF7;
  /deep/ .van-nav-bar__title {
    color: #fff;
    }
/deep/ .van-icon{
    color: #fff;
}   
}

.bor_bottom{
        position:relative;
    }
    .bor_bottom:after{
        position:absolute;
        content:'';
        display:block;
        bottom : 0;
        left:0;
        height:0.01rem;
        width:100%;
        background-color:#f5f5f5;
    }
    .styles{
            margin-top: 0.15rem;
            margin-bottom 0.15rem;
             background-color #fff;
             overflow hidden

             input{
                 box-sizing border-box
                 float right;
                 width 2.1rem;
                 height 0.44rem;
                 border none;
                 outline none;
                 font-size:0.14rem;
                 text-align right;
                 padding-right 0.15rem;
                 color:#666;
             }
             input::-webkit-input-placeholder{
                 font-size:0.13rem;
                 color:#666;
             }

             a{
                 color:#fd545c;
             }

             textarea{
                 width 100%;
                 height 1.2rem;
                 line-height 0.2rem;
                border none;
                resize none;
                outline none;
                color #666;
                font-size 0.15rem;
                word-wrap: break-word;
                word-break: break-all
             }

             .title{
                 line-height 0.44rem;
                 font-size 0.15rem;
                 color #333;
                 font-weight:bold;
             }
        }   
    .record_box{
        overflow hidden;
        margin-bottom 0.08rem;
        font-size 0.12rem;


        span{
            float right;
            color: rgb(96, 158, 247);
        }
    } 

    .btn{
        width 80%;
        height 0.44rem;
        background-color #609EF7;
        border-radius:4px;
        margin 0.2rem auto;
        text-align center;
        line-height 0.44rem;
        color #fff;
        font-size 0.16rem;
    }
</style>
