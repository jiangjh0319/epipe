<style scoped lang="stylus">
  @import "../../style/variable.styl";
  *{
    -webkit-tap-highlight-color: transpranet;
  }
  .tab_work_con {
    margin-left: 0.135rem;
    margin-right: 0.135rem;
    margin-top: 0.15rem;
    background-color: #fff;
    border-radius: 0.027rem;
    box-shadow: 0 0 10px rgba(14,175,106,0.1);
  }
  .tab_work_2con {
    display: flex;
    display:-webkit-flex;
    flex-direction: row;
    height: 0.53rem;
    align-items: center;
  }
  .tab_work_2con li:first-child {
    width: 0.035rem;
    height: 0.16rem;
    background-color: $orange_color;
    border-radius: 1rem;
    margin-left: 0.12rem;
  }
  .tab_work_2con li:last-child {
    margin-left: 0.05rem;
    font-size: 0.16rem;
  }
  .tab_work_3con {
    display: flex;
    display:-webkit-flex;
    flex-direction: row;
    flex-wrap: wrap;
    width: 100%;
  }
  .first_tab_work_3con{
     height auto
     padding-top 0.2rem;
  }
  .tab_work_3con li{
    position relative;
    width: 25%;
    display: flex;
    display:-webkit-flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding-bottom 0.2rem;
    padding-top 0.1rem;
    margin-top -0.15rem;
    -webkit-tap-highlight-color: transpranet;
  }

  .tab_work_3con li .mes-num{
      position absolute;
      width 0.15rem;
      height  0.15rem;
      line-height 0.15rem;
      border-radius 50%;
      right 0.05rem;
      top 0.05rem;
      color #fff;
      font-size 0.1rem;
      text-align center;
      background-color rgb(253, 84, 92); 
  }
  .tab_work_3con li:nth-child(n + 5){
    margin-top 0;
  }
  .tab_work_3con li div:last-child
    font-size: 0.14rem
    margin-top 0.05rem

  .mask{
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: white;
    z-index: 9;
  }
  .banner-wrapper{
    z-index: -1;
    height: 0.5rem;
    padding: 0 0.15rem;
    padding-top: 0.4rem;
    background: #499844;
    color: white;
    line-height:1;
    padding-bottom 0.2rem;
  }
  .banner-h1{
    font-size: 0.19rem;
  }
  .banner-h2{
    font-size: 0.16rem;
    margin: 0.1rem 0 0.16rem;
  }
  .banner-h3{
    font-size: 0.13rem;
  }
  .broadcast{
    display: flex;
    display:-webkit-flex;
    align-items center;
    padding: 0.15rem;
    margin-top: -0.3rem;
    box-shadow: 0 0 20px rgba(0,143,87,0.15);
  }
  .broadcast-content-wrapper,.broadcast-item{
    width 2.7rem;
    height: 0.41rem;
    overflow: hidden;
  }
  .icon-broadcast{
    width: 0.4rem;
    height: 0.4rem;
    margin-right: 0.1rem;
  }
  .broadcast-time{
    font-size: 0.14rem;
    color: #666;
  }
  .broadcast-message{
    white-space nowrap;
    overflow hidden;
    text-overflow ellipsis;
    font-size: 0.16rem;
    color: #333;
  }
  .no-network{
    z-index: 99;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    text-align: center;
    background: white;
    .no-network-content{
      position: absolute;
      top: 50%;
      left: 0;
      width: 100%;
      transform: translateY(-50%);
    }
    img{
      width: 1.5rem;
    }
    .tips{
      margin-top: 10px;
      color: #969696;
    }
    .btn-refresh{
      display inline-block;
      width: 0.8rem;
      height: 0.3rem;
      margin-top: 0.2rem;
      line-height 0.3rem;
      text-align: center;
      background: #499844;
      color: white;
      border-radius: 2px;
    }
  }
