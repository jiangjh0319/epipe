<template>
  <div class="selections-wrapper">
    <div class="selections">
      <div class="serial-number" :class="{'serial-number-active':confirm}">
        <svg class="icon-search" aria-hidden="false">
          <use xlink:href="#icon-sousuo1"></use>
        </svg>
        <input type="tel" pattern="[0-9]*" placeholder="请输入工单账号" v-model="workno"  @focus="showSearch()" @blur="hideSearch()">
      </div>
      <div class="btn btn-confirm" @click="search(workno)" v-if="confirm">
        <span>确定</span>
      </div>
      <div class="btn btn-more" :class="{'btn-more-active': more}" @click="showMore()" v-else>
        <span :style="{color: color}">更多</span>
        <svg aria-hidden="false" class="arrow-down" :class="{'arrow-up':more}">
          <use xlink:href="#icon-jiantou" v-if="color"></use>
          <use xlink:href="#icon-sanjiao" v-else></use>
        </svg>
      </div>
    </div>
    <div class="selections-container" v-show="more">
      <div class="selections-content">
        <div class="selections-item" @click="condition(1)">
          <span>车间</span>
          <div>
            <span class="current-value">{{current_workshop}}</span>
            <svg class="icon icon-into" aria-hidden="false">
              <use xlink:href="#icon-into"></use>
            </svg>
          </div>
        </div>
        <div class="selections-item" @click="condition(2)">
          <span>产线</span>
          <div>
            <span class="current-value">{{current_workline}}</span>
            <svg class="icon icon-into" aria-hidden="false">
              <use xlink:href="#icon-into"></use>
            </svg>
          </div>
        </div>
        <div class="selections-item" @click="condition(3)">
          <span>产品</span>
          <div>
            <span class="current-value">{{current_product}}</span>
            <svg class="icon icon-into" aria-hidden="false">
              <use xlink:href="#icon-into"></use>
            </svg>
          </div>
        </div>
        <div class="selections-item" @click="condition(4)">
          <span>日期</span>
          <div>
            <span class="current-value">{{current_date}}</span>
            <svg class="icon icon-into" aria-hidden="false">
              <use xlink:href="#icon-into"></use>
            </svg>
          </div>
        </div>
      </div>
      <div class="selections-btn" :class="{'selections-btn-active':store.workshop&&store.workline&&store.product&&store.date}" @click="handleConfirm">确定</div>
    </div>
    <div class="mask" v-show="mask" @click="closeMask()"></div>
    <select-workshop :color="color" v-show="module.workshop" @childevent="closeCondition" @childselect="workshop"></select-workshop>
    <select-workline :color="color" v-show="module.workline" @childevent="closeCondition" @childselect="workline"></select-workline>
    <select-product :color="color" v-show="module.product" @childevent="closeCondition" @childselect="product"></select-product>
    <select-date :color="color" v-show="module.date" @childevent="closeCondition" @childselect="date"></select-date>
  </div>
</template>

