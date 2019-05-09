<template>
  <section id="mapcontent">
      <TopHead
        mark='native'
        :bgcolor = 'bgcolor'
        title='公出地点'
      ></TopHead>
    <div id="allmap">
    </div>
    <div class="text_map">
      <div class="text_map_div-1">
            <p class="bold">{{outsideAddress}}</p>
            <p>{{detailAdress}}</p>
      </div>
    </div>
  </section>
</template>

<script>
import TopHead  from '../../components/topheader.vue'  //header导航栏
  export default {
    data () {
      return {
        detail: '',
        outsideAddress:'',
        detailAdress:'',
        bgcolor:'#fd545c'
      }
    },
    components: {
      TopHead
    },
    mounted() {
      let that = this
      this.outsideAddress = this.$route.query.outsideAddress;
      this.detailAdress = this.$route.query.detailAdress;
      this.bgcolor = this.$route.query.bgColor;
      /*
      * 取到经纬度和相关信息 渲染百度地图
      * */
    document.body.style.height="100%"
          document.getElementById("app").style.height="100%"
          // 百度地图API功能
          var map = new BMap.Map("allmap");
          var point = new BMap.Point(this.$route.query.lon,this.$route.query.lat);
          var marker = new BMap.Marker(point);  // 创建标注
          map.addOverlay(marker);              // 将标注添加到地图中
          map.centerAndZoom(point, 15);
    },
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
  .anchorBL {
    display: none;
  }

  .BMapLabel {
    font-size: 0.15rem;
  }

  #mapcontent {
    overflow: hidden;
    height: 100%;
  }

  #allmap {
    width: 100%;
    overflow: hidden;
    margin: 0;
    height: 100%;
  }

  .text_map {
    opacity: 0.9;
    position: relative;
    bottom: 1rem;
    background-color: #fff;
    margin: 0 0.15rem 0 0.15rem;
    padding: 0.15rem;
    border-radius: 0.05rem;
  }

  .text_map span {
    font-size: 0.15rem;
  }

  .text_map ul {
    margin-top: 0.05rem;
    display: flex;
    flex-direction: row;
    padding-bottom: 0.15rem;
    border-bottom: 1px solid #eee;
  }

  .text_map ul li:first-child {
    width: 0.5rem;
    font-size: 0.15rem;
  }

  .text_map ul li:last-child {
    font-size: 0.15rem;
    color: #666;
  }

  .text_map_div-1 {
    line-height: 0.24rem;
    color: #666;
    font-size: 0.14rem;
  }

  .text_map_div-1 li span {
    font-weight: bold;
    color: #333;
    font-size: 0.15rem;
  }

  .bold{
      font-size: 0.16rem;
      color: #333;
      margin-bottom: 0.1rem;
  }
</style>
