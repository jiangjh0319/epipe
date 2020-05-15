<template>
    <div class="main">
        <div>
            <p class="title">审批流程</p>
        </div>
        <div>
            <div class="flow_list">
                <div class="flow_list_item">
                     <div >
                        <div class="user_info">
                            <img :src="datas.profileImg" class="head_img"/>
                            <div class="user_info_d">
                                <span>{{datas.username}}</span>
                                <span>发起申请</span>
                                <span>{{datas.applyTime | timeStrSlice}}</span>
                            </div>
                        </div>
                        <div class="user_info_rest arrows" style="height:0.3rem;"></div>

                    </div>
                </div>
                 <div class="flow_list_item" v-if="datas.auditStatus=='3'" style="margin-top:0.1rem">
                     <div >
                        <div class="user_info">
                            <img :src="datas.profileImg" class="head_img"/>
                            <div class="user_info_d">
                                <span>{{datas.username}}</span>
                                <span class="careOf">已撤销</span>
                                <span></span>
                            </div>
                        </div>

                    </div>
                    
                </div>
                <div v-for="(item,index) in datas.links" :key="index" class="flow_item" v-if="index<=endIndex&&datas.auditStatus!='3'">
                    <div v-if="item.flow" >
                        <div class="user_info">
                            <img :src="item.profileImg" class="head_img"/>
                            <div class="user_info_d">
                                <span>{{item.name}}</span>
                                <span :class="item.status | statusClass">{{item.status | stateName}}</span>
                                <span>{{item.auditTime | timeStrSlice}}</span>
                            </div>
                        </div>
                        <div class="user_info_rest arrows">
                            <p>{{item.reason}}</p>
                            <div v-if="item.accessory">
                                <ul class="accessory">
                                    <li  v-for="child in item.accessory" :key="child.url">
                                        <img @click="go_fildDetails(child)"  v-if="child.isImg"  :src="child.url"/>
                                        <img @click="go_fildDetails(child)" v-if="!child.isImg" src="../../assets/wenjian.png"/>
                                        <div @click="go_fildDetails(child)"  class="accessory-cont">
                                            <p style="margin-bottom:0">{{child.fileName}}</p>
                                            <span>{{child.fileSize | fileSize}}</span>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div v-else-if="item.auditers.length"  class="flow_list_item" >
                        <div class="user_info">
                            <img src="../../assets/group.png" class="head_img"/>
                            <div class="approve_state">
                                <p>审批人 <span v-if="item.status=='0'">审批中</span></p>
                                <span class="approver_type">{{item |info}}</span>
                            </div>
                        </div>
                        <div class="approvers_list arrows">
                            <div v-for="(child,num) in item.auditers" :key="num" class="approvers_list_item">
                                <img class="user_img" :src="child.profileImg"/>
                                <span class="omit">{{child.name}}</span>
                            </div>
                        </div>
                    </div>

                    <div v-else>
                         <div class="user_info">
                            <img src="../../assets/head.png" class="head_img"/>
                            <div>
                                <p style="font-size:0.15rem;">{{item.approvalUserType==1?item.quartersName:'主管'}}</p>
                                <span style="color:#999;font-size:0.12rem;">{{item.approvalUserScope==2?'未找到审批人自动通过':'未找到审批人转交管理员'}}</span>
                            </div>
                        </div>
                        <div class="approvers_list arrows"></div>
                    </div>
                </div>


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
        props:['datas','endIndex'],
        created(){

        },
        mounted(){

        },
        methods:{
            go_fildDetails: function (item) { //查看图片详情
                let obj = {index_num: 0, data:[item.url],type:0,name:item.fileName,size:item.fileSize}
                window.location.href = "epipe://?&mark=imgdetail&url=" + JSON.stringify(obj);
            },

        },
         filters:{
            timeStrSlice:function(value){
                return value?value.slice(0,-3):value;
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
                    case '5':
                        return "已评论";
                        break;
                    }
            },
            info(item){
                if(item.auditers.length<2){
                    return item.auditers.length+'人审批'
                }
                if(item.linkType==2){
                    return item.auditers.length+'人依次审批'
                }else if(item.linkType==4){
                    return item.auditers.length+'人或签'
                }else if(item.linkType==3){
                    return item.auditers.length+'人会签'
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
                    case '5':
                        return "consent";
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
        }
    }
</script>

<style lang="stylus" scoped>
.main{
    background-color #fff;
    padding 0.15rem;
    margin-bottom 0.15rem;

    .title{
        color #333;
        font-size 0.16rem;
        font-weigth 600;
        margin-bottom:0.1rem
    }
}


.approvers_list{
    position relative
    display flex;
    padding-left 0.4rem;
    flex-wrap wrap;
    margin-top:0.1rem;

    &_item{
        width 0.5rem;
        text-align center;
        font-size 0.12rem;
        color:#999;
        margin-right:0.05rem;
        margin-bottom:0.1rem;
    }
}

.flow_item:last-child .arrows{
        min-height:0;

        &:after,&:before{
            display none;
        }
    }


.user_info{
    display flex;

    .head_img{
        width:0.37rem;
        height:0.37rem;
        border-radius:50%;
        margin-right 0.1rem;
    }

    &_rest{
        color:#666;
        margin-top:0.1rem;
        padding-left 0.45rem;

        >p{
            font-size 0.14rem;
            margin-bottom 0.1rem;
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
    }


    &_d{
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
    }

    .approve_state{

        >p{
            font-size 0.15rem;

            span{
                color #f80;
            }
        }

        span{
            font-size 0.12rem;
        }

        .approver_type{
            color:#999;
        }
    }
}

.arrows{
    position relative;
    min-height:0.2rem;


        &:after{
            position absolute
            content ''
            top:0;
            left 0.15rem;
            height 100%;
            width:0.02rem;
            background-color #02D6B2
        }

        &:before{
                position: absolute;
                content: '';
                width: 0.06rem;
                height: 0.06rem;
                border: 0.02rem solid #02d6b2;
                border-top: none;
                border-left: none;
                bottom: -0.01rem;
                left: 0.12rem;
                transform: rotate(45deg);
        }
    }


.user_img{
    display block;
    width:0.24rem;
    height:0.24rem;
    border-radius:50%;
    margin 0 auto;
}

.flow_item{
    margin-top:0.1rem;
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

.omit{
    display block;
        width 0.46rem;
        overflow: hidden;
        text-overflow:ellipsis;
        white-space: nowrap;
}
</style>