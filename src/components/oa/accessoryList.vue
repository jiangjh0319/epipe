<template>

    <div class="styles infor" v-if="accessory.length">
        <ul class="accessory">
            <li  v-for="(item,index) in accessory" :key="index">
                <img @click="go_fildDetails(item.url,item.fileName)" v-if="item.isImg"  :src="item.url"/>
                <img @click="go_fildDetails(item.url,item.fileName)" v-if="!item.isImg" src="../../assets/wenjian.png"/> 
                <div @click="go_fildDetails(item.url,item.fileName)"  class="accessory-cont">
                    <p style="text-align:left">{{item.fileName}}</p>
                    <span>{{item.fileSize | fileSize}}</span>
                </div>
            </li>
        </ul>
    </div>
</template>

<script>
    export default {
        data() {
            return {
            }
        },
        props: ['accessory'],

        filters:{
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
        methods:{
           go_fildDetails: function (url,name) { //附件
                let that = this;
                let obj = {index_num: 0, data:[url],type:0,name}
                window.location.href = "epipe://?&mark=imgdetail&url=" + JSON.stringify(obj);
            },
        }
    }
</script>

<style scoped lang="stylus">

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

    .accessory li:last-child{
        margin-bottom:0;
    }

</style>