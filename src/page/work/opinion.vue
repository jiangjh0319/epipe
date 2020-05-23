<template>
    <section>
        <TopHead
        :bgcolor = colors
        title='审批意见'
        ></TopHead>
        <div style="height:0.59rem;"></div>
        <div class="main">
            <div class="content">
                <textarea :placeholder="placeholder" v-model="textVal" maxlength="500"></textarea>
                <p class="counts"><span v-bind:style="{color:colors}">{{counts}} / 500</span></p>
            </div>
            
            <div class="content" style="padding:0">
                <Accessory
                    :accessory ='accessory'
                >
                </Accessory>

            </div>
            <a :style="{color:colors,borderColor:colors}" class="btn" @click="affirm()">
                {{btnText}}
            </a>
        </div>

    </section>
</template>
<script>
    import TopHead  from '../../components/topheader.vue'  //header导航栏
    import Accessory  from '../../components/worknews/accessory_select.vue'    //附件

export default {
        data(){
            return {
                counts : 0,
                textVal : '',
                id : '',
                colors:'#fd545c',
                btnText:'同意申请',
                placeholder:'请输入批准',
                accessory:[],
            }
        },
        methods : {
            affirm : function(){

                if(this.counts<=0){
                    this.$toast("审批意见不能为空!")
                    return false;
                }
                if(this.$route.query.pageType==1){
                    this.submits(2)
                }else if(this.$route.query.pageType==3){
                    this.submits(10);
                }else{
                    this.submits(3);
                }
            },
            submits:function(type){
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

                    let params = {
                            applyType:this.$route.query.applyType,
                            type,
                            applyId:this.$route.query.id,
                            reason:this.textVal,
                            url:urlStr,
                            fileSize:fileSizeStr,
                            fileName:fileNameStr,
                    }

                    if(type!=3){
                        params.receiverIds = this.$route.query.receiverIds;
                        params.auditerIds = this.$route.query.auditerIds;
                        params.auditCompanyIds = this.$route.query.auditCompanyId;
                        params.receiverCompanyIds = this.$route.query.receiverCompanyId;
                    }

                    that.axios({
                        method:"post",
                        url:"/work/audit",
                        headers:{
                            'Content-type': 'application/x-www-form-urlencoded'
                        },
                        data:params,
                    transformRequest: [function (data) {
                        let ret = ''
                        for (let it in data) {
                            ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
                        }
                        return ret
                    }],
                }).then((res)=>{ 
                        if(res.data.h.code==200){

                            if(that.$route.query.pageType==1){
                                that.$toast('审批通过!')
                            }else if(that.$route.query.pageType==3){
                                that.$toast('评论成功!')
                            }else{
                                that.$toast('已拒绝该审批!')                            
                            }
                            setTimeout(()=>{
                                let applyType = that.$route.query.applyType+''
                                if(applyType.indexOf('MY_')>-1){
                                    window.location.href = "epipe://?&mark=oaDetails&_id="+that.id+'&data='+JSON.stringify({text:1});
                                }else{
                                    window.location.href = "epipe://?&mark="+that.$route.query.typeName+"Details&_id="+that.id+'&data='+JSON.stringify({text:1});
                                }
                            },300) 

                        }else{
                            that.$toast(res.data.h.msg)
                        }
                    })
            },
         
        },
        mounted:function(){
            this.id = this.$route.query.id;
            this.colors = this.$route.query.color;
            if(this.$route.query.pageType=='1'){
                this.btnText = '确认同意'
                this.placeholder = '请输入同意理由'
                this.textVal ='同意'
            }else if(this.$route.query.pageType=='3'){
                this.btnText = '确认评论'
                this.placeholder = '请输入评论理由'
            }else{
                this.btnText = '确认拒绝'
                this.placeholder = '请输入拒绝理由'
            }
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
            color #999;
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
        font-size 0.18rem
        border 1px solid #fd545c;

    }

    // .btn:before{
    //     content: " ";
    //     position: absolute;
    //     left: 0;
    //     top: 0;
    //     width 200%;
    //     height: 200%;
    //     border 1px solid #fd545c;
    //     border-radius: 4px;
    //     color: #D9D9D9;
    //     -webkit-transform-origin: 0 0;
    //     transform-origin: 0 0;
    //     -webkit-transform: scale(0.5);
    //     transform: scale(0.5);
    // }
</style>
