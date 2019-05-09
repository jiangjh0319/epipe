
<template>
    <div class="temp">
        <div v-if="type==1||type==2">
            <div class="li-item">上次读数 <span>{{data.water.lastValue}}</span> </div>
            <div class="li-item">本次读数 <span>{{data.water.thisValue}}</span> </div>
            <div class="li-item">使用量 <span>{{data.water.usedAmount}}</span> </div>
            <div class="li-item">单价 <span>{{data.water.unitPrice}}</span> </div>
            <div class="li-item">金额 <span>{{data.water.amount}} 元</span> </div>
            <div class="li-item">自来水公摊费 <span>{{data.water.shareFee}} 元</span> </div>
            <div class="li-item">污水费 <span>{{data.water.effluentFee}} 元</span> </div>
            <div class="li-item">垃圾费 <span>{{data.water.garbageFee}} 元</span> </div>
            <div class="li-item">滞纳金 <span>{{data.water.lateFee}} 元</span> </div>
        </div>
        <div v-else-if="type==3">
            <div class="li-item">上次读数 <span>{{data.electricity.lastValue}}</span> </div>
            <div class="li-item">本次读数 <span>{{data.electricity.thisValue}}</span> </div>
            <div class="li-item">使用量 <span>{{data.electricity.usedAmount}}</span> </div>
            <div class="li-item">单价 <span>{{data.electricity.unitPrice}} 元</span> </div>
            <div class="li-item">金额 <span>{{data.electricity.amount}} 元</span> </div>
            <div class="li-item">倍率 <span>{{data.electricity.multiRate}} 元</span> </div>
            <div class="li-item">电公摊费 <span>{{data.electricity.shareFee}} 元</span> </div>
            <div class="li-item">滞纳金 <span>{{data.electricity.lateFee}} 元</span> </div>
        </div>
        <div v-else-if="type==4">
            <div class="li-item">缴费面积 <span>{{data.rent.area}}</span> </div>
            <div class="li-item">缴费周期 <span>{{data.rent.period | dateFor}}</span> </div>
            <div class="li-item">滞纳金 <span>{{data.rent.lateFee}} 元</span> </div>
        </div>
         <div v-else-if="type==5">
            <div class="li-item">缴费面积 <span>{{data.property.area}}</span> </div>
            <div class="li-item">缴费周期 <span>{{data.property.period | dateFor}}</span> </div>
            <div class="li-item">滞纳金 <span>{{data.property.lateFee}} 元</span> </div>
        </div>
    </div>
</template>


<script>
    export default {
        data() {
            return {
            }
        },
        props: ['type','data',],
        filters:{
              dateFor(value){
                return (value.replace(/\//g,'年')+'月').replace('-','月-')
            },
        }

    }
</script>


<style scoped lang="stylus"> 

    .li-item{
        font-size 0.15rem;
        line-height 0.48rem;
        padding 0 0.1rem;

        span{
            float right;
        }
    }

    .li-item:nth-child(odd){
        background-color #f9f9f9
    }

    .temp{
        padding-bottom 0.2rem;
    }

</style>