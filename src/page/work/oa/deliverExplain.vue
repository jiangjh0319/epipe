
<template>
    <section>
        <TopHead
        :bgcolor='color'
        :title='"转交给"+name'
        ></TopHead>
      <div style="height:0.59rem;"></div>
        <div class="main">
            <div class="content">
                <textarea placeholder="请输入转交备注" v-model="textVal" maxlength="500"></textarea>
                <p class="counts"><span>{{counts}} / 500</span></p>
            </div>
            <div class="content">
                <p class="title" style="margin-bottom:0.1rem;">附件</p>
                <div>
                    <ul class="accessory">
                        <li  v-for="(item,index) in accessory" :key="index">
                            <img @click=" (item.url)" v-if="item.isImg"  :src="item.url"/>
                            <img @click="go_fildDetails(item)" v-if="!item.isImg" src="../../../assets/wenjian.png"/>
                            <div @click="go_fildDetails(item)"  class="accessory-cont">
                                <p >{{item.fileName}}</p>
                                <span>{{item.fileSize | fileSize}}</span>
                            </div>
                            <div @click="deleteFile(index)" class="accessory-delete">
                                <svg style="font-size: 0.15rem" class="icon" aria-hidden="false">
                                    <use xlink:href="#icon-shanchu"></use>
                                </svg>
                            </div>
                        </li>
                    </ul>
                 
                    <div v-if="accessory.length<10"  @click="addAccessory()" class="add-btn">
                        <svg style="font-size: 0.33rem" class="icon" aria-hidden="false">
                            <use xlink:href="#icon-tianjiarenyuan"></use>
                        </svg>
                        <div>
                            <p>仅支持图片、文档(.doc/.docx/.exls/.exl/.ppt/.txt)</p>
                        </div>
                    </div>
                </div>
             </div>
            <a class="btn" @click="submits()">
                确认
            </a>
        </div>
    </section>

</template>

<script>
import TopHead  from '../../../components/topheader.vue'  //header导航栏
export default {
    data(){
        return{
            name:'张三',
            counts : 0,
            textVal : '',
            id : '',  
            accessory:[], 
            color:'#fd545c'
        }
    },
     methods : {
            affirm : function(){
             
            },
            submits:function(){
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

                    let param = {
                        applyId:this.id,
                        type:4,
                        applyType:this.$route.query.applyType,
                        url:urlStr,
                        fileSize:fileSizeStr,
                        fileName:fileNameStr,
                        reason:encodeURI(this.textVal),
                        auditerIds:this.$route.query.userId+'|'+this.$route.query.auditerIds,
                        receiverIds:this.$route.query.receiverIds,
                        auditCompanyIds :this.$route.query.auditCompanyId,
                        receiverCompanyIds: this.$route.query.receiverCompanyId,
                    }
                    param.auditerIds=param.auditerIds[param.auditerIds.length-1]=='|'?param.auditerIds.slice(0,-1):param.auditerIds
                    param.auditCompanyIds=param.auditCompanyIds[param.auditCompanyIds.length-1]=='|'?param.auditCompanyIds.slice(0,-1):param.auditCompanyIds
                 this.axios.post('/work/audit'+that.Service.queryString(param)).then(function(res){
                    if(res.data.h.code==200){
                        that.$toast('转交成功!')
                        setTimeout(()=>{
                            window.location.href = "epipe://?&mark="+that.$route.query.typeName+"Details&_id="+that.id+'&data='+JSON.stringify({text:1});
                        },500)      
                    }else{
                        that.$toast(res.data.h.msg)
                    }
                })
            },
            isImg:function(str){
                 //判断是否是图片 - strFilter必须是小写列举
                var strFilter=".jpeg|.gif|.jpg|.png|.bmp|.pic|"
                if(str.indexOf(".")>-1){
                    var p = str.lastIndexOf(".");
                    var strPostfix=str.substring(p,str.length) + '|';        
                    strPostfix = strPostfix.toLowerCase();
                    if(strFilter.indexOf(strPostfix)>-1){
                        return true;
                    }
                }        
                return false;   
            },
            deleteFile:function(index){  //删除附件
                 this.accessory.splice(index,1)
            },
            go_fildDetails: function (item) { //查看图片详情
                    let that = this;
                    let obj = {index_num: 0, data:[item.url],type:0,size:item.fileSize}
                    window.location.href = "epipe://?&mark=imgdetail&url=" + JSON.stringify(obj);
            },
            addAccessory:function(){
            let that = this;
            
            window["epipe_camera_callback"] = (url,fileSize,fileName) => {
                    var obj = {
                            url,
                            fileSize,
                            fileName
                    }
                    that.isImg(url)?obj.isImg=true:obj.isImg=false;
                    that.accessory.push(obj)

            }
            window.location.href = "epipe://?&mark=addAccessory"
        },
         accessoryFor:function(){
                let urlStr = '',fileSizeStr = '',fileNameStr = '';

                for(let i=0;i<this.accessory.length;i++){

                    urlStr+='|'+this.accessory[i].url;
                    fileSizeStr+='|'+this.accessory[i].fileSize;
                    fileNameStr+='|'+this.accessory[i].fileName;  
                }
                urlStr = urlStr.slice(1)
                fileSizeStr = fileSizeStr.slice(1)
                fileNameStr = fileNameStr.slice(1)

                return {
                    url:urlStr,
                    fileSize:fileSizeStr,
                    fileName:fileNameStr,
                }
            }
            
        },
        filters:{
            fileSize:function(value){
                    value = value-0
                    if(value<5500){
                        value = value/1024
                        return value.toFixed(2)+'kb';
                    }
                    value = value/1024/1024
                    return value.toFixed(2)+'mb';
            }
        },
        created() {
            let that = this;
            window["epipe_camera_callback"] = (url,fileSize,fileName) => {
                    var obj = {
                            url,
                            fileSize,
                            fileName
                    }
                    that.isImg(url)?obj.isImg=true:obj.isImg=false;
                    that.accessory.push(obj)
            }
        },
        mounted:function(){
            this.id = this.$route.query.id;
            this.name = this.$route.query.userName;
            this.color = this.$route.query.color;
        },
        components:{
            TopHead
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
            min-height 0.8rem;
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
            color #0fc37c
        }
    }

    .btn{
        display block
        height 0.5rem;
        line-height 0.5rem;
        text-align center
        color #0fc37c
        font-size 0.18rem
        border:1px solid #0fc37c;
    }


    .title{
        font-weight bold;
        color #333;
    }

    .accessory{

        li{
            display:flex;
            margin-bottom 0.1rem;
         }

        img{
            width 0.34rem;
            height 0.34rem;
            margin-right 0.1rem;
        }


        .accessory-cont{
            flex 1;

            p{
                width 2.4rem;
                font-size 0.14rem;
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
            }

            span{
                font-size 0.13rem;
                color #666
            }
        }

        .accessory-delete{
            width 0.3rem;
            text-align right;  
        }
    }

.add-btn{
        display flex;

        div{
            height:0.33rem;
            display: table;
            margin-left:0.1rem;
        }

        p{
            font-size:0.12rem;
            color:#999;
            display: table-cell;  
            vertical-align: middle; 
            word-wrap: break-word;
            word-break: break-all;
        }
    }
</style>
