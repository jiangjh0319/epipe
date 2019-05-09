<template>
  <div class="output-daily">
    <top-header bgcolor="#609EF7" title="良率日报" native="native"></top-header>
    <selection-bar ref="selection" :msg="dailydata" color="#609ef7" @childEvent="showContent" @emitGetData="getData" @emitSearch="search"></selection-bar>
    <div class="content-wrapper" v-show="content">
      <div class="current-selections" v-show="workshop || workline || product || date">
        <div class="current-selections-content">
          <span class="workshop">{{workshop}}</span>
          >
          <span class="workline">{{workline}}</span>
          >
          <span class="product">{{product}}</span>
          >
          <span class="date">{{date}}</span>
          <div class="icon-close-container" @click="close()">
            <svg class="icon icon-close" aria-hidden="false">
              <use xlink:href="#icon-guanbi"></use>
            </svg>
          </div>
        </div>
      </div>
      <div class="content">
        <div class="no-result" v-if="!result">
          <svg class="icon" aria-hidden="false" style="width:1.2rem;height:1.2rem;">
            <use xlink:href="#icon-chaxuntiaojian"></use>
          </svg>
          <p class="tips">输入工号或点击"更多"进行查询</p>
        </div>
        <div class="result-wrapper" :class="{'no-selection': no_selection}" v-else>
          <div class="result" v-for="(item,index) in result_length" :key="index">
            <div class="product-name">{{products[index]}}</div>
            <div class="my-echarts" ref="echarts" :id="index"></div>
            <div class="information-wrapper">
              <div class="info-item">
                <p><span class="info-title">抽检数:</span> <span class="info-number info-orange">{{checkList[index]}}</span></p>
                <p><span class="info-title">良品数:</span> <span class="info-number info-blue">{{goodList[index]}}</span></p>
              </div>
              <div class="flex-item">
                <p><span class="info-title">良率:</span> <span class="info-number info-green">{{goodRateList[index]}}</span></p>
                <p><span class="info-title">不良品数:</span> <span class="info-number info-red">{{badList[index]}}</span></p>
              </div>
              <div class="flex-item">
                <p><span class="info-title">产量:</span> <span class="info-number info-lightblue">{{totalList[index]}}</span></p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <footer>
      <div class="tab-item">
        <svg class="icon" aria-hidden="false">
          <use xlink:href="#icon-liangshuairibaoactive"></use>
        </svg>
        <p class="tab-title tab-active">良率日报</p>
      </div>
      <router-link to="/qualitycount" tag="div" class="tab-item">
        <svg class="icon" aria-hidden="false">
          <use xlink:href="#icon-liangshuaitongji"></use>
        </svg>
        <p class="tab-title">良率统计</p>
      </router-link>
    </footer>
  </div>
</template>

<script>
  const TopHeader = () => import("../../../../components/topheader.vue");
  const SelectionBar = () => import("../../../../components/MES/SelectionBar.vue");
  export default{
    name: 'QualityDaily',
    components:{
      TopHeader,
      SelectionBar,
    },
    data(){
      return{
        module: "daily",
        content: true,
        dailydata:{
          workshop: "",
          workshop_id: 0,
          workline: "",
          workline_id: 0,
          product: "",
          product_id: 0,
          date: "",
          no: "",
        },
        workshop: "",
        workshops: [],
        workline: "",
        worklines: [],
        product: "",
        products: [],
        date: "",
        result: false,
        result_length: 0,
        workno: "",
        workdate: "",
        client: "",
        no_selection: false,
        checkList: [],
        goodList: [],
        goodRateList: [],
        badList: [],
        badRateList: [],
        totalList: [],
      }
    },
    watch:{
      dailydata:{
        handler(curVal,oldVal){
          this.workshops = [],
          this.worklines = [];
          this.products = [];
          this.checkList = [];
          this.goodList = [];
          this.goodRateList = [];
          this.badList = [];
          this.badRateList = [];
          this.totalList = [];
          this.fn(curVal);
        },
        deep:true
      }
    },
    methods:{
      fn(obj){
        this.workshop = obj.workshop?obj.workshop:"所有车间";
        this.workline = obj.workline?obj.workline:"所有产线";
        this.product = obj.product?obj.product:"所有产品";
        this.date = obj.date?obj.date:new Date().getFullYear()+"-"+(new Date().getMonth()+1)+"-"+new Date().getDate();
//        this.result = true;
//        this.no_selection = false;
//        console.log("数据更新",obj);
//        this.getData(obj);
      },
      close(){
        let $ref = this.$refs.selection.store;
        this.workshop = this.workline = this.product = this.date = "";
        $ref.workshop = $ref.workline = $ref.product =  $ref.date = "";
        this.result = false;
      },
      /*echarts图表*/
      echarts(target,param){
        let el = echarts.init(target);
        this.echartsLib.Bars(el,param);
      },
      /*获取数据*/
      getData(obj) {
        let params = {
          woNo: obj.no?obj.no:"",
          workShopId: obj.workshop_id?obj.workshop_id:"",
          lineId: obj.workline_id?obj.workline_id:"",
          partId:obj.product_id?obj.product_id:"",
          workDate: this.date
        };
        console.log(params);
        this.$mes.get("/quality/day",params).then(res =>{
          console.log("良率日报",res);
          if(res.h.code === 200){
            let vm = this;
            this.result = true;
            this.result_length = res.b.list.length;
            if(res.b.list.length>0){
              res.b.list.map(function(item){
                vm.worklines.push(item.lineName);
                vm.workshops.push(item.workshopName);
                vm.goodRateList.push(item.yield);
                vm.goodList.push(item.passQty);
                vm.checkList.push(item.sampQty);
                vm.totalList.push(item.outputQty);
                vm.products.push(item.partName);
                vm.badList.push(item.failQty);
              });
              setTimeout(()=>{
                for(let i=0;i<this.result_length;i++){
                  let params = this.setParams(res.b.list[i]);
                  this.echarts(this.$refs.echarts[i],params);
                }
              },0);
            }else{
              this.$toast("暂无数据");
            }
          }
        });
      },
      /*显示或隐藏内容区域*/
      showContent(val){
        this.content = val;
      },
      /*设置echarts参数*/
      setParams(param){
        let _xAxis = ["良品数","不良品数"];
        let _series = [{
          name: '计划',
          type: 'bar',
          stack: '计划',
          barWidth: 20,
          data: [param.passQty,param.failQty],
          itemStyle: {
            normal: {
              label: {
                show: true,
                position: "top",
              },
              color: function(params){
                let colors = ['#00a0b0','#FD545C'];
                return colors[params.dataIndex];
              },
              barBorderRadius: [500, 500, 0, 0]
            }
          }
        }];
        let params = {
          title: "质检良率详情",
          type: ["bar","bar"],
          xAxis: _xAxis,
          yAxis:[{
            type: 'value',
            name: '单位/米',
            nameTextStyle: {
              color: ['#333333'],
              fontSize: 12
            },
            axisLine: { //控制x轴
              lineStyle: {
                color: '#ccc',
                shadowOffsetX: 0
              }
            },
            splitLine: {
              show: false
            },
            axisTick: { //控制y轴刻度
              show: false,
            },
            axisLabel: { //控制刻度标签
              color: '#666',
            },
          },
          {
            type: 'value',
            name: '达成率%',
            min: 0,
            max: 100,
            nameTextStyle: {
              color: ['#333333'],
              fontSize: 12
            },
            axisLine: { //控制x轴
              lineStyle: {
                color: '#ccc',
                shadowOffsetX: 0
              }
            },
            splitLine: {
              show: false, //是否显示y轴指示线
            },
            axisLabel: {
              formatter: '{value}%'
            },
            axisTick: { //控制y轴刻度
              show: false,
            },
            axisLabel: { //控制刻度标签
              color: '#666',
            },
          }],
          series: _series,
        };
        return params;
      },
      /*订单查询*/
      search(val){
        let obj = {
          no: val
        };
        this.workno = val;
        this.no_selection = true;
        this.getData(obj);
      }
    },
    mounted(){

    },
  }
