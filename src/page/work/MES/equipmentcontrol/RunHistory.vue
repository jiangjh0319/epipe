<template>
  <div class="run-histoty">
    <top-header title="运行历史"  bgcolor="#FD545C" native="native"></top-header>
    <div class="selection-wrapper">
      <div class="selection-bar">
        <div class="selection-item" :class="{'tab-active': contentType === 1}" @click="tabSelection(1)">
          <span v-if="selection.workshop">{{selection.workshop}}</span>
          <span v-else>车间</span>
        </div>
        <div class="selection-item" :class="{'tab-active': contentType === 2}" @click="tabSelection(2)">
          <span v-if="selection.workline">{{selection.workline}}</span>
          <span v-else>产线</span>
        </div>
        <div class="selection-item" :class="{'tab-active': contentType === 3}" @click="tabSelection(3)">
          <span v-if="date">{{date}}</span>
          <span v-else>日期</span>
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
        <div class="date-content" v-show="contentType === 3">
          <date-picker @childEvent="dateEvent"></date-picker>
        </div>
      </div>
    </div>
    <div class="content">
      <div class="result" v-if="machineList.length>0">
        <router-link :to="{path: '/machinelist',query:{id: item.machineId,workshopId:selection.workshopId,worklineId:selection.worklineId,name:item.machineName,workdate:selection.date}}" class="result-item" v-for="(item,index) in machineList" :key="index">
          <svg class="icon-machine" aria-hidden="false">
            <use xlink:href="#icon-shebei"></use>
          </svg>
          <div class="machine-name">{{item.machineName}}</div>
        </router-link>
      </div>
      <div class="no-result" v-else>
        <svg class="icon" aria-hidden="false" style="width:1.2rem;height:1.2rem;">
          <use xlink:href="#icon-chaxuntiaojian"></use>
        </svg>
        <p class="tips">点击条件删选进行查询</p>
      </div>
    </div>
    <footer>
      <footer>
        <router-link to="/warning" class="tab-item">
          <svg class="icon" aria-hidden="false">
            <use xlink:href="#icon-yujingbaojingline"></use>
          </svg>
          <p class="tab-title">预警报警</p>
        </router-link>
        <div class="tab-item">
          <svg class="icon" aria-hidden="false">
            <use xlink:href="#icon-yunhanglishiactive"></use>
          </svg>
          <p class="tab-title tab-active">运行历史</p>
        </div>
      </footer>
    </footer>
  </div>
</template>

<script>
  const TopHeader = () => import("../../../../components/topheader.vue");
  const DatePicker = () => import("../../../../components/DatePicker3.vue");
  export default {
    name: "RunHistory",
    components:{
      TopHeader,
      DatePicker
    },
    data(){
      return{
        showContent: true,
        contentType: 0,
        workshopList: [],
        worklineList: [],
        machineList: [],
        date: new Date().getFullYear()+"."+(new Date().getMonth()+1)+"."+new Date().getDate(),
        selection:{
          workshop: "",
          workshopId: "",
          workline: "",
          worklineId: "",
          date: new Date().getFullYear()+"."+(new Date().getMonth()+1)+"."+new Date().getDate(),
        }
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
    created(){
      this.getWorkshop();
    },
    methods:{
      /*选项卡切换*/
      tabSelection(index){
        if(index === 2 && !this.selection.workshop){
          this.$toast("请选择车间");
          return;
        }
        this.contentType = index;
        this.showContent = false;
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
        this.contentType = 0;
        this.showContent = true;
        this.selection.workline = this.worklineList[index].lineName;
        this.selection.worklineId = this.worklineList[index].lineId;
        sessionStorage.setItem("lineId",this.worklineList[index].lineId);
      },
      /*选择时间*/
      dateEvent(ms){
        let date = new Date(ms);
        this.date = date.getFullYear()+"."+(date.getMonth()+1)+"."+date.getDate()
        this.selection.date = date.getFullYear()+"-"+(date.getMonth()+1)+"-"+date.getDate();
        this.contentType = 0;
        this.showContent = true;
      },
      /*获取数据*/
      getData(selection){
        if(selection.worklineId){
          this.$mes.get("/common/machine",{
            lineId: selection.worklineId,
          }).then(res =>{
            console.log("设备列表",res);
            if(res.h.code === 200){
              this.machineList = res.b.list;
            }
          });
        }
      },
    }
  }
</script>

<style lang="stylus" scoped>
  .selection-wrapper{
    position relative;
    z-index 9;
    margin-top: 0.45rem;
    padding: 0.15rem;
  }
  .selection-bar{
    display flex;
    justify-content space-between;
    box-shadow: 0 0 20px rgba(253,84,92,0.1);
  }
  .selection-item{
    flex 1;
    height: 0.45rem;
    line-height 0.45rem;
    text-align center;
    font-size 0.17rem;
    color #333;
    white-space: nowrap;
    background: white;
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
  .content{
    position fixed;
    top: 1.17rem;
    left 0;
    width 100%;
  }
  .result{
    display flex;
    flex-wrap wrap;
    justify-content space-between;
    padding: 0 0.15rem;
  }
  .result-item{
    width: 1.08rem;
    height: 1.01rem;
    margin-bottom: 0.1rem;
    text-align center;
    background: white;
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
  .icon-machine{
    width:0.45rem;
    height:0.45rem;
    margin-bottom:0.1rem;
    margin-top: 0.15rem;
  }
  .machine-name{
    width: 100%;
    overflow hidden;
    white-space nowrap;
    text-overflow ellipsis;
    font-size 0.16rem;
    color: #333;
    // line-height: 1;
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
    color: #FD545C;
  }
</style>
