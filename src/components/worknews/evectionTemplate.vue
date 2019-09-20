<template>
    <div>
        <div class="styles input_group " ref="templates">
                <div class="control" v-if="datas.length>1">
                    <span>行程明细({{index+1}})</span>
                    <span style="color:#fd545c" @click.stop="remove">删除</span>
                </div>
                <div class="items bor_bottom" @click="getSite()" >
                    出差地点
                    <p >
                        <span class="nullValue">{{datas[index].destination}}</span>
                        <svg class="icon icon-back" aria-hidden="false">
                            <use xlink:href="#icon-right"></use>
                        </svg>
                    </p>
                </div>
                 <div class="items bor_bottom" @click="getTime(0)">
                    开始时间
                    <p >
                        <span class="nullValue">{{datas[index].beginTime}}</span>
                        <svg class="icon icon-back" aria-hidden="false">
                            <use xlink:href="#icon-right"></use>
                        </svg>
                    </p>
                </div>

                <div class="items bor_bottom" @click="getTime(1)">
                    结束时间
                    <p >
                        <span class="nullValue">{{datas[index].endTime}}</span>
                        <svg class="icon icon-back" aria-hidden="false">
                            <use xlink:href="#icon-right"></use>
                        </svg>
                    </p>
                </div>

                 <div class="items leaveTime bor_bottom">
                    时长 <span style="font-size:0.12rem;color:#999">（以0.5为单位）</span>
                    <p>
                        <input type="number" v-model="datas[index].tripDuration">
                        <span class="nullValue">
                            天
                        </span>
                    </p>
                </div>

                <router-link tag="div" :to="{path:'/addressList',query:{bgcolor:'#609df6',peArrIndex:index,showGroup:true}}" class="items">
                    同行人员
                    <p >
                        <span class="nullValue">{{peerArr | nameFor }}</span>
                        <svg class="icon icon-back" aria-hidden="false">
                            <use xlink:href="#icon-right"></use>
                        </svg>
                    </p>
                </router-link>

                <div class="bgF5" v-if="index==0">
                    出差天数系统根据开始时间和结束时间自动核算，如与实际情况不符，请进行修改
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
        props: ["datas",'index','peerArr'],
        mounted() {
        },
        methods:{
            remove:function(){
                
            this.datas.splice(this.index,1)

            this.$emit('removePeerArr',this.index)

            },
             getSite:function(){ //获取地点
                let that = this;
                window["epipe_site_callback"] = (name,site,lon,lat) => {
                        name = !name?site:name;
                        that.datas[that.index].destination = name;
                        that.datas[that.index].detailAddress = site;
                        that.datas[that.index].lon =  lon;
                        that.datas[that.index].lat = lat;
                }
                window.location.href = "epipe://?&mark=outsideAddress"
            },
             getTime(num){ //获取原生时间
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

                    if(!num){
                        if(that.datas[that.index].endTime!='请选择结束时间'){
                            let endDate = that.tiemF(that.datas[that.index].endTime)
                            if(date.getTime()>endDate.getTime()){
                                that.$toast('开始时间不能大于结束时间')
                            }else if(date.getTime()==endDate.getTime()){
                                that.$toast('开始时间不能等于结束时间')
                            }else{
                            that.datas[that.index].beginTime = flag?str[0]+'-'+str[1]+'-'+str[2]+' '+str[3]+':'+str[4]:str; 
                            that.getLeaveDay();
                            }
                        }else{
                            that.datas[that.index].beginTime = flag?str[0]+'-'+str[1]+'-'+str[2]+' '+str[3]+':'+str[4]:str;
                        }
                    }else{            
                        
                        if(that.datas[that.index].beginTime!='请选择开始时间'){
                            let beginDate = that.tiemF(that.datas[that.index].beginTime);
                            if(date.getTime()<beginDate.getTime()){
                                that.$toast('结束时间不能小于开始时间')
                            }else if(date.getTime()==beginDate.getTime()){
                                that.$toast('结束时间不能等于开始时间')
                            }else{
                                that.datas[that.index].endTime = flag?str[0]+'-'+str[1]+'-'+str[2]+' '+str[3]+':'+str[4]:str;
                                that.getLeaveDay();
                            }
                        }else{
                            that.datas[that.index].endTime = flag?str[0]+'-'+str[1]+'-'+str[2]+' '+str[3]+':'+str[4]:str;
                        }  
                    }
                }
            },
            tiemF(timeStr){ //传入原生的时间格式化
                timeStr+=':00';
                timeStr = timeStr.split(/[- : \/]/);
                return new Date(timeStr[0],timeStr[1]-1,timeStr[2],timeStr[3],timeStr[4])
             },
             getLeaveDay(){ //请假时间计算
                let bTime = this.tiemF(this.datas[this.index].beginTime)
                let eTime = this.tiemF(this.datas[this.index].endTime)
                let time =eTime.getTime() - bTime.getTime()

                let dayTime =  parseInt( time/(24*60*60*1000));
    
                if(time/(1000*60*60)<=4){
                    this.datas[this.index].tripDuration = 0.5;
                }else if(!dayTime&&time/(1000*60*60)>4){
                    this.datas[this.index].tripDuration = 1;
                }else{
                    let tripDuration = time/(1000*60*60) - dayTime * 24
                    this.datas[this.index].tripDuration = tripDuration<=4?dayTime +0.5:dayTime+1
                }
            },
        },

        filters:{
             nameFor:function(arr){ //同行人员姓名格式化
                if(!arr.length) return 
              var str = '';

              for(let i = 0;i<arr.length;i++){

                  if(i>2){
                      return str.slice(0,-1)+'...';
                  }
                    str+= arr[i].name+','
              }
              return str.slice(0,-1)
            },
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
                color #999;
                font-size 0.14rem;
            }
        }

    .input_group{
        //   -webkit-box-shadow: 0 0 0.2rem rgba(238,65,54,.1);    
        //      box-shadow 0 0 0.2rem rgba(238,65,54,.1);
    }
    .input_group>div{
            display:flex;
            justify-content:space-between; 
            padding 0 0.15rem;
        }

    .input_group .control{
        background-color: #f5f5f5;
        padding-right 0;
        font-size:0.16rem;
        padding-bottom:0.08rem;

        span:first-child{
            color:#609df6;
        }

        span:last-child{
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
    }
</style>