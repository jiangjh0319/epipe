<template>
  <div class="select-product">
    <div class="header" :style="{background: color}">
      <div class="svg" @click="emitEvent(3)">
        <svg class="icon icon-back" aria-hidden="false">
          <use xlink:href="#icon-zuoyoujiantou"></use>
        </svg>
      </div>
      选择产品
    </div>
    <div class="choice-items">
      <div class="choice-item" v-for="(item,index) in choice" :key="index" @click="select(index)">{{item.partName}}</div>
    </div>
  </div>
</template>

<script>
  export default{
    name: 'SelectProduct',
    props: ["color"],
    data(){
      return{
        choice:[{compName:"所有产品"}],
      }
    },
    created(){
      let vm = this;
      eventBus.$on('getProduct',id =>{
        vm.getData(id);
      });
    },
    beforeDestroy() {
      eventBus.$off('getProduct');
    },
    methods:{
      emitEvent(type){
        this.$emit('childevent',type);
      },
      select(index){
        this.$emit('childselect',this.choice[index]);
        this.$emit('childevent',3);
      },
      /*获取产品*/
      getData(id){
        this.$mes.get("/common/part",{
          "lineId":id
        }).then(res =>{
          console.log("获取产品",res);
          if(res.h.code === 200){
            this.choice = res.b.list;
            this.choice.unshift({partName:"所有产品"});
          }
        });
      },
    }
  }
</script>

<style lang="stylus" scoped>
  .header{
    position fixed;
    top: 0;
    left:0;
    width:100%;
    height: 0.44rem;
    text-align center;
    line-height:0.44rem;
    font-size: 0.185rem;
    letter-spacing: 0.012rem;
    color: white;
    background: #499844;
    .icon-back{
      font-size: 0.17rem;
      margin-left: -0.2rem;
      color: white;
    }
    .svg{
      position absolute;
      left 0;
      top 0;
      width 0.58rem;
      height 100%;
    }
  }
  .select-product{
    z-index 10;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: white;
  }
  .choice-items{
    margin-top: 0.59rem;
    padding-left: 0.15rem;
    box-shadow 0 0 20px rgba(15,194,124,0.15);
  }
  .choice-item{
    height: 0.44rem;
    line-height: 0.44rem;
    text-align left;
    font-size: 0.17rem;
    color: #333;
    border-bottom: 1px solid #EBEBEB;
  }
</style>
