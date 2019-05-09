<style scoped lang="stylus">
  @import "../../style/variable.styl";
  .total_top_ul {
    display: flex;
    flex-direction: row;
    background-color: #fff;
    height: 0.6rem;
    align-items: center;
    justify-content: center;
  }

  .total_top_ul li {
    display: flex;
    flex: 1;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 0.45rem;
    border-right: 0.01rem solid #f3f3f3;
    color: $orange_color
    font-size: 0.16rem;
  }

  .total_top_ul li:first-child {
    color: $green_color;
  }

  .total_top_ul li:last-child {
    border: none;
    color: $red_color;
  }

  .total_con_ul1 {
    margin-left: 0.15rem;
    margin-right: 0.15rem;
    padding: 0.14rem 0.14rem 0.14rem 0.16rem;
    background-color: #fff;
    margin-top: 0.15rem;
    border-radius: 0.026rem;
  }

  .total_con_ul1 ul {
    display: flex;
    flex-direction: row;
    align-items: center;
    font-size: 0.15rem;
  }

  .total_con_ul1 ul li:first-child {
    width: 0.1rem;
    height: 0.1rem;
  }

  .total_con_ul1 ul:first-child li:first-child {
    background-color: $orange_color;
    border-radius: 1rem;
  }

  .total_con_ul1 ul li:last-child {
    margin-left: 0.1rem;
  }

  .total_con_lidiv {
    color: $font_color_6
    margin-top: 0.045rem;
  }

  .total_con_ul1 ul li span {
    margin-left: 0.1rem;
  }

  .date_top_con {
    display: flex;
    flex-direction: row;
    border-bottom: 0.005rem solid #f3f3f3;
  }

  .date_top_con li {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 0.59rem;
    background-color: #fff;
    width 23%
  }

  .date_top_con li:first-child:active {
    opacity 0.3
  }

  .date_top_con li:last-child:active {
    opacity 0.3
  }

  .date_top_con .date_top_mytitle {
    font-size: 0.18rem;
    font-weight: bold;
    color #555
    width 54%
  }
</style>
<template style="width: 100%;height: 100%">
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
    <ul class="total_top_ul">
      <li>
        <div>正常打卡</div>
        <div>{{total_one}}天</div>
      </li>
      <li>
        <div>迟到早退</div>
        <div>{{(total_two.times ? total_two.times : 0) + (total_three.times ? total_three.times : 0)}}次</div>
      </li>
      <li>
        <div>缺卡</div>
        <div>{{total_fore.times ? total_fore.times : 0}}天</div>
      </li>
    </ul>
    <div v-if="has_record">
      <div class="total_con_ul1">
        <ul>
          <li style="background-color: #ff8800"></li>
          <li>迟到</li>
        </ul>
        <ul v-show="total_two" v-for="one in total_two.typeList" style="margin-top: 0.09rem" class="total_con_lidiv">
          <li></li>
          <li>{{one.signTime.substring(0, 10)}}（{{one.signWeek}}）{{one.signTime.substring(11)}}</li>
        </ul>
        <ul v-show="!total_two" style="margin-top: 0.09rem" class="total_con_lidiv">
          <li></li>
          <li style="color: #999">无迟到记录</li>
        </ul>
      </div>

      <div class="total_con_ul1">
        <ul>
          <li style="background-color: #ffb055"></li>
          <li>早退</li>
        </ul>
        <ul v-show="total_three" v-for="one in total_three.typeList" style="margin-top: 0.09rem" class="total_con_lidiv">
          <li></li>
          <li>{{one.signTime.substring(0, 10)}}（{{one.signWeek}}）{{one.signTime.substring(11)}}</li>
        </ul>
        <ul v-show="!total_three" style="margin-top: 0.09rem" class="total_con_lidiv">
          <li></li>
          <li style="color: #999">无早退记录</li>
        </ul>
      </div>
      <div class="total_con_ul1">
        <ul>
          <li style="background-color: #fd545c"></li>
          <li>缺卡</li>
        </ul>
        <ul v-show="total_fore" v-for="one in total_fore.typeList" style="margin-top: 0.09rem"
            class="total_con_lidiv">
          <li></li>
          <li>{{one.signTime.substring(0, 10)}}（{{one.signWeek}}）</li>
        </ul>
        <ul v-show="!total_fore" class="total_con_lidiv">
          <li></li>
          <li style="color: #999">无缺卡记录</li>
        </ul>
      </div>
    </div>
    <Norecord v-else="has_record"></Norecord>
  </section>
</template>

<script>
  import Util  from '../../js/Util.js'
  import Norecord from '../../components/norecord.vue'
  function get_CheckStatic(that, param_date) {
    that.axios.get(that.Service.checkStatic, {
      params: {
        staticDate: param_date
      }
    }).then(function (data) {
      console.log(data)
      if (data.data.h.code == "200") {
        let total_one = data.data.b.normalTimes
        let total_two = data.data.b.data[2]
        let total_three = data.data.b.data[3]
        let total_fore = data.data.b.data[4]
        if (!total_two & !total_two & !total_three & !total_fore) {
          that.has_record = false;
        } else {
          that.has_record = true;
        }
        that.total_one = total_one ? total_one : 0
        that.total_two = total_two ? total_two : ''
        that.total_three = total_three ? total_three : ''
        that.total_fore = total_fore ? total_fore : ''
      }

    }).catch(function (error) {

    });
  }

  let mydate
  export default {
    data () {
      return {
        topdate: '',
        has_record: true,
        total_one: '',
        total_two: '',
        total_three: '',
        total_fore: ''
      }
    },
    components: {
      Norecord
    },
    methods: {
      goleft(){
        console.log(Util.GetPreMonth(Util.getNewTime(mydate)))
        mydate = new Date(Util.GetPreMonth(Util.getNewTime(mydate)))
        get_CheckStatic(this, mydate.getFullYear() + '-' + (mydate.getMonth() + 1))
        this.topdate = Util.getNewTime(mydate, '年月')
      },
      goright(){
        console.log(Util.GetNextMonth(Util.getNewTime(mydate)))
        mydate = new Date(Util.GetNextMonth(Util.getNewTime(mydate)))
        get_CheckStatic(this, mydate.getFullYear() + '-' + (mydate.getMonth() + 1))
        this.topdate = Util.getNewTime(mydate, '年月')
      }
    },
    mounted(){
      let that = this
      mydate = new Date()
      get_CheckStatic(this, mydate.getFullYear() + '-' + (mydate.getMonth() + 1))
      this.topdate = Util.getNewTime(mydate, '年月')
    }
  }
</script>


