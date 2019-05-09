<template>
  <div class="user-wrapper">
    <div class="user-info">
      <router-link to="mallsetting" tag="div" class="user-info-content">
        <div class="user">
          <div class="avatar">
            <img :src="userInfo.imgurl" alt="" v-if="userInfo.imgurl">
            <img :src="avatar" alt="" v-else>
          </div>
          <div class="info-content">
            <div class="id">用户名: {{userInfo.phone}}</div>
          </div>
        </div>
        <div class="link-account">
          <i class="iconfont icon-zhanghushezhi"></i>
          账号管理
        </div>
      </router-link>
    </div>
    <div class="menu-tab">
      <router-link to="mallcollection" tag="div" class="menu-item">
        <div class="number">{{userInfo.favGoodsNum}}</div>
        <div class="title">商品收藏</div>
      </router-link>
      <div class="menu-item">
        <div class="number">23</div>
        <div class="title">店铺收藏</div>
      </div>
      <router-link to="recenthistory" class="menu-item">
        <div class="number">{{historyNum}}</div>
        <div class="title">最近浏览</div>
      </router-link>
    </div>
    <div class="assets">
      <div class="assets-tit">我的资产</div>
      <div class="assets-item">
        <div>
          <router-link  :to="{path:'mycoupon'}">
            <p><span>{{userInfo.myCouponsNum}}</span><span>张</span></p>
            <p><i class="iconfont icon-quan"></i><span>优惠券</span></p>
          </router-link>
        </div>
        <div>
          <p><span>6</span><span>个</span></p>
          <p><i class="iconfont icon-hongbao"></i><span>红包</span></p>
        </div>
        <div>
          <p><span>300</span><span>分</span></p>
          <p><i class="iconfont icon-jifen"></i><span>积分</span></p>
        </div>
      </div>
    </div>
    <div class="orders" v-if="this.mallType.type === '2b'">
      <router-link to="inquirylist" class="link-item">
        <div class="link-title">我的询价单</div>
        <div class="link-icon">
          <i class="iconfont icon-jinru"></i>
        </div>
      </router-link>
      <div class="status inquiry-status">
        <router-link :to="{path: 'inquirylist'}" tag="div" class="status-item">
          <p><i class="iconfont icon-xunjia"></i></p>
          <p class="item-title">待询价</p>
        </router-link>
        <router-link :to="{path:'MyInquiryOrder',query:{state:1}}" tag="div" class="status-item">
          <p><i class="iconfont icon-maijiabaojia"></i></p>
          <p class="item-title">卖家报价</p>
        </router-link>
        <router-link :to="{path:'MyInquiryOrder',query:{state:2}}" tag="div" class="status-item">
          <p><i class="iconfont icon-querenbaojia"></i></p>
          <p class="item-title">买家确认</p>
        </router-link>
        <router-link :to="{path:'MyInquiryOrder',query:{state:3}}" tag="div" class="status-item">
          <p><i class="iconfont icon-yixiadan"></i></p>
          <p class="item-title">已下单</p>
        </router-link>
        <router-link :to="{path:'MyInquiryOrder',query:{state:4}}" tag="div" class="status-item">
          <p><i class="iconfont icon-yiquxiao1"></i></p>
          <p class="item-title">已取消</p>
        </router-link>
      </div>
    </div>
    <div class="orders">
      <router-link to="myorder" class="link-item">
        <div class="link-title">我的订单</div>
        <div class="link-icon">
          <i class="iconfont icon-jinru"></i>
        </div>
      </router-link>
      <div class="status">
        <router-link :to="{path:'myorder',query:{state:1}}" tag="div" class="status-item">
          <p><i class="iconfont icon-daifukuan1"></i></p>
          <p class="item-title">待付款</p>
        </router-link>
        <router-link :to="{path:'myorder',query:{state:2}}" tag="div" class="status-item">
          <p><i class="iconfont icon-yifukuan"></i></p>
          <p class="item-title">已付款</p>
        </router-link>
        <router-link :to="{path:'myorder',query:{state:3}}" tag="div" class="status-item">
          <p><i class="iconfont icon-daifahuo"></i></p>
          <p class="item-title">已发货</p>
        </router-link>
        <router-link :to="{path:'myorder',query:{state:4}}" tag="div" class="status-item">
          <p><i class="iconfont icon-yiwancheng"></i></p>
          <p class="item-title">已完成</p>
        </router-link>
        <router-link :to="{path:'myorder',query:{state:5}}" tag="div" class="status-item">
          <p><i class="iconfont icon-yiquxiao"></i></p>
          <p class="item-title">已取消</p>
        </router-link>
      </div>
    </div>
    <div class="links">
      <router-link to="returnlist" tag="div" class="link-item">
        <div class="link-title">我的退货单</div>
        <div class="link-icon">
          <i class="iconfont icon-jinru"></i>
        </div>
      </router-link>
      <router-link to="refundlist" tag="div" class="link-item">
        <div class="link-title">我的退款单</div>
        <div class="link-icon">
          <i class="iconfont icon-jinru"></i>
        </div>
      </router-link>
      <!--<div class="link-item">-->
        <!--<div class="link-title">商品评价</div>-->
        <!--<div class="link-icon">-->
          <!--<i class="iconfont icon-jinru"></i>-->
        <!--</div>-->
      <!--</div>-->
      <!--<div class="link-item">-->
        <!--<div class="link-title">我的咨询</div>-->
        <!--<div class="link-icon">-->
          <!--<i class="iconfont icon-jinru"></i>-->
        <!--</div>-->
      <!--</div>-->
    </div>
    <footer-tab :category="3"></footer-tab>
  </div>
