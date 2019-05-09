<template>
    <div>
        <div class="styles approve">
                <p class="title">审批人<span v-if="dataObj.auditStatus != '3'&&dataObj.auditStatus!= '2'">（已添加{{amount+newAppr.length}}人）</span></p>
                <ul class="list">
                    <li>
                        <div class="approve_list">
                            <img class="imgHead" :src="dataObj.profileImg">
                            <div class="approve_inf">
                                <span>{{dataObj.username}}</span>
                                <span>发起申请</span>
                                <span>{{dataObj.applyTime | timeStrSlice}}</span>
                            </div>
                        </div>
                        <svg class="icon icon-back" aria-hidden="false" v-if="index!=2">
                            <use xlink:href="#icon-jiantou1"></use>
                        </svg>
                    </li>
                    <li v-if="dataObj.auditStatus == '3'">
                        <div class="approve_list">
                            <img class="imgHead" :src="dataObj.profileImg">
                            <div class="approve_inf">
                                <span>{{dataObj.username}}</span>
                                <span style="color:#f80">已撤销</span>
                                <span></span>
                            </div>
                        </div>

                    </li>
                    <li v-for="(item,index) in dataObj.auditers" :key="index" v-if="item.status!='00'">
                        <div class="approve_list" >
                            <img class="imgHead" :src="item.profileImg">
                            <div class="approve_inf">
                                <span>{{item.name}}</span>
                                <span  :class="item.status | statusClass">{{item.status | stateName}}</span>
                                <span>{{item.auditTime | timeStrSlice}}</span>
                            </div>
                        </div>
                        <div class="reasons" v-if="item.status!='0'||newAppr.length!='0'">
                            <svg class="icon icon-back" aria-hidden="false" v-if="(item.status!='0'||newAppr.length!='0')&&((item.status!=2||item.status!=1)&&index!=dataObj.auditers.length-1)">
                                <use xlink:href="#icon-jiantou1"></use>
                             </svg>
                            <p>{{item.reason}}</p>
                            <div v-if="item.accessory">
                                <ul class="accessory">
                                    <li  v-for="child in item.accessory" :key="child.url">
                                        <img @click="go_fildDetails(child.url,child.fileName)"  v-if="child.isImg"  :src="child.url"/>
                                        <img @click="go_fildDetails(child.url,child.fileName)" v-if="!child.isImg" src="../../assets/wenjian.png"/>
                                        <div @click="go_fildDetails(child.url,child.fileName)"  class="accessory-cont">
                                            <p style="margin-bottom:0">{{child.fileName}}</p>
                                            <span>{{child.fileSize | fileSize}}</span>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        
                        <!-- <div class="reasons" v-if="(item.status!='0'||newAppr.length)&&item.status!=3">
                            <svg class="icon icon-back" aria-hidden="false" v-if="newAppr.length!=0&&(item.status!=2||item.status!=1)">
                                <use xlink:href="#icon-jiantou1"></use>
                            </svg>
                            <div class="reason" v-if="item.status==2||item.status==1">
                                {{item.reason}}
                            </div>
                        </div> -->

                        <!-- <div class="reasons ss">
                            <svg  class="icon icon-back" aria-hidden="false" >
                                <use xlink:href="#icon-jiantou1"></use>
                             </svg>
                            <p>{{item.reason}}</p>
                            <div v-if="item.accessory">
                                <ul class="accessory">
                                    <li  v-for="child in item.accessory" :key="child.url">
                                        <img @click="go_fildDetails(child.url,child.fileName)"  v-if="child.isImg"  :src="child.url"/>
                                        <img @click="go_fildDetails(child.url,child.fileName)" v-if="!child.isImg" src="../../assets/wenjian.png"/>
                                        <div @click="go_fildDetails(child.url,child.fileName)"  class="accessory-cont">
                                            <p style="margin-bottom:0">{{child.fileName}}</p>
                                            <span>{{child.fileSize | fileSize}}</span>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </div> -->
                    </li>

                     <li v-for="(it,ind) in newAppr" :key="ind" v-if="dataObj.auditStatus!=3">
                        <div class="approve_list newList">
                            <svg @click="removeAppr(ind)" style="font-size: 0.15rem" class="icon" aria-hidden="false" v-if="dataObj.myselfApply=='0'">
                                <use xlink:href="#icon-shanchu"></use>
                            </svg>
                            <img class="imgHead" :src="it.profileImg">
                            <div class="approve_inf">
                                <span>{{it.name}}</span>
                                <span></span>
                                <span></span>
                            </div>
                        </div>
                        <svg class="icon icon-back" aria-hidden="false" v-if="ind!=newAppr.length-1">
                            <use xlink:href="#icon-jiantou1"></use>
                        </svg>
                    </li>

                     <li style="margin-top:0.1rem;"  class="list_item" @click="go_imchoice(1)" v-if="dataObj.myselfApply==0&&dataObj.auditStatus!=3">
                        <svg style="font-size: 0.33rem;margin-top: 0.085rem" class="icon" aria-hidden="false">
                            <use xlink:href="#icon-tianjiarenyuan"></use>
                        </svg>
                    </li>
                    
                </ul>
            </div>

            <div class="dialog" v-show="show"  @touchmove.prevent>
                <div class="dialog_box">
                    <div class="dialog_content" v-html="dialogText"></div>
                    <div class="dialog_btn">
                        <a class="confirm_btn" @click="affirm">确认</a>
                        <a class="cancel_btn" @click="cancel">取消</a>
                    </div>
                </div>
            </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                dialogText:'确认删除该审批人?</br>删除后,流程自动顺延至下一位审批人',
                show:false,
                indexs:-1,
            }
        },
        created() {

        },
        methods:{

            go_imchoice:function(num){
                this.$router.push({path: 'imchoices', query: {bgcolor:this.color,num:num,isOrder:true}})
            },
             removeAppr:function(index){
                 this.indexs = index;
                 if(this.newAppr.length==1){
                    this.dialogText='确认删除该审批人?</br>删除后,您将为该审批流程的最终审批人。'
                 }else{
                    this.dialogText='确认删除该审批人?</br>删除后,流程自动顺延至下一位审批人。'
                 }
                 this.show = true;
            },
             go_fildDetails: function (url,name) { //查看图片详情
                let that = this;
                let obj = {index_num: 0, data:[url],type:0,name}
                window.location.href = "epipe://?&mark=imgdetail&url=" + JSON.stringify(obj);
            },
            affirm(){
                 this.$emit('removeApp',this.indexs)
                 this.show = false;
            },
            cancel(){
                this.show = false;
            }
        },
         filters:{
            timeStrSlice:function(value){
                return value?value.slice(0,-3):value;
            },
            details:function(value){
                if(value == '1'){
                    return '已同意'
                }else if(value =='0'){
                    return '已拒绝'
                }else if(value=='2'){
                    return '已撤销'
                }else if(value =='5'){
                    return '已退回'
                }
            },
            statusClass:function(value){
                 switch (value){
                    case '0':
                        return "consent";
                        break;
                    case '1':
                        return "consent";
                        break;
                    case '2':
                        return "refause";
                        break;
                    case '3':
                        return "careOf";
                        break;
                    case '4':
                        return "careOf";
                        break;
                    }
            },
            stateName: function(value){
                    switch (value){
                    case '0':
                        return "审批中";
                        break;
                    case '1':
                        return "已同意";
                        break;
                    case '2':
                        return "已拒绝";
                        break;
                    case '3':
                        return "已转交";
                        break;
                    case '4':
                        return "已退回";
                        break;
                    }
            },
            fileSize:function(value){
                value = value-0
                if(value<5500){
                    value = value/1024
                    return value.toFixed(2)+'KB';
                }
                value = value/1024/1024
                return value.toFixed(2)+'MB';
            }
        },
        props:['dataObj','refuseIndex','newAppr','color','amount']
    }
