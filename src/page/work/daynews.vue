<style scoped lang="stylus">
  @import "../../style/variable.styl";
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
      height 0.55rem
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
  .accessory{
    margin 0.15rem;
    background-color #fff
  }

  .redact_btn{
    margin 0 0.15rem;
    background-color:#609ef7;
    color:#fff;
    text-align center
    line-height 0.4rem;
    font-size 0.16rem;
    border-radius 0.05rem;
  }

  
</style>
<template>
  <section class="padding_bottom_content">
    <TopHead mark="mark" title="日报"
      v-on:history_back="history_back_click"
    ></TopHead>
    <div style="margin-top: 0.44rem">
      <TimeTab time_type="day" font_color="#609ef7" v-on:data_time="day_data_time"></TimeTab>
    </div>
    <div>
      <WorkInput
        v-on:text_change="text_change"
        :is_input=!has_journal
        title="工作总结"
        maxlength="5000"
        color="#609ef7"
        :work_value="journal_detail.workSummary?journal_detail.workSummary:work_value"
        :work_text="journal_detail.workSummary?journal_detail.workSummary:work_value"
        placeholder="请在此处输入您的工作总结,限定5000字"
      ></WorkInput>

      <WorkInput
        v-on:text_change="text_change"
        :is_input=!has_journal
        title="备注"
        maxlength="40"
        color="#609ef7"
        placeholder="请输入您的备注~"
        :work_value="journal_detail.remarks?journal_detail.remarks:mark_value"
        :work_text="journal_detail.remarks?journal_detail.remarks:mark_value"
      ></WorkInput>

      <div class="accessory" v-if="!has_journal">
          <Accessory
            :accessory="accessory"
          >
            </Accessory>

      </div>

      <div class="accessory" style="padding:0.15rem;" v-if="has_journal&&accessory.length">
        <AccessoryList
            :accessory="accessory"
          >

          </AccessoryList>
      </div>

      <CopeMan
        :has_journal="!has_journal"
        color="#609ef7"
        :data_list=chosed_list
        v-on:remove_item="remove_item"
        :types = '2'
         hint=1
      ></CopeMan>
      <WorkButton
        v-if="!has_journal"
        v-on:left_click="left_click_button"
        v-on:right_click="right_click_button"
        left_title="存草稿"
        right_title="发送"
        bgcolor="#609ef7"
      ></WorkButton>
    </div>

    <Comment
      v-if="has_journal"
      :data='journal_detail'
    >
    </Comment>

    <div v-if="has_journal" class="redact_btn" @click="redact">
      编 辑
    </div>

    <Dialog
        lfText="保存"
        rgText="不保存"
        content="保存此次编辑?"
        v-on:lfClick="lf_click"
        v-on:rgClick="rg_click"
        v-show="isShow"
        >
      </Dialog>
  </section>
