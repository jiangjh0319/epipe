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
        padding-left 0.15rem
        line-height 0.48rem
        border-bottom 0.01rem solid #E6E6E6
        font-size 0.15rem
        display flex
        justify-content space-between
      .im_div3
        height 0.48rem
        line-height 0.48rem
        padding-left 0.4rem
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
      <div style="height:0.44rem;"></div>
      <div :style="states=='pro'?'':''" @click="is_search=!is_search" class="im_top_div_2">
        <div style="box-shadow: 0 10px 16px #ddd, 0 0 10px #ddd, 0 0 10px #ddd;  " class="im_top_div_3">
          <svg style="font-size: 0.17rem" class="icon"
               aria-hidden="false">
            <use xlink:href="#icon-sousuo"></use>
          </svg>
          <span>&nbsp&nbsp搜索联系人</span>
        </div>
      </div>
      <div class="im_div">
        <ul class="im_div2">
          <div v-for="(item,index) in datalist" :key="index">
              <li @click="set_open(item)">
                <span>{{item.name}}</span>
                <div style="padding-right: 0.15rem;">
                  <svg v-bind:class="{top_ul_yuan22:item.open}" style="width: 0.15rem;height: 0.15rem" class="icon"
                      aria-hidden="false">
                    <use xlink:href="#icon-back"></use>
                  </svg>
                </div>
              </li>
              <AddressList
                v-show="item.open"
                :list="item.offices"
                v-on:pitchOn = "pitchOn"
              >
              </AddressList>
          </div>
        </ul>
        
      </div>
      <div style="padding-bottom: 0.84rem"></div>
      <ul class="im_bottom">

        <div @click="history_back" :style="{background: bgcolor}" class="bottom_button2">确定 <span
        >({{peerData.length}})</span>
        </div>


        <div class="bottom_button">

        </div>
        <li @click="reduce(item)" :key="item.userId"   v-for="item in peerData" class="chose">
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
  import AddressList  from '../../components/worknews/addressList.vue'

  export default {
    data () {
      return {
        bgcolor: "",
        datalist: [], //获取的通讯录数据
        all_bool: true, //是否是展开的
        seach_value: '', //输入框
        is_search: false,
        name: '',
        seach_list_man: [], //被搜索到的人
        states : '',
        peArrIndex:0,
        peerData:[],//同行人员
        old_peerData:[],
        chose_data:[],

      }
    },
    components: {
      TopHead,
      AddressList
    },
    methods: {
        ...mapMutations([
        'peerData_man',
      ]),
      dataInit(data){
        data.forEach(item => {
            item.open = false;
            if(item.subOffice.length){
                this.dataInit(item.subOffice)
            }

            if(item.staff.length){
                let arr = item.staff
                arr.forEach(el=>{
                  el.mark_chose = false
                })
            }
        })
      },
      set_open(item){
          item.open = !item.open;
      },
      chose_people(data,id,val){
         for(let i=0;i<data.length;i++){
            if(data[i].subOffice.length){
                this.chose_people(data[i].subOffice,id,val)
            }
            if(data[i].staff.length){
                let arr = data[i].staff
                for(let j=0;j<arr.length;j++){
                  if(arr[j].userId==id){
                    arr[j].mark_chose = val;
                    return
                  }
                }
            }
         }
      },
      pitchOn(item){
          item.mark_chose = !item.mark_chose


          if(this.$route.query.type=='1'){ //为1既为 选中立马回到之前的界面

              this.peerData[0] = item;
              this.peerData_man({
                  index:this.peArrIndex,
                  array:this.peerData,
              })
              window.history.back()
              return false;
          }


          if(item.mark_chose){
            this.chose_data.push(item)
          }else{
            for(let i=0;i<this.chose_data.length;i++){
              if(this.chose_data[i].userId==item.userId){
                this.chose_data.splice(i,1)
              }
            }
          }


          this.peerData = this.chose_data;
            this.peerData_man({
              index:this.peArrIndex,
              array:this.peerData,
            })

        
      },
      chose_child(index,num,el,c){     
        let array = []
    

        this.datalist[index].offices[num].staff[c].mark_chose = !this.datalist[index].offices[num].staff[c].mark_chose  //设置这个人是否被选中
      
          
              for (let i = 0; i < this.datalist.length; i++) {
                      for (let j = 0; j < this.datalist[i].offices.length; j++) {
                          for (let a = 0; a < this.datalist[i].offices[j].staff.length; a++) {
                            if (this.datalist[i].offices[j].staff[a].mark_chose == true) {
                                this.datalist[i].offices[j].staff[a].receiverId = this.datalist[i].offices[j].staff[a].userId;
                                array = array.concat(this.datalist[i].offices[j].staff[a])
                            }
                        }
                    }
              }
            this.peerData = array;
            this.peerData_man({
              index:this.peArrIndex,
              array:this.peerData,
            })

            if(this.$route.query.back){
              // window.history.back(-1)
            }
      },
      open_all(){
        this.all_bool = !this.all_bool
      },
      reduce(item){ //删除选中人
        let that = this;
        for(let i=0;i<this.chose_data.length;i++){
          if(this.chose_data[i].userId==item.userId){
            this.chose_data.splice(i,1)
          }
        }

        this.datalist.forEach(el=>{
              that.chose_people(el.offices,item.userId,false)
        })

       this.peerData = this.chose_data;
          this.peerData_man({
              index:this.peArrIndex,
              array:this.peerData,
          })
      },
      history_back: function () {
            window.history.back(-1)
      },
      history_back_click: function () {  //返回则数据不改变
        this.peerData_man({
              index:this.peArrIndex,
              array:this.old_peerData,
            })
        window.history.back()
      },
      chose_select: function (item, index) { //搜索之后选中某个人
        let that = this;

       if(this.$route.query.type=='1'){ //为1既为 选中立马回到之前的界面
              this.peerData[0]= item;
              this.peerData_man({
                  index:this.peArrIndex,
                  array:this.peerData,
              })
              window.history.back()
              return false;
          }

        if (!item.mark_chose) {
          that.seach_list_man[index].mark_chose = true

            item.receiverId = item.userId;
            that.peerData.push(item)
            that.peerData_man({
              index:this.peArrIndex,
              array:this.old_peerData,
            })

          this.datalist.forEach(el=>{
            this.chose_people(el.offices,item.userId,true)
          })

          if(this.$route.query.back){
              window.history.back(-1)
            }
        }else{
          that.seach_list_man[index].mark_chose = false;
          that.reduce(item)

        }

        setTimeout(function () { //300毫秒后去掉搜索界面
            that.is_search = false
            that.seach_value = ""
            that.seach_list_man = []
          }, 300)
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

                  for (let a = 0; a < that.peerData.length; a++) {
                    //这是把默认抄送人加上
                    if (that.seach_list_man[b].userId == that.peerData[a].receiverId) {
                      that.seach_list_man[b].mark_chose = true
                    }
                  }
              }
              that.seach_list_man = JSON.parse(JSON.stringify(that.seach_list_man))
            }
          })
        }
      },
    },
    mounted(){
      this.peArrIndex = this.$route.query.peArrIndex;
      this.peerData = this.peer_man_state[this.peArrIndex]?this.peer_man_state[this.peArrIndex]:[];
      this.old_peerData = this.peer_man_state[this.peArrIndex];
      this.bgcolor = this.$route.query.bgcolor
      let that = this;
      // this.axios.get('https://apps.epipe.cn/member/v3/organ/addressbook',{
      this.axios.get('/organ/addressbook',{
        params:{
          showGroup : this.$route.query.showGroup,
        }
      }).then( (data)=>{
        if(data.data.h.code == 200) {
          let datas = data.data.b.data
          let arrs = that.peerData;

          this.chose_data = arrs;

          // this.dataInit(datas,arrs)

          datas.forEach(item=>{
            item.open = false;
            that.dataInit(item.offices,arrs)

            arrs.forEach(el=>{
              that.chose_people(item.offices,el.userId,true)
            })
          })

          that.datalist = datas
        }
      });
    },
    computed: mapState(["peer_man_state"])  
  }
</script>
