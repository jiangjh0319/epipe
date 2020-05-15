<template>
  <div class="mask" v-if="mask"></div>
    <div v-else>
        <div class="no-network" v-if="noNetwork">
            <div class="no-network-content">
                <img :src="logo" alt="无网络">
                <div class="tips">
                <p style="font-size: 0.16rem;">您的手机网络不太顺畅~</p>
                <p>请检查网络设置</p>
                </div>
                <div class="btn-refresh" @click.stop.prevent="reload()">刷新</div>
            </div>
            </div>
        <section class="back">
            <div class="add-organization" @click.stop.prevent="organshow=true">
                <svg style="" class="icon" aria-hidden="false">
                    <use xlink:href="#icon-tianjia1"></use>
                </svg>

                <div class="organ-list" v-show="organshow">
                    <p @click.stop.prevent="openUrl('create')">创建组织</p>
                    <p @click.stop.prevent="openUrl('search')">搜索组织</p>
                    <p @click.stop.prevent="openUrl('myOrganization')">我的组织</p>
                </div>
            </div>
            <div class="infor">

                <div class="infor-user">
                    <img :src="userData.profileImg"/>
                    <div>
                        <p>{{userData.name}}</p> 
                        <p class="company" @click.stop.prevent="openUrl('selectgroup')">{{companyname}}
                            <svg style="width: 0.12rem;height: 0.12rem;" class="icon" aria-hidden="false">
                                <use xlink:href="#icon-xiangyou"></use>
                            </svg>
                        </p>
                    </div>
                </div>

                <div class="infor-msg">
                    <div style="display:flex">
                        <div style="flex:1">
                        <p class="infor-advertising">{{slogans.firstLine}}</p>
                            <p class="infor-date">{{dateString}}</p>
                            <!-- <p class="infor-date">{{token}}</p> -->
                        </div>
                        <div class="msg-box" @click.stop.prevent="message">
                            <svg style="width: 0.27rem;height: 0.27rem" class="icon" aria-hidden="false">
                                <use xlink:href="#icon-gonggao"></use>
                            </svg>
                            <span>公告</span>
                        </div>
                    </div>

                    <div>

                    </div>
                </div>

            </div>

            <div class="menu">
                <div class="menu-lf" @click.stop.prevent="go_record">
                    <p class="h-title">今日考勤</p>
                    <p class="menu-lf-date">{{toDayCheck!=''?toDayCheck:'未打卡'}}</p>
                    <a >去打卡</a>
                    <span>不要忘记打下班卡哦</span>
                </div>

                <div class="menu-rg">
                    <div>
                        <div  @click="businessCircle" class="menu-rg-work">
                            <svg style="width: 0.27rem;height: 0.27rem;margin-top:0.15rem;" class="icon" aria-hidden="false">
                                <use xlink:href="#icon-qiyequan"></use>
                            </svg>
                            <p>企业圈</p>
                        </div>

                        <div @click="agenda" style="border-right:none">
                            <svg style="width: 0.27rem;height: 0.27rem;margin-top:0.15rem;" class="icon" aria-hidden="false">
                                <use xlink:href="#icon-richeng1"></use>
                            </svg>
                            <p>日程</p>
                        </div>
                    </div>
                    <div >
                        <div class="menu-rg-company" @click="companyWall" style="border-bottom:none;">
                            <svg style="width: 0.27rem;height: 0.27rem;margin-top:0.15rem;" class="icon" aria-hidden="false">
                                <use xlink:href="#icon-gongsiqiang"></use>
                            </svg>
                        <span class="num company-num" v-if="companyCount">{{companyCount}}</span>

                            <p>公司墙</p>
                        </div>
                        <div @click="exercise" style="border-right:none;border-bottom:none;">
                            <svg style="width: 0.27rem;height: 0.27rem;margin-top:0.15rem;" class="icon" aria-hidden="false">
                                <use xlink:href="#icon-yundong"></use>
                            </svg>
                            <p>运动</p>
                        </div>
                    </div>

                </div>
            </div>
        </section>

        <div class="menu-list">
            <!-- <div class="menu-item"  :key="index">
                <p class="item-title"> <i></i> <span>测试</span>  <a class="manage" @click="manage">管理</a> </p>
                <ul>
                    <li @click="meal()">
                         <svg style="font-size: 0.33rem;"  class="icon img" aria-hidden="false">
                            <use xlink:href="#icon-gongzuohuibao"></use>
                        </svg>
                        <span>采购</span>
                    </li>
                    <li @click="document()">
                         <svg style="font-size: 0.33rem;"  class="icon img" aria-hidden="false">
                            <use xlink:href="#icon-gongzuohuibao"></use>
                        </svg>
                        <span>物品领用</span>
                    </li>
                </ul>
            </div> -->
            <div class="menu-item"  :key="index">
                <p class="item-title"> <i></i> <span>常用应用</span>  <a class="manage" @click="manage">管理</a> </p>
                <ul>
                    <!-- <li  @click="unfinishAffair()">
                         <svg style="font-size: 0.33rem;"  class="icon img" aria-hidden="false">
                            <use xlink:href="#icon-daibanshiyi"></use>
                        </svg>
                        <span class="num" v-if="oaCount">{{oaCount}}</span>
                        <span>待办事宜</span>
                    </li> -->
                    <li @click="unfinishAffair()">
                        <svg style="font-size: 0.33rem;"  class="icon img" aria-hidden="false">
                            <use xlink:href="#icon-daibanshiyi"></use>
                        </svg>
                        <span class="num" v-if="oaCount">{{oaCount}}</span>
                        <span>待办事宜</span>
                    </li>
                    <li  @click="finishAffair()">
                         <svg style="font-size: 0.33rem;"  class="icon img" aria-hidden="false">
                            <use xlink:href="#icon-yiban"></use>
                        </svg>
                        <span>已办事宜</span>
                    </li>
                    <li  @click="copy()">
                         <svg style="font-size: 0.33rem;"  class="icon img" aria-hidden="false">
                            <use xlink:href="#icon-chaosong"></use>
                        </svg>
                        <span class="num" v-if="copyCount">{{copyCount}}</span>
                        <span>我的抄送</span>
                    </li>
                    <li @click="myApply()">
                         <svg style="font-size: 0.33rem;"  class="icon img" aria-hidden="false">
                            <use xlink:href="#icon-wodeshenqing-mian"></use>
                        </svg>
                        <span>我的申请</span>
                    </li>
                     <li @click="workReport()">
                         <svg style="font-size: 0.33rem;"  class="icon img" aria-hidden="false">
                            <use xlink:href="#icon-gongzuohuibao"></use>
                        </svg>
                        <span>工作汇报</span>
                        <span class="num redDot" v-if="workRed"></span>
                    </li>
                    <li v-if="show_app"  @click="to_link('approvalRecords')">
                         <svg style="font-size: 0.33rem;"  class="icon img" aria-hidden="false">
                            <use xlink:href="#icon-gongzuohuibao"></use>
                        </svg>
                        <span>审批记录</span>
                        <span class="num redDot" v-if="workRed"></span>
                    </li>
                    <li  @click="to_link('cloud_file')">
                         <!-- <svg style="font-size: 0.33rem;"  class="icon img" aria-hidden="false">
                            <use xlink:href="#icon-gongzuohuibao"></use>
                        </svg> -->
                        <img src="../../assets/file.png"/>
                        <span>我的云盘</span>
                    </li>
                    <li v-for="(c,i) in workData[0].apps" @click="go_jump(c)" :key="i" >
                        <img :src="c.icon"/>
                        <span>{{c.name}}</span>
                    </li>
                    <li @click="go_neatenWork" v-if="workData[0].apps.length<3">
                         <svg style="font-size: 0.33rem;"  class="icon img" aria-hidden="false">
                            <use xlink:href="#icon-tianjiarenyuan"></use>
                        </svg>
                        添加
                    </li>
                </ul>
            </div>
            <div class="menu-item" v-for="(item,index) in workData" :key="index" v-if="index!=0&&item.hideFlag!='1'&&item.apps.length&&item.show=='show'">
                <p class="item-title"> <i></i> <span>{{item.name}}</span></p>
                <ul>
                    <li v-for="(c,i) in item.apps" :key="i" @click="go_jump(c)" v-if="c.delFlag!='1'">
                        <img :src="c.icon"/>
                        <span>{{c.name}}</span>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script>
    function escape2Html(str){
        if(str==''||!str) return ''
        var arrEntities={'lt':'<','gt':'>','nbsp':' ','amp':'&','quot':'"','ldquo':'"','rdquo':'"','mdash':'_'};
        return str.replace(/&(lt|gt|nbsp|amp|quot|ldquo|rdquo|mdash);/ig,function(all,t){
        return arrEntities[t]});
    }
    let days = ["星期日","星期一","星期二","星期三","星期四","星期五","星期六"];
    let date = new Date();
    import {mapState, mapMutations} from 'vuex';
    export default {
        data() {
            return {
               dateString:date.getFullYear()+"-"+(date.getMonth()+1)+"-"+date.getDate()+"  "+days[date.getDay()],
               workData:[],
               slogans:{}, //标语
               userData:{}, //用户信息
               signTotal:{}, //考勤统计
               toDayCheck:'', //今日考勤
               tokenStr:'',
               oaCount:0,
               copyCount:0,
               companyCount:0,
               payShow:false,
               mask:true,
               workRed:false,
               noNetwork:false,
                logo: require("../../assets/no_wifi.png"),
                companyname:'',
                organshow:false,
                show_app:false,
            }
        },
        created() {
            let that = this;
            console.log(that)
             window["workUpdate"] = () => {
                that.getCount();
                that.get_work();
                that.redDot();
                that.getTotal();//获取考勤总次数
                that.today();//获取今日考勤
                that.getCompanyCount();
            }

            window['signUpdate'] =() =>{
                that.organshow = false
                that.getCount();
                that.redDot();
            }
            this.getToken()
            // this.token = this.Service.getCookie('auth_token')

            this.Util.getOa(this)

            this.organization(); //获取是否有组织
            this.slogan(); // 获取标语
            this.getInfor(); //
            that.getCount()
            that.redDot();
            that.getCompanyCount();
            this.getUserInfor(); //获取用户名等信息
            this.getTotal();//获取考勤总次数
            this.today();//获取今日考勤
            this.get_work();//获取工作台图标
        },
        computed:  mapState(["token"]),
        // },
        methods:{
            ...mapMutations([
                'setToken',
            ]),
            unfinishAffair(){
                 window.location.href = "epipe://?&mark=unfinishAffair";
            },
            getToken(){
                let str = this.Service.getCookie('auth_token')

                if(!str){
                    str = localStorage.getItem('auth_token')
                }
                
                this.setToken(str)
                this.tokenStr = str
            },
            finishAffair(){
                 window.location.href = "epipe://?&mark=finishAffair";
            },
            copy(){
                 window.location.href = "epipe://?&mark=copy";
            },
            myApply(){
                 window.location.href = "epipe://?&mark=myApply";
            },
            meal(){
                 window.location.href = "epipe://?&mark=buy";
            },
            document(){
                 window.location.href = "epipe://?&mark=material";
            },
            workReport(){
                 window.location.href = "epipe://?&mark=workReport";
            },
            agenda(){
                 window.location.href = "epipe://?&mark=agenda";
            },
            businessCircle(){
                window.location.href = "epipe://?&mark=enterprise"
            },
            exercise(){
                 window.location.href = "epipe://?&mark=exercise";
            },
            openUrl(url){
                console.log(url)
                    this.organshow = false
                    window.location.href = "epipe://?&mark="+url;
            },
            redDot(){
                this.axios.get('work/report/new').then(res=>{
                    this.workRed = res.data.b;
                })
            },
            getCount(){
                let that = this;
                this.axios.get('/work/wait/list').then(function(res){
                    if(res.data.b.data.length){
                        that.oaCount = res.data.b.data[0].count 
                    }else{
                        that.oaCount = 0
                    }
                 }).catch(function(error){
                 })

                 this.axios.get('/work/copy/list').then(function(res){
                    that.copyCount = res.data.b.data[0].count 
                 })

            },
            getCompanyCount(){
                let that = this;
                this.axios.get('/wall/articleorthirdcategory/totalunread').then(function(res){
                    that.companyCount = res.data.b 
                 })
            },
            checkJurisdiction(type,url){
                let str = url.slice(url.indexOf('url='))
                             this.getToken()

                // str.slice(0,str.indexOf('?&'))
                str.slice(4,str.indexOf('?&'))
                // console.log(window.location.href = 'epipe://?&mark=crm&url='+str+this.token)

                this.axios.get('/user/system?type='+type).then(res=>{
                        if(res.data.h.code!==200){
                            this.$toast(res.data.h.msg)
                            return false
                        }else{

                            if(type==0){
                                if(!this.tokenStr){
                                    this.$toast('token失效')
                                    return
                                }
                                    window.location.href = url+this.tokenStr
                            }else{
                                window.location.href = 'epipe://?&mark=crm&url='+res.data.b.url+'#/index?&token='+this.tokenStr
                            }
                        }
                 })
            },
            go_jump(obj){ //应用跳转
                if(obj.url.indexOf('openurl')>-1){
                
                 let url = obj.url.slice(obj.url.indexOf('openurl')+8) 
                //  console.log(url)
                        window.location.href ='epipe://?&mark=openurl&data='+JSON.stringify({displayType:obj.displayType,shareFlag:obj.shareFlag,collectFlag:obj.collectFlag,name:obj.name,url})
                        // console.log('epipe://?&mark=openurl&data='+JSON.stringify({displayType:obj.displayType,shareFlag:obj.shareFlag,collectFlag:obj.collectFlag,name:obj.name,url}))
                      return;
                }
                else if(obj.url.indexOf('token=')>-1){
                    let type = obj.url.indexOf('mark=mes_app')>-1?1:0;
                    this.checkJurisdiction(type,obj.url)
                }else if(obj.url.indexOf('mark=landscape')>-1){
                    window.location.href = obj.url
                    return;
                }else{
                     window.location.href = obj.url+'&data='+JSON.stringify({displayType:obj.displayType,shareFlag:obj.shareFlag,collectFlag:obj.collectFlag,name:obj.name});
                }
            },
            to_link(url){
                 window.location.href = "epipe://?&mark="+url;
            },
            total(){
                 window.location.href = "epipe://?&mark=total";
            },
            manage(){ //管理
                // this.$router.push('/neatenWork')
                 window.location.href = "epipe://?&mark=neatenWork";
            },
            message(){
                 window.location.href = "epipe://?&mark=message";
            },
            get_work(){
                let _this = this;

                this.axios.get('/work/app/list').then(res=>{
                    _this.workData = res.data.b.appCategorys;
                    _this.isHide()
                }).catch(function(err){
                })
            },
            go_neatenWork(){
                // this.$router.push({path:'/addWork'})
                 window.location.href = "epipe://?&mark=addWork";
            },
            go_record(){
                 window.location.href = "epipe://?&mark=record";
            },
            companyWall(){ //跳转公司墙
                 window.location.href = "epipe://?&mark=companyWall";
            },
            slogan(){ //标语
                this.axios.get(this.Service.slogan).then(res =>{
                console.log("标语",res);
                if(res.data.h.code === 200){
                    this.slogans.firstLine = escape2Html(res.data.b.firstLine);
                    this.slogans.secondLine = escape2Html(res.data.b.secondLine);
                }
                });
            },
            isHide(){
                this.workData.forEach(el=>{
                    el.show = 'hide'
                    el.apps.forEach(item=>{
                        if(item.delFlag=='0'){
                            el.show = 'show'
                        }
                    })
                })
            },
             reload(){ //刷新
                this.mask = true;
                this.noNetwork = false;
                setTimeout(() =>{
                window.location.reload();
                },0);
            },
            getUserInfor(){  //用户信息
                this.axios.get('/user/info').then(res =>{
                    this.userData = res.data.b
                    localStorage.setItem('userId',this.userData.userId)
                    localStorage.setItem('companyId',this.userData.companyId)
                });
            },
            today(){ //今日考勤
                    let that = this;
                    this.axios.get('/check/sign/record', {
                            params: {
                                checkDate: date.getFullYear()+"-"+(date.getMonth()+1)+"-"+date.getDate(),
                            }
                        }).then(res=>{
                            let str = res.data.b.data[res.data.b.data.length - 1].signTime;
                            that.toDayCheck = str.slice(10)
                        })
            },
            getTotal(){ //考勤统计
                let that = this;
                this.axios.get(this.Service.checkStatic, {
                        params: {
                            staticDate: date.getFullYear()+"-"+(date.getMonth()+1),
                        }
                    }).then(function (res){
                        that.signTotal = res.data.b.normalTimes;
                    })
            },
            getInfor(){
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
                        this.companyname = res.data.b.companyname
            
                }else{
                    this.mask = false;
                    this.$router.push({path:'/Nologin'}); //跳转无组织页面
                }
                }).catch(err =>{
                this.mask = false;
                this.noNetwork = true; //显示无网络界面
                this.$toast(err.data.h.msg);
                });

                this.axios.get('/apply/user/permit/if').then(res=>{
                    this.show_app = res.data.b;
                })
            },
        }

    }
