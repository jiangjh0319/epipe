<template>
    <div>
        <div class="styles input_group " ref="templates">
                <div class="control" v-if="length>1">
                    <span>异常信息({{index+1}})</span>
                    <span style="color:#fd545c" @click.stop="remove">删除</span>
                </div>
                <div class="items bor_bottom" @click="getTime()" >
                    日期
                    <p style="text-align:right">
                        <span class="nullValue omit">{{datas.absenceDate}}</span>
                        <svg class="icon icon-back" aria-hidden="false">
                            <use xlink:href="#icon-right"></use>
                        </svg>
                    </p>
                </div>
                <div class="items items-details bor_bottom"  >
                    原因
                    <textarea placeholder="请输入异常原因" v-model="datas.absenceReason"></textarea>
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
        props: ["datas",'index','length'],
        created() {
         },
        methods:{
             getTime(){ //获取原生时间
                let that = this;
                window.location.href = "epipe://?&mark=getLeaveTime";

                window["epipe_leavetime_callback"] = str => {
                        let flag = false; 
                        let date = null;
                    if(str.indexOf('/')>0){
                        flag = true;
                        date = that.tiemF(str)
                        str = str.split(/[- : \/]/);
                    }else{
                        date = new Date(str)
                    }
                    that.datas.absenceDate = flag?str[0]+'-'+str[1]+'-'+str[2]+' '+str[3]+':'+str[4]:str; 
                    that.$emit('setTime',that.datas.absenceDate,that.index)
                }
            },
             tiemF(timeStr){ //传入原生的时间格式化
                timeStr+=':00';
                timeStr = timeStr.split(/[- : \/]/);
                return new Date(timeStr[0],timeStr[1]-1,timeStr[2],timeStr[3],timeStr[4])
             },

             remove(){
                this.$emit('remove',this.index)
             }
        },
    }
</script>

<style scoped lang="stylus">
    .styles{
            margin-bottom 0.15rem;
            //  -webkit-box-shadow: 0 0 0.2rem rgba(238,65,54,.1);    
            //  box-shadow 0 0 0.2rem rgba(238,65,54,.1);
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
                 padding-right 0.1rem;
                 color:#666;
             }
             input::-webkit-input-placeholder{
                 font-size:0.13rem;
                 color:#666;
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

    .items{
            height 0.44rem;
            line-height 0.44rem;
            font-size 0.15rem;
            color #333;
            font-weight bold;

            p{
                float right 
            }

            .nullValue{
                color #666;
                font-size 0.14rem;
            }
        }
    .items-details{
        height auto
        text-align left 
    }

    .input_group{
        //   -webkit-box-shadow: 0 0 0.2rem rgba(238,65,54,.1);    
        //      box-shadow 0 0 0.2rem rgba(238,65,54,.1);
    }
    .input_group>div{
            overflow hidden;
            padding 0 0.15rem;
        }

    .input_group .control{
        background-color: #f5f5f5;
        padding-right 0;
        font-size:0.16rem;
        padding-bottom:0.08rem;

        span:first-child{
            float:left;
            color:#609df6;
        }

        span:last-child{
            float:right;
        }
    }

    .leaveTime input{
        width 1.4rem;
        float none;
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

    .bgF5{
        background-color: #f5f5f5;
        color:#999;
        padding-top:0.12rem !important;
    }

     .omit{
        width:2.2rem;
        display:block;
        overflow: hidden;
        text-overflow:ellipsis;
        white-space: nowrap;
        text-align:right;
        float:left;
    }
</style>