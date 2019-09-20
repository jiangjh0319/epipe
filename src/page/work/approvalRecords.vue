<template>
    <div>
         <TopHead
            native = 'native'
            bgcolor = '#f80'
            title="审批记录" 
            v-on:history_back="history_back_click"
         ></TopHead>
         <div style="height:0.93rem;"></div>
         <div class="select_div" :style="{'height':show_div?'100%':'auto'}">
             <div class="tab_lab">
                 <div @click="go_address">{{select_title}}
                     <svg class="icon cirl_90"  aria-hidden="false">
                        <use xlink:href="#icon-xia_"></use>
                    </svg>
                 </div>
                 <div @click="pitch_on(1)" :class="show_div&&show_list==1?'select_active':''">
                     {{type_value.value===''?'审批类型':type_value.key}}
                     <svg class="icon cirl_90"  aria-hidden="false">
                        <use xlink:href="#icon-xia_"></use>
                    </svg>
                 </div>
                 <div @click="pitch_on(2)" :class="show_div&&show_list==2?'select_active':''">
                     {{approval.value===''?'审批状态':approval.key}}

                     <svg class="icon cirl_90"  aria-hidden="false">
                        <use xlink:href="#icon-xia_"></use>
                    </svg>
                 </div>
                 <div @click="pitch_on(3)" :class="show_div&&show_list==3?'select_active':''">
                     {{time_value.text}}
                     <svg class="icon cirl_90"  aria-hidden="false">
                        <use xlink:href="#icon-xia_"></use>
                    </svg>
                 </div>
             </div>
             <div class="select_list"  v-if="show_div" @click.stop.prevent="show_div=false">

                 <div v-show='show_list==2'>
                    <span v-for="item in approvalStatus" :class="approval.value===item.value?'active':''" @click.stop.prevent="chose(item,2)" :key="item.value">{{item.key}}</span>                     
                 </div>

                 <div v-show='show_list==1'>
                    <span v-for="item in type" :class="type_value.value===item.value?'active':''" @click.stop.prevent="chose(item,1)" :key="item.value">{{item.key}}</span>                     

                  </div>
                 <div class="time_select" v-show='show_list==3' v-for="item in time_check" :key="item.num">
                     <div @click.stop.prevent="chose(item,3)">
                    {{item.text}}
                     </div>
                 </div>
                 
             </div>
         </div>
         <div>
             <div>
                <OaTemplate v-on:goDetails="goDetails" v-for="item in list" :item=item :key="item.applyId"></OaTemplate>
            </div>
                <infinite-loading  v-if="load" spinner="bubbles"  :on-infinite="onInfinite" ref="infiniteLoading">
                    <span slot="no-more" class="no-more">
                    暂无更多加载
                    </span>
                    <span slot="no-results" class="no-results">
                    暂无更多加载
                    </span>
                </infinite-loading>
         </div>
    </div>
</template>

<script>
    import {mapState, mapMutations} from 'vuex';
    import TopHead  from '../../components/topheader.vue'  //header导航栏
    import OaTemplate  from '../../components/oa/oa_template.vue' 
 import InfiniteLoading from 'vue-infinite-loading';
