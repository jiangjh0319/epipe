<template>
    <div>
        <TopHead
            native = 'native'
            bgcolor = '#42a653'
            title="选择组织" 
            v-on:history_back="history_back_click"
         ></TopHead>
        <div style="height:0.59rem;"></div>
        <div>
            <div v-for="item in data" :key="item.companyId" class="item" @click="select(item)">
                <div>
                        <svg class="icon icon-back" aria-hidden="false" v-if="item.loginFlag==1">
                                <use xlink:href="#icon-xuanzhong"></use>
                        </svg>
                        <svg v-else class="icon icon-back" aria-hidden="false">
                                <use xlink:href="#icon-meiyouxuanzhong"></use>
                        </svg>
                </div>
                <div class="name">
                    <p>
                        {{item.organName}}
                    </p>
                </div>
                <div v-if="item.unreadCount!='0'&&item.unreadCount" class="msg">
                    <span>{{item.unreadCount}}个新消息</span>
                </div>
            </div>
        </div>

    </div>
</template>

<script>
import TopHead  from '../../components/topheader.vue'  //header导航栏
    export default {
        data() {
            return {
                data:[],
            }
        },
        components:{
            TopHead,
        },
        created(){
            let that = this;
            this.axios.get('user/multioffice/info').then(res=>{
                that.data = res.data.b;
            })
        },
        methods:{
            select(item){
                if(item.loginFlag==1) return false
                this.data.forEach(element => {
                    element.loginFlag = 0
                });
                item.loginFlag = 1
                let that = this;
                this.axios.get('user/multioffice/change?id='+item.id).then(res=>{
                    if(res.data.h.code==200){
                        that.setCookie(res.data.b.authToken)
                        let params = res.data.b;
                        params.organName = item.organName
                        window.location.href = "epipe://?&mark=newLogin&data="+JSON.stringify(params);
                        
                    }else{
                        that.$toast(res.data.h.msg)
                    }
                })

            },
            setCookie(cookie){

                var date=new Date();
                var expiresDays=100;
                date.setTime(date.getTime()+expiresDays*24*3600*1000);
                //将userId和userName两个cookie设置为10天后过期
                document.cookie="auth_token="+cookie+"; expires="+date.toGMTString();
            }
        }
    }
</script>

<style  scoped lang="stylus">

    .item{
        display flex
        height 0.49rem;
        background-color #fff
        align-items:center;
        margin 0 0.15rem;
        padding 0 0.15rem
        border-bottom 0.01rem solid #e6e6e6
        font-size 0.16rem;

        &:last-nth{
            border none;
        }

        p{
            overflow: hidden;
            text-overflow:ellipsis;
            white-space: nowrap;
        }
    }

    .msg span{
        height 0.16rem;
        padding 0.02rem 0.03rem;
        border-radius 0.16rem;
        font-size 0.1rem;
        // border-bottom-left-radius 50% 
        color:#fff;
        background-color #fd545c;
    }

    .name{
        margin 0 0.06rem;
        max-width  65%;
    }
</style>