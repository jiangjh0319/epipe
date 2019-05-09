<template>
  <section id="mapcontent">
    <TopHead
      native='native'
      bgcolor = '#f80'
      :title = title
      :is_relative_approva = relativeInfo
      v-on:history_back="history_back_click"
      v-on:show_edit = "relativeApprova"
    ></TopHead>
    <div id="allmap">
    </div>
    <div class="text_map">
      <span>{{detail.signDate?detail.signDate.substring(5,7):''}}月{{detail.signDate?detail.signDate.substring(8,10):''}}日</span> {{detail.signDate?detail.signDate.substring(10):''}}
      <ul>
        <li style="font-weight: bold;width:0.8rem" >签到地点:</li>
        <li>
          {{detail.destName}}
        </li>
      </ul>
      <div class="text_map_div-1" v-if="!relativeInfo.isShow">
        <li><span>公出事由: </span>{{detail.reason}}</li>
        <li><span>类型：</span>{{detail.taskType | typeFor}}</li>
        <li><span>开始时间：</span>{{detail.beginTime}}</li>
        <li><span>结束时间：</span>{{detail.endTime}}</li>
        <li><span>目的地：</span>{{detail.destination}}</li>
      </div>
       <li class="img">
          <span>图片:</span><img :src="item" v-for="(item,index) in imgs" @click="go_imgdetail(index)"/>
        </li>
    </div>
  </section>
</template>

<script>
  import TopHead  from '../../components/topheader.vue'  //header导航栏
  export default {
    data () {
      return {
        title: '签到详情',
        detail: '',
        relativeInfo: {"isShow":false,"title":"关联审批"},
        id: '',
        color:'#fd545c',
        imgs:[],
      }
    },
    components:{ TopHead },
    mounted() {
      let that = this;
      if(this.$route.query.id){
        that.id = this.$route.query.id;
      }
//      that.id = "1fe111ac8ffc11e8a8074ccc6ac12eca";

      /*
       * 取到经纬度和相关信息 渲染百度地图   this.Service.outSignInfo
       * */
      this.axios.get('/outsign/record/info', {params: {id: that.id}}).then(function (data) {
        if (data.data.h.code == 200) {
          that.detail = data.data.b;
          that.address(data.data.b.lon, data.data.b.lat);
          that.relativeInfo.isShow = !that.detail.related;
          that.imgs = that.imgFor(that.detail.picUrls)
        }
      });
    },
    methods: {
      address:function(lon,lat){
          document.body.style.height="100%"
          document.getElementById("app").style.height="100%"
          // 百度地图API功能
          var map = new BMap.Map("allmap");
          var point = new BMap.Point(lon,lat);
          var marker = new BMap.Marker(point);  // 创建标注
          map.addOverlay(marker);              // 将标注添加到地图中
          map.centerAndZoom(point, 15);
      },
      relativeApprova(){
        window.location.href = "epipe://?&mark=relativeapprove&_id=" + this.id;
      },
      imgFor(val){

          return val.split(',')

      },
      go_imgdetail: function (index) {
        let obj = {index_num: index, data: this.imgs, type:0}
        window.location.href = "epipe://?&mark=imgdetail&url=" + JSON.stringify(obj);
      },
    },
    filters:{
        typeFor:function(value){
            return value==1?'拜访客户':value==2?'学习培训':'工作交流'
        }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="stylus">
  .anchorBL {
    display: none;
  }

  .BMapLabel {
    font-size: 0.15rem;
  }

  .img{
    height 0.3rem;
    line-height 0.3rem;
    overflow hidden;

      span{
        float left;
        margin-right 0.05rem;
        font-weight: bold;
      }
  }

  .img img{
      float left
      width 0.4rem;
      height 0.3rem;
      margin-right 0.05rem;
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
    top: -2.8rem;
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
    padding-top: 0.12rem;
    line-height: 0.24rem;
    color: #333;
    font-size: 0.14rem;
  }

  .text_map_div-1 li span {
    font-weight: bold;
    color: #333;
    font-size: 0.15rem;
  }
</style>