<script>
  import SelectWorkshop from "./SelectWorkshop.vue"
  import SelectWorkline from "./SelectWorkline.vue"
  import SelectProduct from "./SelectProduct.vue"
  import SelectDate from "./SelectDate.vue"
  export default {
    name: 'SelectionBar',
    components:{
      SelectWorkshop,
      SelectWorkline,
      SelectProduct,
      SelectDate,
    },
    props:["msg","color"],
    data(){
      return{
        more: false,
        confirm: false,
        mask: false,
        test: false,
        module:{
          workshop: false,
          workline: false,
          product: false,
          date: false
        },
        store:{
          workshop: "",
          workshop_id: "",
          workline: "",
          workline_id: "",
          product: "",
          product_id: "",
          date: ""
        },
        workno: "",
      }
    },
    computed:{
      current_workshop(){
        return this.store.workshop;
      },
      current_workline(){
        return this.store.workline;
      },
      current_product(){
        return this.store.product;
      },
      current_date(){
        return this.store.date;
      }
    },
    methods:{
      /*显示更多*/
      showMore(){
        this.mask = this.more = !this.more;
        this.$emit("childEvent",!this.more);
      },
      /*显示确定按钮*/
      showSearch(){
        this.mask = this.confirm = true;
        this.$emit("childEvent",false);
      },
      /*隐藏确定按钮*/
      hideSearch(){
        this.mask = this.confirm = false;
        this.$emit("childEvent",true);
      },
      /*查询*/
      search(val){
        this.workno = "";
        this.$emit("emitSearch",val);
      },
      /*关闭弹层*/
      closeMask(){
        this.confirm = this.more = this.mask = false;
      },
      /*选择条件*/
      condition(index){
        switch (index){
          case 1:
            this.module.workshop = true;
            break;
          case 2:
            this.module.workline = true;
            break;
          case 3:
            this.module.product = true;
            break;
          case 4:
            this.module.date = true;
            break;
        }
//        this.mask = this.more = false;
      },
      /*取消选择层*/
      closeCondition(id){
//        this.$emit("childEvent",true);
        switch (id){
          case 1:
            this.module.workshop = false;
            break;
          case 2:
            this.module.workline = false;
            break;
          case 3:
            this.module.product = false;
            break;
          case 4:
            this.module.date = false;
            break;
        }
      },
      /*选择车间*/
      workshop(val){
        console.log("车间对象",val);
//        this.$emit("childEvent",true);
        this.store.workshop = val.workshopName;
        this.store.workshop_id = val.workShopId;
        this.msg.workshop = val.workshopName;
        this.msg.workshop_id = val.workShopId;
        eventBus.$emit('getWorkline', val.workShopId);
      },
      /*选择产线*/
      workline(val){
        console.log("选择产线",val);
        this.store.workline = val.lineName;
        this.store.workline_id = val.lineId;
        this.msg.workline = val.lineName;
        this.msg.workline_id = val.lineId;
//        this.$emit("childEvent",true);
        eventBus.$emit('getProduct', val.lineId);
      },
      /*选择产品*/
      product(val){
        console.log("选择产品",val);
        this.store.product = val.partName;
        this.store.product_id = val.partId;
        this.msg.product = val.partName;
        this.msg.product_id = val.partId;
//        this.$emit("childEvent",true);
      },
      /*选择日期*/
      date(val){
        console.log("选择日期",val);
        this.store.date = val;
        this.msg.date = val;
      },
      /*确定*/
      handleConfirm(){
        if(this.store.workshop && this.store.workline && this.store.product && this.store.date){
          this.$emit("emitGetData",this.store);
          this.showMore();
        }
      },
    },
  }
</script>

<style lang="stylus" scoped>
  .mask{
    z-index: 1;
    position: fixed;
    top: 0.44rem;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(44,44,44,0.3);
  }
  .selections-wrapper{
    position: fixed;
    left: 0;
    top: 0.6rem;
    width: 100%;
  }
  .selections-container{
    position relative;
    z-index 9;
    width 3.45rem;
    margin: 0 auto;
    padding-bottom: 0.2rem;
    background white;
  }
  .selections-content{
    padding-left 0.15rem;
    background: white;
    border-bottom 1px solid #EBEBEB;
  }
  .selections-item{
    display flex;
    justify-content space-between;
    align-items center;
    height: 0.44rem;
    padding-right 0.15rem;
    line-height: 0.44rem;
    font-size: 0.17rem;
    color: #333;
  }
  .selections-item:not(:last-child){
    border-bottom 1px solid #EBEBEB;
  }
  .selections{
    display: flex;
    box-sizing border-box;
    height: 0.45rem;
    padding 0 0.15rem;
  }
  .serial-number-active{
    z-index 9;
  }
  .serial-number{
    width: 2.56rem;
    height: inherit;
    margin-right 0.1rem;
    text-align center;
    line-height 0.45rem;
    background: white;
    border-bottom-left-radius: 0.02rem;
    border-top-left-radius: 0.02rem;
    box-shadow 0 0 20px rgba(15,194,124,0.15);
    .icon-search{
      width:0.22rem;
      height:0.22rem;
      margin: 0.11rem 0;
      margin-right:0.08rem;
      vertical-align bottom;
    }
    input{
      height: 90%;
      outline none;
      z-index 1;
    }
  }
  .btn{
    z-index 9;
    width: 0.8rem;
    height: inherit;
    text-align center;
    line-height 0.45rem;
    font-size: 0;
    background: white;
    border-top-right-radius: 0.02rem;
    border-bottom-right-radius: 0.02rem;
    box-shadow 0 0 20px rgba(15,194,124,0.15);
    span{
      font-size 0.17rem;
      color: #0fc37c;
      vertical-align: sub;
    }
  }
  .btn-more-active{
    border-bottom-right-radius: 0;
    box-shadow none;
  }
  .selections-btn{
    width: 3.15rem;
    height: 0.44rem;
    margin: 0 auto;
    margin-top: 0.2rem;
    text-align center;
    line-height: 0.44rem;
    color: #ddd;
    border: 1px solid #ebebeb;
    border-radius 0.02rem;
  }
  .selections-btn-active{
    color: #499844;
    border: 1px solid #499844;
  }
  .arrow-down{
    width:0.08rem;
    height:0.04rem;
    margin-left:0.04rem;
    transform: translateY(-50%);
  }
  .arrow-up{
    transform: translateY(-50%) rotateZ(180deg);
  }
  .current-value{
    font-size 0.16rem;
    color: #333;
  }
</style>
