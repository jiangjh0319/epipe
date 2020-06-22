<template>
    <div class="styles" style="padding:0 0.15rem;">
        <p class="title">附件</p>
        <div style="padding-bottom:0.15rem">
            <ul class="accessory">
                <li  v-for="(item,index) in accessory" :key="index">
                    <img @click="go_fildDetails(item)" v-if="item.isImg"  :src="item.url"/>
                    <img @click="go_fildDetails(item)" v-if="!item.isImg" src="../../assets/wenjian.png"/>
                    <div @click="go_fildDetails(item)"  class="accessory-cont">
                        <p >{{item.fileName}}</p>
                        <span>{{item.fileSize | fileSizes}}</span>
                    </div>
                    <div @click="deleteFile(index)" class="accessory-delete">
                        <svg style="font-size: 0.15rem" class="icon" aria-hidden="false">
                            <use xlink:href="#icon-shanchu"></use>
                        </svg>
                    </div>
                </li>
            </ul>
            
            <div v-if="accessory.length<30"  @click="addAccessory()" class="add-btn">
                <svg style="font-size: 0.33rem;width:0.33rem;" class="icon" aria-hidden="false">
                    <use xlink:href="#icon-tianjiarenyuan"></use>
                </svg>
                <div style="flex:1">
                    <p >仅支持图片、文档( .doc/.docx/.ppt/.pptx/.txt/.jpg/.jpeg/.png/.xlsx/.xls/.pdf)</p>
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
        mounted:function(){
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
          props: [
            'accessory',
            //  颜色  选中的联系人数据  
            ],
        methods:{
            go_fildDetails: function (item) { //查看图片详情
                let obj = {index_num: 0, data:[item.url],type:0,name:item.fileName,size:item.fileSize}

                window.location.href = "epipe://?&mark=imgdetail&url=" + JSON.stringify(obj);
            },
            deleteFile:function(index){  //删除附件
                this.accessory.splice(index,1)
            },
            addAccessory:function(){
                let that = this;
                window.location.href = "epipe://?&mark=addAccessory"
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

        },
        filters:{
            fileSizes:function(value){
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

<style scoped lang="stylus">

    .styles,.title{
        font-size: 0.15rem;
        color: #333;
        font-weight: bold;
    }

    .title{
        line-height: 0.44rem;

    }

    .styles{
        background-color #fff;
        margin-bottom 0.15rem;
    }

     .accessory{

        li{
            display:flex;
            margin-bottom 0.1rem;
            padding-left 0.15rem;
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
        padding:0 0.15rem;
        box-sizing border-box

        div{
            height:0.33rem;
            display: table;
            margin-left:0.1rem;
        }

        p{
            font-size:0.12rem;
            color:#999;
            // display: table-cell;  
            // vertical-align: middle; 
            word-wrap: break-word;
            word-break: break-all;
        }
    }
</style>