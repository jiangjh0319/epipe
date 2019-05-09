<style scoped lang="stylus">
  @import "../../style/variable.styl";
  .img_title {
    margin: 0.15rem;
    background-color: #fff;
    margin-bottom: 0;
    font-size: 0.16rem;
    font-weight: 600;
    padding 0.15rem
    padding-bottom 0
  };
  .img_ul
    display flex
    flex-direction row
    margin 0.15rem
    margin-top 0
    padding-bottom 0.1rem
    border-radius 0.03rem
    flex-wrap wrap
    padding-left 0.04rem
    background-color: #fff
    li
      width 0.7rem
      border-radius 0.03rem
      overflow hidden
      margin-left 0.11rem
      height 0.5rem
      margin-top 0.1rem

  .day_chose_img
    margin 0.15rem 0.15rem 0 0.15rem
    background-color #fff
    display flex
    border-radius 0.03rem
    padding 0.15rem
    flex-direction row
    align-items center
    &:active
      background-color $bg_color
    .day_chose_span2
      font-size 0.14rem
      color $font_color_6
      padding-right 0.15rem
    .day_chose_span
      font-size 0.15rem
      color $font_color_3
      font-weight bold
      flex 1

  .detail_top
    margin 0.15rem
    background-color #fff
    border-radius 0.03rem
    padding 0.15rem
    .detail_top_1
      font-size 0.16rem
      font-weight 600
      padding-bottom 0.08rem
    .detail_top_2
      display flex
      flex-direction row
      font-size 0.14rem
      justify-content space-between

  .top_edit {
    position: fixed;
    top: 0.44rem;
    right: 0;
    background-color: $orange_color;
    opacity 0.9
    color #fff
    padding 0 0.1rem 0 0.1rem
    animation opacity_show 0.35s
    box-shadow: 1 1 20px rgba(160,160,160,0.7);
  }

  .top_edit li {
    width: 0.78rem;
    height 0.44rem
    line-height 0.44rem
    text-align center
    font-size 0.15rem
  }

  .detail_head {
    position fixed
    top 0
  }

  .accessory{
    margin 0.15rem;
    background-color #fff
  }

</style>
<template>
  <section class="padding_bottom_content">
    <div class="detail_head">
      <TopHead native="native" :is_button="detail.isDraft==1" v-on:show_edit="show_edit_button" :title=detail.reportTitle
               bgcolor="#ff8800"></TopHead>
    </div>
    <div @click="is_showedit=false">
      <ul v-if="is_showedit" class="top_edit">
        <li @click="remove_detail" style="height: 0.4rem">删除</li>
      </ul>
      <div style="margin-top: 0.59rem">
        <ul class="detail_top">
          <li class="detail_top_1" v-if="detail.reportType==1">日报日期</li>
          <li class="detail_top_1" v-if="detail.reportType==2">周报日期</li>
          <li class="detail_top_1" v-if="detail.reportType==3">月报日期</li>
          <li class="detail_top_2">
            <div>{{detail.reportTime}}</div>
            <div style="font-size: 0.13rem;color: #666">
              提交时间: {{detail.submitTime ? detail.submitTime.substring(0, 10) : ""}}
            </div>
          </li>
        </ul>
        <WorkInput
          :is_input=false
          :work_text="detail.workSummary"
          title="工作总结"
          color="#609ef7"
          maxlength="1000"
          input_height="1.93"
          placeholder="请在此处输入您的工作总结~"></WorkInput>
        <div v-if="detail.reportType==2|detail.reportType==3">
          <WorkInput
            :is_input=false
            :work_text="detail.nextPlan"
            :title='detail.reportType==2?"下周计划":"下月计划"'
            color="#609ef7"
            maxlength="1000"
            input_height="1.93"
            placeholder="请在此处输入您的工作总结~"></WorkInput>
        </div>
        <div v-if="img_list.length>0" class="img_title">图片</div>
        <ul class="img_ul"  style="background-color: #fff">
          <li @click="go_imgdetail(index)" v-for="(itme,index) in img_list" :key="index">
            <img :src=itme|journal_img style="width: 100%;height: 100%"/>
          </li>
        </ul>
       <WorkInput
          type="work_detail"
          color="#609ef7"
          :work_text="detail.remarks"
          :is_input=false
          title="备注"
          maxlength="40"
          placeholder="请输入您的备注~"></WorkInput>

          <div class="accessory" style="padding:0.15rem;" v-if="accessory.length">
            <AccessoryList
                :accessory="accessory"
              >

              </AccessoryList>
          </div>

        <CopeMan
          :has_journal="false"
          color="#609ef7"
          :data_list="chosed_list"
        ></CopeMan>
        <Comment
          :data="detail"
        >

        </Comment>
      </div>
    </div>
  </section>
</template>
<script>
  import Util  from '../../js/Util.js'
  import WorkInput  from '../../components/worknews/work_input.vue'
  import TopHead  from '../../components/topheader.vue'
  import CopeMan  from '../../components/worknews/copy_man.vue'
   import Comment  from '../../components/worknews/comment.vue'    //
  import Accessory  from '../../components/worknews/accessory_select.vue'    //附件
  import AccessoryList  from '../../components/oa/accessoryList.vue'  //附件
  export default {
    data () {
      return {
        is_showedit: false,
        detail: "",
        chosed_list: [],
        img_list: [],
        accessory:[],
      }
    },
    components: {
      WorkInput,
      TopHead,
      CopeMan,
      Comment,
      Accessory,
      AccessoryList
    },
    methods: {
      go_imgdetail: function (index) {
        let obj = {index_num: index, data: this.img_list, type:"0"}
        window.location.href = "epipe://?&mark=imgdetail&url=" + JSON.stringify(obj);
      },
      accessoryFor:function(datas){
                if(!datas.urls) return [];
               let urlArr = datas.urls.split('|')
               let fileSizeArr = datas.fileSizes.split('|')
               let fileNameArr = datas.fileNames.split('|')
               let arrs = [];
                for(let i=0;i<urlArr.length;i++){
                    let bool = this.Util.isImg(urlArr[i])
                    arrs.push({
                        url:urlArr[i],
                        fileSize:fileSizeArr[i],
                        fileName:fileNameArr[i],
                        isImg: bool,
                    })
                }
                return arrs
            },
      remove_detail: function () {
        let that = this;
        that.$confirm("是否确定删除").then(function () {
          that.axios.post(that.Service.reportDelete + that.Service.queryString({id: that.detail.id})).then(function (data) {
            console.log(data)
          if (data.data.h.code = 200) {
              that.$alert("删除成功").then(
                function () {
                  window.location.href = "epipe://?&mark=history_back&_id=" + that.detail.id
                }
              )
            }
          })
        })
      },
      show_edit_button: function () {
        this.is_showedit = !this.is_showedit
      }
    },
    mounted(){
      let that = this;
      let _id = this.$route.query.id
      this.axios.get(this.Service.reportDetail, {params: {id: _id}}).then(function (data) {
        console.log(data)
        if (data.data.h.code = 200) {
          that.detail = data.data.b
          that.chosed_list = data.data.b.receiverData
          that.img_list = data.data.b.imgData
          that.accessory = that.accessoryFor(data.data.b)
        }
      })
    }
  }
</script>
