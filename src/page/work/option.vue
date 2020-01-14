
<template>
    <section>
        <TopHead
        :bgcolor=color
        :title=title
        mark='mark'
        v-on:history_back='history_back'
        :is_relative_approva="is_relative_approva"
        v-on:show_edit='show_edit'
        ></TopHead>
        <div class="main">
            <div style="height:0.59rem;"></div>
            <ul class="list" v-if="type=='leave'">
                <li v-for="(item,index) in data" @click="clickEvent(index+1,item.name)" :key="index">
                    <div class="li">
                        <span>
                        {{item.name}} 
                        </span>
                        <svg class="icon icon-back" aria-hidden="false" v-if="index==indexs-1">
                            <use xlink:href="#icon-xuanzhong1"></use>
                        </svg>
                    </div>
                </li>
            </ul>
            <ul class="list" v-if="type=='wantPri'">
                <li v-for="(item,index) in data" @click="item.choose=!item.choose" :key="index">
                    <div class="li">
                        <span>
                        {{item.key}} 
                        </span>
                        <svg class="icon icon-back" aria-hidden="false" v-if="item.choose">
                            <use xlink:href="#icon-xuanzhong"></use>
                        </svg>
                        <svg class="icon icon-back" aria-hidden="false" v-else>
                                <use xlink:href="#icon-meiyouxuanzhong"></use>
                        </svg>
                    </div>
                </li>
            </ul>
            <ul class="list" v-else>
                <li v-for="(item,index) in data" @click="clickEvent(item.value,item.key)" :key="index">
                    <div class="li">
                        <span>
                        {{item.key}} 
                        </span>
                        <svg class="icon icon-back" aria-hidden="false" v-if="item.value==indexs">
                            <use xlink:href="#icon-xuanzhong1"></use>
                        </svg>
                    </div>
                </li>
            </ul>
        </div>
    </section>
</template>

<script>

