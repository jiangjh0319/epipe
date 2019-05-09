<style scoped lang="stylus">
  .edit-content{
    margin-top: 0.59rem;
  }
  .edit-item{
    display: -webkit-flex;
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 50px;
    line-height: 50px;
    padding: 0 0.15rem;
    border-bottom: 1px solid #EAEAEA;
    background: white;
    input{
      z-index: 9;
      font-size: 16px;
      width: 3rem;
      height: 100%;
      outline: none;
    }
  }
  .edit-item:first-child{
    border-top: 1px solid #EAEAEA;
  }
  .icon-close{
    width: 0.2rem;
    height: 0.2rem;
  }
  .edit-tips{
    font-size: 10px;
    padding-left: 0.15rem;
    margin-top: 0.1rem;
    color: #999;
  }
  .btn-save{
    position: fixed;
    top: 0;
    right: 0;
    width: 0.58rem;
    height: 0.44rem;
    line-height: 0.44rem;
    font-size: 0.16rem;
    text-align: center;
    color: white;
    z-index: 9;
  }

  .header{
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 0.44rem;
    background: #499844;
    text-align: center;
    line-height: 0.44rem;
    color: #fff;
    font-size: 0.185rem;
    letter-spacing: 0.012rem;
    .back{
      position: absolute;
      left: 0;
      width: 0.5rem;
      text-align: left;
      .icon-back{
        font-size: 0.17rem;
        margin-left: 0.1rem;
      }
    }
  }
</style>

<template>
  <div class="edit-wrapper">
    <LOADING v-show="loading"></LOADING>
      <div class="header" v-bind:style="{ background: bg_color}" >
        <div class="back" @click="goback()">
          <svg class="icon icon-back" aria-hidden="false">
            <use xlink:href="#icon-zuoyoujiantou"></use>
          </svg>
        </div>
        {{title}}
        <div class="btn-save" @click.stop.prevent="save()">保存</div>
      </div>
      <div class="edit-content" v-if="is_name">
        <div class="edit-item">
          <input type="text" maxlength="24" ref="input" :value="init_value" v-on:keyup="limit()" autofocus="autofocus">
          <svg class="icon icon-close" aria-hidden="false" @click="clearInput()">
            <use xlink:href="#icon-close"></use>
          </svg>
        </div>
        <div class="edit-tips">
          姓名输入提示:最长24个字符，一个汉字视为2个字符
        </div>
      </div>
    <div class="edit-content" v-else-if="is_abbreviation">
      <div class="edit-item">
        <input type="text" maxlength="10" ref="input" :value="init_value" v-on:keyup="limit()" autofocus="autofocus">
        <svg class="icon icon-close" aria-hidden="false" @click="clearInput()">
          <use xlink:href="#icon-close"></use>
        </svg>
      </div>
    </div>
    <div class="edit-content" v-else>
      <div class="edit-item">
        <input type="tel" maxlength="24" :value="init_value" ref="input" v-if="is_phone" autofocus="autofocus">
        <template v-else>
          <input type="email" :value="init_value" ref="input" v-if="is_email" autofocus="autofocus">
          <input type="text" maxlength="20" :value="init_value" ref="input" v-else autofocus="autofocus">
        </template>
        <svg class="icon icon-close" aria-hidden="false" @click="clearInput()">
          <use xlink:href="#icon-close"></use>
        </svg>
      </div>
    </div>
  </div>
</template>

