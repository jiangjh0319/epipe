<template>
  <div class="output-live">
    <top-header bgcolor="#499844" title="产出看板" native="native"></top-header>
    <div class="selections">
      <div class="selection-tabs">
        <div class="selection" :class="{'selection-active': tabItem === 1}" @click="tab(1)">{{selection.workshop}}</div>
        <div class="selection" :class="{'selection-active': tabItem === 2}" @click="tab(2)">{{selection.workline}}</div>
        <div class="selection" :class="{'selection-active': tabItem === 3}" @click="tab(3)">
          <span v-if="currentDate">{{currentDate.year}}-{{currentDate.month}}-{{currentDate.day}}</span>
          <span v-else>日期</span>
        </div>
        <div class="selection" :class="{'selection-active': tabItem === 2}" @click="tab(4)">{{selection.shift}}</div>
      </div>
      <div class="selections-items" v-show="mask">
        <div class="workshop" v-show="tabItem === 1">
          <div class="selection-item" v-for="(item,index) in workshop_arr" :key="index" @click="workshopSelect(index)">
            {{item.workshopName}}
          </div>
        </div>
        <div class="workline" v-show="tabItem === 2">
          <div class="selection-item" v-for="(item,index) in workline_arr" :key="index" @click="worklineSelect(index)">
            {{item.lineName}}
          </div>
        </div>
        <div class="workdate" v-show="tabItem === 3" style="margin-left: -0.15rem;">
          <div class="date-picker" style="background: white;">
            <div class="current-date" style="display: flex;justify-content: space-around;height:0.45rem;line-height: 0.45rem;text-align: center;border-bottom: 1px solid #ebebeb;">
              <div class="icon-container" style="width: 1rem;" @click="lastMonth">
                <svg class="icon" aria-hidden="false">
                  <use xlink:href="#icon-zuoyoujiantou"></use>
                </svg>
              </div>
              <div class="date">{{dateObj.year}}年{{dateObj.month}}月</div>
              <div class="icon-container" style="width: 1rem; transform: rotate(180deg)" @click="nextMonth">
                <svg class="icon" aria-hidden="false">
                  <use xlink:href="#icon-zuoyoujiantou"></use>
                </svg>
              </div>
            </div>
            <div class="date-content">
              <ul class="day-list" style="display: flex;justify-content: space-around;height:0.45rem;line-height: 0.45rem;">
                <div class="day-item">一</div>
                <div class="day-item">二</div>
                <div class="day-item">三</div>
                <div class="day-item">四</div>
                <div class="day-item">五</div>
                <div class="day-item">六</div>
                <div class="day-item">日</div>
              </ul>
              <div class="date-list" style="display: flex;flex-wrap: wrap;padding: 0.1rem 0;">
                <div class="date-item" v-for="(item,index) in days" :key="index" @click="pickDate(index)" style="width:14.28%;height:0.34rem;line-height: 0.34rem;text-align: center;">
                  <div :class="{active: (item === currentDate.day && dateObj.year === currentDate.year && dateObj.month === currentDate.month )}">{{item}}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="workline" v-show="tabItem === 4">
          <div class="selection-item" v-for="(item,index) in shift_arr" :key="index" @click="shiftSelect(index)">
            {{item.shiftName}}
          </div>
        </div>
      </div>
    </div>
    <div class="content" :class="{'content-bg':result}" v-show="showContent">
      <div class="no-result" v-if="!result">
        <svg class="icon" aria-hidden="false" style="width:1.2rem;height:1.2rem;">
          <use xlink:href="#icon-chaxuntiaojian"></use>
        </svg>
        <p class="tips">点击条件筛选进行查询</p>
      </div>
      <div class="result" v-else>
        <div class="my-echarts"></div>
      </div>
    </div>
    <output-tab :category="1"></output-tab>
  </div>
</template>

