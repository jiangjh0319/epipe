<template>
  <div class="details-list-wrapper">
    <top-header title="详情"  bgcolor="#FD545C"></top-header>
    <div class="content-wrapper">
      <div class="content">
        <div class="content-item" v-for="(item,index) in list">
          <div class="item-info">
            <p>时间: {{workdate}}</p>
            <p>参数: {{item.parName}}</p>
          </div>
          <div class="lines-content"></div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  const TopHeader = () => import("../../../../components/topheader.vue");
  export default{
    name: "DetailsList",
    components:{
      TopHeader
    },
    data(){
      return{
        workdate: "",
        machineId: "",
        workshopId:'',
        linedata:'',
        list: [],
      }
    },
    created(){
      this.workdate = this.$route.query.workdate;
      this.linedata = this.$route.query.worklineId;
      this.workshopId = this.$route.query.workshopId; 
      this.machineId = this.$route.query.id;
      this.getData(this.machineId,this.workshopId,this.linedata,this.workdate);
      console.log({
        id: this.machineId,
        date: this.workdate
      });
    },
    methods:{
      getData(id,workshopId,linedata,workdate){
        if(id){
          this.$mes.get("/device/realtime_data",{
            machineId: id,
            workShopId:workshopId,
            lineId:linedata,
            workDate: workdate
          }).then(res =>{
            console.log("详情列表",res);
            if(res.h.code === 200){
              this.list = res.b.list;
              let vm = this;
              res.b.list.map(function(item,index){
                let data = {
                  lines: [item.parName],
                  time: [],
                  parAlarmUL:item.parAlarmUL,
                  parAlarmLL:item.parAlarmLL,
                  x_unit: "min",
                  y_unit: "单位/"+item.parUnit,
                  outputQty: {
                    "outputQty0":[],
                  },
                };
                item.data.map(function(item,index){
                  data.time.push(item.time.substring(11,16));
                  data.outputQty["outputQty0"].push(item.value);
                });
                setTimeout(()=>{
                  let target =  document.querySelectorAll(".lines-content")[index];
                  vm.echarts(data,target);
                },0);
              });
            }
          })
        }
      },
      /*绘图*/
      echarts(data,target){
        let el = echarts.init(target);
        el.clear();
        this.echartsLib.lines(el,data);
      }
    }
  }
</script>

<style lang="stylus" scoped>
  .content-wrapper{
    box-sizing border-box;
    position fixed;
    top 0.45rem;
    left 0;
    width 100%;
    padding 0.1rem 0.15rem;
  }
  .content{
    max-height 6.05rem;
    overflow-y auto;
  }
  .content::-webkit-scrollbar{
    width 0;
    height: 0;
  }
  .content-item{
    background: white;
    padding 0.1rem 0.15rem;
    margin-bottom 0.15rem;
    box-shadow 0 0 10px rgba(253,84,92,0.1);
  }
  .item-info{
    border-bottom: 1px solid #eee;
    p{
      font-size: 0.16rem;
      color: #333;
      line-height 0.34rem;
    }
  }
  .lines-content{
    height: 4rem;
  }
</style>