</template>
<script>
  /*
   * 存日记或者存草稿 方法
   * */ 
  let save_day = (index, text, that) => {
    if (that.work_value.length == 0) {
      that.$toast("请输入工作总结")
    } else if (that.chosed_list.length == 0) {
      that.$toast("请选择抄送人")
    } else {
      let string_id = ""
      for (var i = 0; i < that.chosed_list.length; i++) {
        string_id = string_id + "|" + that.chosed_list[i].userId
      }
      string_id = string_id.slice(1)

      let urlStr = '',fileSizeStr = '',fileNameStr = '';
        for(let i=0;i<that.accessory.length;i++){
            urlStr+='|'+that.accessory[i].url;
            fileSizeStr+='|'+that.accessory[i].fileSize;
            fileNameStr+='|'+that.accessory[i].fileName;  
        }
        urlStr = urlStr.slice(1)
        fileSizeStr = fileSizeStr.slice(1)
        fileNameStr = fileNameStr.slice(1)

      that.axios({
            method:"post",
            url:that.Service.reportAdd,
            headers:{
                'Content-type': 'application/x-www-form-urlencoded'
            },
            data:{
              workSummary: that.work_value.replace(/\n/g, '<br/>'),
              remarks: that.mark_value.replace(/\n/g, '<br/>'),
              reportType: 1,
              id: that.journal_detail.id ? that.journal_detail.id : "",
              reportTimeStr: that.reportTimeStr,
              reportTime: that.reportTime,
              receiveUserIds: string_id,//id串
              isDraft: index,
              urls:urlStr,
              fileSizes:fileSizeStr,
              fileNames:fileNameStr
            },
            transformRequest: [function (data) {
                let ret = ''
                for (let it in data) {
                ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
                }
                return ret
            }],
        }).then((data)=>{
            if (data.data.h.code == 200) {
                that.$alert(text).then(
                  function () {
                    window.sessionStorage.mark_value = ""
                    window.sessionStorage.work_value = ""
                    localStorage.removeItem('daynews')
                    window.location.href = "epipe://?&mark=history_back"
                  }
                )
              }else{
                that.$toast(data.data.h.msg)
              }
        })
    }
  }
  /*
   * 获取某一天日记的 方法
   * */
  let getdetail = (that) => {

    that.axios.get(that.Service.reportQuery, {
      params: {
        reportType: 1,
        reportTime: that.reportTime
      }
    }).then(function (data) {
      if (data.data.h.code == 200) {
        that.work_value = ''
        that.mark_value = ''
        that.chosed_list = [];
        // if (window.localStorage.chosed_list) {
        //   that.chosed_list = JSON.parse(window.localStorage.chosed_list)
        // }
        that.has_journal = true
        that.journal_detail = {}
        that.accessory = [];
        if (data.data.b == null) {
          that.has_journal = false
          that.getItem();
        } else if (data.data.b) {
          that.URL = data.data.b.imgData
          if (data.data.b.isDraft == 1) {
            data.data.b.workSummary = Util.HTMLDecode(data.data.b.workSummary)
            data.data.b.remarks = Util.HTMLDecode(data.data.b.remarks)
            that.journal_detail = data.data.b
            that.chosed_list = data.data.b.receiverData
            that.has_journal = false
            that.work_value = data.data.b.workSummary.replace(/\n/g, '<br/>')
            that.mark_value = data.data.b.remarks.replace(/\n/g, '<br/>')
            that.accessory = that.accessoryFor(data.data.b)
            that.getItem();
          }else if(data.data.b.isDraft == 0){
             that.journal_detail = data.data.b
            that.chosed_list = data.data.b.receiverData
            that.has_journal = true
            that.accessory = that.accessoryFor(data.data.b)
            that.oldData.reportTime =''
          }else {
            that.has_journal = false
            that.mark_value = ''
            that.work_value = data.data.b.workSummary.replace(/\n/g, '<br/>')
            that.getItem();
          }
        }
      }
    })
  }
  import {mapState, mapMutations} from 'vuex';
  import Util  from '../../js/Util.js' //工具
  import TimeTab  from '../../components/worknews/time_tab.vue'  //头部时间切换
  import TopHead  from '../../components/topheader.vue'  //header导航栏
  import WorkInput  from '../../components/worknews/work_input.vue'  //输入框
  import WorkButton  from '../../components/worknews/work_button.vue'   //提交按钮
  import CopeMan  from '../../components/worknews/copy_man.vue'    //抄送人
  import Comment  from '../../components/worknews/comment.vue'    //
  import Dialog  from '../../components/oa/dialog.vue'    //弹窗
  import Accessory  from '../../components/worknews/accessory_select.vue'    //附件
  import AccessoryList  from '../../components/oa/accessoryList.vue'  //附件


  export default {
    data () {
      return {
        work_value: '',
        mark_value: '',
        reportTimeStr: '',//汇报时间 字符串
        reportTime: '',//汇报时间 yyyy-MM-dd
        chosed_list: [], //抄送人
        chosed_list_two: [], //抄送人
        has_journal: true, //是否有日志
        journal_detail: {},
        isShow:false,
        accessory:[],
        oldData:{},
        isCheck:false,

      }
    },
    components: {
      TimeTab,
      WorkInput,
      WorkButton,
      CopeMan,
      TopHead,
      Dialog,
      Accessory,
      Comment,
      AccessoryList
    },
    methods: {
      /*
       * 左右点击时间
       * */
      day_data_time: function (data, text) { //子组件接收时间数据
        let that = this;
        this.reportTime = data
        this.reportTimeStr = text
        getdetail(that)
      },
      redact(){//重新编辑
        this.has_journal = false;
        this.work_value = this.journal_detail.workSummary
        this.mark_value = this.journal_detail.remarks
        this.journal_detail.workSummary = this.journal_detail.workSummary.replace(/<br\/>/g,'\n') 
        this.journal_detail.remarks = this.journal_detail.remarks.replace(/<br\/>/g,'\n')  
        this.change_man(this.chosed_list)

      },
      text_change: function (data, title) { //实时监听工作内容输入
        if (title == "工作总结") {
          window.sessionStorage.work_value = data
          if (data.length >= 5000) {
            this.$toast("最多输入5000字~")
          }
          this.work_value = data
        } else {
          window.sessionStorage.mark_value = data
          if (data.length >= 40) {
            this.$toast("最多输入40字~")
          }
          this.mark_value = data
        }
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
    
       history_back_click(){

             if(this.oldData.reportTime!=this.reportTime||!this.isCheck||!this.Util.isUpdate(this.$data,this.oldData)){

                 window.location.href = "epipe://?&mark=history_back"
                 
            }else{
                this.isShow = true;
            }
        },
        lf_click(){
            this.isShow=false;
            localStorage.setItem('daynews',JSON.stringify(this.$data))
            window.location.href = "epipe://?&mark=history_back"
        },
        rg_click(){
            this.isShow=false;
            localStorage.removeItem('daynews')
            window.location.href = "epipe://?&mark=history_back"
        },
        getItem(){
             if(localStorage.getItem('daynews')){
              let weekdata = JSON.parse(localStorage.getItem('daynews'))
                  for(let key in weekdata){
                      this.$data[key] = weekdata[key]
                  }
                this.$data.journal_detail.workSummary = weekdata['work_value'].replace(/<br\/>/g,'\n')
                this.$data.journal_detail.remarks = weekdata['mark_value'].replace(/<br\/>/g,'\n')
                this.change_man(this.$data.chosed_list)
            }
            this.isCheck = true;
            this.oldData = JSON.parse(JSON.stringify(this.$data))
        },
      get_camera: function () { //调用手机摄像头
        let that = this;
        if (that.URL.length >= 8) {
          this.$alert("最多选择8张图片")
        } else {
          window.location.href = "epipe://?&mark=camera&num=" + that.URL.length
          window["epipe_camera_callback"] = URL => {
            that.URL = that.URL.concat(URL);
            if (window.sessionStorage.work_value) {
              this.journal_detail = Object.assign(this.journal_detail, {workSummary: window.sessionStorage.work_value})
            }
            if (window.sessionStorage.mark_value) {
              this.journal_detail = Object.assign(this.journal_detail, {remarks: window.sessionStorage.mark_value})
            }
          }
        }
      },
      go_imgdetail: function (index) { //查看图片详情
        let obj = {index_num: index, data: this.URL, type: this.has_journal ? "0" : "1"}
        window.location.href = "epipe://?&mark=imgdetail&url=" + JSON.stringify(obj);
      },
      left_click_button: function () { //存草稿
        let that = this;
        this.$confirm("是否确定存入草稿")
          .then(function () {
            save_day(1, "存入草稿成功", that)
          }).catch(
          function () {
          }
        )
      },
      right_click_button: function () {  //发送
        let that = this;
        this.$confirm("是否确定发送")
          .then(function () {
            save_day(0, "发送成功", that)
          }).catch(
          function () {
          }
        )
      },
      ...mapMutations([
        'change_man'
      ]),
      remove_item: function (itme, index) {   //删除抄送人
        this.chosed_list.splice(index, 1);
        this.change_man(this.chosed_list)
      }
    },
    mounted(){
      let that = this;
      // this.axios.get(this.Service.reportReceiver).then(function (data) { //查询抄送人
      //   if (data.data.h.code == 10) {
      //     window.location.href = "epipe://?&mark=login_out"
      //   } else if (data.data.h.code == 200) {
      //     that.chosed_list = data.data.b.data
      //     window.localStorage.chosed_list = JSON.stringify(that.chosed_list)
      //     that.change_man(that.chosed_list)
      //   }
      // })
      getdetail(that)
      window["epipe_removephoto_callback"] = index => {//原生的调用删除图片的方法
        that.URL.splice(parseInt(index), 1)
        if (window.sessionStorage.work_value) {
          this.journal_detail = Object.assign(this.journal_detail, {workSummary: window.sessionStorage.work_value})
        }
        if (window.sessionStorage.mark_value) {
          this.journal_detail = Object.assign(this.journal_detail, {remarks: window.sessionStorage.mark_value})
        }
      }
    },
    computed: mapState(["chosed_man_state"]), //监听 shosed_man_state 的变化
    /*
     * 被keep live了
     */
    activated(){
      this.chosed_list = this.chosed_man_state
      if (window.sessionStorage.work_value) {
        this.journal_detail = Object.assign(this.journal_detail, {workSummary: window.sessionStorage.work_value})
      }
      if (window.sessionStorage.mark_value) {
        this.journal_detail = Object.assign(this.journal_detail, {remarks: window.sessionStorage.mark_value})
      }
    }
  }
</script>
