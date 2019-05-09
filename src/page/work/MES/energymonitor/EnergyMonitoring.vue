<template>
  <div class="energy-monitoring">
    <top-header native="native" title="能源监控" bgcolor="#FF8800"></top-header>
    <div class="wrapper">
      <div class="content">
        <div class="content-item" id="power"></div>
        <div class="content-item" id="water"></div>
      </div>
    </div>
  </div>
</template>
<script>
  const TopHeader = () => import("../../../../components/topheader.vue");
  export default {
    name: "EnergyMonitoring",
    components:{
      TopHeader
    },
    methods:{
      getData(){
        this.$mes.get("/monitor/energy").then(res =>{
          console.log("能源监控",res);
          if(res.h.code === 200){
            let powerData_data = [];
            let waterData_data = [];
            res.b.powerData.map(function(item){
              powerData_data.push({
                value: item.fieldValue,
                name: item.fieldName
              })
            });
            res.b.waterData.map(function(item){
              waterData_data.push({
                value: item.fieldValue,
                name: item.fieldName
              })
            });
            let waterData = {
              data: waterData_data,
              title: res.b.waterFieldName+": "+res.b.waterFieldValue
            };
            let powerData = {
              data: powerData_data,
              title: res.b.powerFieldName+": "+res.b.powerFieldValue
            };
            setTimeout(() =>{
              let target_power = document.getElementById("power");
              let el_power = echarts.init(target_power);
              this.echartsLib.pie(el_power,powerData);

              let target_water = document.getElementById("water");
              let el_water = echarts.init(target_water);
              this.echartsLib.pie(el_water,waterData);
            },0)
          }
        })
      }
    },
    created(){
      this.getData();
    },
    mounted(){

    }
  }
</script>
<style lang="stylus" scoped>
  .wrapper{
    overflow auto;
    box-sizing border-box;
    position fixed;
    top: 0.45rem;
    left: 0;
    width: 100%;
    max-height: 6rem;
    padding: 0.15rem;
  }
  .wrapper::-webkit-scrollbar{
    width 0;
    height: 0;
  }
  .content-item{
    height: 3rem;
    margin-bottom: 0.15rem;
    padding: 0.15rem 0;
    background: white !important;
  }
</style>
