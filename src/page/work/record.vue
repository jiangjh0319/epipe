<style scoped lang="stylus">
  @import "../../style/variable.styl";
  .date_piker_con li {
    display: flex;
    justify-content: center;
    flex: 1;
    height: 0.29rem;
    align-items: center;
    font-weight: bold;
    font-size: 0.15rem;
    color: #333;
  }

  .date_piker_con {
    display: flex;
    flex-direction: row;
    height: 0.3rem;
    background-color: #fff;
  }

  .date_piker_li {
    padding-top: 0.13rem;
    padding-bottom: 0.13rem;
    display: flex;
    display: -webkit-flex;
    flex-direction: row;
    flex-wrap: wrap;
    -webkit-flex-wrap: wrap;
    background-color: #f1f2f3;
    word-wrap : break-word
    word-break:break-all;
    width:100%;
  }

  .date_piker_li li {
    display: flex;
    justify-content: center;
    width: 14.28%;
    height: 0.34rem;
    align-items: center;
  }

  .date_top_con {
    display: flex;
    flex-direction: row;
  }

  .date_top_con li {
    display: flex;
    width 23%
    justify-content: center;
    align-items: center;
    height: 0.59rem;
    background-color: #fff;
  }

  .date_top_con li:first-child:active {
    background-color 0.3
  }

  .date_top_con li:last-child:active {
    opacity 0.3
  }

  .date_piker_li li .div_choserd {
    width: 0.34rem;
    height: 0.34rem;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    border-radius: 100px;
    background-color: $blue_color;
  }

  .record_word_div {
    margin-left: 0.15rem;
    margin-right: 0.15rem;
    display: flex;
    height: 0.44rem;
    align-items: center;
    font-size: 0.15rem;
    border-bottom: 1px solid #e2e2e2;
  }

  .record_wordcon_div {
    width: 90%;
    margin: auto;
    display: flex;
    flex-direction: row;
    align-items: center;
  }

  .record_con_div2 {
    flex: 9;
    display: flex;
    align-items: center;
    font-size: 0.15rem;
  }

  .record_con_div3 {
    flex: 9;
    display: flex;
    height: 0.29rem;
    border-bottom: 0.01rem solid #eee;
  }

  .date_top_con .date_top_mytitle {
    display: flex;
    font-size: 0.18rem;
    font-weight: bold;
    width 54%
    color #555
    justify-content center
    align-items center
  }

  .no_record_1
    display flex
    justify-content center
    align-items center
    height 0.79rem
    color $font_color_6
    background-color #ededed
    font-size 0.15rem

  .record_my-1 {
    padding-top: 0.15rem;
    background-color: #fff;
  }

  .lackCard{
    margin-top 0.05rem;

    a{
      display inline-block
      width 0.3rem;
      height 0.15rem;
      line-height 0.15rem;
      border 0.01rem solid #fd545c
      border-raidus 0.02rem;
      font-size 0.12rem;
      text-align center
      margin-right 0.1rem;
      color #fd545c
    }

    .success{
        color #0f73c3
        border-color #0f73c3 
    }

  }
</style>

<template>
  <section>
    <ul class="date_top_con">
      <li @click="goleft">
        <svg style="width: 0.21rem;height: 0.21rem;transform:rotate(180deg)" class="icon" aria-hidden="false">
          <use xlink:href="#icon-into"></use>
        </svg>
      </li>
      <li class="date_top_mytitle">{{topdate}}</li>
      <li @click="goright">
        <svg style="width: 0.21rem;height: 0.21rem" class="icon" aria-hidden="false">
          <use xlink:href="#icon-into"></use>
        </svg>
      </li>
    </ul>
    <ul class="date_piker_con">
      <li>一</li>
      <li>二</li>
      <li>三</li>
      <li>四</li>
      <li>五</li>
      <li>六</li>
      <li>日</li>
    </ul>
    <ul class="date_piker_li">
      <li @click="chosetime(index,item.id)" v-for="(item,index) in dateArrray">
        <div v-bind:class="{ div_choserd: item.mark }">{{item.id}}</div>
      </li>
    </ul>
    <div v-show="has_record">
      <div style="background-color: #fff">
        <div class="record_word_div">
          当天考勤信息
        </div>
      </div>
      <!-- <div v-for="item in items" class="record_my-1">
        <div class="record_wordcon_div">
          <div style="flex: 1;align-items: center">
            <svg style="width: 0.18rem;height: 0.18rem;" class="icon" aria-hidden="false">
              <use xlink:href="#icon-time"></use>
            </svg>
          </div>
          <div class="record_con_div2">打卡时间（{{item.signTime.substring(11)}}）</div>
        </div>
        <div class="record_wordcon_div">
          <div style="flex: 1"></div>
          <div class="record_con_div3">{{item.address}}</div>
        </div>
      </div> -->

      <div v-for="item in items" class="record_my-1">
        <div v-if="item.address">
            <div class="record_wordcon_div">
              <div style="flex: 1;align-items: center">
                <svg style="width: 0.18rem;height: 0.18rem;" class="icon" aria-hidden="false">
                  <use xlink:href="#icon-time"></use>
                </svg>
              </div>
              <div class="record_con_div2">打卡时间（{{item.signTime.substring(11)}}）</div>
              </div>
            <div class="record_wordcon_div">
              <div style="flex: 1"></div>
              <div class="record_con_div3">{{item.address}}</div>
            </div>
        </div>

        <div v-if="!item.address">
            <div class="record_wordcon_div">
              <div style="flex: 1;align-items: center">
                <svg style="width: 0.18rem;height: 0.18rem;" class="icon" aria-hidden="false">
                  <use xlink:href="#icon-time"></use>
                </svg>
              </div>
              <div class="record_con_div2">{{item.workShift | workFor }}（{{item.signTime}}）</div>
            </div>
            <div class="record_wordcon_div">
              <div style="flex: 1"></div>
              <div class="record_con_div3 lackCard" @click="go_absence(item)">
                
                <a v-if="item.absenceApplyState!='申请补卡'" :class="item.absenceApplyState=='已通过'?'success':''">
                  {{item.absenceApplyState | absenceState}}
                </a>

                <span style="color:#609ef7">
                  {{item.absenceApplyState}} >
                </span>
              </div>
            </div>
        </div>

      </div>

      <div style="width: 100%;height: 0.15rem;background-color: #fff;position: relative;top: -0.01rem"></div>
    </div>
    <div v-show="!has_record" class="no_record_1">
      暂时没有考勤记录哦~
    </div>
  </section>
