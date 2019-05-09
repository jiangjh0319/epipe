<template>
  <div>
    <div class="coupon-tab">
      <div :class="{active : couponState === 1}" @click="couponTab(1)">可使用</div>
      <div :class="{active : couponState === 2}" @click="couponTab(2)">已使用</div>
      <div :class="{active : couponState === 3}" @click="couponTab(3)">已失效</div>
    </div>
    <div class="slider" v-if="couponState === 1 && myCoupons.length>0" v-for="(item,index) in myCoupons" :key="index">
      <div class="coupon-info" @touchstart='touchStart($event,index)' @touchmove='touchMove($event,index)' @touchend='touchEnd($event,index)' :style="{'transform' : deleteSliderState === index ? deleteSlider : ''}">
        <div class="coupon">
          <div><span>￥</span><span>{{item.couponPrice}}</span></div>
        </div>
        <div class="condition">
          <p>满{{item.couponLimit}}可用</p>
          <p v-if="item.isTotal === 1">{{item.storeName}}指定商品</p>
          <p v-if="item.isTotal === 0">{{item.storeName}}店铺通用</p>
          <p>{{item.startTimeStr.substring(0,10)}}～{{item.endTimeStr.substring(0,10)}}</p>
        </div>
        <div class="receive"><router-link :to="{path:'/StoreHome',query:{storeId:item.storeId}}">立即使用</router-link></div>
      </div>
      <div class="remove" @click="deletCoupon(item.shopCouponMemberId)">删除</div>
    </div>
    <div class="slider" v-if="couponState === 2  && myCoupons.length>0" v-for="(item,index) in myCoupons" :key="index">
      <div class="coupon-info" @touchstart='touchStart($event,index)' @touchmove='touchMove($event,index)' @touchend='touchEnd($event,index)' :style="{'transform' : deleteSliderState === index ? deleteSlider : ''}">
        <div class="coupon color-ccc">
          <div><span>￥</span><span>{{item.couponPrice}}</span></div>
        </div>
        <div class="condition">
          <p>满{{item.couponLimit}}可用</p>
          <p v-if="item.isTotal === 1">{{item.storeName}}指定商品</p>
          <p v-if="item.isTotal === 0">{{item.storeName}}店铺通用</p>
          <p>{{item.startTimeStr.substring(0,10)}}～{{item.endTimeStr.substring(0,10)}}</p>
        </div>
        <div class="receive color-ccc">已使用</div>
      </div>
      <div class="remove" @click="deletCoupon(item.shopCouponMemberId)">删除</div>
    </div>
    <div class="slider" v-if="couponState === 3  && myCoupons.length>0" v-for="(item,index) in myCoupons" :key="index">
      <div class="coupon-info" @touchstart='touchStart($event,index)' @touchmove='touchMove($event,index)' @touchend='touchEnd($event,index)' :style="{'transform' : deleteSliderState === index ? deleteSlider : ''}">
        <div class="coupon color-ccc">
          <div><span>￥</span><span>{{item.couponPrice}}</span></div>
        </div>
        <div class="condition">
          <p>满{{item.couponLimit}}可用</p>
          <p v-if="item.isTotal === 1">{{item.storeName}}指定商品</p>
          <p v-if="item.isTotal === 0">{{item.storeName}}店铺通用</p>
          <p>{{item.startTimeStr.substring(0,10)}}～{{item.endTimeStr.substring(0,10)}}</p>
        </div>
        <div class="color-d9d9d9">已失效</div>
      </div>
      <div class="remove" @click="deletCoupon(item.shopCouponMemberId)">删除</div>
    </div>
    <div class="nodata" v-if="myCoupons.length === 0" >暂无数据</div>
  </div>