import TopHead  from '../../components/topheader.vue'  //header导航栏
export default {
        data(){
            return{
            indexs : -1,
            data : [],
            t_index: 0,
            t_name: "",
            type:'outsign',
            title:'请假类型',
            color:'#fd545c',
            isComplie:'',
            is_relative_approva:{
                isShow:false,
                title:'确认'
            }
         }
        },
        components : {
            TopHead
        },
        methods : {          
            clickEvent(index,name){
                // console.log(index,name)
                this.t_index = index;
                this.t_name = name;
                window.history.back(-1);
            },
            show_edit(){
                let indexStr = '',nameStr=''
                 this.data.forEach(item=>{
                    if(item.choose){
                        indexStr+=item.value+'|'
                        nameStr+=item.key+','
                    }
                });
                this.t_index =indexStr?indexStr.slice(0,-1):'-1';
                this.t_name =nameStr?nameStr.slice(0,-1):'请选择';
                console.log(  this.t_index,  this.t_name)

                window.history.back(-1);
            },
            updata(){
                let vm = this;
                eventBus.$emit('leaveType',{
                    index: vm.t_index,
                    name: vm.t_name,
                    type: vm.type,
                });
            },
            history_back:function(){
                window.history.back(-1);
            }
        },
        mounted : function(){
          this.indexs = this.$route.query.indexs;
          this.color = this.$route.query.color
          let that = this;
          this.type = this.$route.query.type;
          this.isComplie  = this.$route.query.isComplie;

          if(this.$route.query.getType==1){
                this.title = this.$route.query.title;
                this.axios.get('/work/'+ this.$route.query.type +'/type').then(function(res){
                    if(res.data.h.code =200 ) that.data = res.data.b;
                    console.log('data：',that.data)
                })
          }else if(this.type=='outsign'){
                this.title = '公出类型';
                this.axios.get('/outsign/task/type').then(function(res){
                    if(res.data.h.code =200 ) that.data = res.data.b.type;
                })
          }else if(this.type=='stamp_fileCategory'){
                this.title = '文件类别';
            this.axios.get('/work/stamp/fileCategory').then(function(res){
                if(res.data.h.code =200 ) that.data = res.data.b
            })
          }else if(this.type=='stamp_sealName'){
                this.title = '印章名称';
            this.axios.get('/work/stamp/sealName').then(function(res){
                if(res.data.h.code =200 ) that.data = res.data.b;
            })
          }else if(this.type == 'reimburse'){
                this.title = '报销类别';
                this.axios.get('/work/reimburse/type').then(function(res){
                    if(res.data.h.code =200 ) that.data = res.data.b;
                })
          }else if(this.type =='payApply'){
                this.title = '付款方式';
                this.axios.get('/work/pay/type').then(function(res){
                    if(res.data.h.code =200 ) that.data = res.data.b;
                })
          }else if(this.type =='position'){
                this.title = '岗位类型';
                this.axios.get('/work/position/type').then(function(res){
                    if(res.data.h.code =200 ) that.data = res.data.b;
                })
          }else if(this.type =='dimission'){
                this.title = '离职类型';
                this.axios.get('/work/dimission/type').then(function(res){
                    if(res.data.h.code =200 ) that.data = res.data.b;
                })
          }else if(this.type=='reception'){
                this.title = '交通工具';
                this.axios.get('/work/traffic/type').then(function(res){
                    if(res.data.h.code =200 ) that.data = res.data.b;
                })
          }else if(this.type=='sex'){
              this.title = '性别选择';
                this.axios.get('/work/sex/type').then(function(res){
                    if(res.data.h.code =200 ){
                        that.data = res.data.b
                        if(that.$route.query.remove){
                            that.data.splice(that.data.length-1,1)
                        }
                    } 
                })
          }else if(this.type=='marriage'){
                this.title = '婚姻状况';
                this.axios.get('/work/marriage/type').then(function(res){
                    if(res.data.h.code =200 ) that.data = res.data.b;
                })
          }else if(this.type=='remind'){
                this.title = '提醒时间';
                this.axios.get('/agenda/remind/type').then(function(res){
                    if(res.data.h.code =200 ) that.data = res.data.b;
                })
          }else if(this.type=='meal'){
               this.title = '就餐类型';
                this.axios.get('/work/meal/type').then(function(res){
                    if(res.data.h.code =200 ) that.data = res.data.b;
                })
          }else if(this.type=="overtime"){
               this.title = '是否法定假日';
               that.data = [{key:'是',value:true},{key:'否',value:false}]
          }else if(this.type=="exposition"||this.type=="afterposition"){
                this.title = '部门';
                this.axios.get('/work/changeposition/offices?userId='+this.$route.query.userId).then(function(res){
                    if(res.data.h.code =200 ) that.data = res.data.b;
                })
         }else if(this.type=='isComplie'){
             this.title = '编制';
             that.data = [{key:'编制内',value:1},{key:'编制外',value:0}]
         }else if(this.type=='isPosition'){
             this.title = '岗位招聘';
             console.log('isComplie',this.isComplie)
             if(this.isComplie==1){//编制内
                    this.axios.get('/work/hrPositionInside/type').then(function(res){
                    //  console.log(res.data.b)
                        if(res.data.h.code =200 ) that.data = res.data.b;
                    })
             }else{//编制外
                 this.axios.get('/work/hrPosition/type').then(function(res){
                    //  console.log(res.data.b)
                        if(res.data.h.code =200 ) that.data = res.data.b;
                    })
             }
         }else if(this.type=='moveReason'){
                this.title = '异动原因';
                this.axios.get('/move/erpprimove/reason').then(function(res){
                    if(res.data.h.code =200 ) that.data = res.data.b;
                })
         }else if(this.type=="moveType"){
                this.title = '异动类型';
                this.axios.get('/move/erpprimove/type').then(function(res){
                    if(res.data.h.code =200 ) that.data = res.data.b;
                })
         }else if(this.type=='wantPri'){
                this.title = '权限';
                this.is_relative_approva.isShow = true;
                this.axios.get('/move/erpprimove/wantPri').then((res)=>{
                    let data = res.data.b;
                    let  arr= this.$route.query.indexs+'';
                    arr=arr.split('|')
                    data.forEach(element => {
                        element.choose = false;

                        arr.forEach(item=>{
                            if(item==element.value){
                                element.choose = true;
                            }
                        })
                    });
                    this.data= data;
            })
         }

          else{
           this.axios.get('/work/leave/type/list').then(function(res){
                if(res.data.h.code =200 ) that.data = res.data.b.data;
            })
          }
        },
        beforeDestroy() {
            this.updata();
        },

}
</script>


<style lang="stylus" scoped>
    .main{
        padding 0 0.15rem;
    }

    .list{
        //  -webkit-box-shadow: 0 0 0.2rem rgba(238,65,54,.1);    
        // box-shadow 0 0 0.2rem rgba(238,65,54,.1);
        background-color #fff;
    }

    li{
        height 0.43rem;
        line-height 0.43rem;
        font-size 0.15rem;
        padding-left 0.15rem;
        color #333;

        svg{
            float right;
            margin-top 0.14rem;
            margin-right 0.15rem;
        }
    }

    .li{
        border-bottom 1px solid  #e6e6e6;        
    }
</style>