<script>
  const TopHeader = () => import("../../../../components/topheader.vue");
  const OutputTab = () => import("../../../../components/MES/OutputTab.vue");
  function DateFormat(date) { //封装一个方法点击左右 改变头部那个时间的显示
    let now = new Date(date);
    let dateObj = {};
    dateObj.year = now.getFullYear();
    dateObj.month = now.getMonth() + 1;
    dateObj.date = (now.getMonth() + 1) + "月" + now.getDate() + "日";
    dateObj.day = now.getDate();
    return dateObj;
  }
  /*设置天数数组*/
  function setDaysArr(year,month){
    let arr = [];
    let d = new Date(year,month,0);
    let daycount = d.getDate();
    /*计算当月1号对应星期几*/
    let blankLenth = new Date(year+'/'+month+'/1').getDay();
    blankLenth = (blankLenth === 0) ? 6 : blankLenth-1;
    for(var i=1;i<=daycount;i++){
      arr.push(i);
    }
    return new Array(blankLenth).concat(arr);
  }
  export default{
    name: 'OutputLive',
    components:{
      TopHeader,
      OutputTab,
    },
    data(){
      return{
        tabItem: null,
        mask: false,
        showContent: true,
        result: false,
        date: "日期",
        workshop_arr:[],
        workline_arr:[],
        shift_arr:[],
        dateObj: {},
        currentDate: {},
        days: [],
        showDatePicker: false,
        nowDate:'',//接口返回的当前时间
        selection:{
          workshop: "车间",
          workshop_id: "no",
          workline: "产线",
          workline_id: "no",
          shift:'白班',
          shiftCode:"01",
          date: new Date().getFullYear()+"-"+(new Date().getMonth() + 1)+"-"+new Date().getDate(),
        }
      }
    },
    watch:{
      selection:{
        handler(curVal){
          this.getData(curVal.shiftCode,curVal.workshop_id,curVal.workline_id,curVal.date);
        },
        deep:true
      }
    },
    methods:{
      /*切换条件*/
      tab(num){
        this.mask = true;
        this.showContent = false;
        this.tabItem = num;
        if(num === 2 && this.selection.workshop == '车间'){
          this.$toast("请选择车间");
        }
      },
      /*选择车间*/
      workshopSelect(index){
        this.selection.workshop = this.workshop_arr[index].workshopName;
        this.selection.workshop_id = this.workshop_arr[index].workShopId;
        this.mask = false;
        this.showContent = true;
        this.tabItem = null;
        this.getWorkline(this.selection.workshop_id);
      },
      /*选择产线*/
      worklineSelect(index){
        this.selection.workline = this.workline_arr[index].lineName;
        this.selection.workline_id = this.workline_arr[index].lineId;
        this.mask = false;
        this.showContent = true;
        this.tabItem = null;
      },
      //选择班次
      shiftSelect(index){
           this.selection.shift = this.shift_arr[index].shiftName;
          this.selection.shiftCode = this.shift_arr[index].shiftCode;
          this.mask = false;
          this.showContent = true;
          this.tabItem = null;
      },
      /*前一个月*/
      lastMonth(){
        if(this.dateObj.month>1){
          this.dateObj.month --;
        }else{
          this.dateObj.month = 12;
          this.dateObj.year --;
        }
        this.days = setDaysArr(this.dateObj.year,this.dateObj.month);
      },
      /*后一个月*/
      nextMonth(){
        if(this.dateObj.month<12){
          this.dateObj.month ++;
        }else{
          this.dateObj.month = 1;
          this.dateObj.year ++;
        }
        this.days = setDaysArr(this.dateObj.year,this.dateObj.month);
      },
      /*选择日期*/
      pickDate(index){
        let month = this.dateObj.month>9 ? this.dateObj.month : '0'+this.dateObj.month;
        let day = this.days[index]>9 ? this.days[index] : '0'+this.days[index];
        let dateString = this.dateObj.year+""+month+""+day;
        let ms = Date.parse(dateString.substr(4,2)+"/"+dateString.substr(6,2)+"/"+dateString.substr(0,4));
        this.ms = ms;
        this.dateObj = DateFormat(ms);
        let date = new Date(ms);
        sessionStorage.setItem("ms",ms);
        this.currentDate = {
          year: date.getFullYear(),
          month: date.getMonth() + 1,
          day: date.getDate()
        };
        this.selection.date = date.getFullYear()+"-"+(date.getMonth() + 1)+"-"+date.getDate();
        this.mask = false;
        this.showContent = true;
        this.tabItem = null;
      },
      /*获取车间*/
      getWorkshop(){
        this.$mes.get("/common/workshop").then(res =>{
          if(res.h.code === 200){
            this.workshop_arr = res.b.list;
            this.workshop_arr.unshift({
              workShopId: "",
              workshopName: "所有车间"
            });
          }
        });
      },
      /*获取生产线*/
      getWorkline(id){
        this.$mes.get("/common/line?workShopId="+id).then(res =>{
          console.log("获取生产线",res);
          if(res.h.code === 200){
            this.workline_arr = res.b.list;
            this.workline_arr.unshift({
              lineId: "",
              lineName: "所有产线"
            });
          }
        });
      },
      /*获取产出看板数据*/
      getData(shiftCode,workshop_id,workline_id,date){
        let line = false;
        if(workshop_id){
          line = true;
        }

        if(workshop_id=="no"||workline_id=="no"){
          return false
        }
        this.$mes.get("/produce/outputKanban",{
          workShopId: workshop_id,
          lineId: workline_id,
          workDate: date,
          shift:shiftCode,
        }).then(res =>{
          if(res.h.code === 200){
            if(res.b.length>0){
              this.result = true;
              if(!line){
                let obj = res.b[0].data[res.b[0].data.length-1].data;
                let data = {
                  time: [],
                  outputQty: [],
                  title:this.selection.workshop+this.selection.workline,
                };
                obj.map(function(item){
                    data.outputQty.push(item.outputQty);
                    data.time.push(item.workPeriod);
                });
                setTimeout(()=>{
                  this.echarts(data,1);
                },0);
              }else{
                 let timeList = [], outputList = [];
                let objs = res.b[0].data[0].data;
                objs.forEach(item => {
                      timeList.push(item.workPeriod);
                      outputList.push(item.outputQty);
                });
                let params = {
                  time: timeList,
                  outputQty: outputList,
                  title:this.selection.workshop+this.selection.workline,
                  legend: ["产量"],
                  unit:'单位/米',
                };
                setTimeout(()=>{
                  this.echarts(params,1);
                },0);
              }
            }else{
              this.result = false;
              this.$toast("暂无数据");
            }
          }else{
            this.$toast("网络请求错误");
          }
        })
      },
      /*绘图*/
      echarts(data,type){
        let target =  document.querySelector(".my-echarts");
        let el = echarts.init(target);
        el.clear();

        console.log(data)
        if(type === 1){
          this.echartsLib.MutipleBars(el,data);
        }else{
          this.echartsLib.lines(el,data);
        }
      },
      creat(){
        if(this.nowDate!=''){
            this.dateObj = DateFormat(this.nowDate);
            this.ms = new Date().getTime();
            this.currentDate = {
              year: new Date().getFullYear(),
              month: new Date().getMonth() + 1,
              day: new Date().getDate()
            };
        }else if(sessionStorage.getItem("ms")){
            let ms = parseInt(sessionStorage.getItem("ms"));
            this.dateObj = DateFormat(ms);
            this.ms = ms;
            let date = new Date(ms);
            this.currentDate = {
              year: date.getFullYear(),
              month: date.getMonth() + 1,
              day: date.getDate()
            };
            this.selection.date = date.getFullYear()+"-"+(date.getMonth() + 1)+"-"+date.getDate();
          }else{
            this.dateObj = DateFormat(new Date());
            this.ms = new Date().getTime();
            this.currentDate = {
              year: new Date().getFullYear(),
              month: new Date().getMonth() + 1,
              day: new Date().getDate()
            };
          }
          this.days = setDaysArr(this.dateObj.year,this.dateObj.month);
          this.getWorkshop();
      }
    },
    created(){
        let that = this;
        this.$mes.get("/common/shift/type").then(res=>{
          that.shift_arr = res.b.list;
        })

        this.$mes.get("/common/currentWorkDateAndShift").then(res=>{
            for(let i=0;i<that.shift_arr.length;i++){
                  if(res.b.shift==that.shift_arr[i].shiftCode){
                      that.selection.shift = that.shift_arr[i].shiftName;
                      that.selection.shiftCode = res.b.shift
                  }
            }
            that.nowDate = res.b.workDate;
            that.creat();
        })
    },
    mounted(){
        
    },
  }