</template>
<script>
  export default {
  	data:function () {
      return{
      	startX:0,   //触摸位置
	      endX:0,     //结束位置
	      moveX: 0,   //滑动时的位置
	      disX: 0,    //移动距离
	      deleteSlider: '',//滑动时的效果,使用v-bind:style="deleteSlider"
	      deleteSliderState:'',  //滑动式改变单个滑块判断标志
			  couponState:1,
	      myCoupons:[]
		  }
	  },
    methods:{
	    touchStart(ev,index){
	    	this.deleteSliderState=index;
	    	console.log(index);
	    	console.log(ev);
		    ev= ev || event
		    //tounches类数组，等于1时表示此时有只有一只手指在触摸屏幕
		    if(ev.touches.length == 1){
			    // 记录开始位置
			    this.startX = ev.touches[0].clientX;
		    }
	    },
	    touchMove(ev,index){
		    this.deleteSliderState=index;
		    ev = ev || event;
		    //获取删除按钮的宽度，此宽度为滑块左滑的最大距离
		    const wd=90;
		    if(ev.touches.length == 1) {
			    // 滑动时距离浏览器左侧实时距离
			    this.moveX = ev.touches[0].clientX
			    //起始位置减去 实时的滑动的距离，得到手指实时偏移距离
			    this.disX = this.startX - this.moveX;
			    // 如果是向右滑动或者不滑动，不改变滑块的位置
			    if(this.disX < 0 || this.disX == 0) {
				    this.deleteSlider = "translateX(0px)";
				    // 大于0，表示左滑了，此时滑块开始滑动
			    }else if (this.disX > 0) {
				    //具体滑动距离我取的是 手指偏移距离*5。
				    this.deleteSlider = "translateX(-" + this.disX*5 + "px)";
				    // 最大也只能等于删除按钮宽度
				    if (this.disX*5 >=wd) {
					    this.deleteSlider = "translateX(-" +wd+ "px)";
				    }
			    }
		    }
	    },
	    touchEnd(ev,index){
		    this.deleteSliderState=index;
		    ev = ev || event;
		    const wd=90;
		    if (ev.changedTouches.length == 1) {
			    let endX = ev.changedTouches[0].clientX;
			    this.disX = this.startX - endX;
			    //如果距离小于删除按钮一半,强行回到起点
			    if ((this.disX*5) < (wd/2)) {
				    this.deleteSlider = "translateX(0px)";
			    }else{
				    //大于一半 滑动到最大值
				    this.deleteSlider = "translateX(-"+wd+ "px)";
			    }
		    }
	    },
	    couponTab(index){
	    	this.couponState=index;
	    	this.getCouponList();
      },
      getCouponList(){
	      this.axios.post(this.baseURL.mall + '/m/my/myCoupons' +this.Service.queryString({
		      token:this.mallToken.getToken(),
		      couponState:this.couponState
	      })).then(res=>{
		      console.log(res);
		      if(res.data.h.code === 200){
		      	this.myCoupons=res.data.b.myCoupons;
          }else if(res.data.h.code === 30){
			      if(this.isApp.state){
				      window.location.href = "epipe://?&mark=login";
			      }else{
				      this.$router.replace("/verificationlogin?loginUrl="+encodeURIComponent(window.location.href));
			      }
          }
	      })
      },
	    deletCoupon(couponId){
		    console.log(couponId);
		    this.$confirm('确认要删除吗?').then(()=>{
			    this.axios.post(this.baseURL.mall + "/m/my/deleteMyCoupon"+this.Service.queryString({
				    token:this.mallToken.getToken(),
				    id:couponId
			    })).then(res=>{
				    console.log(res);
				    if(res.data.h.code==200){
					    this.$toast("删除成功");
					    this.getCouponList();
					    this.deleteSlider='';
				    }else{
					    this.$toast(res.data.h.msg);
				    }
			    })
		    })
	    },
    },
    created(){
  		this.getCouponList();
    }
  }
</script>
<style lang="stylus" scoped="true">
  .coupon-tab{
    display flex;
    justify-content center;
    align-items center;
    height .45rem;
    background #fff;
    position relative;
    &::after{
      content: "";
      position absolute;
      left 0;
      bottom: 0;
      width 100%;
      height: 1px;
      background #e5e5e5;
      -webkit-transform-origin: 0 0;
      transform-origin: 0 0;
      -webkit-transform: scaleY(0.5);
      transform: scaleY(0.5);
    }
    div{
      flex 1;
      font-size .14rem;
      color #333;
      text-align center;
      height 100%;
      line-height .45rem;
    }
    .active{
      color #ff8800;
    }
  }
  .slider{
    margin .15rem .1rem;
    position relative;
    height .9rem;
    user-select none;
  }
  .coupon-info{
    position absolute;
    left 0;
    top 0;
    z-index 100;
    width 100%;
    height .9rem;
    display flex;
    display -webkit-flex ;
    background #fff;
    transition 0.3s;
    .coupon{
      width 1.1rem;
      height 100%;
      background #ffcc33;
      position relative;
      div{
        position absolute;
        left 50%;
        top 50%;
        transform translate(-50%,-50%);
        -webkit-transform translate(-50%,-50%);
        span{
          color #fff;
        }
        span:first-child{
          font-size .18rem;
        }
        span:last-child{
          font-size .5rem;
        }
      }
    }
    .condition{
      flex 1;
      margin-left .1rem;
      p{
        line-height 1.27;
        margin-top .18rem;
        font-size .12rem;
        color #999;
      }
      p:first-child{
        color #666;
      }
      p:nth-child(2){
        margin-top .1rem;
      }
      p:last-child{
        margin-top .05rem;
      }
    }
    .receive{
      width .7rem;
      height .25rem;
      line-height .25rem;
      text-align center;
      background #ffcc33;
      border-radius .2rem;
      position relative;
      top 50%;
      margin-top -.125rem;
      margin-right .12rem;
      a{
        font-size .12rem;
        color #fff;
      }
    }
    .color-ccc{
      background #ccc;
    }
    .color-d9d9d9{
      color #d9d9d9;
      font-size .16rem;
      transform: rotate(-30deg);
      -ms-transform: rotate(-30deg);
      -webkit-transform: rotate(-30deg);
      -o-transform: rotate(-30deg);
      -moz-transform: rotate(-30deg);
      line-height .9rem;
      margin-right .12rem;
    }
  }
  .remove{
    position  absolute;
    width 90px;
    height .9rem;
    line-height .9rem;
    background red;
    right 0;
    top 0;
    color #fff;
    text-align center;
    font-size .16rem;
  }
  .nodata{
    text-align center;
    margin-top .2rem;
    font-size .14rem;
    color #666;
  }
</style>