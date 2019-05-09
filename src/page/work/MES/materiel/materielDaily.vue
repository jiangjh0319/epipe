<template>
  <div class="materiel-wrapper">
    <top-header bgcolor="#ff8800" title="消耗日报" native="native"></top-header>
    <div class="selection-wrapper">
      <div class="selections">
        <div class="selections-title" :class="{'selections-title-active':tabItem === 1}" @click="tabSelection(1)">
          <span v-if="selection.materiel">{{selection.materiel}}</span>
          <span v-else>物料</span>
        </div>
        <div class="selections-title" :class="{'selections-title-active':tabItem === 2}" @click="tabSelection(2)">
          <span v-if="selection.workshop">{{selection.workshop}}</span>
          <span v-else>车间</span>
        </div>
        <div class="selections-title" :class="{'selections-title-active':tabItem === 3}" @click="tabSelection(3)">
          <span v-if="selection.workline">{{selection.workline}}</span>
          <span v-else>产线</span>
        </div>
        <div class="selections-title" :class="{'selections-title-active':tabItem === 4}" @click="tabSelection(4)">
          <span v-if="date">{{date}}</span>
          <span v-else>日期</span>
        </div>
      </div>
      <div class="selections-content">
        <div class="materiel-content" v-show="tabItem === 1">
          <div class="content-item" v-for="(item,index) in materielList" :key="index" @click="materielSelect(index)">{{item.compName}}</div>
        </div>
        <div class="workshop-content" v-show="tabItem === 2">
          <div class="content-item" v-for="(item,index) in workshopList" :key="index" @click="workshopSelect(index)">{{item.workshopName}}</div>
        </div>
        <div class="workline-content" v-show="tabItem === 3">
          <div class="content-item" v-for="(item,index) in worklineList" :key="index" @click="worklineSelect(index)">{{item.lineName}}</div>
        </div>
        <div class="date-wrapper" v-show="tabItem === 4">
          <date-picker @childEvent="dateEvent"></date-picker>
        </div>
      </div>
    </div>
    <div class="content" v-show="showContent">
      <div class="no-result" v-if="!result">
        <svg class="icon" aria-hidden="false" style="width:1.2rem;height:1.2rem;">
          <use xlink:href="#icon-chaxuntiaojian"></use>
        </svg>
        <p class="tips">点击条件删选进行查询</p>
      </div>
      <div class="result-wrapper" v-else>
        <div class="result" ref="result" v-for="(item,index) in length" :key="index"></div>
      </div>
    </div>
    <footer>
      <div class="tab-item">
        <svg class="icon" aria-hidden="false">
          <use xlink:href="#icon-xiaohaoribaoactive"></use>
        </svg>
        <p class="tab-title tab-active">消耗日报</p>
      </div>
      <router-link to="materielcount" tag="div" class="tab-item">
        <svg class="icon" aria-hidden="false">
          <use xlink:href="#icon-xiaohaotongji"></use>
        </svg>
        <p class="tab-title">消耗统计</p>
      </router-link>
    </footer>
  </div>
</template>

