<template>
  <div class="details-wrapper">
    <top-header title="设备详情"  bgcolor="#FD545C"></top-header>
    <div class="content-wrapper">
      <div class="content">
        <div class="info">
          <div class="info-item">
            <span class="info-title">设备名称:</span>
            <span>{{machine}}</span>
          </div>
          <div class="info-item">
            <span class="info-title">设备编号:</span>
            <span class="info-number">{{machineId}}</span>
          </div>
          <div class="info-item">
            <span class="info-title">车间:</span>
            <span>{{workshop}}</span>
          </div>
          <div class="info-item">
            <span class="info-title">产线:</span>
            <span>{{workline}}</span>
          </div>
        </div>
        <div class="info-list">
          <router-link :to="{path:'/detailsinfo',query:{type:index,unit:item.parUnit,name:item.parName}}" class="list-item" v-for="(item,index) in list" :key="index">
            <div class="standard">
              <div class="standard-value">{{item.parAlarmUL}}</div>
              <div class="line"></div>
              <div class="standard-value">{{item.parAlarmLL}}</div>
            </div>
            <div style="margin-left: 0.2rem">
              <div class="list-value" :class="{'danger':parseInt(item.data[item.data.length-1].value)>parseInt(item.parAlarmUL)||parseInt(item.data[item.data.length-1].value)<parseInt(item.parAlarmLL)}">{{item.data[item.data.length-1].value}}</div>
              <div class="list-title">{{item.parName}}({{item.parUnit}})</div>
            </div>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  const TopHeader = () => import("../../../../components/topheader.vue");
  export default {
    name: "DeviceDetails",
    components:{
      TopHeader,
    },
    data(){
      return{
        workshop: "",
        workline: "",
        machine: "",
        machineId: "",
        workdate: "",
        list: [],
      }
    },
    created(){
      let $route = this.$route.query;
      this.workshop = $route.workshop;
      this.workline = $route.line;
      this.machine = $route.machine;
      this.machineId = $route.machineId;
      this.workdate = $route.workdate;
      this.getStatus(this.machineId,this.workdate);
      sessionStorage.setItem("workdate",this.workdate);
      sessionStorage.setItem("machineId",this.machineId);
      sessionStorage.setItem("machine",this.machine);
    },
    methods:{
      getStatus(id,workdate){
        this.$mes.get("/device/realtime_data",{
          machineId: id,
          workDate: workdate
        }).then(res =>{
          console.log("设备详情",res);
          if(res.h.code === 200){
            this.list = res.b.list;
          }
        });
      }
    }
  }
</script>
<style lang="stylus" scoped>
  .content-wrapper{
    position fixed;
    top: 0.45rem;
    padding: 0.15rem;
  }
  .content{
    padding: 0.15rem 0.1rem;
    background: white;
  }
  .info{
    margin-bottom 0.15rem;
    border-bottom: 1px solid #ccc;
  }
  .info-item{
    font-size: 0.16rem;
    line-height 1;
    color: #333;
  }
  .info-item:not(:last-child){
    margin-bottom: 0.1rem;
  }
  .info-item:last-child{
    margin-bottom: 0.15rem;
  }
  .info-title{
    color: #666;
  }
  .info-number{
    color: #FF8800;
  }
  .info-list{
    display flex;
    justify-content space-between;
    flex-wrap wrap;
    width: 3.24rem;
  }
  .list-item{
    position relative;
    box-sizing border-box;
    width: 1.57rem;
    height: 1.01rem;
    padding: 0.15rem 0.1rem;
    margin-bottom: 0.1rem;
    border: 1px solid #E6E6E6;
    border-radius: 4px;
  }
  .standard{
    position absolute;
    left 0.1rem;
    top 0.15rem;
    text-align center;
    font-size: 0.13rem;
    line-height 1;
    color: #666;
    .line{
      width: 1px;
      height: 0.13rem;
      margin: 0.05rem auto;
      background: #666;
    }
  }
  .list-value{
    box-sizing border-box;
    width: 0.55rem;
    height: 0.55rem;
    margin: 0 auto;
    margin-top: -0.05rem;
    text-align center;
    line-height 0.51rem;
    background: white;
    border: 0.02rem solid #0FC37C;
    border-radius: 50%;
    font-size: 0.16rem;
    color: #333;
  }
  .list-title{
    margin-top: 0.05rem;
    text-align center;
    font-size: 0.16rem;
    color: #333;
    line-height 1;
  }
  .danger{
    background: #FD5457;
    color: white;
    border: none;
    line-height: 0.55rem;
  }
</style>
