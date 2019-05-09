<template>
  <div class="select-date">
    <div class="header" :style="{background: color}">
      <div class="svg" @click="emitEvent(4)">
        <svg class="icon icon-back" aria-hidden="false">
          <use xlink:href="#icon-zuoyoujiantou"></use>
        </svg>
      </div>
      选择日期
    </div>
    <div class="date-picker" style="background: white;padding-top: 0.45rem;">
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
        <ul class="day-list" style="display: flex;justify-content: space-around;height:0.45rem;line-height: 0.45rem;border-bottom: 1px solid #ebebeb;">
          <div class="day-item">一</div>
          <div class="day-item">二</div>
          <div class="day-item">三</div>
          <div class="day-item">四</div>
          <div class="day-item">五</div>
          <div class="day-item">六</div>
          <div class="day-item">日</div>
        </ul>
        <div class="date-list" style="display: flex;flex-wrap: wrap;padding: 0.1rem 0;border-bottom: 1px solid #ebebeb;">
          <div class="date-item" v-for="(item,index) in days" :key="index" @click="pickDate(index)" style="width:14.28%;height:0.34rem;line-height: 0.34rem;text-align: center;">
            <div :class="{active: (item === currentDate.day && dateObj.year === currentDate.year && dateObj.month === currentDate.month )}">{{item}}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
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
    name: 'SelectDate',
    props: ["color"],
    data(){
      return{
        dateObj: {},
        currentDate: {},
        days: [],
        ms: 0,
        date: "",
      }
    },
    methods:{
      emitEvent(type){
        this.$emit('childevent',type);
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
        let month = parseInt(this.dateObj.month)>9?this.dateObj.month:"0"+this.dateObj.month;
        let day = parseInt(this.days[index])>9?this.days[index]:"0"+this.days[index];
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
        this.date = date.getFullYear()+"-"+(date.getMonth() + 1)+"-"+date.getDate();
        this.$emit("childselect",this.date);
        this.$emit('childevent',4);
      },
    },
    created(){
      this.dateObj = DateFormat(new Date());
      this.ms = new Date().getTime();
      this.currentDate = {
        year: new Date().getFullYear(),
        month: new Date().getMonth() + 1,
        day: new Date().getDate()
      };
      this.days = setDaysArr(this.dateObj.year,this.dateObj.month);
    },
  }
</script>

<style lang="stylus" scoped>
  .header{
    position fixed;
    top: 0;
    left:0;
    width:100%;
    height: 0.44rem;
    text-align center;
    line-height:0.44rem;
    font-size: 0.185rem;
    letter-spacing: 0.012rem;
    color: white;
    background: #499844;
    .icon-back{
      font-size: 0.17rem;
      margin-left: -0.2rem;
      color: white;
    }
    .svg{
      position absolute;
      left 0;
      top 0;
      width 0.58rem;
      height 100%;
    }
  }
  .select-date{
    z-index 10;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: white;
  }
  .choice-items{
    margin-top: 0.59rem;
    padding-left: 0.15rem;
    box-shadow 0 0 20px rgba(15,194,124,0.15);
  }
  .choice-item{
    height: 0.44rem;
    line-height: 0.44rem;
    text-align left;
    font-size: 0.17rem;
    color: #333;
    border-bottom: 1px solid #EBEBEB;
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
</style>