</script>

<style lang="stylus" scoped>
  .selections{
    position: fixed;
    left: 0;
    top: 0.6rem;
    width: 100%;
  }
  .selection-tabs{
    display: flex;
    align-items: center;
    width: 100%;
    height: 0.45rem;
    background: white;
    box-shadow 0 0 20px rgba(49,98,44,0.15);
  }
  .selection{
    flex: 1;
    height: 100%;
    line-height: 0.45rem;
    text-align: center;
    font-size 0.17rem;
    color: #333;
  }
  .selection-active{
    color: #499844;
  }
  .selections-items{
    padding-left: 0.15rem;
    background: white;
    border-top: 1px solid #ccc;
    box-shadow 0 5px 15px rgba(15,195,124,0.15);
  }
  .selection-item{
    height: 0.44rem;
    line-height: 0.44rem;
    font-size: 0.15rem;
    color: #333;
  }
  .selection-item:not(:last-child){
    border-bottom: 1px solid #ebebeb;
  }
  .no-result{
    margin-top 2.17rem;
    text-align center;
    .tips{
      margin-top: 0.1rem;
      font-size 0.17rem;
      color: #666;
    }
  }
  .active{
    width: 0.34rem;
    height: 0.34rem;
    margin: 0 auto;
    border-radius: 50%;
    background: #609ef7;
    box-shadow: 0 0 10px #609ef7;
    color: #fff;
  }
  .content{
    margin-top: 1.2rem;
    padding: 0 0.15rem;
  }
  .my-echarts{
    height: 4rem;
  }
  .content-bg{
    background: white;
    padding: 0.2rem 0;
  }
  @media only screen and (device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3){
    .my-echarts{
      height: 5.4rem;
    }
  }
</style>