</template>
<script>
  const FooterTab = () => import("../../../components/mall/FooterTab.vue");
  const imgUrl = require("../../../assets/avatar.png");
  export default {
    name: "MallUser",
    components:{
      FooterTab
    },
    data(){
      return{
        avatar: imgUrl,
        userInfo:{},
        historyNum: localStorage.getItem("browser_history") ? JSON.parse(localStorage.getItem("browser_history")).length : 0,
      }
    },
    created(){
      document.title="个人中心";
     //this.$toast(this.mallToken.getToken())
      this.getUserInfo();
    },
    methods:{
      getUserInfo(){
//      let queryPer='';
//      if(this.isApp.state){
//         queryPer='queryPersonalMsgAPP';
//       }else{
//         queryPer='queryPersonalMsg';
//       }
        this.axios.post(this.baseURL.mall + '/m/my/queryPersonalMsg' + this.Service.queryString({
          isApp:this.isApp.state,
          token: this.mallToken.getToken()
        })).then(res =>{
          console.log("个人信息",res);

          if(res.data.h.code === 200){
            this.userInfo = res.data.b;
          }
             if(res.data.h.code === 50 || res.data.h.code === 30){
            if(this.isApp.state){
              window.location.href = "epipe://?&mark=login";
            }else{
	            this.$router.replace("/verificationlogin?loginUrl="+encodeURIComponent(window.location.href));
            }
          }
        })
      },
    }
  }
</script>
<style lang="stylus" scoped="true">
  .user-wrapper{
    padding-bottom .75rem;
  }
  .user-info{
    padding: 15px 10px;
    background white;
  }
  .user-info-content{
    position relative;
    display flex;
    align-items center;
    height: 120px;
    border-radius: 5px;
    box-shadow 0 0 6px rgb(255,152,152);
    background linear-gradient(to right,#DA4D46,#FF7559);
  }
  .user{
    display flex;
    justify-content flex-start;
    align-items center;
    .avatar{
      width: 0.62rem;
      height: 0.62rem;
      margin-left 0.25rem;
      margin-right 0.15rem;
      border: 1px solid #ff9898;
      border-radius 50%;
      box-shadow 0 2px 4px rgba(0,0,0,0.2);
      img{
        width: 100%;
        height: 100%;
        border-radius 50%;
      }
    }
    .name{
      font-size: 0.14rem;
      color: white;
      line-height 1;
    }
    .id{
      color: #ffcccc;
      line-height 1;
      font-size 0.14rem;
    }
  }
  .link-account{
    position absolute;
    top: 0.1rem;
    right: 0.1rem;
    color: #993d3d;
    font-size 11px;
    .iconfont{
      color: #993d3d;
      vertical-align: middle;
    }
  }
  .menu-tab{
    display flex;
    justify-content space-between;
    align-items center;
    height: 0.6rem;
    margin-top 0.1rem;
    background white;
  }
  .menu-item{
    flex 1;
    text-align center;
    .number{
      color: #d74a45;
      font-size 0.16rem;
      font-weight bold;
      line-height 1;
    }
    .title{
      margin-top 0.1rem;
      font-size: 0.12rem;
      color: #666;
      line-height 1;
    }
  }
  .assets{
    margin-top .1rem;
    background #fff;
    .assets-tit{
      height .45rem;
      line-height .45rem;
      font-size .14rem;
      color #333;
      padding 0 .1rem;
      position relative;
      &::after{
        content: "";
        position absolute;
        left 0;
        bottom: 0;
        width 100%;
        height: 1px;
        background #E9E9E9;
        -webkit-transform-origin: 0 0;
        transform-origin: 0 0;
        -webkit-transform: scaleY(0.5);
        transform: scaleY(0.5);
      }
    }
    .assets-item{
      height .7rem;
      display flex;
      justify-content center;
      align-items center;
      div{
        flex 1;
        text-align center;
        p{
          &:first-child{
            color #d74a45;
            span:first-child{
              font-size .16rem;
              font-weight bold;
            }
            span:last-child{
              font-size .12rem;
              font-weight bold;
            }
          }
          &:last-child{
            color #666;
            margin-top .05rem;
            height .24rem;
            line-height .24rem;
            i{
              color #d4a163;
              font-size .22rem;
              vertical-align middle;
            }
            span{
              vertical-align middle;
            }
          }
        }
      }
    }
  }
  .orders{
    margin-top 0.1rem;
    background: white;
  }
  .status{
    height: 0.7rem;
    display flex;
    justify-content space-between;
    align-items center;
  }
  .status-item{
    flex: 1;
    text-align center;
    .iconfont{
      font-size 0.25rem;
      color: #d4a163;
    }
  }
  .inquiry-status{
    .status-item{
      .iconfont{
        //font-size .2rem;
      }
    }
  }
  .links{
    position relative;
    margin-top 0.1rem;
    background white;
    &::after{
      content: "";
      position absolute;
      left 0;
      bottom -49px;
      width 100%;
      height 49px;
      background #F4F4F4;
    }
  }
  .link-item{
    position relative;
    display flex;
    justify-content space-between;
    align-items center;
    height: 0.45rem;
    padding: 0 0.1rem;
    font-size: 0.14rem;
    color: #666;
  }
  .link-item:not(:last-child)::after{
    content: "";
    position absolute;
    left 0;
    bottom: 0;
    width 100%;
    height: 1px;
    background #E9E9E9;
    -webkit-transform-origin: 0 0;
    transform-origin: 0 0;
    -webkit-transform: scaleY(0.5);
    transform: scaleY(0.5);
  }
  .icon-jinru{
    color: #ccc;
    font-size 0.12rem;
  }
  .item-title{
    line-height 1;
    font-size 0.12rem;
    color: #666;
    margin-top 0.05rem;
  }
  .link-title{
    color: #333;
  }
</style>
