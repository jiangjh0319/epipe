<template>
  <div class="wrapper">
    <div class="select-item select-top">
      <div class="pending-selections" v-if="proviceShow">请选择省</div>
      <div class="my-selections" v-else>{{areaObj.provice}}</div>
      <div class="pending-selections" v-if="cityShow">请选择市</div>
      <div class="my-selections" v-else>{{areaObj.city}}</div>
      <div class="pending-selections" v-if="areaShow">请选择区</div>
      <div class="my-selections" v-else>{{areaObj.area}}</div>
    </div>
    <div class="select-content">
      <div class="select-provice" v-show="proviceShow">
        <div class="select-item" v-for="(item,index) in proviceList"
             :key="index" @click="selectProvice(index)">{{item.areaName}}</div>
      </div>
      <div class="select-city" v-show="cityShow">
        <div class="select-item" v-for="(item,index) in cityList"
             :key="index" @click="selectCity(index)">{{item.areaName}}</div>
      </div>
      <div class="select-area" v-show="areaShow">
        <div class="select-item" v-for="(item,index) in areaList"
             :key="index" @click="selectArea(index)">{{item.areaName}}</div>
      </div>
    </div>
  </div>
</template>
<script>
  const specicalList = ["北京市","重庆市","上海市","天津市","香港特别行政区","澳门特别行政区","台湾省"];
  export default {
    name: "AreaSlector",
    data(){
      return{
        proviceList: [],
        cityList: [],
        areaList: [],
        areaObj:{
          provice: "",
          proviceId: "",
          city: "",
          cityId: "",
          area: "",
          areaId: ""
        },
        proviceShow: true,
        cityShow: false,
        areaShow: false,
      }
    },
    created(){
      this.getData(0);
    },
    methods:{
      /*获取地址数据*/
      getData(type,code){
        this.axios.post(this.baseURL.mall + '/m/user/queryAllAddress' + this.Service.queryString({
          token: this.mallToken.getToken(),
          id: code ? code : "",
        })).then(res =>{
          console.log(res);
          if(res.data.h.code === 200){
            let vm = this;
            if(type === 0){
              res.data.b.map(function(item){
                vm.proviceList.push(item);
              });
            }else if(type === 1){
              res.data.b.map(function(item){
                vm.cityList.push(item);
              });
            }else{
              res.data.b.map(function(item){
                vm.areaList.push(item);
              });
            }
          }
        })
      },
      /*选择省份*/
      selectProvice(index){
        this.proviceShow = false;
        this.cityShow = true;
        this.areaObj.provice = this.proviceList[index].areaName;
        this.areaObj.proviceId = this.proviceList[index].areaId;
        if(specicalList.includes(this.proviceList[index].areaName)){
          this.$emit('selectArea',this.areaObj);
        }else{
          this.getData(1,this.proviceList[index].areaId);
        }
      },
      /*选择城市*/
      selectCity(index){
        this.cityShow = false;
        this.areaShow = true;
        this.areaObj.city = this.cityList[index].areaName;
        this.areaObj.cityId = this.cityList[index].areaId;
        this.getData(2,this.cityList[index].areaId);
      },
      /*选择市区*/
      selectArea(index){
        this.areaShow = false;
        this.proviceShow = true;
        this.areaObj.area = this.areaList[index].areaName;
        this.areaObj.areaId = this.areaList[index].areaId;
        this.$emit('selectArea',this.areaObj);
        this.areaObj = {};
      },
    }
  }
</script>
<style lang="stylus" scoped>
  .select-address{
    background white;
  }
  .select-item{
    display flex;
    align-items center;
    height 45px;
    padding 0 10px;
    font-size 14px;
    line-height 45px;
    color: #333;
  }
  .select-top{
    position fixed;
    left 0;
    top 0;
    width 100%;
    background white;
    z-index 9;
    &::after{
      content: "";
      position absolute;
      left 0;
      bottom 0;
      width 100%;
      height: 1px;
      background #e9e9e9;
      transform scaleY(0.5);
      transform-origin center;
    }
  }
  .select-content{
    padding-top 46px;
  }
  .pending-selections{
    position relative;
    height inherit;
    margin-right 0.3rem;
    font-size 14px;
    color: #ff8800;
  }
  .pending-selections::after{
    content: "";
    z-index 1;
    position absolute;
    left 0;
    bottom 0;
    width 100%;
    height 1px;
    background #ff8800;
    transform scaleY(0.5);
    transform-origin center;
  }
  .my-selections{
    height inherit;
    margin-right 0.3rem;
    font-size 14px;
  }
</style>
