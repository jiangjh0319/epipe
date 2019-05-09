<style scoped lang="stylus">
  @import "../../style/variable.styl";
  ::-webkit-input-placeholder { /* WebKit browsers */
    color: $font_color_6;
  }

  .inner-container::-webkit-scrollbar {
    display: none;
  }

  .bottom_button2:active {
    opacity $opacity_common;
  }

  li:active {
    background-color $bg_color
  }

  .im_div1:active {
    background-color $bg_color
  }

  .im_div3:active {
    background-color $bg_color
  }

  .seach_input{
    animation seach_im 0.18s;
    opacity 1;
    background-color #fff;
    position relative;
    display flex;
    flex-direction row
    justify-content center;
    padding 0.06rem 0.15rem 0.06rem 0.15rem;
  }

  .seach_input input {
    flex 1
    outline: none
    background $bg_color
    border-radius 0.05rem
    height 0.35rem
    padding-left 0.38rem
    font-size 0.15rem
  }

  .seach_input .seach_svg {
    position absolute
    left 0.3rem
    top 0.14rem
  }

  .seach_input .hide_seach {
    width 0.75rem
    height 0.35rem
    line-height 0.35rem
    text-align center
    color #fff
    background-color $blue_color
    border-radius 0.03rem
    font-size 0.15rem
  }

  .im_div
    display flex
    flex-direction column
    background-color #fff
    .im_div1
      display flex
      height 0.48rem
      line-height 0.48rem
      padding-left 0.15rem
      border-bottom 0.01rem solid #d9d9d9
      font-size 0.16rem
      align-items center
      justify-content space-between
    .im_div2
      display flex
      flex-direction column
      /*margin 0 0rem 0 0.3rem*/
      li
        height 0.48rem
        padding-left 0.3rem
        line-height 0.48rem
        border-bottom 0.01rem solid #E6E6E6
        font-size 0.15rem
        display flex
        justify-content space-between
      .im_div3
        height 0.48rem
        line-height 0.48rem
        padding-left 0.45rem
        border-bottom 0.01rem solid #E6E6E6
        font-size 0.15rem
        display flex
        align-items center
        img
          width 0.32rem
          height 0.32rem
          border-radius 0.32rem
        div
          height 0.48rem
          padding-left 0.15rem
          display flex
          justify-content center
          align-items center
          font-size 0.15rem

  .im_top_div_2
    background-color $bg_color
    padding 4%
    .im_top_div_3
      background-color #fff
      height 0.35rem
      display flex
      justify-content center
      align-items center
      border-radius 0.03rem
      color $font_color_6
      font-size 0.15rem

  .im_border {
    background $bg_color
    height 0.15rem
    border-top 1px solid #ddd
  }

  .seach_item
    display flex
    flex-direction column
    margin 0 0.3rem 0 0.15rem
    line-height 0.54rem
    li
      border-bottom 1px solid #eee
      height 0.48rem
      display flex
      flex-direction row
      align-items center
      img
        width 0.32rem
        height 0.32rem
        border-radius 0.32rem
      div
        padding-left 0.15rem
        font-size 0.15rem

  .im_bottom {
    min-height 0.84rem
    width 100%
    position fixed
    bottom 0
    background-color #FFF
    white-space: nowrap;
    overflow scroll
    color #bbb
    padding 0 0.15rem 0rem 0.15rem
    box-shadow: 0 0 15px rgba(187, 187, 187, 0.7);
  }

  .im_bottom li {
    display inline-block
    width 0.575rem
    text-align center
  }

  .im_bottom img {
    width 0.32rem
    height 0.32rem
    border-radius 0.32rem
  }

  .im_bottom li .name {
    margin-top 0.05rem
    font-size 0.13rem
  }
  
  .bottom_button {
    position fixed
    height 0.77rem
    background-color #fff
    opacity 0.9
    width 1.2rem
    bottom 0
    right 0
    z-index 2
  }

  .bottom_button2 {
    right 0.15rem
    z-index 3
    position fixed
    width 0.9rem
    bottom 0.24rem
    height 0.34rem
    opacity 1
    border-radius 0.17rem
    background-color rgba(96, 158, 247, 1)
    text-align center
    line-height 0.34rem
    font-size 0.15rem
    color #ffffff
  }
