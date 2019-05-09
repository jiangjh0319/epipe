<template>
    <div style="height:100%;background-color:#fff">
        <div class='header myaffairs_head' v-bind:style="{ background: bg_color}" >
            <div class="back" @click="history_back_click">
            <svg class="icon icon-back" aria-hidden="false">
                <use xlink:href="#icon-zuoyoujiantou"></use>
            </svg>
            </div>
            日程
            <div  class="redact">
                <svg class="icon icon-back" @click="show=!show" aria-hidden="false">
                    <use xlink:href="#icon-tianjia1"></use>
                </svg>

                <div class="option" v-show="show">
                    <div @click="go_option(1)">日程</div>
                    <div @click="go_option(2)">会议</div>
                    <div @click="go_option(3)">备忘</div>
                </div>
            </div>
        </div>
        <div class="date">
            <ul class="date_top_con">
                <li @click="goleft">
                    <svg style="width: 0.16rem;height: 0.16rem;" class="icon" aria-hidden="false">
                    <use xlink:href="#icon-xiangzuo"></use>
                    </svg>
                </li>
                <li class="date_top_mytitle">{{topdate}}</li>
                <li @click="goright">
                    <svg style="width: 0.16rem;height: 0.16rem;" class="icon" aria-hidden="false">
                        <use xlink:href="#icon-xiangyou"></use>
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
            <ul class="date_piker_li" v-if="!dateHide">
                <li @click="chosetime(index,item.id,dateArray)" v-for="(item,index) in dateArray" :key="item.id" >
                    <div v-bind:class="{ div_choserd: item.mark }">{{item.id}}</div>
                    <i v-if="item.remind"></i>
                </li>

                <div class="show_btn" @click="hide">
                    <svg style="width: 0.16rem;height: 0.16rem;" class="icon iconUp" aria-hidden="false">
                        <use xlink:href="#icon-xiangyou"></use>
                    </svg>
                </div>
            </ul>
            <ul class="date_piker_li" v-else>
                <li @click="chosetime(index,item.id,minDate)" v-for="(item,index) in minDate" :key="item.id" >
                    <div v-bind:class="{ div_choserd: item.mark }">{{item.id}}</div>
                    <i  v-if="item.remind"></i>
                </li>

                <div class="show_btn" @click="hide">
                    <svg style="width: 0.16rem;height: 0.16rem;" class="icon iconDown" aria-hidden="false">
                        <use xlink:href="#icon-xiangyou"></use>
                    </svg>
                </div>
            </ul>
        </div>
        <div>
            <div v-if="!dayData.length" class="no-content">
                {{hint?'过去的这一天，好像什么都没做':'大部分成功人士，都把事情放到日程里！'}}
            </div>
            <div v-else class="content">
                <ul>
                    <li class="content-item" v-for="(item) in dayData" :key="item.id" @click="go_details(item)">
                        <div class="item-info">
                            <svg style="width: 0.21rem;height: 0.16rem;color:#fff" class="icon" aria-hidden="false">
                                <use xlink:href="#icon-richengxinxi"></use>
                            </svg><span class="item-text">{{item.beginTime.slice(10,-3)}}</span>
                            <time class="from" v-if="item.agendaType!='0'">{{item.endTime.slice(10,-3)}}</time>
                        </div>
                        <div class="item-main line-left">
                            <div class="item-text">{{item.title}}</div>
                            <div class="from">
                                日程来自: {{item.userName}}
                            </div>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script>
