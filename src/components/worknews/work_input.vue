<style scoped lang="stylus">
  @import "../../style/variable.styl";
  ::-webkit-input-placeholder { /* WebKit browsers */
    color: $font_color_9;
  }

  .day_topcontent
    margin 0.15rem 0.15rem 0 0.15rem
    background-color #fff
    border-radius 0.03rem
    padding 0.15rem
    .day_p_content2
      display flex
      justify-content flex-end
      font-size 0.14rem
    .day_p_content /*padding-top 0.05rem
      margin-top 0.05rem*/
      word-wrap: break-word
      background-color #fff
      font-size 0.15rem
      line-height 0.28rem
      color $font_color_3
      width 100%
      border none
      outline none
      max-height 1.93rem
    /*overflow-y scroll*/
    .day_p_title
      font-size 0.15rem
      font-weight bold
      color $font_color_3
</style>
<template>
  <section>
    <div>
      <div class="day_topcontent">
        <p class="day_p_title">{{title}}：</p>
        <textarea :style="{height:title=='备注'?'0.49rem':'1.92rem'}"
                  v-show="is_input"
                  v-on:input="text_change()"
                  v-model="work_value"
                  :maxlength="maxlength"
                  :placeholder=placeholder
                  class="day_p_content"></textarea>

        <div v-show="!is_input" style="height: auto;overflow-y: scroll" v-html="work_text" class="day_p_content">

        </div>

        <div v-if="is_input" class="day_p_content2" :style="{color:color}">
          {{work_value.length}}/{{maxlength}}
        </div>
      </div>
    </div>
  </section>
</template>
<script>
  export default {
    data () {
      return {//工作总结
      }
    },
    props: [
      "title","placeholder", "maxlength", "color", "is_input", "work_value","work_text"
    ],
    methods: {
      text_change: function () { //实时监听工作内容输入
        this.$emit("text_change", this.work_value, this.title)
//        console.log(this.work_value.replace("\n", "<br/>"))
//        if (this.work_value.replace("\n", "<br/>").length >= 1000) {
//          this.$toast("工作总结不超过1000字")
//        }
      }
    },
    mounted  (){


    }
  }
</script>