</script>

<style scoped lang="stylus">



 .num{
    width 0.16rem;
    color #fff !important;
    height 0.16rem;
    line-heigth 0.15rem;
    text-algin center;
    position: absolute;
    top: -0.1rem;
    right: 0;
    font-size 0.1rem
    background-color: #fd545c;
    border-radius 50%;
    color #fff;
    padding 0.01rem;
}

.redDot{
    width:0.08rem;
    height:0.08rem;
    top: -0.03rem;
    right: 0.13rem;
}

.company-num{
     top:0.05rem;
     right:0.05rem;
 }

.msg-box{
    padding-right 0.02rem;
    float:right;

    svg{
        display:block;
    }

    span{
            font-size: 0.12rem;
            color: #cfe5db;
    }
}

.mask{
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: white;
    z-index: 9;
  }

    .back{
        background-color #42a653
        height 2.3rem;
        position relative
        box-sizing border-box;
    }

    .organ-list{
        position absolute;
        width:1rem;
        height 1.1rem;
        border-radius:0.03rem;
        top:0.3rem;
        right:0;
        background-color #fff;

        p{
            border-bottom:0.01rem solid #e6e6e6
            font-size 0.15rem;
            line-height:0.36rem;
            text-align:center;
        }

        p:last-child{
            border:none
        }
    }

    .add-organization{
        position:absolute;
        right:0.15rem;
        top:0.15rem;
        padding:0.1rem;
    }

    .manage{
        color #609ef7;
        font-size 0.14rem;
        float right;
        margin-top 0.02rem;
    }

    .infor{
        color #fff
        padding 0 0.15rem;
        padding-top 0.35rem;

        &-user{
            overflow hidden;
            font-size 0.17rem;
            margin-bottom 0.15rem;
            letter-spacing 0.02rem;
            display:flex;

            img{
                box-sizing border-box;
                float left;
                width 0.5rem;
                height 0.5rem;
                border-radius 50%;
                border 0.02rem solid #fff;
                margin-right 0.06rem;
            }
        }

        .company{
            font-size 0.14rem;
            color:#cfe6db;
        }

        &-advertising{
            font-size 0.17rem;
            letter-spacing 0.01rem;
            margin-bottom 0.07rem;
        }

        &-date{
            font-size 0.12rem;
            color #cfe5db;
        }
    }

    .menu{
        // width 3.45rem;
        height 1.7rem;
        box-sizing border-box;
        background-color #fff
        border-top-left-radius 0.08rem;
        border-top-right-radius 0.08rem;
        display flex;
        text-align center
        position absolute 
        bottom -1rem;
        left 0;
        right 0;
        margin 0 0.15rem;

        &-lf{
            border-right 0.01rem solid #e6e6e6;
            width 1.75rem;

            .h-title{
                margin-top 0.2rem;
                margin-bottom 0.1rem;
                font-size 0.17rem;
            }

            &-date{
                color #609ef7
                font-size 0.24rem;
                font-weight bold;
            }

            a{
                display block
                width 1rem;
                height 0.35rem;
                line-height 0.35rem;
                border-radius 0.35rem;
                background-color #f28912;
                color #fff;
                margin 0 auto;
                font-size 0.18rem
                margin-bottom 0.05rem;
                margin-top 0.18rem;
            }

            span{
                color #b2b2b2;
                font-size 0.12rem;
            }
        }

        &-rg{
            flex 1;
            display flex
            flex-direction:column;

            >div{
                display flex
                flex 1;
                width 100%;

                >div{
                    flex 1;
                    border-bottom 0.01rem solid #e6e6e6;
                    border-right 0.01rem solid #e6e6e6;
                    position relative;
                }
            }

            &-work{

                span{
                    display inline-block
                    font-size 0.22rem;
                    color #1bb36f;
                    font-weight bold;
                    margin-top:0.15rem;
                }
            }
        }
    }

    .menu-list{
        margin-top 1.2rem;
        padding-bottom 0.2rem;
    }

    .menu-item{
        box-sizing border-box;
        background-color #fff;
        margin 0 0.15rem;
        padding 0.15rem;
        border-raius 0.04rem;
        margin-bottom 0.15rem;

        .item-title{
            overflow hidden

            i{
                float left
                width 0.03rem;
                height 0.16rem;
                background-color #f80;
                border-radius 0.03rem;
                margin-top 0.03rem;
                margin-right 0.06rem;
            }

            span{
                float left
                font-size 0.16rem;
                color #333
            }
        }

        img,.img{
            display block;
            width 0.27rem;
            height 0.27rem;
            margin 0 auto;
            margin-bottom 0.03rem;
        }

        ul{
            overflow hidden

            li{
                float left;
                width 25%;
                text-align center;
                margin-top 0.15rem;
                position relative
            }

            span{
                font-size 0.14rem;
                color #333
            }
        }
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