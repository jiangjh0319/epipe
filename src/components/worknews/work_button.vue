<style scoped lang="stylus">
  @import "../../style/variable.styl";
  /*
 提交
 */
  .day_button li:active {
    opacity $opacity_common
  }

  .day_button
    display flex
    margin 0.25rem 0.15rem 0 0.15rem
    padding-bottom 0.3rem
    flex-direction row
    justify-content space-between
    letter-spacing 2px
    li
      width 48%
      height 0.5rem
      background-color $green_color
      border-radius 0.03rem
      display flex
      justify-content center
      align-items center
      color #fff
      font-size 0.18rem
      &:nth-last-child(1)
        background-color $blue_color
      &:nth-child(1)
        background-color $bg_color
        color $font_color_6
        border 1px solid $font_color_6
  svg{
    margin-right 0.08rem;
  }
</style>
<template>
  <section>
    <ul class="day_button">
      <li @click="left_click">
        <svg v-if="noSvg" class="icon" style="font-size: 0.22rem" aria-hidden="false">
        <use xlink:href="#icon-chucun"></use>
      </svg>{{left_title}}</li>
      <li @click="right_click" :style="{background:bgcolor}">
        <svg v-if="noSvg" class="icon" style="font-size: 0.22rem"
             aria-hidden="false">
          <use xlink:href="#icon-fasong"></use>
        </svg>
        {{right_title}}</li>
    </ul>
  </section>
</template>
<script>
  export default {
    data () {
      return {}
    },
    props: [
      "left_title", "right_title", "bgcolor","noSvg","leftBgColor"
    ],
    methods: {
      left_click: function () {
        this.$emit("left_click")
      },
      right_click: function () {
        this.$emit("right_click")
      }
    },
    mounted(){

    }
  }
</script>