import { setTimeout } from 'timers';


    export default {
            data() {
                return {
                        type:[{key:'全部',value:''},{key:'请假',value:0},
                            {key:'补卡',value:11},{key:'出差',value:4},{key:'公出',value:3},{key:'请示函',value:1},{key:'合同',value:2},{key:'报销',value:6},
                            {key:'付款',value:7},{key:'用印',value:5},{key:'离职',value:8},{key:'借款',value:9},{key:'接待',value:10},
                            {key:'用车',value:12},{key:'人员需求',value:13},
                            {key:'项目立项',value:14},{key:'转正',value:15},{key:'就餐',value:16},{key:'行文呈批',value:17},{key:'加班',value:18},
                            {key:'员工调岗',value:19},{key:'采购',value:20},{key:'物品领用',value:21}
                            ],
                        approvalStatus:[
                            {key:'全部',status:1,value:'',arr:[]},
                            {key:'审批中',status:0,value:0,arr:[2,3]},
                            {key:'已同意',status:0,value:1,arr:[1]},
                            {key:'已拒绝',status:0,value:2,arr:[1] },
                            {key:'已撤销',status:0,value:3,arr:[3] },
                            {key:'已退回',status:0,value:4,arr:[1,3] }],
                        time_check: [{text: "一个月", num: 1}, {text: "三个月", num: 2}, {text: "半年", num: 3}, {text: "不限时间", num: 0}],

                        list:[],
                        type_data_arr:[{"flag":4,"ids":""}],
                        select_title:'所有用户',
                        pageNo:1,

                        type_value:{key:'全部',value:''},
                        approval: {key:'全部',status:1,value:'',arr:[]},
                        time_value:{text: "不限时间", num: 0},
                        show_list:1,
                        show_div:false,
                        load:true,
                }
            },
            components: {
                TopHead,
                OaTemplate,
                InfiniteLoading
            },
            created(){
                
            },
            watch:{
                show_div(value){
                    if(value){
                                            document.querySelector('#app').style.overflowY='hidden'

                    }else{
                                            document.querySelector('#app').style.overflowY='inherit'

                    }
                }
            },
            methods: {
                go_address(){
                    this.$router.push({path:'/address',query:{type:2}})
                },
                dataFor(arr){
                    let data = [],res=[];
                    for(let i= 0;i<arr.length;i++){
                        let obj = {};
                        for(let j = 0;j<arr[i].extend.length;j++){
                            obj[arr[i].extend[j].key] = arr[i].extend[j].value
                        }
                        data.push(obj)
                    }
                    return data;
                },
                pitch_on(type){
                    this.show_div = true;
                    this.show_list = type
                },
                goDetails(item,type){
                    console.log(window.location.href = "epipe://?&mark="+type+"Details&_id="+item.applyId+'&data='+JSON.stringify({text:0}))
                    window.location.href = "epipe://?&mark="+type+"Details&_id="+item.applyId+'&data='+JSON.stringify({text:0});
                },
                chose(val,type){
                    if(type==1){
                        this.type_value = val
                    }else if(type==2){
                        this.approval = val
                    }else{
                        this.time_value = val
                    }

                    this.show_div = false;
                    this.load = false;
                    this.pageNo=1;
                    this.list = [];
                    this.getList()
                },
                onInfinite(){
                    let that = this;
                    //供需
                    setTimeout(()=>{

                        that.axios({
                            method:"post",
                            url:"apply/user/list1",
                            data:{
                                    reportReq:JSON.stringify({
                                        finalStatus:that.approval.value,
                                        oaType:that.type_value.value,
                                        reportTime:that.time_value.num,
                                        permitParams:that.type_data_arr,
                                    }),
                                    pageSize: 10,
                                    pageNo: that.pageNo,
                            },
                            transformRequest: [function (data) {
                                let ret = ''
                                for (let it in data) {
                                    ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
                                }
                                return ret
                            }],
                        }).then((res)=>{ 
                            if (res.data.b.data.length == 0) {
                                console.log(111111111111)
                                that.$refs.infiniteLoading.$emit('$InfiniteLoading:complete');
                            } else if (res.data.b.data) {
                                console.log(22222222222222222)
                                let arr = that.dataFor(res.data.b.data)
                                that.list = that.list.concat(arr)
                                that.pageNo++;
                                that.$refs.infiniteLoading.$emit('$InfiniteLoading:loaded');
                            }
                         })
                    },300)
                    
                        
                },
                getList(){
                    this.axios({
                        method:"post",
                        url:"apply/user/list1",
                        data:{
                                reportReq:JSON.stringify({
                                    finalStatus:this.approval.value,
                                    oaType:this.type_value.value,
                                    reportTime:this.time_value.num,
                                    permitParams:this.type_data_arr,
                                }),
                                pageSize: 10,
                                pageNo: this.pageNo
                        },
                        transformRequest: [function (data) {
                            let ret = ''
                            for (let it in data) {
                                ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
                            }
                            return ret
                        }],
                    }).then((res)=>{ 
                        this.list = this.dataFor(res.data.b.data)
                        this.pageNo++;
                        this.load = true;
                    })
                }
            },
            activated(){
                this.show = true;
                this.pageNo = 1;
                let arr = []
                let companyIds = '',departIds = '',userIds=""

                if(!this.permissionsusers.length) return false
                
                if(this.permissionsusers[this.permissionsusers.length-1].mark_chose){
                    this.select_title = '所有用户'
                    arr[4] = ''

                }else{
                    for(let i=0;i<this.permissionsusers.length;i++){
                    let item = this.permissionsusers[i] 

                        if(item.mark_chose){
                        arr[item.type]=arr[item.type]?arr[item.type]:''
                        arr[item.type]+=item.id+'|'
                        // companyIds+=item.id+'|'
                        continue;
                        }
                        if(!item.subOffice) continue;
                        for(let j=0;j<item.subOffice.length;j++){
                        let el = this.permissionsusers[i].subOffice[j]
                            if(el.mark_chose){
                            arr[el.type]=arr[el.type]?arr[el.type]:''
                            arr[el.type]+=el.id+'|'
                            // departIds+=el.id+'|'
                            continue;
                            }

                if(el.subOffice){
                  for(let s=0;s<el.subOffice.length;s++){

                      if(el.subOffice[s].mark_chose){
                          arr[el.subOffice[s].type]=arr[el.subOffice[s].type]?arr[el.subOffice[s].type]:''
                          arr[el.subOffice[s].type]+=el.subOffice[s].id+'|'
                      }

                      if(!el.subOffice[s].staff) continue;
                      for(let k=0;k<el.subOffice[s].staff.length;k++){
                        let c = el.subOffice[s].staff[k]
                          if(c.mark_chose){
                            arr[3]=arr[3]?arr[3]:''
                            arr[3]+=c.userId+'|'
                            // userIds+=c.userId+'|'
                            continue;
                          } 
                      }
                  }
                }

                if(!el.staff) continue;
                for(let k=0;k<el.staff.length;k++){
                  let c = el.staff[k]
                    if(c.mark_chose){
                        arr[3]=arr[3]?arr[3]:''
                        arr[3]+=c.userId+'|'
                      continue;
                    } 
                }
            }
        }
          this.select_title = '指定用户'
      }

      this.top_mark = false;

      let dataArr = []

      arr.forEach((item,index)=>{
          if(item!=undefined){
              dataArr.push({flag:index,ids:item})
          }
      })
      this.type_data_arr = dataArr;
      this.getList()
      },
    computed: mapState(["permissionsusers"])

    }
