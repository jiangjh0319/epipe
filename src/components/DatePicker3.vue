<template>
  <div class="date-picker">
    <div class="date-header">
      <div class="icon-container" style="width: 1rem;" @click="lastMonth">
        <svg class="icon" aria-hidden="false">
          <use xlink:href="#icon-zuoyoujiantou"></use>
        </svg>
      </div>
      <div class="date">
        {{dateObj.year}}年{{dateObj.month}}月
      </div>
      <div class="icon-container" style="width: 1rem; transform: rotate(180deg)" @click="nextMonth">
        <svg class="icon" aria-hidden="false">
          <use xlink:href="#icon-zuoyoujiantou"></use>
        </svg>
      </div>
    </div>
    <div class="date-content">
      <ul class="date-days flex-between">
        <li class="day-item">一</li>
        <li class="day-item">二</li>
        <li class="day-item">三</li>
        <li class="day-item">四</li>
        <li class="day-item">五</li>
        <li class="day-item">六</li>
        <li class="day-item">日</li>
      </ul>
      <div class="day-list">
        <div class="list-item" v-for="(item,index) in days" @touchend="pickDate(index)" :key="index">
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
      }
    },
    methods:{
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
        if(this.days[index]){
          let month = parseInt(this.dateObj.month)>9?this.dateObj.month:"0"+this.dateObj.month;
          let day = parseInt(this.days[index])>9?this.days[index]:"0"+this.days[index];
          let dateString = this.dateObj.year+""+month+""+day;
          let ms = Date.parse(dateString.substr(4,2)+"/"+dateString.substr(6,2)+"/"+dateString.substr(0,4));
          this.ms = ms;
          this.dateObj = DateFormat(ms);
          let date = new Date(ms);
          this.$emit("childEvent",ms);
          sessionStorage.setItem("ms",ms);
          this.currentDate = {
            year: date.getFullYear(),
            month: date.getMonth() + 1,
            day: date.getDate()
          };
        }
      }
    },
    mounted(){
      if(sessionStorage.getItem("ms")){
        let ms = parseInt(sessionStorage.getItem("ms"));
        this.dateObj = DateFormat(ms);
        this.ms = ms;
        this.currentDate = {
            year: new Date(ms).getFullYear(),
            month: new Date(ms).getMonth() + 1,
            day: new Date(ms).getDate()
        };
        this.days = setDaysArr(this.dateObj.year,this.dateObj.month);
      }else{
        this.dateObj = DateFormat(new Date());
        this.ms = new Date().getTime();
        this.currentDate = {
          year: new Date().getFullYear(),
          month: new Date().getMonth() + 1,
          day: new Date().getDate()
        };
        this.days = setDaysArr(this.dateObj.year,this.dateObj.month);
      }
    }
  }
</script>

<style lang="stylus" scoped>
  .date-picker{
    /*padding-bottom: 0.5rem;*/
  }
  .date-header{
    display flex;
    justify-content space-around;
    align-items center;
    height 0.45rem;
    line-height 0.45rem;
  }
  .date{
    text-align center;
  }
  .icon-container{
    z-index 9;
    cursor pointer;
    text-align center;
  }
  .date-content{
    width: 100%;
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
    cursor pointer;
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
