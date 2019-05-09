<template>
  <div class="date-picker">
    <div class="date-header">
      <div class="arrow" @touchend="goleft">
        <svg class="icon" aria-hidden="false">
          <use xlink:href="#icon-zuoyoujiantou"></use>
        </svg>
      </div>
      <div class="current-date" @click="openPicker">
        <div class="date">{{dateObj.date}}</div>
        <div class="day">{{dateObj.day}}</div>
      </div>
      <div class="arrow arrow-right" @touchend="goright">
        <svg class="icon" aria-hidden="false">
          <use xlink:href="#icon-zuoyoujiantou"></use>
        </svg>
      </div>
    </div>
    <div class="date-content" v-show="showPicker">
      <div class="date-info flex-between">
        <div class="year-month">{{dateObj.year}}年{{dateObj.month}}月</div>
        <div class="day">{{dateObj.day}}</div>
      </div>
      <ul class="date-days flex-between">
        <li class="day-item">一</li>
        <li class="day-item">二</li>
        <li class="day-item">三</li>
        <li class="day-item">四</li>
        <li class="day-item">五</li>
        <li class="day-item">六</li>
        <li class="day-item">日</li>
      </ul>
      <div class="day-list" v-if="isAndroid">
        <div class="list-item" v-for="(item,index) in days" :data-index="index" @click="pickDate(index)">
          <div :class="{active: (item === currentDate.day && dateObj.year === currentDate.year && dateObj.month === currentDate.month )}">{{item}}</div>
        </div>
      </div>
      <div class="day-list" v-else>
        <div class="list-item" v-for="(item,index) in days" :data-index="index" @touchend="pickDate(index)">
          <div :class="{active: (item === currentDate.day && dateObj.year === currentDate.year && dateObj.month === currentDate.month )}">{{item}}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import Util  from '../js/Util.js'
  function DateFormat(date) { //封装一个方法点击左右 改变头部那个时间的显示
    let now = new Date(date);
    let num = now.getDay();
    let obj = {0: "天", 1: "一", 2: "二", 3: "三", 4: "四", 5: "五", 6: "六"};
    let dateObj = {};
    dateObj.year = now.getFullYear();
    dateObj.month = now.getMonth() + 1;
    dateObj.date = (now.getMonth() + 1) + "月" + now.getDate() + "日";
    dateObj.day = "星期" + obj[num];
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
    name: "DatePicker",
    data(){
      return{
        dateObj:{},
        dateCouter: 0,
        ms: 0,
        days: [],
        currentDate:{},
        showPicker: false,
        isAndroid: navigator.userAgent.indexOf('Android') > -1 || navigator.userAgent.indexOf('Adr') > -1, //android终端
      }
    },
    methods:{
      /*前一天*/
      goleft(){
        this.closePicker();
        if(((new Date().getTime()-this.ms)/(24*60*60*1000))<30){
          this.ms -= 24*60*60*1000;
          sessionStorage.setItem("ms",this.ms);
          this.currentDate = {
            year: new Date(this.ms).getFullYear(),
            month: new Date(this.ms).getMonth() + 1,
            day: new Date(this.ms).getDate()
          };
          this.dateObj = DateFormat(this.ms);
          this.days = setDaysArr(this.dateObj.year,this.dateObj.month);
          this.$emit("childEvent",this.ms,false);
        }else{
          this.$alert("最多可查看30天的数据");
        }
      },
      /*后一天*/
      goright(){
        this.closePicker();
        if((this.ms - new Date().getTime())/(24*60*60*1000) < 6){
          this.ms += 24*60*60*1000;
          sessionStorage.setItem("ms",this.ms);
          this.currentDate = {
            year: new Date(this.ms).getFullYear(),
            month: new Date(this.ms).getMonth() + 1,
            day: new Date(this.ms).getDate()
          };
          this.dateObj = DateFormat(this.ms);
          this.days = setDaysArr(this.dateObj.year,this.dateObj.month);
          this.$emit("childEvent",this.ms,false);
        }else{
          this.$alert("最多可查看一周的数据");
        }
      },
      /*展开日期选择*/
      openPicker(){
        this.days = setDaysArr(this.dateObj.year,this.dateObj.month);
        this.showPicker = !this.showPicker;
        this.$emit("childEvent",0,this.showPicker);
      },
      /*关闭日期选择*/
      closePicker(){
        this.showPicker = false;
      },
      /*选择日期*/
      pickDate(index){
        if(this.days[index]){
          this.closePicker();
          let month = parseInt(this.dateObj.month)>9?this.dateObj.month:"0"+this.dateObj.month;
          let day = parseInt(this.days[index])>9?this.days[index]:"0"+this.days[index];
          let dateString = this.dateObj.year+""+month+""+day;
          let ms = Date.parse(dateString.substr(4,2)+"/"+dateString.substr(6,2)+"/"+dateString.substr(0,4));
          this.ms = ms;
          this.dateObj = DateFormat(ms);
          this.$emit("childEvent",ms,false);
          let date = new Date(ms);
          sessionStorage.setItem("ms",ms);
          this.currentDate = {
            year: date.getFullYear(),
            month: date.getMonth() + 1,
            day: date.getDate()
          };
        }
      },
    },
    created(){
      if(sessionStorage.getItem("ms")){
        let ms = parseInt(sessionStorage.getItem("ms"));
        this.dateObj = DateFormat(ms);
        this.ms = ms;
        this.currentDate = {
            year: new Date(ms).getFullYear(),
            month: new Date(ms).getMonth() + 1,
            day: new Date(ms).getDate()
        };
      }else{
        this.dateObj = DateFormat(new Date());
        this.ms = new Date().getTime();
        this.currentDate = {
          year: new Date().getFullYear(),
          month: new Date().getMonth() + 1,
          day: new Date().getDate()
        };
      }
      this.$emit("childEvent",this.ms,false);
    },
  }
