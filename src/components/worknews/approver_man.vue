<style scoped lang="stylus">
  @import "../../style/variable.styl";
  /*
 审批人
 */
  .day_chose_ul2
    display flex
    flex-direction column
    margin 0.15rem 0.15rem 0 0.15rem
    background-color #fff
    border-radius 0.03rem
    padding 0.1rem 0.15rem 0.15rem 0.15rem
    .day_chose_ul3
      width 100%
      display flex
      height 0.77rem
      flex-direction row
      overflow hidden
      flex-wrap wrap
      margin-top 0.02rem
      .day_chose_ul3_li
        &:active
          opacity $opacity_common
      p
        text-align center
        position relative
        left 0.13rem
        height 0.08rem
      li
        width 25%
        padding-top 0.12rem
        text-align center
        div
          font-size 0.13rem
        img
          width 0.33rem
          height 0.33rem
          border-radius 0.33rem
    .day_chose_ul4
      display flex
      align-items center
      .day_div_two
        font-size 0.15rem
        color $blue_color
        font-weight normal
        padding 0.05rem 0.12rem 0.05rem 0.12rem
        &:active
          opacity $opacity_common
      .day_div_one
        flex 1
        .title_h
          font-size 0.15rem
          color $font_color_3
          font-weight bold
        span
          font-size 0.13rem
          color $font_color_6
          font-weight normal
  .my-test
    -webkit-box-shadow: 0 0 0.2rem rgba(238,65,54,.1)   
    box-shadow 0 0 0.2rem rgba(238,65,54,.1)
    .day_chose_ul2
      margin 0
      margin-top 0.15rem;

  .list_man{
    display flex;
  }
  .arrows{
      width 0.12rem;

      svg{
        margin-top:0.2rem;
      }
  }
   .guide{
      position fixed;
      top:0;
      left:0;
      width 100%;
      height 100%;
      background-color rgba(0,0,0,0.3)
      z-index 3;
    }

    .guide_content{
          position absolute;
          top:50%;
          left:50%;
          // height 3rem;
          width 91%;
          background-color #fff;
          z-index 10
          transform: translate(-50%, -50%);
          padding-bottom 0.15rem;
    }

    .guide_item{
      position relative;
      width 33.33%;
      text-align center;

      span{
        font-size 0.12rem;
        color #999;
      }
    }

    .guide_item:nth-child(1),.guide_item:nth-child(2),.guide_item:nth-child(3){
        float left;
        padding-bottom 0.35rem;

        .guide_arrows{
          position absolute;
          right -6px;
          top 0.1rem;
        }
    }

    .guide_item:nth-child(3) .guide_arrows{
        transform rotate(90deg)
        position absolute;
        width 0.2rem;
        height 0.12rem;
        bottom -0.5rem;
        left 0;
        right 0;
        margin auto ;
    }


    .guide_item:nth-child(4),.guide_item:nth-child(5),.guide_item:nth-child(6){
        float right;
        .guide_arrows{
          position absolute;
          left -6px;
          top 0.1rem;
          transform rotate(180deg)
        }
    }

     .guide_item:nth-child(6){
        padding-bottom 0.35rem;
     }

    .guide_item:nth-child(6) .guide_arrows{
        transform rotate(90deg)
        position absolute;
        width 0.2rem;
        height 0.12rem;
        bottom -0.5rem;
        left 0;
        right 0;
        margin auto ;
    }

    .guide-title{
       height 0.4rem;
       line-height 0.4rem;
       padding-left 0.15rem;
       font-size 0.13rem;
       color #666;
       border 1px solid #e6e6e6;
       margin-bottom 0.15rem;
    }

    .guide_btn{
         clear both

        a{
          display block;
          width 1.2rem;
          height 0.35rem;
          line-height 0.35rem;
          background-color #f80
          color #fff;
          text-align center
          border-radius 0.04rem;
          margin 0 auto ;
        }
    }