</style>
<template>
  <section>
    <div v-show="!is_search">
      <TopHead mark="mark" v-on:history_back="history_back_click" :bgcolor="bgcolor" title="选择联系人" :show='states'></TopHead>
      <div :style="states=='pro'?'':'margin-top: 0.44rem'" @click="is_search=!is_search" class="im_top_div_2">
        <div style="box-shadow: 0 10px 16px #ddd, 0 0 10px #ddd, 0 0 10px #ddd;  " class="im_top_div_3">
          <svg style="font-size: 0.17rem" class="icon"
               aria-hidden="false">
            <use xlink:href="#icon-sousuo"></use>
          </svg>
          <span>&nbsp&nbsp搜索联系人</span>
        </div>
      </div>
      <div class="im_div">
        <div @click="open_all" class="im_div1">
          <span>{{datalist.name}}</span>
          <div style="padding-right: 0.15rem;">
            <svg v-bind:class="{top_ul_yuan22:all_bool}" style="width: 0.15rem;height: 0.15rem" class="icon"
                 aria-hidden="false">
              <use xlink:href="#icon-back"></use>
            </svg>
          </div>
        </div>
        <ul v-show="all_bool" class="im_div2">
          <div v-for="(item,index) in datalist.offices">
            <li @click="open_item(index)">
              <span>{{item.name}}&nbsp; （{{item.personNO}}）</span>
              <div style="padding-right: 0.15rem;">
                <svg v-bind:class="{top_ul_yuan22:item.open}" style="width: 0.15rem;height: 0.15rem" class="icon"
                     aria-hidden="false">
                  <use xlink:href="#icon-back"></use>
                </svg>
              </div>
            </li>
            <div @click="chose_item(index,p,num)" v-show="item.open" v-for="(p,num) in item.persons" class="im_div3">  
              <svg v-show="p.mark_chose" style="font-size: 0.19rem;padding-right: 0.15rem" class="icon">
                <use xlink:href="#icon-chenggong"></use>
              </svg>
              <svg v-show="!p.mark_chose" style="font-size: 0.19rem;padding-right: 0.15rem" class="icon">
                <use xlink:href="#icon-meiyouxuanzhong"></use>
              </svg>
              <img :src=p.profileImg|man_photo_format v-show="p.profileImg"/>
              <img v-show="!p.profileImg" src="../../assets/tou.png"/>
              <div>{{p.name}}</div>
            </div>
          </div>
        </ul>
      </div>
      <div style="padding-bottom: 0.84rem"></div>
      <ul class="im_bottom">

        <div v-if="chose_array.length>0 & type_num" @click="history_back" :style="{background: bgcolor}" class="bottom_button2">确定 <span
        >({{chose_array.length}})</span>
        </div>

        <div v-if="approver_array.length>0 & !type_num" @click="history_back" :style="{background: bgcolor}" class="bottom_button2">确定 <span
        >({{approver_array.length}})</span>
        </div>

        <div v-if="(chose_array.length<=0&type_num)|(approver_array.length<=0&!type_num)" class="bottom_button2" :style="{opacity: 0.6,background: bgcolor}" style="">确定{{chose_array.length}}
        </div>
        <div class="bottom_button">

        </div>
        <li @click="reduce(item)"  v-if="type_num" v-for="item in chose_array" class="chose">
          <div style="height: 0.15rem">
            <svg style="font-size: 0.15rem;position: relative;top: 0.08rem;left: 0.135rem" class="icon">
              <use xlink:href="#icon-shanchu"></use>
            </svg>
          </div>
          <img src="../../assets/tou.png" v-show="!item.profileImg"/>
          <img :src=item.profileImg|man_photo_format v-show="item.profileImg"/>
          <div class="name">{{item.name}}</div>
        </li>
        <li @click="reduce(item)" v-if="!type_num"  v-for="item in approver_array" :key="item.userId" class="approver">
          <div style="height: 0.15rem">
            <svg style="font-size: 0.15rem;position: relative;top: 0.08rem;left: 0.135rem" class="icon">
              <use xlink:href="#icon-shanchu"></use>
            </svg>
          </div>
          <img src="../../assets/tou.png" v-show="!item.profileImg"/>
          <img :src=item.profileImg|man_photo_format v-show="item.profileImg"/>
          <div class="name">{{item.name}}</div>
        </li>

        <li style="width:1.25rem"></li>
      </ul>
    </div>
    <div style="background-color: #fff" v-show="is_search">
      <div class="seach_input">
        <input v-on:input="value_change" v-model="seach_value" placeholder="搜索联系人" type="text">
        <div class="hide_seach" @click="hide_seach" :style="{background: bgcolor}">取消</div>
        <div class="seach_svg">
          <svg class="icon" style="font-size: 0.16rem"
               aria-hidden="false">
            <use xlink:href="#icon-sousuo"></use>
          </svg>
        </div>
      </div>
      <div class="im_border"></div>
      <ul class="seach_item">
        <li @click="chose_select(item,index)" v-for="(item,index) in seach_list_man">
          <svg v-if="item.mark_chose" style="font-size: 0.19rem;padding-right: 0.15rem" class="icon">
            <use xlink:href="#icon-chenggong"></use>
          </svg>
          <svg v-if="!item.mark_chose" style="font-size: 0.19rem;padding-right: 0.15rem" class="icon">
            <use xlink:href="#icon-meiyouxuanzhong"></use>
          </svg>
          <img src="../../assets/tou.png" v-show="!item.profileImg"/>
          <img :src=item.profileImg|man_photo_format v-show="item.profileImg"/>
          <div>{{item.name}}</div>
        </li>
      </ul>
    </div>
  </section>
