<template>
    <section>
        <TopHead
        :bgcolor=color
        title='退回'
        ></TopHead>
      <div style="height:0.59rem;"></div>
        <div class="main">
            <div class="content">
                <div class="input" style="margin-bottom:0.3rem" @click="selectType=5">
                    <div class="circle">
                        <i v-show="selectTypeType==8"></i>
                        <i v-show="selectType==5" :style="{backgroundColor:color}"></i>
                    </div>
                    返回至上一审批人
                </div>
                <div class="input" @click="selectType=8">
                    <div class="circle">
                        <i v-show="selectType==5"></i>
                        <i v-show="selectType==8" :style="{backgroundColor:color}"></i>
                    </div>
                    返回至申请人
                </div>               
            </div>
            <div class="content">
                <textarea placeholder="请输入退回理由" v-model="textVal" maxlength="500"></textarea>
                <p class="counts"><span v-bind:style="{color:color}">{{counts}} / 500</span></p>
            </div>

            <div class="content" style="padding:0">
                <Accessory
                    :accessory ='accessory'
                >
                </Accessory>
            </div>

            <a :style="{color:color,borderColor:color}" class="btn" @click="affirm()">
                确认退回
            </a>
        </div>
    </section>
</template>
<script>
    import TopHead  from '../../../components/topheader.vue'  //header导航栏
    import Accessory  from '../../../components/worknews/accessory_select.vue'    //附件

export default {
        data(){
            return {
                counts : 0,
                textVal : '',
                id : '',
                color:'#f80',
                target:'',
                selectType:5,
                accessory:[],
            }
        },
        methods : {
            affirm : function(){
                if(this.counts<=0){
                    this.$toast("请填写退回理由!")
                    return false;
                }else{
                    this.goBack()
                }
            },
            goBack(type){
                let that = this;
                setTimeout(()=>{
                        window.location.href = "epipe://?&mark=workUpdate";
                    },2000)
                 let urlStr = '',fileSizeStr = '',fileNameStr = '';//附件
                    for(let i=0;i<this.accessory.length;i++){
                        urlStr+='|'+this.accessory[i].url;
                        fileSizeStr+='|'+this.accessory[i].fileSize;
                        fileNameStr+='|'+this.accessory[i].fileName;  
                    }
                    urlStr = urlStr.slice(1)
                    fileSizeStr = fileSizeStr.slice(1)
                    fileNameStr = fileNameStr.slice(1)

                this.axios.post('/work/audit'+that.Service.queryString({
                    applyId:this.id,
                    type:this.selectType,
                    applyType:this.$route.query.applyType,
                    reason:encodeURI(this.textVal),
                    url:urlStr,
                    fileSize:fileSizeStr,
                    fileName:fileNameStr,
                })).then(function(res){
                    if(res.data.h.code==200){
                        that.$toast('退回成功!')
                        setTimeout(()=>{
                             window.location.href = "epipe://?&mark=goWork"
                        },300)      
                    }else{
                        that.$toast(res.data.h.msg)
                    }
                })
            }

        },
        mounted:function(){
            this.id = this.$route.query.id;
            this.color = this.$route.query.color
        },
        components:{
            TopHead,
            Accessory
        },
        watch : {
            textVal : function(){
                this.counts = this.textVal.length
            }
        }
}
</script>

<style lang="stylus" scoped>
    .main{
        padding 0 0.15rem;
    }
    .content{
        padding 0.15rem;
        -webkit-box-shadow: 0 0 0.2rem rgba(238,78,54,.1);    
        box-shadow 0 0 0.2rem rgba(238,78,54,.1);
        background-color #fff;
        margin-bottom 0.3rem;

        textarea{
            width 100%;
            min-height 1rem;
            border none 
            outline none
            resize none
            font-size 0.15rem;
            color #333;
            line-height 0.2rem;
        }

        .counts{
            text-align right 
            font-size 0.14rem;
            color #fd545c
        }
    }

    .btn{
        position relative
        display block
        height 0.5rem;
        line-height 0.5rem;
        text-align center
        color #fd545c
        font-size 0.18rem;
        border 1px solid #fd545c;
    }

    .input{
        font-size 0.15rem;
        color:#999;
        display flex;
        line-height 1em;
    }

    .circle{
        width 0.12rem;
        height:0.12rem;
        border 0.01rem solid #ccc
        border-radius 50%;
        position relative
        margin-right 0.08rem

        i{
            position absolute 
            width 0.08rem;
            height:0.08rem;
            top 0;
            bottom 0;
            left 0;
            right 0;
            margin auto;
            border-radius 50%;
            // background-color #F80
        }
    }


</style>
