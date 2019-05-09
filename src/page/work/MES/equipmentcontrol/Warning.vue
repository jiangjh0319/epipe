<template>
  <div class="power-wrapper">
    <top-header title="预警报警" bgcolor="#FD545C" native="native"></top-header>
    <div class="selection-wrapper">
      <div class="selection-bar">
        <div class="container-left">
          <div class="selection-item" :class="{'tab-active':contentType === 1}" @click="tabSelection(1)">
            <span v-if="selection.workshop">{{selection.workshop}}</span>
            <span v-else>车间</span>
          </div>
          <div class="selection-item" :class="{'tab-active':contentType === 2}" @click="tabSelection(2)">
            <span v-if="selection.workline">{{selection.workline}}</span>
            <span v-else>产线</span>
          </div>
          <div class="selection-item" :class="{'tab-active':contentType === 3}" @click="tabSelection(3)">
            <span v-if="selection.machine">{{selection.machine}}</span>
            <span v-else>设备</span>
          </div>
        </div>
        <div class="container-right" @click="showIdSelect">
          <span>编号</span>
          <svg aria-hidden="false" class="arrow-down" :class="{'arrow-up':idSelect}">
            <use xlink:href="#icon-jiantou"></use>
          </svg>
        </div>
      </div>
      <div class="selection-content" v-show="!showContent">
        <div class="workshop-content" v-show="contentType === 1">
          <div class="choose-item" v-for="(item,index) in workshopList" :key="index" @click="selectWorkshop(index)">
            {{item.workshopName}}
          </div>
        </div>
        <div class="workline-content" v-show="contentType === 2">
          <div class="choose-item" v-for="(item,index) in worklineList" :key="index" @click="selectWorkline(index)">
            {{item.lineName}}
          </div>
        </div>
        <div class="machine-content" v-show="contentType === 3">
          <div class="choose-item" v-for="(item,index) in machineList" :key="index" @click="selectMachine(index)">
            {{item.machineName}}
          </div>
        </div>
      </div>
      <div class="mask" v-show="idSelect"></div>
    </div>
    <div class="id-select-wrapper" v-show="idSelect">
      <div class="search-bar">
        <input type="text" :class="{'input-active':searchNum}" placeholder="请输入设备编号" v-model="searchNum">
        <div class="btn-search">
          <span v-if="searchNum" @click="searchMachine">确定</span>
          <span v-else @click="closeIdSelect">取消</span>
        </div>
      </div>
    </div>
    <div class="content" v-show="showContent">
      <div v-if="!result">
        <div class="warn-wrapper" v-if="warn">
          <p class="warn-title">以下设备出现故障</p>
          <div class="warn-content">
            <router-link :to="{path:'/devicedetails',query:{machine:item.machineName,machineId:item.machineId,workshop:item.workshopName,line:item.lineName,workdate:item.latestTime.substring(0,10)}}" tag="div" class="result-item" v-for="(item,index) in warnList" :key="index">
              <svg class="icon" aria-hidden="false" style="width:0.45rem;height:0.45rem;margin-bottom:0.1rem;">
                <use xlink:href="#icon-shebei"></use>
              </svg>
              <div class="machine-name">{{item.machineName}}</div>
              <div class="machine-id">{{item.machineId}}</div>
            </router-link>
          </div>
        </div>
        <div class="no-result" v-else>
          <svg class="icon" aria-hidden="false" style="width:1.2rem;height:1.2rem;">
            <use xlink:href="#icon-chaxuntiaojian"></use>
          </svg>
          <p class="tips">输入工号或点击"更多"进行查询</p>
        </div>
      </div>
      <div class="result-content" v-else>
        <div class="result" v-if="resultList.length>0">
          <router-link  :to="{path:'/devicedetails',query:{machine:item.machineName,machineId:item.machineId,workshop:item.workshopName,line:item.lineName,workdate:item.latestTime.substring(0,10)}}" tag="div" class="result-item" v-for="(item,index) in resultList" :key="index">
            <svg class="icon" aria-hidden="false" style="width:0.45rem;height:0.45rem;margin-bottom:0.1rem;">
              <use xlink:href="#icon-shebei"></use>
            </svg>
            <div class="machine-name">{{item.machineName}}</div>
            <div class="machine-id">{{item.machineId}}</div>
          </router-link>
        </div>
        <div class="result-tips" v-else>
          暂无数据
        </div>
      </div>
    </div>
    <footer>
      <footer>
        <div class="tab-item">
          <svg class="icon" aria-hidden="false">
            <use xlink:href="#icon-yujingbaojingactive"></use>
          </svg>
          <p class="tab-title tab-active">预警报警</p>
        </div>
        <router-link to="/runhistory" tag="div" class="tab-item">
          <svg class="icon" aria-hidden="false">
            <use xlink:href="#icon-yunhanglishiline"></use>
          </svg>
          <p class="tab-title">运行历史</p>
        </router-link>
      </footer>
    </footer>
  </div>