</template>
<script>
  import {mapState, mapMutations} from 'vuex';
  import TopHead  from '../../components/topheader.vue'
  export default {
    data () {
      return {
        type_num:1, //抄送人为1 审批人为0
        bgcolor: "",
        datalist: [], //获取的通讯录数据
        all_bool: true, //是否是展开的
        seach_value: '', //输入框
        is_search: false,
        chosed_list_mark: [], //抄送人 备份一个
        chose_array: [],  //抄送人
        approver_array : [], //审批人
        approver_list_mark : [], //审批人 备份一个
        name: '',
        seach_list_man: [], //被搜索到的人
        states : ''
      }
    },
    components: {
      TopHead
    },
    methods: {
      ...mapMutations([
        'change_man','approver_man'
      ]),
      open_item(index){  //点开分组
      console.log(index)
        let array = []
        this.datalist.offices[index].open = !this.datalist.offices[index].open
        console.log(this.datalist.offices[index].open)
      },
      chose_item(index, p, num){ //点击选中某个人  通过遍历改变mark_chose的布尔值
        let array = []
        this.datalist.offices[index].persons[num].mark_chose = !this.datalist.offices[index].persons[num].mark_chose  //设置这个人是否被选中

        if(this.type_num){

          // debugger

            for (let i = 0; i < this.datalist.offices.length; i++) {
              for (let a = 0; a < this.datalist.offices[i].persons.length; a++) {
                if (this.datalist.offices[i].persons[a].mark_chose == true) {
                    this.datalist.offices[i].persons[a].receiverId = this.datalist.offices[i].persons[a].userId;
                  array = array.concat(this.datalist.offices[i].persons[a])
                }
              }
            }
            this.chose_array = array;
            this.change_man(this.chose_array)

        }else{
            if(this.datalist.offices[index].persons[num].mark_chose){
              
              let flag = true;

              for(let i =0;i<this.approver_array.length;i++){
                if(this.approver_array[i].auditUserId === p.userId){
                    flag = false;
                }
              }

              if(flag){
                  p.auditUserId = p.userId;
                  this.approver_array.push(p)
                  this.approver_man(this.approver_array)
                  window.history.back()
              }
            
            }else{
              for(let i =0;i<this.approver_array.length;i++){
                if(this.approver_array[i].auditUserId === p.userId){
                    this.approver_array.splice(i,1)
                    this.approver_man(this.approver_array)
                    window.history.back()
                }
              }
            }
        }
      },
      open_all(){
        this.all_bool = !this.all_bool
      },
      reduce(item){ //删除选中人
        let array = []
        for (let i = 0; i < this.datalist.offices.length; i++) {
          for (let a = 0; a < this.datalist.offices[i].persons.length; a++) {
            if (this.datalist.offices[i].persons[a].userId != item.userId) {
              if (this.datalist.offices[i].persons[a].mark_chose == true) {
                array = array.concat(this.datalist.offices[i].persons[a])
              }
            } else {
              this.datalist.offices[i].persons[a].mark_chose = false
            }
          }
        }
        if(this.type_num){
          this.chose_array = array;
          this.change_man(this.chose_array)
        }else{
          this.approver_array = array;
          this.approver_man(this.approver_array)
        }
      },
      history_back: function () {
        if(this.states=='pro'){
            let str = JSON.stringify(this.chose_array)
            window.location.href = "epipe://?&data="+str;
        }else{
          window.history.back()
        }
      },
      history_back_click: function () {  //返回则数据不改变
        if(this.type_num){
          this.change_man(this.chosed_list_mark)
        }else{
          this.approver_man(this.approver_list_mark)
        }
        window.history.back()
      },
      chose_select: function (item, index) { //搜索之后选中某个人
        let that = this;
        if (!item.mark_chose) {
          that.seach_list_man[index].mark_chose = true

          if(this.type_num){
            item.receiverId = item.userId;
            that.chose_array.push(item)
            that.change_man(this.chose_array)
          }else{
            item.auditUserId = item.userId;
            that.approver_array.push(item)
            that.approver_man(this.approver_array)
          }

          that.seach_value = ""
          for (let i = 0; i < that.datalist.offices.length; i++) {
            for (let a = 0; a < that.datalist.offices[i].persons.length; a++) {
              if (item.userId == that.datalist.offices[i].persons[a].userId) {
                that.datalist.offices[i].persons[a].mark_chose = true
              }
            }
          }
          setTimeout(function () { //300毫秒后去掉搜索界面
            that.is_search = false
            that.seach_list_man = []
          }, 300)
        }
      },
      hide_seach: function () {
        this.seach_value = ""
        this.seach_list_man = []
        this.is_search = false
      },
      value_change: function () { //模糊查询实时监听输入框变化
        let that = this;
        if (this.seach_value != "") {
          this.axios.get(this.Service.selectReceiver, {params: {name: this.seach_value}}).then(function (data) {
            if (data.data.h.code == 200) {
              that.seach_list_man = data.data.b.data
              for (let b = 0; b < that.seach_list_man.length; b++) {
                that.seach_list_man[b].mark_chose = false

                if(this.type_num){
                  for (let a = 0; a < that.chose_array.length; a++) {
                    //这是把默认抄送人加上
                    if (that.seach_list_man[b].userId == that.chose_array[a].receiverId) {
                      that.seach_list_man[b].mark_chose = true
                    }
                  }
                }else{
                  for (let a = 0; a < that.approver_array.length; a++) {
                    if (that.seach_list_man[b].userId == that.approver_array[a].auditUserId) {
                      that.seach_list_man[b].mark_chose = true
                    }
                  }
                }
              }
              that.seach_list_man = JSON.parse(JSON.stringify(that.seach_list_man))
            }
          })
        }
      }
    },
    mounted(){
      this.states = location.href.slice(location.href.indexOf('state=')+6)
      this.states = this.states.slice(0,(this.states.indexOf('&')))
        //以上代码判断是由什么入口进入该界面
      this.bgcolor = this.$route.query.bgcolor
      if(this.$route.query.num){ //判断是审批人还是抄送人
        //审批人
        this.type_num = 0;
        this.approver_array = this.approver_man_state
        this.approver_list_mark = this.approver_man_state
      }else{
        //抄送人
        this.chose_array = this.chosed_man_state
        this.chosed_list_mark = this.chosed_man_state
      }

      let that = this;
      this.axios.get(this.Service.organAddress,{
        params:{
          showGroup : false,
        }
      }).then(function (data) {
        if(data.data.h.code == 200) {
          that.datalist = data.data.b.data[0]
          let arrs = [];
          if(that.type_num){
            arrs = that.chosed_man_state;
          }else{
            arrs = that.approver_man_state;
          }

          console.log(data.data.b.data[0].offices)

          if(that.type_num){
            for (let i = 0; i < data.data.b.data[0].offices.length; i++) {
              data.data.b.data[0].offices[i].open = false
              for (let a = 0; a < data.data.b.data[0].offices[i].persons.length; a++) {
                for (let b = 0; b <arrs.length; b++) {
                  if (arrs[b].receiverId == data.data.b.data[0].offices[i].persons[a].userId) {
                    data.data.b.data[0].offices[i].persons[a].mark_chose = true
                  }
                }
              }
            }
          }else{
            for (let i = 0; i < data.data.b.data[0].offices.length; i++) {
              data.data.b.data[0].offices[i].open = false
              for (let a = 0; a < data.data.b.data[0].offices[i].persons.length; a++) {
                for (let b = 0; b <arrs.length; b++) {
                  if (arrs[b].auditUserId == data.data.b.data[0].offices[i].persons[a].userId) {
                    data.data.b.data[0].offices[i].persons[a].mark_chose = true
                  }
                }
              }
            }
          }

          that.datalist = JSON.parse(JSON.stringify(data.data.b))
        }
      });
    },
    computed: mapState(["chosed_man_state",'approver_man_state'])  
  }
</script>
