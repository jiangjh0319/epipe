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

  .icon{
    font-size 0.19rem;
  }
</style>
<template>
  <section>
    <div v-show="!is_search">
      <TopHead mark="mark"
        v-on:history_back="history_back_click"
        bgcolor="#f80" title="选择联系人"
        :show='states'
        :is_relative_approva = is_relative_approva
        v-on:show_edit = "affirm"
        >
         </TopHead>
      <div @click="is_search=!is_search" class="im_top_div_2">
          <div style="height:0.44rem;"></div>
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
            <li >
               
              <div @click="chose(item)" v-if="item.allInFlag">
                    <svg v-show="item.mark_chose"  style="font-size: 0.19rem;padding-right: 0.15rem" class="icon">
                        <use xlink:href="#icon-chenggong"></use>
                    </svg>
                    <svg v-show="!item.mark_chose" style="font-sizae: 0.19rem;padding-right: 0.15rem" class="icon">
                        <use xlink:href="#icon-meiyouxuanzhong"></use>
                    </svg>
              </div>
              <span @click="open_item(item)" style="flex:1;">{{item.name}}</span>
              <div style="padding-right: 0.15rem;">
                <svg v-bind:class="{top_ul_yuan22:item.open}" style="width: 0.15rem;height: 0.15rem" class="icon"
                     aria-hidden="false">
                  <use xlink:href="#icon-back"></use>
                </svg>
              </div>
            </li>
            <div v-show="item.open" v-for="(p,num) in item.subOffice"  class="im_div4" style="padding:0" :key="num">   
                <li style="padding-left:0.3rem;">
                <div  @click="chose(p)" v-if="item.allInFlag">
                    <svg v-show="p.mark_chose" style="font-size: 0.19rem;padding-right: 0.15rem" class="icon">
                        <use xlink:href="#icon-chenggong"></use>
                    </svg>
                    <svg v-show="!p.mark_chose" style="font-sizae: 0.19rem;padding-right: 0.15rem" class="icon">
                        <use xlink:href="#icon-meiyouxuanzhong"></use>
                    </svg>
                </div>
                <span  @click="open_item(p)" style="flex:1;">{{p.name}}</span>
                <div style="padding-right: 0.15rem;">
                    <svg v-bind:class="{top_ul_yuan22:p.open}" style="width: 0.15rem;height: 0.15rem" class="icon"
                        aria-hidden="false">
                    <use xlink:href="#icon-back"></use>
                    </svg>
                </div>
                </li>
                <!--  -->
                <div v-show="p.open" v-for="(m,site) in p.subOffice"  class="im_div4" style="padding:0" :key="site" v-if="p.subOffice&&p.subOffice.length>0">   
                    <li style="padding-left:0.3rem;">
                    <div  @click="chose(m)" v-if="p.allInFlag">
                        <svg v-show="m.mark_chose" style="font-size: 0.19rem;padding-right: 0.15rem" class="icon">
                            <use xlink:href="#icon-chenggong"></use>
                        </svg>
                        <svg v-show="!m.mark_chose" style="font-sizae: 0.19rem;padding-right: 0.15rem" class="icon">
                            <use xlink:href="#icon-meiyouxuanzhong"></use>
                        </svg>
                    </div>
                    <span  @click="open_item(m)" style="flex:1;">{{m.name}}</span>
                    <div style="padding-right: 0.15rem;">
                        <svg v-bind:class="{top_ul_yuan22:m.open}" style="width: 0.15rem;height: 0.15rem" class="icon"
                            aria-hidden="false">
                        <use xlink:href="#icon-back"></use>
                        </svg>
                    </div>
                    </li>
                    
                    <div @click="chose_peo(s,m,p,item)" v-show="m.open" v-for="(s,n) in m.staff" class="im_div3">  
                        <svg v-show="s.mark_chose" style="font-size: 0.19rem;padding-right: 0.15rem" class="icon">
                            <use xlink:href="#icon-chenggong"></use>
                        </svg>
                        <svg v-show="!s.mark_chose" style="font-size: 0.19rem;padding-right: 0.15rem" class="icon">
                            <use xlink:href="#icon-meiyouxuanzhong"></use>
                        </svg>
                        <img :src= s.profileImg|man_photo_format v-show="s.profileImg"/>
                        <img v-show="!s.profileImg" src="../../assets/tou.png"/>
                        <div>{{s.name}}</div>
                    </div>

                </div>


                
                <div @click="chose_peo(s,p,item)" v-show="p.open" v-for="(s,n) in p.staff" class="im_div3" >  
                    <svg v-show="s.mark_chose" style="font-size: 0.19rem;padding-right: 0.15rem" class="icon">
                        <use xlink:href="#icon-chenggong"></use>
                    </svg>
                    <svg v-show="!s.mark_chose" style="font-size: 0.19rem;padding-right: 0.15rem" class="icon">
                        <use xlink:href="#icon-meiyouxuanzhong"></use>
                    </svg>
                    <img :src= s.profileImg|man_photo_format v-show="s.profileImg"/>
                    <img v-show="!s.profileImg" src="../../assets/tou.png"/>
                    <div>{{s.name}}</div>
                </div>

            </div>
              
          </div>
        </ul>
        
      </div>
      <div style="padding-bottom: 0.84rem"></div>
    </div>
    <div style="background-color: #fff" v-show="is_search">
      <div class="seach_input">
        <input v-on:input="value_change" v-model="seach_value" placeholder="搜索联系人" type="text">
        <div class="hide_seach" @click="hide_seach" :style="{background: bgcolor}">完成</div>
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
        bgcolor: "",
        datalist: [], //获取的通讯录数据
        all_bool: true, //是否是展开的
        seach_value: '', //输入框
        is_search: false,
        name: '',
        seach_list_man: [], //被搜索到的人
        states : '',
        peArrIndex:0,
        old_permissionsusers:[],
        is_relative_approva:{"isShow":true,"title":"确认",color:'#0fc37c'}
      }
    },
    components: {
      TopHead
    },
    methods: {
        ...mapMutations([
        'permissions',
      ]),
      open_item(item){  //点开分组
        item.open = !item.open
      },
      chose(item,flag){
          item.mark_chose = !item.mark_chose
          this.for(item,item.mark_chose);
      },
      for(item,flag){
          if(item.subOffice&&item.subOffice.length!=0){
              let arr = item.subOffice
              for(let i=0;i<arr.length;i++){
                  arr[i].mark_chose =flag;
                  if(arr[i].subOffice.length!=0||arr[i].staff.length!=0){
                    this.for(arr[i],flag)
                  }
              }
          }else if(item.staff&&item.staff.length!=0){
            let arr = item.staff
            for(let i=0;i<arr.length;i++){
                arr[i].mark_chose = flag;
            }
          }
      },
      chose_peo(s,m,p,item){
          s.mark_chose = !s.mark_chose

          if(!s.mark_chose){
            m.mark_chose= m.mark_chose?false:m.mark_chose;
            p.mark_chose= p.mark_chose?false:p.mark_chose;

            if(item){
              item.mark_chose= item.mark_chose?false:item.mark_chose
            }
          }
        
      },
      affirm(){
          this.permissions(this.datalist)
          history.back()
      },
      chose_child(index,num,el,c){     
      },
      open_all(){
        this.all_bool = !this.all_bool
      },
    
      history_back_click: function () {  //返回则数据不改变

          this.permissions(this.old_permissionsusers)
          history.back()

      },
      chose_select: function (item, index) { //搜索之后选中某个人

      item.mark_chose=!item.mark_chose

        for(let i =0;i<this.datalist.length;i++){

            if(this.datalist[i].subOffice==undefined){
                continue;
            }
            for(let j=0;j<this.datalist[i].subOffice.length;j++){

                for(let k=0;k<this.datalist[i].subOffice[j].staff.length;k++){
                    
                     if(item.id==this.datalist[i].subOffice[j].staff[k].userId){
                        
                         
                         this.datalist[i].subOffice[j].staff[k].mark_chose=!this.datalist[i].subOffice[j].staff[k].mark_chose
                         if(this.datalist[i].subOffice[j].staff[k].mark_chose){
                            this.datalist[i].subOffice[j].open = true
                            this.datalist[i].open = true
                         }
                     }
                }

                if(!this.datalist[i].subOffice[j].subOffice) continue;

                for(let s=0;s<this.datalist[i].subOffice[j].subOffice.length;s++){

                    for(let k=0;k<this.datalist[i].subOffice[j].subOffice[s].staff.length;k++){
                    
                        if(item.id==this.datalist[i].subOffice[j].subOffice[s].staff[k].userId){
                         
                            this.datalist[i].subOffice[j].subOffice[s].staff[k].mark_chose=!this.datalist[i].subOffice[j].subOffice[s].staff[k].mark_chose
                            if( this.datalist[i].subOffice[j].subOffice[s].staff[k].mark_chose){
                               this.datalist[i].subOffice[j].subOffice[s].open = true
                                this.datalist[i].subOffice[j].open = true
                                this.datalist[i].open = true
                          }
                        }
                    }
                }

            }
        }
      },
      hide_seach: function () {
        this.seach_value = ""
        this.seach_list_man = []
        this.is_search = false
      },
      value_change: function () { //模糊查询实时监听输入框变化
        let that = this;
        let url = this.$route.query.type?'/apply/user/permit/checkbyname':'work/report/permit/checkbyname'

        if (this.seach_value != "") {
          this.axios.get(url, {params: {userName: this.seach_value}}).then(data => {
            if (data.data.h.code == 200) {
              that.seach_list_man = data.data.b


              let arr = []

              for(let i =0;i<this.datalist.length;i++){

                if(this.datalist[i].subOffice==undefined){
                    continue;
                }
                for(let j=0;j<this.datalist[i].subOffice.length;j++){

                    for(let k=0;k<this.datalist[i].subOffice[j].staff.length;k++){
                        
                        if(this.datalist[i].subOffice[j].staff[k].mark_chose){
                                arr.push(this.datalist[i].subOffice[j].staff[k].userId)
                        }
                    }
                    
                    if(!this.datalist[i].subOffice[j].subOffice) continue;

                    for(let s=0;s<this.datalist[i].subOffice[j].subOffice.length;s++){

                        for(let k=0;k<this.datalist[i].subOffice[j].subOffice[s].staff.length;k++){
                        
                            if(this.datalist[i].subOffice[j].subOffice[s].staff[k].mark_chose){
                                    arr.push(this.datalist[i].subOffice[j].subOffice[s].staff[k].userId)
                            }
                        }
                    }
                    
                }
            }

             for (let b = 0; b < that.seach_list_man.length; b++) {
                    that.seach_list_man[b].mark_chose = false

                    for(let c=0;c<arr.length;c++){
                        if(that.seach_list_man[b].id==arr[c]){
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
      let that = this;
      // this.axios.get('https://apps.epipe.cn/member/v3/organ/addressbook',{
      let url = this.$route.query.type?'/apply/user/permit/list':'work/report/permit/list'

        if(this.permissionsusers.length!=0){
            that.datalist = this.permissionsusers
            that.old_permissionsusers = JSON.parse(JSON.stringify( this.permissionsusers))
            return false;
        }

      this.axios.get(url,{
      }).then(function (data) {
        if(data.data.h.code == 200) {
          let datas = data.data.b
          let arrs = that.peerData;


            datas.forEach(element => {
                element.mark_chose = false
                element.open = false
                    if(!element.subOffice) return false
                    element.subOffice.forEach(item=>{
                        item.mark_chose = false
                        item.open = false
                        if(item.subOffice&&item.subOffice.length!=0){

                            item.subOffice.forEach(el=>{
                                    el.mark_chose = false
                                    el.open = false

                                    if(!el.staff) return false

                                    el.staff.forEach(child=>{
                                        child.mark_chose = false
                                    })
                            })

                        }else{
                            if(!item.staff) return false
                            
                            item.staff.forEach(child=>{
                                child.mark_chose = false
                            })
                        }

                    })
            });

            datas.unshift({name:'我的',allInFlag:true,staff:[],mark_chose:false})
            datas.unshift({name:'所有用户',allInFlag:true,staff:[],mark_chose:false})

            // if(this.permissionsusers.length!=0){

            // }

            that.datalist = datas

        }
      });
    },
    computed: mapState(["permissionsusers"])  
  }
</script>