</style>
<template>
  <div class="mask" v-if="mask"></div>
  <section class="padding_bottom_content" v-else>
    <div class="no-network" v-if="noNetwork">
      <div class="no-network-content">
        <img :src="logo" alt="无网络">
        <div class="tips">
          <p style="font-size: 0.16rem;">您的手机网络不太顺畅~</p>
          <p>请检查网络设置</p>
        </div>
        <div class="btn-refresh" @click="reload()">刷新</div>
      </div>
    </div>
    <div class="banner-wrapper">
      <div class="banner-h1">{{slogans.firstLine}}</div>
            <!-- {{token}} -->

      <div class="banner-h2">{{slogans.secondLine}}</div>
      <div class="banner-h3">{{dateString}}</div>
    </div>
    <div class="content-wrapper">

 		 <div class="tab_work_con">
        <ul class="tab_work_3con first_tab_work_3con">
          <li @click="go_unfinishAffairs">
            <span v-if="mesNum" class="mes-num">{{mesNum}}</span>
            <div>
              <svg style="width: 0.27rem;height: 0.27rem" class="icon" aria-hidden="false">
                <use xlink:href="#icon-daibanshiyi"></use>
              </svg>
            </div>
            <div style="font-size:0.14rem;margin-top: 0.05rem">待办事宜</div>
          </li> 
          <li @click="go_myApply">
            <div>
              <svg style="width: 0.27rem;height: 0.27rem" class="icon" aria-hidden="false">
                <use xlink:href="#icon-wodeshenqing-mian"></use>
              </svg>
            </div>
            <div style="font-size:0.14rem;margin-top: 0.05rem">我的申请</div>
          </li> 
          <!-- <li @click="go_daily">
            <div>
              <svg style="width: 0.27rem;height: 0.27rem" class="icon" aria-hidden="false">
                <use xlink:href="#icon-qiyeribao"></use>
              </svg>
            </div>
            <div>企业日报</div>
          </li> -->
            <li @click="go_inform">
            <div>
              <svg style="width: 0.27rem;height: 0.27rem" class="icon" aria-hidden="false">
                <use xlink:href="#icon-Msg"></use>
              </svg>
            </div>
            <div>公告</div>
          </li>
        </ul>
      </div>
      
       <div class="tab_work_con">
        <ul class="tab_work_2con">
          <li></li>
          <li>移动审批</li>
        </ul>
        <ul class="tab_work_3con">
          <li @click="go_leave">
            <div>
              <svg style="width: 0.27rem;height: 0.27rem" class="icon" aria-hidden="false">
                <use xlink:href="#icon-qingjia"></use>
              </svg>
            </div>
            <div>请假</div>
          </li>
            <li @click="go_trip">
            <div>
              <svg style="width: 0.27rem;height: 0.27rem" class="icon" aria-hidden="false">
                <use xlink:href="#icon-chucha"></use>
              </svg>
            </div>
            <div style="font-size:0.14rem;margin-top: 0.05rem">出差</div>
          </li>
          <li @click="go_goOutWork">
            <div>
              <svg style="width: 0.27rem;height: 0.27rem" class="icon" aria-hidden="false">
                <use xlink:href="#icon-gongchu"></use>
              </svg>
            </div>
            <div>公出</div>
          </li>

          <li @click="go_LetterOfRequest">
            <div>
              <svg style="width: 0.27rem;height: 0.27rem" class="icon" aria-hidden="false">
                <use xlink:href="#icon-qingshihan"></use>
              </svg>
            </div>
            <div style="font-size:0.14rem;margin-top: 0.05rem">请示函</div>
          </li>
          <li @click="go_reimburse">
            <div>
              <svg style="width: 0.27rem;height: 0.27rem" class="icon" aria-hidden="false">
                <use xlink:href="#icon-baoxiao"></use>
              </svg>
            </div>
            <div style="font-size:0.14rem;margin-top: 0.05rem">报销</div>
          </li>
           <li @click="go_contract">
            <div>
              <svg style="width: 0.27rem;height: 0.27rem" class="icon" aria-hidden="false">
                <use xlink:href="#icon-hetongshenpi"></use>
              </svg>
            </div>
            <div style="font-size:0.14rem;margin-top: 0.05rem">合同</div>
          </li>
           <li @click="go_payApply">
            <div>
              <svg style="width: 0.27rem;height: 0.27rem" class="icon" aria-hidden="false">
                <use xlink:href="#icon-fukuanshenqing"></use>
              </svg>
            </div>
            <div style="font-size:0.14rem;margin-top: 0.05rem">付款</div>
          </li>
          <li @click="go_stamp">
            <div>
              <svg style="width: 0.27rem;height: 0.27rem" class="icon" aria-hidden="false">
                <use xlink:href="#icon-yongyin"></use>
              </svg>
            </div>
            <div style="font-size:0.14rem;margin-top: 0.05rem">用印</div>
          </li>
          <li @click="go_absence">
            <div>
              <svg style="width: 0.27rem;height: 0.27rem" class="icon" aria-hidden="false">
                <use xlink:href="#icon-buqiashenqing"></use>
              </svg>
            </div>
            <div style="font-size:0.14rem;margin-top: 0.05rem">补卡</div>
          </li>
          <li @click="go_dimission">
            <div>
              <svg style="width: 0.27rem;height: 0.27rem" class="icon" aria-hidden="false">
                <use xlink:href="#icon-lizhi"></use>
              </svg>
            </div>
            <div style="font-size:0.14rem;margin-top: 0.05rem">离职</div>
          </li>
          <li @click="go_borrow">
            <div>
              <svg style="width: 0.27rem;height: 0.27rem" class="icon" aria-hidden="false">
                <use xlink:href="#icon-jiekuanshenqing"></use>
              </svg>
            </div>
            <div style="font-size:0.14rem;margin-top: 0.05rem">借款</div>
          </li>
          <li @click="go_reception">
            <div>
              <svg style="width: 0.27rem;height: 0.27rem" class="icon" aria-hidden="false">
                <use xlink:href="#icon-jiedaishenqing"></use>
              </svg>
            </div>
            <div style="font-size:0.14rem;margin-top: 0.05rem">接待</div>
          </li>
        </ul>
      </div>
      <div class="tab_work_con">
        <ul class="tab_work_2con">
          <li></li>
          <li>智能办公</li>
        </ul>
        <ul class="tab_work_3con">
          <li @click="go_record">
            <div>
              <svg style="width: 0.27rem;height: 0.27rem" class="icon" aria-hidden="false">
                <use xlink:href="#icon-kaoqin"></use>
              </svg>
            </div>
            <div>考勤打卡</div>
          </li>
          <li @click="go_outwork">
            <div>
              <svg style="width: 0.27rem;height: 0.27rem" class="icon" aria-hidden="false">
                <use xlink:href="#icon-waiqin"></use>
              </svg>
            </div>
            <div>公出签到</div>
          </li>
          <li @click="go_Maillist">
            <div>
              <svg style="width: 0.27rem;height: 0.27rem" class="icon" aria-hidden="false">
                <use xlink:href="#icon-tongxunlu"></use>
              </svg>
            </div>
            <div style="font-size:0.14rem;margin-top: 0.05rem">通讯录</div>
          </li>
          <li @click="go_workReport">
            <div>
              <svg style="width: 0.27rem;height: 0.27rem" class="icon" aria-hidden="false">
                <use xlink:href="#icon-gongzuohuibao"></use>
              </svg>
            </div>
            <div style="font-size:0.14rem;margin-top: 0.05rem">工作汇报</div>
          </li>
        </ul>
        <ul class="tab_work_3con">
          <!-- <li @click="go_Grouplist">
            <div>
              <svg style="width: 0.27rem;height: 0.27rem" class="icon" aria-hidden="false">
                <use xlink:href="#icon-qunzu"></use>
              </svg>
            </div>
            <div style="font-size:0.14rem;margin-top: 0.05rem">群组</div>
          </li> -->
        </ul>
      </div>
     <div class="tab_work_con" v-show="showMES">
        <ul class="tab_work_2con">
          <li></li>
          <li>物联网云平台</li>
        </ul>
        <ul class="tab_work_3con">
          <li @click="go_IoT">
            <div>
              <svg style="width: 0.27rem;height: 0.27rem" class="icon" aria-hidden="false">
                <use xlink:href="#icon-wulianwangpingtai"></use>
              </svg>
            </div>
            <div style="font-size:0.14rem;margin-top: 0.05rem">物联网管理</div>
          </li>
          <li @click="go_bigData">
            <div>
              <svg style="width: 0.27rem;height: 0.27rem" class="icon" aria-hidden="false">
                <use xlink:href="#icon-dashujufenxi"></use>
              </svg>
            </div>
            <div style="font-size:0.14rem;margin-top: 0.05rem">大数据分析</div>
          </li>
          <li @click="go_3DGIS">
            <div>
              <svg style="width: 0.27rem;height: 0.27rem" class="icon" aria-hidden="false">
                <use xlink:href="#icon-DGis"></use>
              </svg>
            </div>
            <div style="font-size:0.14rem;margin-top: 0.05rem">3D GIS</div>
          </li>
          <li @click="go_ConfigurationCenter">
            <div>
              <svg style="width: 0.27rem;height: 0.27rem" class="icon" aria-hidden="false">
                <use xlink:href="#icon-peizhizhongxin"></use>
              </svg>
            </div>
            <div style="font-size:0.14rem;margin-top: 0.05rem">配置中心</div>
          </li>
          <li @click="go_LogCenter">
            <div>
              <svg style="width: 0.27rem;height: 0.27rem" class="icon" aria-hidden="false">
                <use xlink:href="#icon-rizhizhongxin"></use>
              </svg>
            </div>
            <div style="font-size:0.14rem;margin-top: 0.05rem">日志中心</div>
          </li>
           <li @click="go_ContainerManagement">
            <div>
              <svg style="width: 0.27rem;height: 0.27rem" class="icon" aria-hidden="false">
                <use xlink:href="#icon-moxing"></use>
              </svg>
            </div>
            <div style="font-size:0.14rem;margin-top: 0.05rem">容器管理</div>
          </li> 
        
        </ul>
      </div>
       <div class="tab_work_con" v-show="true">
        <ul class="tab_work_2con">
          <li></li>
          <li>优制云</li>
        </ul>
        <ul class="tab_work_3con">
          <li @click="go_mes" v-if="showMES">
            <div>
              <svg style="width: 0.27rem;height: 0.27rem" class="icon" aria-hidden="false">
                <use xlink:href="#icon-zhinengzhizao"></use>
              </svg>
            </div>
            <div style="font-size:0.14rem;margin-top: 0.05rem">智能制造</div>
          </li>
          <li @click="go_erp">
            <div>
              <svg style="width: 0.27rem;height: 0.27rem" class="icon" aria-hidden="false">
                <use xlink:href="#icon-ERP"></use>
              </svg>
            </div>
            <div style="font-size:0.14rem;margin-top: 0.05rem">云ERP</div>
          </li>
          <li @click="go_crm">
            <div>
              <svg style="width: 0.27rem;height: 0.27rem" class="icon" aria-hidden="false">
                <use xlink:href="#icon-CRM"></use>
              </svg>
            </div>
            <div style="font-size:0.14rem;margin-top: 0.05rem">云CRM</div>
          </li>
          <li @click="go_null">
            <div>
              <svg style="width: 0.27rem;height: 0.27rem" class="icon" aria-hidden="false">
                <use xlink:href="#icon-PDM"></use>
              </svg>
            </div>
            <div style="font-size:0.14rem;margin-top: 0.05rem">云PDM</div>
          </li>
          <li @click="go_null">
            <div>
              <svg style="width: 0.27rem;height: 0.27rem" class="icon" aria-hidden="false">
                <use xlink:href="#icon-xietong"></use>
              </svg>
            </div>
            <div style="font-size:0.14rem;margin-top: 0.05rem">云协同</div>
          </li>
           <li @click="go_null">
            <div>
              <svg style="width: 0.27rem;height: 0.27rem" class="icon" aria-hidden="false">
                <use xlink:href="#icon-SCM"></use>
              </svg>
            </div>
            <div style="font-size:0.14rem;margin-top: 0.05rem">云SCM</div>
          </li> <li @click="go_null">
            <div>
              <svg style="width: 0.27rem;height: 0.27rem" class="icon" aria-hidden="false">
                <use xlink:href="#icon-zhinengfuwu"></use>
              </svg>
            </div>
            <div style="font-size:0.14rem;margin-top: 0.05rem">智能服务</div>
          </li>
        </ul>
      </div>

      <div class="tab_work_con" v-if="payShow">
        <ul class="tab_work_2con">
          <li></li>
          <li>其他</li>
        </ul>
        <ul class="tab_work_3con">
          <li @click="go_pay">
            <div>
              <svg style="width: 0.27rem;height: 0.27rem" class="icon" aria-hidden="false">
                <use xlink:href="#icon-ejiaofei1"></use>
              </svg>
            </div>
            <div style="font-size:0.14rem;margin-top: 0.05rem">e缴费</div>
          </li>
        </ul>
      </div>

    </div>
      
  </section>