</script>

<style lang="stylus" scoped>
  .no-result{
    margin-top 2.17rem;
    text-align center;
    .tips{
      margin-top: 0.1rem;
      font-size 0.17rem;
      color: #666;
    }
  }
  .current-selections{
    box-sizing: border-box;
    z-index: 1;
    position: fixed;
    left: 0;
    right: 0;
    top: 1.15rem;
    width: 3.45rem;
    height: 0.4rem;
    margin: auto;
    padding: 0 0.15rem;
    line-height: 0.4rem;
    font-size: 0.13rem;
    color: #666;
    border-radius: 0.02rem;
    background: white;
    box-shadow: 0 0 20px rgba(15,194,124,0.15);
  }
  .current-selections-content{
    position relative;
    width 100%
    height 100%;
  }
  .icon-close-container{
    position: absolute;
    right: -0.15rem;
    top: -0.05rem;
  }
  .icon-close{
    width: 0.22rem;
    height: 0.22rem;
  }
  .my-echarts{
    height: 3rem;
  }
  .result-wrapper{
    z-index 5;
    overflow-y auto;
    position fixed;
    left 0;
    right 0;
    top: 1.7rem;
    width 3.45rem;
    max-height 4.3rem;
    margin 0 auto;
  }
  .result{
    position: relative;
    padding-top: 0.4rem;
    box-shadow: rgba(15, 194, 124, 0.15) 0px 0px 20px;
    margin-bottom 0.15rem;
    background: white;
  }
  .product-name{
    position: absolute;
    top:0;
    left:0;
    width: 0.6rem;
    height: 0.27rem;
    border-bottom-right-radius: 0.1rem;
    background: #DADADA;
    color: #333;
    text-align: center;
    line-height: 0.27rem;
    font-size: 0.13rem;
  }
  .my-selections{
    padding: 0.1rem 0;
    margin: 0 0.15rem;
    margin-bottom: 0.1rem;
    border-bottom: 1px solid #EBEBEB;
    p{
      font-size 0.16rem;
      line-height 1.8;
      color #333;
    }
  }
  .information-wrapper{
    display: flex;
    justify-content space-around;
    padding-bottom 0.2rem;
  }
  .info-item{
    height: 0.2rem;
    line-height: 0.2rem;
    font-size 0.13rem;
  }
  .info-title{
    display inline-block;
    text-align right;
    color: #333;
  }
  .info-number{
    width: 3em;
    text-align left;
  }
  .info-green{
    color: #0fc37c;
  }
  .info-blue{
    color: #00a0b0;
  }
  .info-orange{
    color: #ff8800;
  }
  .info-red{
    color: #fd545c;
  }
  .info-lightblue{
   color: #609EF7;
  }
  .no-selection{
    top: 1.15rem;
    max-height: 4.9rem;
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
    color: #609EF7;
  }
</style>