</style>
<template>
  <section :class="special_class?'my-test':''">
    <ul class="day_chose_ul2">
      <li class="day_chose_ul4">
        <div class="day_div_one">
           <span class="title_h">{{title?title:'审批人'}}</span>
           <span v-if="has_journal&data_list.length!=false">（已添加{{data_list.length}}人）</span>
           <span v-if="!data_list.length">({{minTitle?minTitle:'审批人'}})</span>
           <span style="color:#609ef7" v-if="!title" @click="isShowGuide=true">添加指引</span>
           </div>
        <div v-if="more_prople&data_list.length>3"  @click="open_people" class="day_div_two">点击收缩</div>
        <div v-if="!more_prople&data_list.length>3"  @click="open_people" class="day_div_two">
          查看全部
        </div>
      </li>
      <ul class="day_chose_ul3" :style="more_prople?'height:auto':'height:0.77rem'">

        <!-- <li @click="remove_man(item,index)" v-for="(item,index) in data_list">
          <div>
            <p>
              <svg v-if="has_journal" style="font-size: 0.15rem" class="icon" aria-hidden="false">
                <use xlink:href="#icon-shanchu"></use>
              </svg>
            </p>
            <img v-if="item.profileImg.length<=1" src="/static/img/tou.81b395f.png"/>
            <img :src=item.profileImg|man_photo_format v-if="item.profileImg.length>1"/>
            <div v-html="item.name"></div>
          </div>

          <div class="arrows">
              <svg style="font-size: 0.12rem;margin-top: 0.085rem" class="icon" aria-hidden="false">
                <use xlink:href="#icon-jiantou1"></use>
               </svg>
          </div>
        </li> -->
        <li class="list_man" @click="remove_man(item,index)" v-for="(item,index) in data_list">
          <div style="flex:1">
            <p>
              <svg v-if="has_journal" style="font-size: 0.15rem" class="icon" aria-hidden="false">
                <use xlink:href="#icon-shanchu"></use>
              </svg>
            </p>
              <img v-if="item.profileImg.length<=1" src="/static/img/tou.81b395f.png"/>
              <img :src=item.profileImg|man_photo_format v-if="item.profileImg.length>1"/>
              <div v-html="item.name"></div>
          </div>
          <div class="arrows">
               <svg style="font-size: 0.12rem" class="icon" aria-hidden="false">
                <use xlink:href="#icon-jiantou1"></use>
               </svg>
          </div>
        </li>

        <li v-if="has_journal" class="day_chose_ul3_li" @click="go_imchoice" style="width:20%">
          <svg style="font-size: 0.33rem;margin-top: 0.085rem" class="icon" aria-hidden="false">
            <use xlink:href="#icon-tianjiarenyuan"></use>
          </svg>
          <div style="margin-top: 0.055rem">添加</div>
        </li>
      </ul>
    </ul>

    <div class="guide" v-if="isShowGuide" @touchmove.prevent @click="isShowGuide=false">
        <div class="guide_content">
            <div class="guide-title">
                请参考以下流程添加审批人
            </div>
            <div style="margin-bottom:0.2rem;overflow:hidden">
                <div class="guide_item" v-for="(item,index) in guideData[type]" :key="index">
                  <svg style="font-size: 0.4rem" class="icon" aria-hidden="false">
                    <use xlink:href="#icon-shenpiliuchengtouxiang"></use>
                  </svg>
                  <p>{{item}}</p>
                  <span v-if="index==guideData[type].length-1&item=='人事行政部门'">(抄送)</span>
                  <div class="guide_arrows">
                      <svg style="font-size: 0.12rem" class="icon" aria-hidden="false" v-if="index!=guideData[type].length-1">
                        <use xlink:href="#icon-jiantou1"></use>
                      </svg>
                  </div>
                </div>
            </div>
           

            <div class="guide_btn">
                <a @click="isShowGuide=false">知道了</a>
            </div>
        </div>
    </div>
  </section>
</template>
<script>
  export default {
    data () {
      return {
        more_prople: true,
        isShowGuide:false,
        guideData:[
          ['发起人','部门负责人','人事行政部门','总经理','人事行政部门'],// 
          ['发起人','部门负责人','财务管理中心','总经理','人事行政部门'],
          ['发起人','部门负责人','财务管理中心','法务部','总经理','董事办'],
          ['发起人','相关领导1','相关领导2','相关领导3','公司领导','董事办'],
          ['发起人','部门负责人','总经理','人事行政部门'],
          ['发起人','部门负责人','财务管理中心','法务部','用印管理部门','总经理','董事办'],
          ['发起人','部门负责人','综合管理中心','财务管理中心','总经理','董事办'],//离职
          ['发起人','部门负责人','总经理','综合管理中心','董事办'], //接待
          ['发起人','部门负责人','综合管理中心','总经理','人事行政部门'], //补卡
          ['发起人','部门负责人','综合管理中心','总经理','董事办'],//用人 转正
          ['发起人','部门负责人','财务管理中心','总经理','董事办'],//付款 借款
          ['发起人','部门负责人','综合管理中心'],//用车
          ['发起人','部门负责人','研发中心负责人','总经理','董事办'],//项目立项
        ]
      }
    },
    props: [
      'color', 'data_list', 'has_journal','special_class','isGroup','type','title','minTitle'
    //  颜色  选中的联系人数据  
    ],
    methods: {
      open_people: function () {
        // if (this.more_prople) {
        //   document.getElementsByClassName("day_chose_ul3")[0].style.height = "auto"
        // } else {
        //   document.getElementsByClassName("day_chose_ul3")[0].style.height = "0.77rem"
        // }
        this.more_prople = !this.more_prople
      },
      go_imchoice: function () {
          this.$router.push({path: 'imchoices', query: {bgcolor:this.color,num:1}})
      },
      remove_man: function (item, index) {
        if (this.has_journal) {
          this.$emit("remove_item", item, index,true)
        }
      }
    },
    mounted(){
    },
    activated(){
      if (this.data_list.length > 3) {
        this.more_prople = true
      } else {      
        this.more_prople = false
      }
    }
  }
</script>