</script>

<style scoped lang="stylus">

    .newList{

        position relative;

        svg{
            position absolute;
            left 0.32rem;
            top -0.05rem;
        }
    }

    .imgHead{
        width 0.37rem;
        height 0.37rem;
        border-radius 50%; 
    }

    .styles{
        padding 0.15rem;
        margin-bottom 0.15rem;
        -webkit-box-shadow: 0 0 0.2rem rgba(96,157,246,.1);    
        box-shadow 0 0 0.2rem rgba(96,157,264,.1);
        background-color #fff;
    }

     .approve{

            .approve_list{
                display flex;
            
                img{
                    margin-right 0.1rem;
                }
            }

            .approve_inf{
                flex 1;
                line-height 0.37rem;
                font-size 0.14rem;

                span:first-child{
                    float left;
                    font-size 0.15rem;
                    color #333;
                    width:0.7rem;
                    overflow: hidden;
                    text-overflow:ellipsis;
                    white-space: nowrap;
                }

                span:last-child{
                    float right;
                    color #666;
                    width:1.25rem;
                    height:100%;
                }

                .refause{
                    color:#fd545c;
                }

                .consent{
                    color:#0fc37c;
                }

                .careOf{
                    color:#f80;
                }
            }

            .icon-back{
                transform rotate(90deg)
                margin 0.1rem;
            }

            p{
                margin-bottom 0.15rem;
            }

            .reason{
                font-szie 0.14rem;
                color #666;
                line-height 0.2rem;
                margin 0.1rem 0;
                word-wrap:break-word;
            }
            
            .reasons{
                position relative;
                padding-left 0.48rem;
                font-szie 0.14rem;
                color #666;
                min-height:0.2rem;
                line-height 0.2rem;
                margin 0.1rem 0;
                word-wrap:break-word;

                svg{
                    position:absolute;
                    top:0;
                    left:0.1rem;
                    bottom:0;
                    margin:auto !important;

                }
            }
        }

        .approve{

            .title{
                font-size 0.15rem;
                corlor #333;

                span{
                    font-size 0.13rem;
                    color #999;
                }
            }
        }

.dialog {
    position: fixed;
    width: 100%;
    height: 100%;
    top: 0;
    left:0;
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
        text-align left;
        height: 1rem;
        color: #333;
        padding:0.2rem;
        padding-top:0.156
        box-sizing:border-box;
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

.accessory {
    li {
        display: flex;
        margin-bottom: 0.1rem;
    }

    img {
        width: 0.34rem;
        height: 0.34rem;
        margin-right: 0.1rem;
    }

}
</style>