</script>

<style lang="stylus" scoped>
.tab_lab{
    display flex;
    box-shadow: 0 0 10px rgba(160, 160, 160, 0.7);
    background-color #fff;
    line-height 0.48rem;

    >div{
        flex 1;
        text-align center;
    }

    .select_active{
        color:#f80;
    }
    
}

.no-results,.no-more{
        display:block;
        margin:0.15rem 0;
    }

.select_div{
    width:100%;
    height:100%;
    position fixed;
    top:0.45rem;
    z-index 999
}


.time_select>div{
    padding 0;
    line-height:0.4rem;
    border-bottom:0.01rem solid #e6e6e6;
}

.select_list{
    background #fff;
    height:100%;
    background-color:rgba(0,0,0,0.3)
    border-top:0.01rem solid #e6e6e6;

    >div{
        padding 0.15rem;
        overflow hidden
        background-color: #fff;
    }

    .time_select{
        padding 0;
        text-indent:0.15rem;
    }

    span{
        float left;
        width:22%;
        text-align:center;
        box-sizing border-box;
        padding 0.03rem 0;
        border 0.01rem solid #e6e6e6;
        color:#666;
        margin-right:0.1rem;
        margin-bottom:0.1rem;
        letter-spacing 0.01rem;
    }

    .active{
        color #fff;
        background #609ef6;
        border-color:#609ef6;
    }
}
</style>