</template>

<script>
  const TopHeader = () => import("../../../../components/topheader.vue");
  const DatePicker = () => import("../../../../components/DatePicker3.vue");
  export default{
    name: "Warning",
    components:{
      TopHeader,
      DatePicker
    },
    data(){
      return{
        result: false,
        workshopList: [],
        worklineList: [],
        machineList: [],
        resultList: [],
        warnList: [],
        showContent: true,
        idSelect: false,
        contentType: 0,
        searchNum: "",
        warn: false,
        selection:{
          workshop: "",
          workshopId: "",
          workline: "",
          worklineId: "",
          machine: "",
          machineId: ""
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
        if(index === 2 && !this.selection.workshop){
          this.$toast("请选择车间");
          return;
        }
        if(index === 3 && !this.selection.workline){
          this.$toast("请选择产线");
          return;
        }
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
            this.workshopList.unshift();
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
            this.worklineList.unshift();
          }
        });
      },
      /*获取设备*/
      getMachine(id){
        this.$mes.get("/common/machine",{
          lineId: id
        }).then(res =>{
          console.log("获取设备",res);
          if(res.h.code === 200){
            this.machineList = res.b.list;
            this.machineList.unshift({
              machineId: "",
              machineName: "所有设备"
            });
          }
        });
      },
      /*获取设备*/
      searchMachine(){
        console.log("搜索ID",this.searchNum);
        this.$mes.get("/device/warn",{
          deviceID: this.searchNum
        }).then(res =>{
          console.log("搜索结果",res);
          if(res.h.code === 200){
            this.resultList = res.b.list;
            this.result = true;
            this.closeIdSelect();
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
        this.getMachine(this.selection.worklineId);
      },
      /*选择设备*/
      selectMachine(index){
        this.selection.machine = this.machineList[index].machineName;
        this.selection.machineId = this.machineList[index].machineId;
        this.contentType = 0;
        this.showContent = true;
      },
      /*编号查询*/
      showIdSelect(){
        this.idSelect = !this.idSelect;
        this.showContent = !this.idSelect;
      },
      closeIdSelect(){
        this.idSelect = false;
        this.showContent = true;
      },
      /*获取数据*/
      getData(selection){
        if(!selection.worklineId){
          return
        }
        console.log("获取数据参数--workshopId:"+selection.workshopId+",lineId:"+selection.worklineId+",machineId:"+selection.machineId);
        this.$mes.get("/device/warn",{
          workShopId: selection.workshopId,
          lineId: selection.worklineId,
          machineId: selection.machineId
        }).then(res =>{
          console.log("设备预警",res);
          if(res.h.code === 200){
            this.result = true;
            this.resultList = res.b.list;
          }
        }).catch(err =>{

        });
      },
      /*获取报警状态*/
      getStatus(){
        this.$mes.get("/device/warn").then(res =>{
          console.log("设备预警状态",res);
          if(res.h.code === 200){
            this.warn = res.b.warnlist.length>0?true:false;
            this.warnList = res.b.warnlist;
          }
        }).catch(err =>{

        });
      },
      /*绘图*/
      echarts(params,type){
        var target  = document.querySelector(".result");
        if(type === 1){
          let el = echarts.init(target);
          el.clear();
          this.echartsLib.MutipleBars(el,params);
        }else{
          let el = echarts.init(target);
          el.clear();
          this.echartsLib.compare(el,params);
        }
      }
    },
    created(){
      this.getWorkshop();
      this.getStatus();
    },
  }
</script>

<style lang="stylus" scoped>
  .mask{
    z-index: 1;
    position: fixed;
    top: 0.44rem;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(44,44,44,0.3);
  }
  .selection-wrapper{
    position: fixed;
    top: 0.6rem;
    left: 0;
    width 100%;
    box-shadow: 0 0 20px rgba(253,84,92,0.1);
  }
  .selection-bar{
    display: flex;
    justify-content space-between;
    height: 0.45rem;
    background: transparent;
  }
  .container-left{
    display: flex;
    justify-content space-between;
    height: 0.45rem;
    width: 2.85rem;
    background: white;
  }
  .container-right{
    z-index: 9;
    width: 0.8rem;
    height: 0.45rem;
    line-height: 0.45rem;
    text-align center;
    font-size: 0;
    background: white;
    span{
      font-size: 0.17rem;
      color: #609DF6;
    }
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
  .workshop-content,.workline-content,.machine-content{
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
    display flex;
    justify-content space-between;
    flex-wrap: wrap;
    max-height: 4.5rem;
    width: 3.45rem;
    padding: 0.15rem 0;
    overflow-y auto;
    -webkit-overflow-scrolling: touch;
  }
  .result::-webkit-scrollbar{
    width 0;
    height 0;
  }
  .result-tips{
    text-align: center;
    padding-top: 1rem;
    font-size: 0.17rem;
    color: #999;
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
  .arrow-down{
    width: 0.08rem;
    height: 0.04rem;
    margin-left: 0.04rem;
    -webkit-transform: translateY(-50%);
    transform: translateY(-50%);
  }
  .arrow-up{
    transform: translateY(-50%) rotateZ(180deg);
  }
  .id-select-wrapper{
    position: relative;
    top: 1.05rem;
    padding: 0.15rem;
    background: white;
  }
  .search-bar{
    display flex;
    justify-content space-between;
    height: 0.45rem;
    input{
      box-sizing border-box;
      height: inherit;
      width: 2.69rem;
      padding: 0 0.1rem;
      border: 1px solid #ccc;
      border-bottom-left-radius 2px;
      border-top-left-radius 2px;
      outline none;
      background transparent;
      z-index 19;
      font-size: 0.16rem;
      color: #333;
    }
    .input-active{
      border: 1px solid #609DF6;
    }
    input::-webkit-input-placeholder{
      color: #999;
      font-size: 0.16rem;
    }
    .btn-search{
      z-index 19;
      width: 0.76rem;
      height: inherit;
      background: #609DF6;
      color: white;
      text-align center;
      font-size 0.17rem;
      line-height 0.45rem;
      border-bottom-right-radius 2px;
      border-top-right-radius 2px;
      span{
        display block;
        width inherit;
        height inherit;
      }
    }
  }
  .result-item{
    width:1.65rem;
    height: 0.95rem;
    padding: 0.15rem 0;
    margin-bottom: 0.12rem;
    text-align: center;
    font-size: 0.16rem;
    border: 1px solid #FD545C;
    border-radius: 2px;
    background: white;
    .machine-name{
      margin-bottom 0.1rem;
      line-height 1;
    }
    .machine-id{
      font-size: 0.14rem;
      line-height 1;
      color: #FF8800;
    }
  }
  .warn-wrapper{
    box-sizing border-box;
    position: fixed;
    top: 1.2rem;
    left: 0;
    width: 100%;
    max-height 4.8rem;
    padding: 0.15rem;
    background: white;
    overflow-y auto;
    -webkit-overflow-scrolling touch;
  }
  .warn-title{
    text-align center;
    font-size 0.16rem;
    color: #333;
    margin-bottom: 0.15rem;
  }
  .warn-content{
    display flex;
    justify-content space-between;
    flex-wrap: wrap;
  }
</style>
