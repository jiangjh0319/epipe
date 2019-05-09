<style scoped lang="stylus">
  @import "../../style/variable.styl";
  .top
    display flex
    flex-direction row
    border-bottom 0.01rem solid #ccc
    position fixed
    width 100%
    box-shadow: 0 0 15px rgba(160, 160, 160, 0.7);
    li
      flex 1
      text-align center
      height 0.48rem
      background-color #fff
      line-height 0.48rem
      font-size 0.17rem
      &:active
        background-color $bg_color

  .top_content
    position fixed
    top 0.49rem
    width 100%
    display flex
    flex-direction column
    box-shadow: 0px 5px 3px #f9f9f9;
    li
      height 0.44rem
      line-height 0.44rem
      border-bottom 1px solid #e5e5e5
      padding-left 0.2rem
      font-size 0.15rem
      background-color #fff
      animation: myfirst 0.08s;
      &:active
        background-color $bg_color

  .cirl_90 {
    transform: rotate(90deg)
    font-size: 0.17rem
  }

  .top_ul_yuan {
    animation: circle 0.3s;
    transform: rotate(-90deg)
  }

  .data_content
    display flex
    flex-direction column
    li
      margin 0.15rem 0.15rem 0 0.15rem
      background-color #fff
      padding 0.15rem
      border-radius 0.03rem
      overflow hidden
      line-height 0.24rem
      .div_date_2
        font-size 0.14rem
        color $font_color_6
      .div_date_1
        font-size 0.145rem
        color $font_color_3
      .span_title
        font-size 0.16rem
        color $font_color_3
        display flex
        justify-content space-between
        div
          &:nth-of-type(1)
            font-weight 600
          &:nth-of-type(2)
            width 0.75rem
            height 0.23rem
            background-color $green_color
            color #fff
            text-align center
            line-height 0.24rem
            margin-right -0.3rem
            font-size 0.14rem
            border-radius 0.4rem
            span
              margin-left -0.1rem
</style>
<template>
  <section>
    <ul class="top">
      <li @click="journal_chose">{{journal_text.text}}
        <svg class="icon cirl_90" v-bind:class="{ top_ul_yuan: journal_bool&&top_mark }" aria-hidden="false">
          <use xlink:href="#icon-right"></use>
        </svg>
      </li>
      <li @click="type_chose">{{type_text.text}}
        <svg v-bind:class="{ top_ul_yuan: type_bool&&top_mark }" class="icon cirl_90" aria-hidden="false">
          <use xlink:href="#icon-right"></use>
        </svg>
      </li>
      <li @click="time_chose">{{time_text.text}}
        <svg v-bind:class="{ top_ul_yuan: time_bool&&top_mark }" class="icon cirl_90" aria-hidden="false">
          <use xlink:href="#icon-right"></use>
        </svg>
      </li>
    </ul>
    <div style="height:0.49rem"></div>
    <ul v-show="top_mark" class="top_content">
      <li @click="chose_item(item)" v-for="item in data_type">{{item.text}}</li>
    </ul>
    <ul @click="top_mark=false" class="data_content">
      <li @click="go_detail(item)" v-for="(item,index) in data_list">
        <div class="span_title">
          <div>{{item.reportTitle}}</div>
          <div v-if="item.isDraft==1">
            <span>草稿</span>
          </div>
        </div>
        <div class="div_date_1">{{item.reportTime}}</div>
        <div class="div_date_2">工作总结 :</div>
        <div class="div_date_2 simple-ellipsis" v-html="item.workSummary">
        </div>
      </li>
    </ul>
    <div style="width: 100%;height: 46px;text-align: center;line-height: 46px;color: #666" v-if="!show">
      暂无更多日志
    </div>
    <infinite-loading  v-if="show" spinner="bubbles" :on-infinite="onInfinite" ref="infiniteLoading">
    <span slot="no-more">
      暂无更多加载
    </span>
      <span slot="no-results">
      暂无结果
    </span>
    </infinite-loading>
  </section>