</script>

<style lang="stylus" scoped>
  .date-picker{
    padding-bottom: 0.5rem;
  }
  .date-header{
    display flex;
    justify-content space-around;
    align-items center;
    width 3rem;
    height 0.87rem;
    margin 0 auto;
  }
  .current-date{
    display flex;
    justify-content center;
    align-items center;
    font-size 0.17rem;
    color white;
    .date{
      margin-right 0.36rem;
    }
  }
  .icon{
    width: 0.21rem;
    height: 0.21rem;
    color: rgba(255,255,255,0.5);
  }
  .arrow{
    z-index 9;
    cursor pointer;
  }
  .arrow-left{
    margin-right 0.46rem;
  }
  .arrow-right{
    transform: rotate(180deg);
  }
  .date-content{
    position: fixed;
    top: 1.11rem;
    left: 0;
    height: 100%;
    background: rgba(44,44,44,0.3);
  }
  .date-info{
    height 0.47rem;
    padding 0 0.15rem;
    line-height 0.47rem;
    font-size 0.17rem;
    color #333;
    background white;
  }
  .flex-between{
    display flex;
    justify-content space-between;
  }
  .date-days{
    height 0.34rem;
    line-height 0.34rem;
    font-size 0.14rem;
    color #666;
    background white;
    border-bottom 1px solid #ebebeb;
  }
  .day-item{
    width: 14.28%;
    text-align center;
  }
  .day-list{
    padding-top: 0.1rem;
    padding-bottom: 0.3rem;
    display: flex;
    -webkit-box-orient: horizontal;
    -webkit-box-direction: normal;
    flex-direction: row;
    flex-wrap: wrap;
    word-wrap: break-word;
    word-break: break-all;
    width: 100%;
    background white;
    box-shadow 0 5px 10px rgba(0,0,0,0.15);
  }
  .list-item{
    z-index 9;
    width: 14.28%;
    height: 0.34rem;
    line-height 0.34rem;
    text-align center;
  }
  .active{
    width: 0.34rem;
    height: 0.34rem;
    margin: 0 auto;
    border-radius: 50%;
    background: #609ef7;
    box-shadow: 0 0 10px rgba(96,158,247,1);
    color: white;
  }
</style>