import Util from '../../../js/Util.js'
  let mydate,myyear,mymonth,myday,hasDay,week
  let that = this

  function get_record(that, param_date) { //获取的方法
    that.axios.get('/agenda/arrange/list', {
      params: {
        checkDate: Util.getNewTime(param_date)
      }
    }).then(function (data) {
      if (data.data.h.code == "200") {
          that.dayData = data.data.b
          console.log(dayData)
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

    function commonways(mydate, type, that) {

        console.log('获得传入的时间 类型')
        console.log(mydate,type,that)

        myyear = mydate.getFullYear()
        mymonth = mydate.getMonth() + 1
        myday = mydate.getDate()

        console.log('获取年月日',mymonth)

        hasDay = getDaysInOneMonth(myyear, mymonth)

        console.log("hasDay:这年这月一共有多少天",hasDay);

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
        console.log('知道了1号的第几天，在数组前面加上空缺的值')

        week = getnum(myyear + '/' + mymonth + '/'+myday)

        if(new Date(myyear+'/'+mymonth+'/'+myday).getTime()<new Date().getTime()){
            that.hint = true
        }else{
            that.hint = false
        }
        //判断时间来进行下面的提示

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
        return array
    }

    export default {
        data() {
            return {
                topdate:'',
                dateArray: [],
                minDate:[],
                dayData:[],
                dateHide:false,
                show:false,
                hint:false,
            }
        },
        mounted: function () {
            var that = this;
            mydate = new Date()
            this.dateArray = commonways(mydate,'left_right',this) //获取当前时间 传入方法
            this.get_remind(myyear+'-'+mymonth+'-01')
            this.getData(this.dateArray)
            this.topdate = myyear + '年' + mymonth + '月'
        },
        methods: {
            chosetime(index, id, arr){
                if (id != '') {
                let array = arr
                for (let i = 0; i < array.length; i++) {
                    if (i == index) {
                        array[index].mark = true
                        if(array[index].id<myday){
                            this.hint = true
                        }else{
                            this.hint = false
                        }
                    } else {
                        array[i].mark = false
                    }
                }
                get_record(this, myyear + '/' + mymonth + '/' + id)
                    this.dateArray = array
                }
            },
             goleft(){
                this.has_record = false
                mydate = myyear + '-' + mymonth + '-' + myday
                this.dateArray = commonways(new Date(Util.GetPreMonth(mydate)), "left_right", this)
                this.get_remind(myyear+'-'+mymonth+'-01')
                this.topdate = myyear + '年' + mymonth + '月'
            },
            goright(){
                this.has_record = false
                mydate = myyear + '-' + mymonth + '-' + myday
                this.dateArray = commonways(new Date(Util.GetNextMonth(mydate)), "left_right", this)
                this.get_remind(myyear+'-'+mymonth+'-01')
                this.topdate = myyear + '年' + mymonth + '月'
            },
            go_details(item){

                if(item.agendaType=='0'){
                    // window.location.href="epipe://?&mark=memo&_id="+item.id
                    this.$router.push({path:'/memo',query:{id:item.id}})
                }else if(item.agendaType=='1'){
                    this.$router.push({path:'/meetingDetails',query:{id:item.id}})

                    // window.location.href="epipe://?&mark=meetingDetails&_id="+item.id
                }else if(item.agendaType=='2'){
                    // window.location.href="epipe://?&mark=planDetaild&_id="+item.id
                    this.$router.push({path:'/planDetails',query:{id:item.id}})
                }

            },
            getData(array){
                let arr = [];
                for(let i=0;i<array.length;i++){
                    if(array[i]&&array[i].id==myday){

                        for(let j=0;j<7-week;j++){
                            if(array[i+j]){
                                arr.push(array[i+j])
                            }
                        }

                        for(let j=0;j<week;j++){
                            if(array[i-j-1]){
                               arr.unshift(array[i-j-1])
                            }
                        }
                    }
                }
                this.minDate = JSON.parse(JSON.stringify(arr));
            },
            get_remind(firstDate){
                let arr = []
                let that = this;
                this.axios.get('/agenda/remind/mark',{params:{
                    firstDate,
                }}).then(res=>{
                    let obj = res.data.b
                    for(let keys in obj){
                        arr.push(obj[keys])
                    }

                        for(let j=0;j<that.dateArray.length;j++){
                            if(that.dateArray[j].id!=''){
                                that.dateArray[j].remind = arr[that.dateArray[j].id-1]
                            }
                        }
                        for(let j=0;j<that.minDate.length;j++){
                            if(that.minDate[j].id!=''){
                                that.minDate[j].remind = arr[that.minDate[j].id-1]
                            }
                        }
                    
                    that.$forceUpdate()
                })
            },
            hide(){
                this.dateHide = !this.dateHide;
                this.dateArray=commonways(new Date(),'left_right',this)
                this.get_remind(myyear+'-'+mymonth+'-01')
            },
            go_option(type){
                if(type==1){
                    this.$router.push({path:'/plan',})
                    // window.location.href="epipe://?&mark=plan"
                }else if(type==2){
                    this.$router.push({path:'/meeting',})
                    // window.location.href="epipe://?&mark=meeting"
                }else{
                    this.$router.push({path:'/memo',})

                    // window.location.href="epipe://?&mark=memo"

                }
            },
            history_back_click(){
                window.location.href = "epipe://?&mark=history_back"
            },
        },
        
    }
</script>

<style scoped lang="stylus">


.iconUp{
    transform:translateX(0.15rem) rotate(-90deg);
}

.iconDown{
    transform:translateX(0.15rem) rotate(90deg);
}

.option{
    background #fff;
    color #609ef7
    line-height 0.35rem;
    width 0.8rem;
    text-align center;
    border-radius 0.04rem;
    font-size 0.16rem;
    position absolute;
    z-index 999999;
    left -0.6rem;

    &:after{
        content ''

    }
}

.header{
        position relative;
        width: 100%;
        height: 0.44rem;
        text-align: center;
        line-height: 0.44rem;
        color: #fff;
        font-size: 0.18rem;
        font-weight bold;
        letter-spacing: 0.012rem;
        background-color #609ef7
        
        .back{
            position: absolute;
            left: 0;
            width: 0.5rem;
            text-align: left;
            .icon-back{
                font-size: 0.17rem;
                font-weight:bold;
                margin-left: 0.1rem;
            }
        }
        .redact{
            position:absolute;
            right:0;
            top:0;
            margin-right:0.15rem;
            font-size 0.15rem;
        }
    }

.date{
    background-color #609ef7
}

.show_btn{
    width 0.45rem;
    height 0.18rem;
    position absolute;
    background-color #80b1f9;
    bottom 0;
    left 0;
    right 0;
    margin auto;
    border-top-left-radius 0.05rem;
    border-top-right-radius 0.05rem;
}

.content{
    padding 0.3rem 0.25rem;
    background-color #fff;
}

.from{
    font-size 0.12rem;
    color #999;
}

.item-main{
    box-sizing border-box; 
    padding-left 0.2rem;
    position relative
    margin 0.08rem 0.1rem;
    height 0.7rem;
}

.line-left{
    &:after{
        content ''
        position absolute;
        height 0.7rem;
        width 0.01rem;
        left 0;
        top 0;
        background-color #dbdbdb
    }
}

.item-text{
    font-size 0.15rem;
    color #333;
    margin-bottom 0.10rem;
}

.item-info{
    svg{
        margin-right 0.08rem;
    }
}

.date{
    opacity 0.9;
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
  }

  .date_top_con li:first-child:active {
    background-color 0.3
  }

  .date_top_con li:last-child:active {
    opacity 0.3
  }

  .date_top_con .date_top_mytitle {
    display: flex;
    font-size: 0.17rem;
    font-weight: bold;
    width 54%
    color #fff
    justify-content center
    align-items center
  }

  .date_piker_con li {
    display: flex;
    justify-content: center;
    flex: 1;
    height: 0.29rem;
    align-items: center;
    // font-weight: bold;
    font-size: 0.15rem;
    color: #fff;
  }

  .date_piker_con {
    display: flex;
    flex-direction: row;
    height: 0.3rem;
  }

  .date_piker_li {
      position relative
    padding-top: 0.13rem;
    padding-bottom: 0.25rem;
    display: flex;
    display: -webkit-flex;
    flex-direction: row;
    flex-wrap: wrap;
    -webkit-flex-wrap: wrap;
    background-color: #609ef7;
    color #fff;
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
    font-size 0.15rem;
    font-weight bold;
    position relative;

    i{
        position absolute ;
        bottom 0.02rem;
        width 0.04rem;
        height 0.04rem;
        background-color #ff0
        border-radius 50%;
    }

  }

  .date_piker_li li .div_choserd {
    width: 0.34rem;
    height: 0.34rem;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    border-radius: 100px;
    background-color: #498ff2;
  }


  .no-content{
      text-align center;
      font-size 0.15rem;
      color #999;
      margin-top 1.2rem;
  }
</style>