</template>
<script>
  let date = new Date();
  let days = ["星期日","星期一","星期二","星期三","星期四","星期五","星期六"];
  function escape2Html(str){
    if(str==''||!str) return ''
    var arrEntities={'lt':'<','gt':'>','nbsp':' ','amp':'&','quot':'"','ldquo':'"','rdquo':'"','mdash':'_'};
    return str.replace(/&(lt|gt|nbsp|amp|quot|ldquo|rdquo|mdash);/ig,function(all,t){
      return arrEntities[t]});
  }
  function getCookie(name) {
    var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
    if (arr = document.cookie.match(reg))
      return unescape(arr[2]);
    else
      return null;
  }
  import {mapState, mapMutations} from 'vuex';
  export default {
    data () {
      return {
        mesNum : 0,//待办事宜条数
        banner: '',
        loading: false,
        is_login: true,
        mask: true,
        noNetwork: false,
        slogans:{},
        broadcast_list: [],
        dateString: date.getFullYear()+"-"+(date.getMonth()+1)+"-"+date.getDate()+"  "+days[date.getDay()],
        interval: null,
        logo: require("../../assets/no_wifi.png"),
        showMES: false,
        payShow:false,
        token:'',
      }
    },
    created(){
      if (window.localStorage.work_banner) {
        this.banner = JSON.parse(window.localStorage.work_banner)
      }

      this.setToken(this.Service.getCookie('auth_token'))
      this.token = this.Service.getCookie('auth_token')
    },
    computed: mapState(["token"]),
    methods: {
      ...mapMutations([
        'setToken',
      ]),
      go_record(){
        window.location.href = "epipe://?&mark=record"
        window["epipe_login_callback"] = auth_token => {
          window.localStorage.setItem("auth_token", auth_token);
        }
        TDGA.onEvent('record','考勤')                
      },
      go_outwork(){
        window.location.href = "epipe://?&mark=outwork"
        window["epipe_login_callback"] = auth_token => {
          window.localStorage.setItem("auth_token", auth_token);
        }
        TDGA.onEvent('outwork','外勤')        
      },
      go_Maillist(){
        window.location.href = "epipe://?&mark=Maillist"
        TDGA.onEvent('Maillist','通讯录')        
      },
      go_newsdetail(item){
        if (item.url != "#") {
          let title = Util.Title_format(item.title)
          window.location.href = "epipe://?&mark=newsdetail&title=" + title + "&url=" + item.url;
        }
      },
      go_workReport(){ //工作汇报
          window.location.href = "epipe://?&mark=workReport";
          TDGA.onEvent('workReport','工作汇报')        
      },
      //企业日报
      go_daily(){
        window.location.href = "epipe://?&mark=dailyreport";
        TDGA.onEvent('dailyreport','企业日报')        
      },
      //已办事宜
      go_finishAffairs(){
        window.location.href = "epipe://?&mark=finishAffair";
        TDGA.onEvent('finishAffair','已办事宜')
      },
      //待办事宜
      go_unfinishAffairs(){
        window.location.href = "epipe://?&mark=unfinishAffair"
        TDGA.onEvent('unfinishAffair','待办事宜')        
      },
      //我的申请
      go_myApply(){
        window.location.href = "epipe://?&mark=myApply"
        TDGA.onEvent('myApply','我的申请')                
      },
      //请假
      go_leave(){
        window.location.href = "epipe://?&mark=leave"
        TDGA.onEvent('leave','请假')                        
      },
       //请示函
      go_LetterOfRequest(){
        window.location.href = "epipe://?&mark=letterOfRequest"
        TDGA.onEvent('letter_of_request','请示函')                        
      },
      go_null(){
        window.location.href = "epipe://?&mark=dialog"
      },  
      //合同审批
      go_contract(){
        window.location.href = "epipe://?&mark=contract"
        TDGA.onEvent('contract','合同审批')
      },
      go_stamp(){
        window.location.href = "epipe://?&mark=stamp"
        TDGA.onEvent('stamp','用印')
      },
      go_reimburse(){
        window.location.href = "epipe://?&mark=reimburse"
        TDGA.onEvent('contract','报销')
      },
      go_trip(){ //出差
          window.location.href = "epipe://?&mark=trip"
         TDGA.onEvent('trip','出差')
      },
      //公出
      go_goOutWork(){
        window.location.href = "epipe://?&mark=goOutWork"
        TDGA.onEvent('goOutWork','公出')
      },
      go_payApply(){
        window.location.href = "epipe://?&mark=payApply"
        TDGA.onEvent('payApply','付款')
      },
      go_dimission(){
        window.location.href = "epipe://?&mark=dimission"
        TDGA.onEvent('dimmission','离职')
      },
      go_reception(){
        window.location.href = "epipe://?&mark=reception"
        TDGA.onEvent('reception','接待')
      },
      go_borrow(){
        window.location.href = "epipe://?&mark=borrow"
        TDGA.onEvent('borrow','借款')
      },
      go_absence(){
        window.location.href = "epipe://?&mark=absence"
        TDGA.onEvent('absence','补卡')
      },
      go_inform(){ //通知
        window.location.href = "epipe://?&mark=message"
      },
      //跳转群组
      go_Grouplist(){
        window.location.href = "epipe://?&mark=Grouplist"
        TDGA.onEvent('group','群组')                                
      },
      go_mes(){
          window.location.href = "epipe://?&mark=mes";
        TDGA.onEvent('materialControl','移动制造')   
      },
       go_erp(){
          window.location.href = "epipe://?&mark=erp&url="+'http://cerphhyg1001.epipe.cn/youguanapp?dbname=cerphhyg1001&token='+this.token
          TDGA.onEvent('ERP','ERP')   
      },
      go_crm(){
          window.location.href = "epipe://?&mark=crm&url="+"http://ccrmhhyg1010.epipe.cn/youguanapp?dbname=ccrmhhyg1010&token="+this.token
          TDGA.onEvent('CRM','CRM')   
      },
      //物料管理
      go_materierl(){
        window.location.href = "epipe://?&mark=materieldaily";
        TDGA.onEvent('materialControl','物料管理')        
      },
      //-
      go_machine(){
        window.location.href = "epipe://?&mark=warning";
        TDGA.onEvent('equipmentControl ','设备管理')                        
      },
      //生产管理
      go_output(){
        window.location.href = "epipe://?&mark=outputdaily";
        TDGA.onEvent('productionControl ','生产管理')                        
      },
      //质量管理
      go_quality(){
        window.location.href = "epipe://?&mark=qualitydaily";
        TDGA.onEvent('qualityControl','质量管理')                                
      },
      //能源管理
      go_energy(){
        window.location.href = "epipe://?&mark=power";
        TDGA.onEvent('energyControl','能源管理')                        
      },
      //能源监控
      go_energyMonitor(){
        window.location.href = "epipe://?&mark=energymonitoring";
        TDGA.onEvent('energymonitoring','能源监控')
      },
      go_pay(){
        window.location.href = "epipe://?&mark=pay";
        TDGA.onEvent('pay','e缴费')                
      },
      //趋势监控
      go_trendMonitor(){
        window.location.href = "epipe://?&mark=trendmonitoring";
        TDGA.onEvent('trendmonitoring','趋势监控')    
      },
       //三化云平台
      go_IoT(){ //物联网平台
        // window.location.href = "epipe://?&mark=landscape&title=物联网平台&url=http://39.104.84.131/thingsSystemManager#/homeTenant";
        window.location.href = "epipe://?&mark=landscape&title=物联网平台&url=http://39.104.84.131/autoLogin?username=TenantAdmin@bupt.edu.cn&password=password&module=thingsManager";
      },
      go_bigData(){ //大数据分析
        window.location.href = "epipe://?&mark=landscape&title=大数据分析&url=http://39.104.84.131/autoLogin?username=TenantAdmin@bupt.edu.cn&password=password&module=bigdata";
      },
      go_3DGIS(){ //3dGIS
        window.location.href = "epipe://?&mark=landscape&title=3D_GIS&url=http://39.104.84.131/autoLogin?username=TenantAdmin@bupt.edu.cn&password=password&module=gis";
      },
      go_ConfigurationCenter(){ //配置中心
        window.location.href = "epipe://?&mark=landscape&title=配置中心&url=http://39.104.84.131/autoLogin?username=TenantAdmin@bupt.edu.cn&password=password&module=disconf";
      },
      go_LogCenter(){ //日志中心
        window.location.href = "epipe://?&mark=landscape&title=日志中心&url=http://39.104.84.131/autoLogin?username=TenantAdmin@bupt.edu.cn&password=password&module=log";
      },
      go_ContainerManagement(){ //容器管理
        window.location.href = "epipe://?&mark=landscape&title=容器管理&url=http://39.104.84.131/autoLogin?username=TenantAdmin@bupt.edu.cn&password=password&module=k8s";
      },
      //判断用户是否有组织
      organization(){
        this.axios.get(this.Service.organization).then(res =>{
          console.log("用户组织",res);

          if(res.data.h.code == 200){
            let obj = res.data.b;
            if(obj.type == 1 || obj.type == 2){  //待审核，跳转到待审核页面
              this.$router.push({path:'/pending'});
            }else if(obj.type == 3){  //无组织，跳转到申请加入组织页面
              this.$router.push({path:'/Nologin'});
            }
            if(obj.menuType.indexOf('1')>-1){ //显示e付款
              this.payShow = true;
            }
            this.mask = false;  //有组织，展示工作台
       
          }else{
            this.mask = false;
            this.$toast(err.data.h.msg);
            this.$router.push({path:'/Nologin'}); //跳转无组织页面
          }
        }).catch(err =>{
          this.mask = false;
          this.noNetwork = true; //显示无网络界面
          this.$toast(err.data.h.msg);
        });
      },
      /*获取用户信息*/
      getUserInfo(){
        // const userToken = getCookie("auth_token") ? getCookie("auth_token") : "9d760d72-f1dc-4f71-959c-e197ccf9a78e";
        const userToken = getCookie("auth_token");
        if(userToken){
          this.axios.get('/user/info/by/token',{params: {token:userToken}}).then(res =>{
            console.log("用户信息",res);
            if(res.data.h.code === 200 && res.data.b.centerGroupId){
              this.getFactory(res.data.b.centerGroupId);
            }
          });
        }
      },
      /*获取工厂ID*/
      getFactory(id){
        this.$mes.get("/user/factoryId",{
          companyId: id
        }).then(res =>{
          console.log("工厂信息",res);
          if(res.b.factoryId){
            this.showMES = true;
          }else{
            this.showMES = false;
          }
        })
      },
      /*获取banner图片*/
      getBanner(){
        let that = this;
        this.axios.get(this.Service.content_show, {params: {type: 3, locationId: 30}}).then(function (data) { //欢迎图
          if (data.data.b) {
            data.data.b[0].imgUrl = data.data.b[0].imgUrl + "?imageslim&imageView2/1/w/750/h/320"
            that.banner = data.data.b[0]
            window.localStorage.work_banner = JSON.stringify(data.data.b[0])
          }
        });
      },
      /*广播信息轮播*/
      /*工作台文字信息*/
      slogan(){
        this.axios.get(this.Service.slogan).then(res =>{
          console.log("标语",res);
          if(res.data.h.code === 200){
            this.slogans.firstLine = escape2Html(res.data.b.firstLine);
            this.slogans.secondLine = escape2Html(res.data.b.secondLine);
          }
        });
      },
      /*获取广播消息*/
      message(){
        let vm = this;
        this.axios.get(this.Service.message).then(res =>{
          if(res.data.h.code === 200){
            if(res.data.b.data.length>5){
              for(let i=0;i<5;i++){
                this.broadcast_list.push(res.data.b.data[i]);
              }
            }else{
              this.broadcast_list = res.data.b.data;
            }
            if(this.broadcast_list.length > 1){
              this.broadcast();
            }
          }
        });
        window["epipe_message_callback"] = () => {
          vm.message();
        }
      },
      /*消息跳转*/
      messageLink(){
        window.location.href = "epipe://?&mark=message"
      },
      /*刷新页面*/
      reload(){
        this.mask = true;
        this.noNetwork = false;
        setTimeout(() =>{
          window.location.reload();
        },0);
      },
      getAffairs(){
        let vm = this;
        vm.mesNum = 0;
        this.axios.get(this.Service.affairsList).then(function(res){
              vm.mesNum = res.data.b.data[0].count;
            });

        window["epipe_affairs_callback"] = () => {
            vm.getAffairs();
        }
      },
    },
 
    mounted(){
      this.organization();
      this.getUserInfo();
      this.slogan();
      this.getAffairs();
    }
  }
</script>


