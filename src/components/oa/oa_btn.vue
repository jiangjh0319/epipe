
<template>
    <div>
        <div class="btn_box" v-if="dataObj.myselfApply!='00'">
            <div class="btn_box_content" v-if="dataObj.myselfApply=='ziji'&dataObj.auditStatus!=3&dataObj.auditStatus!=2&dataObj.auditStatus!=1&dataObj.auditStatus!=4">
                    <a  class="deliver_btn" @click="urge">催办</a> 
                    <a  class="consent_btn"   @click="print">打印</a>
                    <a  class="refuse_btn"  @click="revocation">撤销</a>
            </div>
            <div  @click="resubmit" v-else-if="dataObj.myselfApply=='ziji'&(dataObj.auditStatus==3||dataObj.auditStatus==4)" class="revocation_btn re_btn" >再次提交</div>

            <div class="btn_box_content" v-else-if="dataObj.myselfApply=='0'&&dataObj.auditStatus!=3">
                    <a  class="consent_btn" @click="consent">同意</a> 
                    <a  class="refuse_btn"  @click="refuse">拒绝</a>
                    <a  class="deliver_btn" @click="more">更多</a>
                <div style="clear:both"></div>
            </div>

            <div class="revocation_btn re_btn" @click="print" v-else>打印</div>
        </div>
        <!-- <div v-else class="btn_box_content" >
            <a>打印</a>
        </div> -->
    </div>
</template>

<script>
    export default {
        data() {
            return {
            }
        },
         methods:{
            consent:function(){ //同意
                this.$emit('consent')
            },
            refuse:function(){ //拒绝
                this.$emit('refuse')
            },
            more:function(){ //更多
                this.$emit('more')
            },
            revocation(){ //撤销
                this.$emit('revocation')
            },
            urge(){ //催办
                this.$emit('urge')
            },
            resubmit(){ //重新提交
                this.$emit('resubmit')
            },
            print(){
                this.$emit('print')
            }
        },
        props:['dataObj','leaveType']
        
    }
</script>

<style scoped lang="stylus">

        .btn_box{
            position fixed;
            width:100%;
            bottom 0px;
            box-sizing border-box;

            .btn_box_content{
                background-color #fff;
                text-align center;
                display:flex;
            }

            .more_btn{
                display:flex;
            }

            .revocation_btn:after{
                display block;
                content '';
                position absolute;
                height 1px;
                width 200%;
                top 0;
                left -50%;
                transform scale(0.5);
                background-color #ccc;
                z-index 5
            }
            
            .revocation_btn{
                position relative;
                width:100%;
                text-align:center;
                height 0.5rem;
                font-size 0.18rem;
                color #666;
                line-height 0.5rem;
                letter-spacing 0.05rem;
                background-color #fff;
            }

            .consent_btn,.refuse_btn,.deliver_btn{
                flex 1;
                height 0.5rem;
                color #fff; 
                line-height 0.5rem;
                font-size 0.18rem;
                text-align center
            }

            .consent_btn{
                background-color: #0fc37c;
                border:1px solid #0fc37c;
            }

            .refuse_btn,.deliver_btn{
                position relative;
                color:#fff;
                margin-right 0
                border 1px solid #fd545c;
                background-color:#fd545c;
            }

            .deliver_btn{
                background-color:#609ef7;
                border:1px solid #609ef7;
            }

        }

</style>