</template>

<script>
  import Util from '../../js/Util.js'
  let mydate
  let myyear
  let mymonth
  let myday
  let hasDay
  let that = this
  function get_record(that, param_date) { //获取的方法
    that.axios.get(that.Service.checkRecord, {
      params: {
        checkDate: Util.getNewTime(param_date)
      }
    }).then(function (data) {
      console.log(data)
      if (data.data.h.code == "200") {
        if (data.data.b.data.length > 0) {
          that.items = data.data.b.data
          that.has_record = true
        } else {
          that.has_record = false
        }
      } else if (data.data.h.code == "10") {
        console.log('用户已过期，请重新登录')
        window.location.href = "epipe://?&mark=login_out"
      }
    }).catch(function (error) {
    });
  }
  /*当前月的第一天*/
  function getDaysInOneMonth(year, month) {
    month = parseInt(month, 10);
    let d = new Date(year, month, 0);
    return d.getDate()
  }
  /*公共的方法*/
  function commonways(mydate, type, that) {
    myyear = mydate.getFullYear()
    mymonth = mydate.getMonth() + 1
    myday = mydate.getDate()
    hasDay = getDaysInOneMonth(myyear, mymonth)
    console.log("hasDay",hasDay);
    /*一号是星期几*/
    function getnum(dataone) {
      let num = new Date(dataone).getDay()
      if (num == 0) {
        return 6
      } else {
        return num - 1
      }
    }

    let dataone = myyear + '/' + mymonth + '/1'
    let array = []
    for (let i = 1; i <= getnum(dataone); i++) {
      array.push({id: ''})
    }
    for (let i = 1; i <= hasDay; i++) {
      if (mydate.getFullYear() + '-' + mydate.getMonth() == new Date().getFullYear() + '-' + new Date().getMonth()) {
        if (i == myday) {
          array.push({id: i, mark: true})
          if (type == "left_right") {
            get_record(that, new Date())
          }
        } else {
          array.push({id: i, mark: false})
        }
      } else {
        array.push({id: i, mark: false})
      }
    }
    console.log(array.length)
    return array
  }


  export default {
    data () {
      return {
        dateArrray: [],
        topdate: '',
        has_record: true,
        items: ''
      }
    },
    components: {},
    methods: {
      chosetime(index, id){
        if (id != '') {
          let array = this.dateArrray
          for (let i = 0; i < array.length; i++) {
            if (i == index) {
              array[index].mark = true
            } else {
              array[i].mark = false
            }
          }
          console.log(myyear + '/' + mymonth + '/' + id)
          get_record(this, myyear + '/' + mymonth + '/' + id)
          this.dateArrray = array
        }
      },
      goleft(){
        this.has_record = false
        mydate = myyear + '-' + mymonth + '-' + myday
        this.dateArrray = commonways(new Date(Util.GetPreMonth(mydate)), "left_right", this)
        this.topdate = myyear + '年' + mymonth + '月'
      },
      goright(){
        this.has_record = false
        mydate = myyear + '-' + mymonth + '-' + myday
        this.dateArrray = commonways(new Date(Util.GetNextMonth(mydate)), "left_right", this)
        this.topdate = myyear + '年' + mymonth + '月'
      },
      go_absence(item){
        console.log(11)
          if(item.applyType==='0'){
                window.location.href = "epipe://?&mark=leaveDetails&_id="+item.applyId
          }else if(item.applyType==='3'){//公出
                window.location.href = "epipe://?&mark=goOutWorkDetails&_id="+item.applyId
          }else if(item.applyType === '4'){ //出差
                window.location.href = "epipe://?&mark=tripDetails&_id="+item.applyId
          }else if(item.applyType === '11'){ //补卡
              if(item.applyId){
                window.location.href = "epipe://?&mark=absenceDetails&_id="+item.applyId
              }else{
                window.location.href = "epipe://?&mark=absence&data="+JSON.stringify({absenceTime:item.signTime})
              }
          }

      }
    },
    mounted: function () {
      var that = this;
      mydate = new Date()
      this.dateArrray = commonways(mydate)
      this.topdate = myyear + '年' + mymonth + '月'

      window["recordUpdate"] = () => {
        get_record(that, new Date())
      }
      get_record(that, new Date())
    },
    filters:{
      workFor(value){
          if(value.indexOf('L')>-1){
            return '上班时间'
          }else{
            return '下班时间'
          }
      },
      absenceState(value){
        return value.indexOf('已申请')>-1?'正常':'缺卡'
      }
    }

  }
</script>
