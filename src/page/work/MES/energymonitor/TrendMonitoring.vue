<template>
  <div class="trend-monitoring">
    <top-header title="趋势监控" bgcolor="#609EF7" native="native"></top-header>
    <div class="wrapper">
      <div class="content">
        <div class="content-item" id="output" v-show="output"></div>
        <div class="content-item" id="materiel" v-show="materiel"></div>
        <div class="content-item" id="water" v-show="water"></div>
        <div class="content-item" id="power" v-show="power"></div>
        <div class="no-data" v-show="!output && !materiel && !water && !power">暂无数据</div>
      </div>
    </div>
  </div>
</template>
<script>
  const TopHeader = () => import("../../../../components/topheader.vue");
  export default{
    name: "TrendMonitor",
    data(){
      return{
        output: false,
        materiel: false,
        water: false,
        power: false,
      }
    },
    components:{
      TopHeader
    },
    methods:{
      /*获取数据*/
      getData(){
        this.$mes.get("/monitor/trend").then(res =>{
          console.log("趋势监控",res);
          if(res.h.code === 200){
            if(res.b.produceData.length > 0){
              this.output = true;
              let outputData = {
                title: "产出趋势",
                lines: ["产出趋势"],
                time: [],
                x_unit: "h",
                y_unit: "产出数量 (米)",
                outputQty: {
                  "outputQty0":[],
                },
                showLegend: false,
                color: '#9386E0',
              };
              res.b.produceData[0].data.map(function(item){
                outputData.time.push(item.workPeriod);
                outputData.outputQty['outputQty0'].push(item.outputQty);
              });
              setTimeout(() =>{
                this.echarts(document.getElementById("output"),outputData);
              },0);
            }
            if(res.b.materielData.length > 0){
              this.materiel = true;
              let materielData = {
                title: "物料消耗趋势",
                lines: ["物料消耗趋势"],
                time: [],
                x_unit: "h",
                y_unit: "物料消耗 (kg)",
                outputQty: {
                  "outputQty0":[],
                },
                showLegend: false,
                color: '#71D4F1',
              };
              res.b.materielData[0].data.map(function(item){
                materielData.time.push(item.workPeriod);
                materielData.outputQty['outputQty0'].push(item.outputQty);
              });
              setTimeout(() =>{
                this.echarts(document.getElementById("materiel"),materielData);
              },0);
            }
            if(res.b.waterData.length > 0){
              this.water = true;
              let waterData = {
                title: "水耗趋势",
                lines: ["水耗趋势"],
                time: [],
                x_unit: "h",
                y_unit: "水耗 (kg)",
                outputQty: {
                  "outputQty0":[],
                },
                showLegend: false,
                color: '#0fc37c',
              };
              res.b.waterData[0].data.map(function(item){
                waterData.time.push(item.workPeriod);
                waterData.outputQty['outputQty0'].push(item.outputQty);
              });
              setTimeout(() =>{
                this.echarts(document.getElementById("water"),waterData);
              },0);
            }
            if(res.b.powerData.length > 0){
              this.power = true;
              let powerData = {
                title: "电耗趋势",
                lines: ["电耗趋势"],
                time: [],
                x_unit: "h",
                y_unit: "电耗 (℃)",
                outputQty: {
                  "outputQty0":[],
                },
                showLegend: false,
                color: '#fc4b57',
              };
              res.b.powerData[0].data.map(function(item){
                powerData.time.push(item.workPeriod);
                powerData.outputQty['outputQty0'].push(item.outputQty);
              });
              setTimeout(() =>{
                this.echarts(document.getElementById("power"),powerData);
              },0);
            }
          }
        });
      },
      /*绘图*/
      echarts(target,data){
        let el = echarts.init(target);
        el.clear();
        this.echartsLib.lines(el,data);
      }
    },
    mounted(){
      this.getData();
    }
  }
</script>
<style lang="stylus" scoped>
  .wrapper{
    overflow-y auto;
    box-sizing border-box;
    position fixed;
    left 0;
    top 0.45rem;
    width 100%;
    max-height 6.2rem;
    padding 0.15rem;
  }
  .wrapper::-webkit-scrollbar{
    width 0;
    height 0;
  }
  .content-item{
    height 4rem;
    margin-bottom 0.15rem;
    padding-top 0.15rem;
    box-shadow 0 0 20px rgba(96,157,246,0.15);
    background white !important;
  }
  .no-data{
    width 100%;
    height 5rem;
    line-height 5rem;
    text-align center;
    font-size 0.16rem;
    color: #969696;
  }
</style>