</template>
<script>
  import InfiniteLoading from 'vue-infinite-loading';
  let get_data = (that) => {
    that.axios.get(that.Service.workList, {
      params: {
        reportType: that.type_text.num,
        receiveType: that.journal_text.num,
        reportTime: that.time_text.num,
        pageSize: 10,
        pageNo: 1
      }
    }).then(function (data) {
      if (data.data.h.code == 200) {
        that.show=true
        that.data_list = data.data.b.data;
      }
    })
  }
  let pageNo = 2
  export default {
    data () {
      return {
        journal_check: [{text: "我接收的", num: 1}, {text: "我的", num: 2}, {text: "所有对象", num: 0}],  //初始化数据
        type_check: [{text: "日报", num: 1}, {text: "周报", num: 2}, {text: "月报", num: 3}, {text: "所有日志", num: 0}],
        time_check: [{text: "一个月", num: 1}, {text: "三个月", num: 2}, {text: "半年", num: 3}, {text: "不限时间", num: 0}],
        journal_text: {text: "所有对象", num: 0}, //三个导航栏数据
        type_text: {text: "所有日志", num: 0},
        time_text: {text: "不限时间", num: 0},
        journal_bool: false,   //三个箭头的布尔值
        type_bool: false,
        time_bool: false,
        data_type: [],  //列表数据
        top_mark: false, //是否显示列表
        show: true,
        data_list: []
      }
    },
    components: {
      InfiniteLoading
    },
    methods: {
      journal_chose(){
        this.journal_bool = true
        this.type_bool = false
        this.time_bool = false
        if (this.data_type == this.journal_check || this.data_type.length == 0) {
          this.top_mark = !this.top_mark
        } else {
          this.top_mark = true
        }
        this.data_type = this.journal_check
      },
      type_chose(){
        this.journal_bool = false
        this.type_bool = true
        this.time_bool = false
        if (this.data_type == this.type_check || this.data_type.length == 0) {
          this.top_mark = !this.top_mark
        } else {
          this.top_mark = true
        }
        this.data_type = this.type_check

      },
      time_chose(){
        this.journal_bool = false
        this.type_bool = false
        this.time_bool = true
        if (this.data_type == this.time_check || this.data_type.length == 0) {
          this.top_mark = !this.top_mark
        } else {
          this.top_mark = true
        }
        this.data_type = this.time_check

      },
      chose_item(item){
        console.log(item)
        let that = this;
        this.top_mark = false
        if (this.data_type == this.journal_check) { //选择对象 我的 我接收的
          window.scrollTo(0, 0)
          that.journal_text = item
          get_data(that)
          pageNo = 2
        } else if (this.data_type == this.type_check) {
          window.scrollTo(0, 0)
          that.type_text = item
          get_data(that)
          pageNo = 2
        } else if (this.data_type == this.time_check) {
          window.scrollTo(0, 0)
          that.time_text = item
          get_data(that)
          pageNo = 2
        }
      },
      onInfinite: function () {
        let that = this;
        this.axios.get(this.Service.workList, {
          params: {
            reportType: that.type_text.num,
            receiveType: that.journal_text.num,
            reportTime: that.time_text.num,
            pageSize: 10,
            pageNo: pageNo
          }
        }).then(function (data) {
          console.log(data)
          setTimeout(() => {
            if (data.data.h.code == 10) {
              // window.location.href = "epipe://?&mark=login_out"
            } else if (data.data.h.code == 200) {
              if (data.data.b.pageTotal == pageNo || data.data.b.pageSize >= data.data.b.dataTotal) {
                that.show = false
              }
              pageNo++
              that.data_list = that.data_list.concat(data.data.b.data);
              that.$refs.infiniteLoading.$emit('$InfiniteLoading:loaded');
            }
          }, 200);

        })
      },
      go_detail: function (item) {
        console.log(item.id)
        window.location.href = "epipe://?&mark=journaldetail&_id=" + item.id;
      }
    },
    mounted(){
      let that = this;
      get_data(that)
      window["epipe_getid_callback"] = id => {
        let array = []
        for (let i = 0; i < that.data_list.length; i++) {
          if (that.data_list[i].id != id) {
            array = array.concat(that.data_list[i])
          }
        }
        that.data_list = array
      }
    }
  }
</script>