<script>
  const TopHeader = () => import("../../../../components/topheader.vue");
  const DatePicker = () => import("../../../../components/DatePicker3.vue");
  export default{
    name: "MaterielDaily",
    components:{
      TopHeader,
      DatePicker
    },
    data(){
      return{
        tabItem: 0,
        materielList: [],
        workshopList: [],
        worklineList: [],
        date: "",
        selection:{
          materiel: "",
          materielId: "",
          workshop: "",
          workshopId: "",
          workline: "",
          worklineId: "",
          date: ""
        },
        result: false,
        length: 0,
        showContent: true,
      }
    },
    watch:{
      selection:{
        handler(curVal){
          console.log("选择条件发生变化",curVal);
          this.getData(curVal);
          this.showContent =  true;
        },
        deep:true
      }
    },
    created(){
      this.getMateriel();
      this.getWorkshop();
    },
    methods:{
      tabSelection(index){
        if(index === 3 && !this.selection.workshop){
          this.$toast("请选择车间");
          return;
        }
        this.tabItem = index;
        this.showContent = false;
      },
      dateEvent(ms){
        let date = new Date(ms);
        this.selection.date = date.getFullYear()+"-"+(date.getMonth()+1)+"-"+date.getDate();
        this.date = (date.getMonth()+1)+"-"+date.getDate();
        this.tabItem = 0;
        this.showContent = true;
      },
      /*选择物料*/
      materielSelect(index){
        this.tabItem = 0;
        this.selection.materiel = this.materielList[index].compName;
        this.selection.materielId = this.materielList[index].compId;
      },
      /*选择车间*/
      workshopSelect(index){
        this.tabItem = 0;
        this.selection.workshop = this.workshopList[index].workshopName;
        this.selection.workshopId = this.workshopList[index].workShopId;
        this.getWorkline(this.selection.workshopId);
        console.log("车间Id",this.selection.workshopId);
      },
      /*选择产线*/
      worklineSelect(index){
        this.tabItem = 0;
        this.selection.workline = this.worklineList[index].lineName;
        this.selection.worklineId = this.worklineList[index].lineId;
      },
      /*获取物料*/
      getMateriel(){
        this.$mes.get("/common/comp").then(res =>{
          console.log("获取物料",res);
          if(res.h.code === 200){
            this.materielList = res.b.list;
            this.materielList.unshift({
              compId: "",
              compName: "所有产品"
            });
          }
        });
      },
      /*获取车间*/
      getWorkshop(){
        this.$mes.get("/common/workshop").then(res =>{
          console.log("获取车间",res);
          if(res.h.code === 200){
            this.workshopList = res.b.list;
            this.workshopList.unshift({
              workShopId: "",
              workshopName: "所有车间"
            });
          }
        });
      },
      /*获取产线*/
      getWorkline(id){
        this.$mes.get("/common/line",{
          workShopId: id
        }).then(res =>{
          console.log("获取产线",res);
          if(res.h.code === 200){
            this.worklineList = res.b.list;
            this.worklineList.unshift({
              lineId: "",
              lineName: "所有产线"
            });
          }
        });
      },
      /*消耗日报*/
      getData(obj){
        let params = {
          compId: obj.materielId?obj.materielId:"",
          workShopId: obj.workshopId?obj.workshopId:"",
          lineId: obj.worklineId?obj.worklineId:"",
          workDate: obj.date?obj.date:""
        };
        console.log(params);
        if(obj.date){
          this.$mes.get("/materiel/consume/day",params).then(res =>{
            console.log("消耗日报",res);
            if(res.h.code == 200){
              if(res.b.length <1){
                this.$toast("暂无数据");
              }
              this.result = true;
              this.length = res.b.length;
              for(let i=0;i<res.b.length;i++){
                let data = {
                  lines: [],
                  time: {},
                  outputQty: {},
                  title: "",
                };
                if(res.b[i].compName){
                  data.lines.push(res.b[i].compName);
                }
                let _outputQty = "outputQty"+i;
                let outputQty = [];
                res.b[i].data.map(function(item){
                  outputQty.push(item.outputQty);
                });
                data.outputQty[_outputQty] = outputQty;
                data.title = res.b[i].workshopName+res.b[i].lineName;
                setTimeout(()=>{
                  let target = this.$refs.result[i];
                  this.echarts(target,data);
                },0);
              }
            }
          }).catch(err =>{
            this.$toast("网络请求错误");
          });
        }
      },
      /*绘图*/
      echarts(target,data){
        let el = echarts.init(target);
        this.echartsLib.lines(el,data);
      }
    },
  }
</script>

<style lang="stylus">
  .selection-wrapper{
    margin-top 0.6rem;
  }
  .selections{
    display flex;
    justify-content space-between;
    align-items center;
    width: 100%;
    height: 0.45rem;
    background: white;
    color: #333;
    font-size 0.17rem;
    box-shadow: 0 0 20px rgba(255,136,0,0.1);
  }
  .selections-title{
    flex: 1;
    height: 0.45rem;
    line-height 0.45rem;
    text-align center;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .selections-title-active{
    color: #ff8800;
  }
  .selections-content{
    padding-left 0.15rem;
    background white;
    border-top: 1px solid #ebebeb;
    box-shadow: 0 5px 15px rgba(255,136,0,0.1);
  }
  .content-item{
    height: 0.45rem;
    line-height 0.45rem;
  }
  .content-item:not(:last-child){
    border-bottom: 1px solid #ebebeb;
  }
  .date-wrapper{
    margin-left -0.15rem;
  }
  footer{
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    padding: 6px 0;
    display: flex;
    justify-content space-between;
    background: white;
  }
  .tab-item{
    flex: 1;
    text-align center;
  }
  .icon{
    width: 22px;
    height: 22px;
  }
  .tab-title{
    font-size: 11px;
    color: #999999;
  }
  .tab-active{
    color: #ff8800;
  }
  .no-result{
    margin-top 1.17rem;
    text-align center;
    .tips{
      margin-top: 0.1rem;
      font-size 0.17rem;
      color: #666;
    }
  }
  .result-wrapper{
    position: fixed;
    left: 0;
    top: 1.1rem;
    width: 100%;
    max-height: 5rem;
    overflow-y: auto;
  }
  .result{
    height: 4rem;
    padding: 0.1rem 0;
    margin-bottom: 0.2rem;
    background: white !important;
  }
</style>
