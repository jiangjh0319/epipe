<template>
  <div id="app">
    <keep-alive>
      <router-view v-if="$route.meta.keepAlive"></router-view>
    </keep-alive>
    <router-view v-if="!$route.meta.keepAlive"></router-view>
  </div>
</template>

<script>
  export default {
    name: 'app',
    data () {
      return {
        keepAlive: true
      }
    },
    provide(){
        return {
           reload:this.reload,
        }
    },
    components: {
      
    },
    mounted(){

    },
    methods:{
        reload(){
          this.keepAlive = false;
          this.$nextTick(function(){
            this.keepAlive = true;
          })
        }
    }
  }
</script>
<style>
  body,#app{
    height: 100%;
  }
</style>
