<template>
  <div class="details-info-wrapper">
    <top-header :title="title"  bgcolor="#FD545C"></top-header>
    <div class="container">
      <div class="content">
        <div class="content-title"></div>
        <div class="echarts-wrapper">
          <div class="echarts"></div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  const TopHeader = () => import("../../../../components/topheader.vue");
  export default{
    name: "DetailsInfo",
    components:{
      TopHeader,
    },
    data(){
      return{
        workdate: "",
        machineId: "",
        machine: "",
        index: 0,
        object: {},
        unit: "",
        name: "",
        title: ""
      }
    },
    created(){
      this.index = this.$route.query.type;
      this.unit = this.$route.query.unit;
      this.name = this.$route.query.name;
      this.machineId = sessionStorage.getItem("machineId");
      this.machine = sessionStorage.getItem("machine");
      this.workdate = sessionStorage.getItem("workdate");
    },
    mounted(){
      this.getData(this.machineId,this.workdate);
    },
    methods:{
      getData(id,workdate){
        this.$mes.get("/device/realtime_data",{
          machineId: id,
          workDate: workdate
        }).then(res =>{
          console.log("设备详情信息",res);
          if(res.h.code === 200){
            this.object = res.b.list[this.index];
            this.title = this.machine + "-" + this.object.parName;
            let data = {
              lines: [this.name],
              time: [],
              x_unit: "min",
              y_unit: "单位/"+this.unit,
              outputQty: {
                "outputQty0":[],
              },
              parAlarmUL:this.object.parAlarmUL,
              parAlarmLL:this.object.parAlarmLL
            };
            this.object.data.map(function(item,index){
              data.time.push(item.time.substring(11,16));
              data.outputQty["outputQty0"].push(item.value);
            });
            setTimeout(()=>{
              this.echarts(data);
            },0);
          }
        });
      },
      /*绘图*/
      echarts(data){
        let target =  document.querySelector(".echarts");
        let el = echarts.init(target);
        el.clear();
        console.log(data)
        this.echartsLib.lines(el,data);
      }
    }
  }
</script>
<style lang="stylus" scoped>
  .echarts-wrapper{
    margin-top: 0.6rem;
    padding-bottom 0.15rem;
    background: white !important;
  }
  .echarts{
    height: 4rem;
  }
</style>
