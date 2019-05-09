<template>
  <div class="output-tab">
    <div class="tab-item" v-if="category === 1">
      <svg class="tab-icon" aria-hidden="false">
        <use xlink:href="#icon-chanchukanbanactive"></use>
      </svg>
      <p class="tab-title tab-title-active">产出看板</p>
    </div>
    <router-link tag="div" to="/outputlive" class="tab-item" v-else>
      <svg class="tab-icon" aria-hidden="false">
        <use xlink:href="#icon-chanchukanban"></use>
      </svg>
      <p class="tab-title">产出看板</p>
    </router-link>
    <div class="tab-item" v-if="category === 2">
      <svg class="tab-icon" aria-hidden="false">
        <use xlink:href="#icon-chanchuribaoactive"></use>
      </svg>
      <p class="tab-title tab-title-active">产出日报</p>
    </div>
    <router-link to="/outputdaily" class="tab-item" v-else>
      <svg class="tab-icon" aria-hidden="false">
        <use xlink:href="#icon-chanchuribao"></use>
      </svg>
      <p class="tab-title">产出日报</p>
    </router-link>
    <router-link tag="div" to="/outputcount" class="tab-item" v-if="category === 3">
      <svg class="tab-icon" aria-hidden="false">
        <use xlink:href="#icon-chanchutongjiactive"></use>
      </svg>
      <p class="tab-title tab-title-active">产出统计</p>
    </router-link>
    <router-link tag="div" to="/outputcount" class="tab-item" v-else>
      <svg class="tab-icon" aria-hidden="false">
        <use xlink:href="#icon-chanchutongji"></use>
      </svg>
      <p class="tab-title">产出统计</p>
    </router-link>
  </div>
</template>

<script>
  export default{
    name: "OutputTab",
    props: ["category"],
  }
</script>

<style lang="stylus" scoped>
  .output-tab{
    z-index 19;
    display flex;
    position fixed;
    left 0;
    bottom 0;
    width 100%;
    padding 6px 0;
    background white;
    border-top: 1px solid #ccc;
    .tab-item{
      flex: 1;
      text-align center;
    }
    .tab-icon{
      width: 22px;
      height: 22px;
      margin: 0 auto;
    }
    .tab-title{
      font-size 11px;
      color: #333;
      text-align center;
    }
    .tab-title-active{
      color: #499844;
    }
  }
</style>
