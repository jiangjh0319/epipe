<template>
  <div class="detail-container">
    <div class="info">
      <div class="tit">{{type === 'D' ? '需求' : '供应'}}信息</div>
      <div class="one-info"><div class="sp1">{{type === 'D' ? '需求' : '供应'}}名称：</div><div class="sp2">{{type === 'D' ? infoObj.demandName : infoObj.supplyName}}</div></div>
      <div class="one-info"><div class="sp1">数　　量：</div><div class="sp2">{{type === 'D' ? infoObj.demandNum : infoObj.supplyNum}}</div></div>
      <div class="one-info"><div class="sp1">所属分类：</div><div class="sp2">{{type === 'D' ? infoObj.className : infoObj.className}}</div></div>
      <div class="one-info"><div class="sp1">价　　格：</div><div class="sp2">{{type === 'D' ? infoObj.demandReferencePrices : infoObj.supplyReferencePrices}}</div></div>
      <div class="one-info"><div class="sp1">所在地区：</div><div class="sp2">{{type === 'D' ? infoObj.demandArea : infoObj.supplyArea}}</div></div>
      <div class="one-info"><div class="sp1">发布时间：</div><div class="sp2">{{type === 'D' ? infoObj.createTimeStr : infoObj.createTimeStr}}</div></div>
    </div>
    <div class="info">
      <div class="tit">联系信息</div>
      <div class="one-info"><div class="sp1">联系人：</div><div class="sp2">{{type === 'D' ? infoObj.demandContactName : infoObj.supplyContactName}}</div></div>
      <div class="one-info"><div class="sp1">手机号码：</div><div class="sp2">{{type === 'D' ? infoObj.demandContactPhone : infoObj.supplyContactPhone}}</div></div>
      <div class="one-info"><div class="sp1">地　　址：</div><div class="sp2">{{type === 'D' ? infoObj.demandArea : infoObj.supplyArea}}</div></div>
      <div class="one-info"><div class="sp1">网　　址：</div><div class="sp2">{{type === 'D' ? infoObj.demandSourceUrl : infoObj.supplySourceUrl}}</div></div>
      <div class="one-info"><div class="sp1">公司名称：</div><div class="sp2">{{type === 'D' ? infoObj.storeName : infoObj.storeName}}</div></div>
    </div>
    <div class="info">
      <div class="tit">详细描述</div>
      <div class="content" v-html="type === 'D' ? infoObj.demandDescription : infoObj.supplyDescription"></div>
    </div>
  </div>
</template>

<script>
	export default {
		name: 'SupplyDemandDetail',
    data () {
			return {
				id: this.$route.query.id,
        type: this.$route.query.type,
        infoObj: {}
      }
    },
    methods: {
			getSupplyDemandInfo(){
				this.axios.post(this.baseURL.mall + "/m/demandAndSupply/queryGXDetailInfoOfIndex" + this.Service.queryString({
          id: this.id,
          type: this.type
				})).then(res => {
					if(res.data.h.code === 200){
						this.infoObj = this.type === 'S' ? res.data.b.supply : res.data.b.demandInfo;
          }
        })
      }
    },
    created () {
			this.getSupplyDemandInfo();
    }
	}
</script>

<style lang="stylus" scoped>
  .detail-container{
    padding-top .15rem;
    background #fff;
    overflow hidden;
    width 100%;
    min-height 100%;
    box-sizing border-box;
    position absolute;
    .info{
      overflow hidden;
      .tit{
        width .78rem;
        height .3rem;
        line-height .3rem;
        padding-left .15rem;
        font-size .15rem;
        color #fff;
        background url("../../../assets/lineBg.png") no-repeat top center;
        background-size 100%;
      }
      .one-info{
        margin .15rem 0 0 .15rem;
        overflow hidden;
        div{
          font-size .15rem;
          float left;
        }
        .sp1{
          color #666;
          margin-right .15rem;
          width 75px;
          height 20px;
          text-align justify;
          &:after {
            content: "";
            display: inline-block;
            width: 100%;
          }
        }
        .sp2{
          color #333;
        }
        &:last-child{
          margin-bottom .2rem;
        }
      }
      .content{
        font-size .15rem;
        color #333;
        line-height .26rem;
        text-indent .32rem;
        padding .15rem;
        text-align justify;
      }
    }
  }
</style>
