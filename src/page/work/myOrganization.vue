<template>
    <div>
        <TopHead
        native = 'native'
        bgcolor = '#42a653'
        title="我的组织" 
        v-on:history_back="history_back_click"
         ></TopHead>
         
        <div style="height:0.59rem;"></div>
         <div class="content">
             <div v-for="item in datas" :key="item.companyId" class="item" @click="go_org_details(item)">
                 <div style="width:70%;">
                     <p>{{item.companyName}}
                         <svg class="icon icon-back" style="color:#609df6" aria-hidden="false" v-if="item.creatorFlag==1">
                            <use xlink:href="#icon-pc-icon-"></use>
                        </svg>
                     </p>
                 </div>
                 <div style="color:#999">
                     <span>{{item.auditStatus|status}}</span>
                     <svg class="icon icon-back" aria-hidden="false" v-if="item.auditStatus==1">
                            <use xlink:href="#icon-right"></use>
                        </svg>
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
                datas:[],
            }
            
        },
        components:{
            TopHead,
        },
        filters:{
            status:function(value){
                if(value=='0'){
                    return '待审核'
                }else if(value=='1'){
                    return '已加入'
                }else if(value==2){
                    return '审核不通过'
                }
            }
        },
        created(){
            let that = this;
            this.axios.get('organ/user/organs').then(res=>{
                that.datas = res.data.b
            })
        },
        methods: {
            go_org_details(item){
                if(item.creatorFlag!=1) return
                console.log(item.id)
                this.$router.push({path:'/OrganDetails',query:{title:'组织信息',info:true,id:item.officeJoinId}})
            }
        },

    }
</script>

<style  scoped lang="stylus">

    .item{
        display flex
        height 0.49rem;
        background-color #fff
        justify-content:space-between;
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
</style>