<script>
  import {mapState, mapMutations} from 'vuex';
  import TopHead from "../../components/topheader.vue"    //引入导航栏
  import LOADING from "../../components/loading.vue"
  export default{
    name: 'edit',
    components:{
      TopHead,
      LOADING,
    },
    data(){
      return{
        title: '',
        bg_color: '',
        is_name: false,
        is_phone: false,
        is_email: false,
        is_abbreviation: false,
        text: "",
        init_value: "",
        loading: false,
        emailSave:true,
      }
    },
    mounted(){
      this.$nextTick(() =>{
        this.$refs.input.focus();
      });
      this.title = this.$route.query.title;
      this.bg_color = this.$route.query.bg;
      if(this.title == "姓名"){
        this.is_name = true;
      }
      if(this.title == "手机"){
        this.is_phone = true;
      }
      if(this.title == "邮箱"){
        this.is_email = true;
      }
      if(this.title == "组织简称"){
        this.is_abbreviation = true;
      }
      if(this.$route.query.value){
        this.text = this.$route.query.value;
        this.init_value = this.$route.query.value;
      }
    },
    beforeDestroy() {
      this.updata(this.title);
    },
    methods: {
      ...mapMutations([
        'edit_name',
        'edit_email',
        'edit_phone',
        'changeStatus',
        'edit_status',
        'edit_organization',
        'edit_abbreviation',
        'edit_category',
        'edit_chargeman',
        'edit_tel',
        'edit_mail',
      ]),
      /*
      * 更新个人信息
      * */
      updataInfo(key,val){
        let data = {};
        data[key] = val;
        let vm = this;
        this.axios.post(this.Service.updataInfo+this.Service.queryString(data)).then(function (res) {
          console.log("更新个人信息",res);
          vm.loading = false;
          if(res.data.h.code === 200){
            window.history.back(-1);
          }
        });
      },
      /*
      * 同步修改vuex中的数据
      * 如果vuex中的数据发生变化，则has_change为true，用于在前一个页面判断是否显示弹出框
      * */
      category(title){
        switch (title){
          case "姓名":
            if(this.$refs.input.value != this.$store.state.application.name){
              this.changeStatus(true);
            }
            this.edit_name(this.$refs.input.value);
            this.updataInfo('name',this.$refs.input.value);
            break;
          case "邮箱":
            if(this.isEmail(this.$refs.input.value)){
              
              if(this.$refs.input.value != this.$store.state.application.email){
                this.changeStatus(true);
              }
              this.edit_email(this.$refs.input.value);
              this.updataInfo('email',this.$refs.input.value);
            }else{
              this.$toast("请输入正确邮箱");
            }
            break;
          case "手机":
            if(this.isPhone(this.$refs.input.value)){
              if(this.$refs.input.value != this.$store.state.application.phone){
                this.changeStatus(true);
              }
              this.edit_phone(this.$refs.input.value);
            }else{
              this.$toast("请输入正确手机号");
            }
            break;
          case "组织名称":
            this.edit_organization(this.$refs.input.value);
            window.history.back(-1);
            break;
          case "组织简称":
            this.edit_abbreviation(this.$refs.input.value);
            window.history.back(-1);
            break;
          case "组织类型":
            this.edit_category(this.$refs.input.value);
            window.history.back(-1);
            break;
          case "联系人":
            this.edit_chargeman(this.$refs.input.value);
            window.history.back(-1);
            break;
          case "手机号码":
            if(this.isPhone(this.$refs.input.value)){
              this.edit_tel(this.$refs.input.value);
              window.history.back(-1);
            }else{
              this.$toast("请输入正确手机号");
            }
            break;
          case "设置邮箱":
            if(this.isEmail(this.$refs.input.value)){
              this.edit_mail(this.$refs.input.value);
              window.history.back(-1);
            }else{
              this.$toast("请输入正确邮箱");
            }
            break;
        }
        this.loading = false;
      },
      /*
      * 使用evenBus向application页面传参
      * 如果有数据更新则触发eventBus
      * */
      updata(title){
        let vm = this;
        switch (title){
          case "姓名":
            if(vm.$refs.input.value != vm.init_value) {
              eventBus.$emit('getTarget', {
                title: "姓名",
                txt: vm.$refs.input.value || vm.init_value,
              });
            }
            break;
          case "邮箱":
            if(vm.$refs.input.value != vm.init_value&&this.emailSave) {
              eventBus.$emit('getTarget', {
                title: "邮箱",
                txt: vm.$refs.input.value || vm.init_value,
              });
            }
            break;
          case "手机":
            if(vm.$refs.input.value != vm.init_value) {
              eventBus.$emit('getTarget', {
                title: "手机",
                txt: vm.$refs.input.value || vm.init_value,
              });
            }
            break;
        }
      },
      //清除搜索框文字
      clearInput(){
        this.$refs.input.value = this.text = "";
        this.$refs.input.focus();
      },
      //限制输入框字符长度，最长24个字符
      limit() {
        let that = this.$refs.input;
        let v = that.value;
        let reg = /^[a-zA-Z\d`~@#\$%\^&\*\(\)\-_=\+\[\]\{\}\\\|;\:'",<\.>\/\?]{0,24}$/;
        let vv = v.replace(/[^\x00-\xff]/g, "aa");
        if (!reg.test(vv)) {
          that.value = that.pv ? that.pv : "";
        } else {
          that.pv = v;
        }
      },
      //保存
      save(){
        if(this.$refs.input.value != "" || this.title=="设置邮箱" || this.title=="手机号码"){
          this.loading = true;
          this.category(this.title);
        }else{
            this.$toast("请输入"+this.title);
        }
      },
      //返回
      goback(){
            this.emailSave = false;
            window.history.back(-1);
        
      },
      //邮箱验证
      isEmail(str){
        var reg=/^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((.[a-zA-Z0-9_-]{2,3}){1,2})$/;
        return reg.test(str);
      },
      //手机号码验证
      isPhone(phoneNum){
        return /^1[0-9]{10}$/.test(phoneNum);
      },
    }
  }
</script>
