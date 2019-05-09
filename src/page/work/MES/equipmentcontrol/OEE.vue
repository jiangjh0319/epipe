<template>
  <div class="power-wrapper">
    <top-header title="OEE分析" bgcolor="#FD545C"></top-header>
    <div class="selection-wrapper">
      <div class="selection-bar">
        <div class="selection-item" :class="{'tab-active':contentType === 1}" @click="tabSelection(1)">
          <span v-if="selection.workshop">{{selection.workshop}}</span>
          <span v-else>车间</span>
        </div>
        <div class="selection-item" :class="{'tab-active':contentType === 2}" @click="tabSelection(2)">
          <span v-if="selection.workline">{{selection.workline}}</span>
          <span v-else>产线</span>
        </div>
        <div class="selection-item" :class="{'tab-active':contentType === 3}" @click="tabSelection(3)">
          <span v-if="selection.date">{{selection.date}}</span>
          <span v-else>日期</span>
        </div>
      </div>
      <div class="selection-content" v-show="!showContent">
        <div class="workshop-content" v-if="contentType === 1">
          <div class="choose-item" v-for="(item,index) in workshopList" :key="index" @click="selectWorkshop(index)">
            {{item.workshopName}}
          </div>
        </div>
        <div class="unit-content" v-if="contentType === 2">
          <div class="choose-item" v-for="(item,index) in worklineList" :key="index" @click="selectWorkline(index)">
            {{item.lineName}}
          </div>
        </div>
        <div class="date-content" v-if="contentType === 3">
          <date-picker @childEvent="dateEvent"></date-picker>
        </div>
      </div>
    </div>
    <div class="content" v-show="showContent">
      <div class="no-result" v-if="!result">
        <svg class="icon" aria-hidden="false" style="width:1.2rem;height:1.2rem;">
          <use xlink:href="#icon-chaxuntiaojian"></use>
        </svg>
        <p class="tips">输入工号或点击"更多"进行查询</p>
      </div>
      <div class="result" v-else>

      </div>
    </div>
    <footer>
      <footer>
        <router-link to="/materieldaily" tag="div" class="tab-item">
          <svg class="icon" aria-hidden="false">
            <use xlink:href="#icon-shuihaofenxiactive"></use>
          </svg>
          <p class="tab-title tab-active">水耗分析</p>
        </router-link>
        <router-link to="/power" tag="div" class="tab-item">
          <svg class="icon" aria-hidden="false">
            <use xlink:href="#icon-shuihaofenxiline"></use>
          </svg>
          <p class="tab-title">电耗分析</p>
        </router-link>
      </footer>
    </footer>
  </div>
</template>

<script>
  import TopHeader from "../../../../components/topheader.vue"
  import DatePicker from "../../../../components/DatePicker3.vue"
  export default{
    name: "OEE",
    components:{
      TopHeader,
      DatePicker
    },
    data(){
      return{
        result: false,
        workshopList: [],
        worklineList: [],
        showContent: true,
        contentType: 0,
        selection:{
          date: "",
          workshop: "",
          workshopId: "",
          workline: "",
          worklineId: ""
        },
      }
    },
    watch:{
      selection:{
        handler(curVal){
          this.getData(curVal);
        },
        deep:true
      }
    },
    methods:{
      tabSelection(index){
        this.contentType = index;
        this.showContent = false;
      },
      dateEvent(ms){
        let date = new Date(ms);
        this.selection.date = date.getFullYear()+"-"+(date.getMonth()+1)+"-"+date.getDate();
        this.contentType = 0;
        this.showContent = true;
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
      /*选择车间*/
      selectWorkshop(index){
        this.selection.workshop = this.workshopList[index].workshopName;
        this.selection.workshopId = this.workshopList[index].workShopId;
        this.contentType = 0;
        this.showContent = true;
        this.getWorkline(this.selection.workshopId);
      },
      /*选择产线*/
      selectWorkline(index){
        this.selection.workline = this.worklineList[index].lineName;
        this.selection.worklineId = this.worklineList[index].lineId;
        this.contentType = 0;
        this.showContent = true;
      },
      /*获取数据*/
      getData(selection){
        this.$mes.get("/device/oee",{
          workShopId: selection.workshopId,
          lineId: selection.worklineId
        }).then(res =>{

        }).catch(err =>{

        });
      },
      /*绘图*/
      echarts(params,type){
        var target  = document.querySelector(".result");
        if(type === 1){
          let el = this.$echarts.init(target);
          el.clear();
          this.echartsLib.MutipleBars(el,params);
        }else{
          let el = this.$echarts.init(target);
          el.clear();
          this.echartsLib.compare(el,params);
        }
      }
    },
    created(){
      this.getWorkshop();
    },
  }
</script>

<style lang="stylus">
  .selection-wrapper{
    position: fixed;
    top: 0.6rem;
    left: 0;
    right: 0;
    width 3.45rem;
    margin: 0 auto;
    background: white;
    box-shadow: 0 0 20px rgba(253,84,92,0.1);
  }
  .selection-bar{
    display: flex;
    justify-content space-between;
    height: 0.45rem;
    background: white;
  }
  .selection-item{
    flex: 1;
    height: 100%;
    line-height: 0.45rem;
    text-align: center;
    font-size: 0.17rem;
    color: #333;
    white-space: nowrap;
  }
  .selection-content{
    background: #fff;
    border-top: 1px solid #ebebeb;
  }
  .workshop-content,.unit-content{
    padding-left: 0.15rem;
  }
  .choose-item{
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 0.44rem;
    padding-right: 0.15rem;
    line-height: 0.44rem;
    font-size: 0.17rem;
    color: #333;
  }
  .choose-item:not(:last-child){
    border-bottom: 1px solid #ebebeb;
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
  .result{
    height: 4rem;
    width: 3.45rem;
    padding: 0.15rem 0;
    background: white !important;
  }
  .content{
    position fixed;
    top 1.2rem;
    left 0;
    right 0;
    width: 3.45rem;
    margin: 0 auto;
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
</style>
