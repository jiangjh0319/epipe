<template>
    <div>
        <div class="main-top">
        <img src="../../assets/OA_01.png"/>
            <div class="box">
                <div>
                    <h3>欢迎注册优管APP</h3>
                    <div>
                        <div class="input">
                            <input v-model="mobile"  placeholder="请输入手机号码" type="number">
                        </div>
                        <div class="input">
                            <input v-model="code" placeholder="请输入验证码" style="width:50%;float:left;" type="text">
                            <span class="yzm" @click="get_code" v-if="!isGET">获取验证码</span>
                            <span class="yzm" style="color:#ccc;" v-else>已发送({{s}}s)</span>
                        </div>
                        <div class="input">
                            <input v-model="password" placeholder="请输入密码" type="password">
                        </div>

                        <a class="btn" @click="login">
                            立即注册，免费试用
                        </a>
                        <p class="hint">用户注册即代表同意<span @click="go_agreement">《隐私保护政策》</span>及<span @click="go_registertext">《服务使用协议》</span></p>

                    </div>
                </div>
            </div>
        </div>
        <img src="../../assets/OA_02.png"/>
        <img src="../../assets/OA_03.png"/>
        <img src="../../assets/OA_04.png"/>

    </div>
</template>

<script>

function checkPhone(phone){ 
    if(!(/^1[34578]\d{9}$/.test(phone))){ 
        return false; 
    }else{
        return true;
    }
}
    
    export default {
        data() {
            return {
                mobile:'',
                password:'',
                code:'',
                isGET:false,
                s:59,
            }
        },
        methods: {
            get_code(){
                if(!checkPhone(this.mobile)){
                    this.$toast('请输入正确的手机号码')
                    return
                }


                let _this = this;
                this.axios.get('/sms/getcode',{
                    params:{
                        mobile:this.mobile,
                        type:1,
                    }
                }).then(res=>{
                        if(res.data.h.code==200){
                            _this.isGET = true;
                            _this.sets();
                        }else{
                            _this.$toast(res.data.h.msg)
                        }
                })
            },
            sets(){
                let that = this;
                let keys = setInterval(res=>{

                    if(that.s<2){
                        that.isGET = false;
                        that.s=59;
                        clearInterval(keys)
                        return;
                    }
                    that.s--;

                },1000)
            },
            login(){

                if(this.mobile==''){
                    this.$toast('请输入手机号码')
                    return
                }else if(this.code==''){
                    this.$toast('请输入验证码')
                    return
                }else if(this.password==''){
                    this.$toast('请输入密码')
                    return
                }else if(!checkPhone(this.mobile)){
                    this.$toast('请输入正确的手机号码')
                    return
                }

                let that = this;
                this.axios.post('/user/registry'+this.Service.queryString({
                    mobile:this.mobile,
                    password:this.password,
                    code:this.code,
                    chkagreement:true,
                })).then(res=>{
                    if(res.data.h.code==200){
                        that.$toast('注册成功')
                        setTimeout(()=>{
                            window.location.href = "epipe://?&mark=go_login&_id="+that.mobile
                        },700)
                    }else{
                        that.$toast(res.data.h.msg)
                    }
                })
            },
            go_agreement(){
                window.location.href = "epipe://?&mark=registertext"
            },
            go_registertext(){
                window.location.href = "epipe://?&mark=agreement"

            },
        },
    }
</script>

<style scoped lang="stylus">

    img{
        width 100%;
        display block;
    }

    .main-top{
        position relative
        margin-bottom 0.3rem;
    }

    .yzm{
        color #609ef7;
        float right;
    }

    .box{
        position absolute
        bottom  0rem;
        box-sizing border-box
        padding 0 0.15rem;
        width 100%;

        input{
            display block;
            line-height 0.4rem;
            outline none;
            position relative;
            font-size 0.15rem;
        }
        ::-webkit-input-placeholder{color:#ccc;font-size 0.15rem;}

        >div{
            background-color #fff;
            border-radius 0.08rem;
            height 3.9rem;
            box-sizing border-box;
            padding 0.25rem;

        }
    }

     .input{
            width 100%;
            line-height 0.4rem;
            font-size 0.15rem;
            color #333;
            position: relative;
            overflow hidden;
            margin-top 0.15rem;
        }

        .input:after{
            content: '';
            position: absolute;
            left 0;
            bottom: 0;
            background: #ebebeb;
            width: 100%;
            height: 1px;
            -webkit-transform: scaleY(0.5);
            transform: scaleY(0.5);
            -webkit-transform-origin: 0 0;
            transform-origin: 0 0;
        }

    h3{
        font-size 0.23rem;
        color #0fc27c;
    }
    .btn{
        display block;
        line-height 0.45rem;
        text-align center;
        font-size 0.17rem;
        background-color #0fc27c;
        color #fff;
        width 100%;
        border-radius 0.03rem;
        margin-top 0.5rem;
    }
    .hint{
        font-size 0.12rem;
        color #609ef7;
        margin-top:0.15rem;
    }
</style>