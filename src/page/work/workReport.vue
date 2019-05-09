<template>
    <div>
         <TopHead
        native='native'
        bgcolor = '#42a653'
        :title='title'
         ></TopHead>
         <section class="main" v-if="type==1">
             <div class="main-ul">
                 <div class="main-li" @click="go_daynews()">
                     <div>
                         <svg style="width: 0.27rem;height: 0.27rem" class="icon" aria-hidden="false">
                            <use xlink:href="#icon-ribao"></use>
                        </svg>
                     </div>
                     <p>日报</p>
                 </div>
                 <div class="main-li" @click="go_weeknews()">
                        <div>
                         <svg style="width: 0.27rem;height: 0.27rem" class="icon" aria-hidden="false">
                            <use xlink:href="#icon-zhoubao"></use>
                        </svg>
                     </div>
                     <p>周报</p>
                 </div>
                 <div class="main-li" @click="go_monthnews()">
                    <div>
                         <svg style="width: 0.27rem;height: 0.27rem" class="icon" aria-hidden="false">
                            <use xlink:href="#icon-yuebao"></use>
                        </svg>
                     </div>
                     <p>月报</p>
                 </div>
                 <div class="main-li" @click="go_journal()">
                    <div>
                        <svg style="width: 0.27rem;height: 0.27rem" class="icon" aria-hidden="false">
                            <use xlink:href="#icon-gongzuohuibao"></use>
                        </svg>
                    </div>
                    <p>工作汇报</p>
                </div>
            </div>
            <div class="main-ul">

            </div>
         </section>

         <section class="main" v-if="type==2">
             <div class="main-ul">
                 <div class="main-li" @click="go_output()">
                      <div>
                         <svg style="width: 0.27rem;height: 0.27rem" class="icon" aria-hidden="false">
                            <use xlink:href="#icon-shengchanguanli"></use>
                        </svg>
                     </div>
                     <p>生产管理</p>
                 </div>

                <div class="main-li" @click="go_materierl()">
                    <div>
                        <svg style="width: 0.27rem;height: 0.27rem" class="icon" aria-hidden="false">
                        <use xlink:href="#icon-wuliaoguanli"></use>
                    </svg>
                    </div>
                    <p>物料管理</p>
                </div>
                 <div class="main-li" @click="go_machine()">
                    <div>
                        <svg style="width: 0.27rem;height: 0.27rem" class="icon" aria-hidden="false">
                        <use xlink:href="#icon-shebeiguanli"></use>
                    </svg>
                    </div>
                    <p>设备管理</p>
                </div>
                 <div class="main-li" @click="go_quality()">
                    <div>
                        <svg style="width: 0.27rem;height: 0.27rem" class="icon" aria-hidden="false">
                        <use xlink:href="#icon-zhiliangguanli"></use>
                    </svg>
                    </div>
                    <p>质量管理</p>
                </div>
             </div>

             <div class="main-ul">
                  <div class="main-li" @click="go_energy()">
                      <div>
                         <svg style="width: 0.27rem;height: 0.27rem" class="icon" aria-hidden="false">
                            <use xlink:href="#icon-nengyuanguanli"></use>
                        </svg>
                     </div>
                     <p>电耗分析</p>
                 </div>
                  <div class="main-li"></div>
                  <div class="main-li"></div>
                  <div class="main-li"></div>
             </div>
         </section>
    </div>
</template>

<script>
    import TopHead  from '../../components/topheader.vue'  //header导航栏
    export default {
        data() {
            return {
                type:1,
                title:'工作汇报'
            }
        },
        components:{
            TopHead
        },
        mounted() {
            this.type = this.$route.query.type;

            if(this.type==2){
                this.title = '移动制造'
            }
        },
        methods:{
              go_daynews(){
                    window["epipe_login_callback"] = auth_token => {
                    window.localStorage.setItem("auth_token", auth_token);
                    }
                    window.location.href = "epipe://?&mark=daynews"
                    TDGA.onEvent('daynews','日报')
                },
             go_weeknews(){
                window["epipe_login_callback"] = auth_token => {
                window.localStorage.setItem("auth_token", auth_token);
                }
                window.location.href = "epipe://?&mark=weeknews"
                TDGA.onEvent('weeknews','周报') 
            },
            go_monthnews(){
                window["epipe_login_callback"] = auth_token => {
                window.localStorage.setItem("auth_token", auth_token);
                }
                window.location.href = "epipe://?&mark=monthnews"
                TDGA.onEvent('monthnews','月报')                        
            },
             go_journal(){
                window["epipe_login_callback"] = auth_token => {
                window.localStorage.setItem("auth_token", auth_token);
                }
                window.location.href = "epipe://?&mark=journal"
                TDGA.onEvent('journal','工作汇报')                

            },
             //物料管理
            go_materierl(){
                window.location.href = "epipe://?&mark=materieldaily";
                TDGA.onEvent('materialControl','物料管理')        
            },
            //设备管理
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
        }
    }
</script>

<style scoped lang="stylus">

    .main{
        margin-top:0.65rem;
    }

    .main-ul{
        display flex;
    }

    .main-li{
        flex 1
        text-align center
        margin-bottom 0.20rem;

        p{
            margin-top 0.05rem;
        }
    }

</style>