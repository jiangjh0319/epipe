<template>
  <div class="early-list">
    <div class="header">
      <div class="header-top">
        <div class="svg" @click="goback">
          <svg class="icon icon-back" aria-hidden="false">
            <use xlink:href="#icon-zuoyoujiantou"></use>
          </svg>
        </div>
        早到榜
      </div>
      <div class="header-content">
        <div class="date">{{date}}</div>
      </div>
      <div class="myself list-item flex-box">
        <div class="flex-box">
          <div class="user-info flex-box" @click="myspace">
            <div class="avater">
              <img :src="myself.image" v-if="myself.image">
              <img src="../../../assets/avatar.png" v-else>
            </div>
            <div class="info-container">
              <div class="name">{{myself.userName}}</div>
              <p class="department">{{myself.officeName}}</p>
            </div>
          </div>
        </div>
        <div class="flex-box">
          <div class="time" v-if="myself.signTime">{{myself.signTime | format}}</div>
          <div class="support" :class="{active:myself.flag}" v-if="myself.signTime">
            <svg class="icon" aria-hidden="false" v-if="myself.flag">
              <use xlink:href="#icon-zan"></use>
            </svg>
            <svg class="icon" aria-hidden="false" v-else>
              <use xlink:href="#icon-zan1"></use>
            </svg>
            <span>{{myself.zan}}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="content-wrapper">
      <div class="list-container">
        <div class="list-item flex-box" v-for="(item,index) in list" :key="index">
          <div class="flex-box">
            <div class="list">{{index+1}}</div>
            <div class="user-info flex-box" @click="userInfo(index)">
              <div class="avater">
                <img :src="item.image" v-if="item.image">
                <img src="../../../assets/avatar.png" v-else>
              </div>
              <div class="info-container">
                <div class="name">{{item.userName}}</div>
                <p class="department">{{item.officeName}}</p>
              </div>
            </div>
          </div>
          <div class="flex-box">
            <div class="time">{{ item.signTime | format }}</div>
            <div class="support" :class="{active:item.flag}" @click="like(item.id,index,item.flag)">
              <svg class="icon" aria-hidden="false" v-if="item.flag">
                <use xlink:href="#icon-zan"></use>
              </svg>
              <svg class="icon" aria-hidden="false" v-else>
                <use xlink:href="#icon-zan1"></use>
              </svg>
              <span>{{item.zan}}</span>
            </div>
          </div>
        </div>
      </div>
      <div class="no-more-data">暂时没有更多数据了~</div>
    </div>
  </div>
</template>

<script>
  const Loading = () => import("../../../components/loading.vue");
  export default{
    components: {Loading},
    name: "EarlyList",
    componets:{
      Loading,
    },
    data(){
      return{
        myself: {},
        list: [],
        date: "",
        ms: 0,
        loading: false,
      }
    },
    methods:{
      getEarlyList(date){
        this.axios.get(this.Service.earlylist+"?checkDate="+date).then(res =>{
          console.log("早到榜",res);
          if(res.data.h.code === 200){
            this.list = res.data.b.data;
            this.myself = res.data.b.myself[0];
          }
        });
      },
      like(id,index,flag){
        let vm = this;
        if(!this.loading){
          this.loading = true;
          this.axios.post(this.Service.like+this.Service.queryString({
            checkId: id
          })).then(res =>{
            console.log("点赞",res);
            vm.loading = false;
            if(res.data.h.code === 200){
              if(flag){
                if(this.list[index].me == 1){
                  this.myself.zan --;
                  this.myself.flag = 0;
                }
                this.list[index].zan --;
                this.list[index].flag = 0;
              }else{
                if(this.list[index].me == 1){
                  this.myself.zan ++;
                  this.myself.flag = 1;
                }
                this.list[index].zan ++;
                this.list[index].flag = 1;
              }
            }
          });
        }
      },
      goback(){
            window.location.href = "epipe://?&mark=history_back"
      },
      userInfo(index){
        window.location.href = "epipe://?&mark=userinfo&_id="+this.list[index].userId;
      },
      myspace(){
        window.location.href = "epipe://?&mark=userinfo&_id="+this.myself.userId;
      }
    },
    filters:{
      format: function(val){
        return (val+"").substring(0,5);
      }
    },
    mounted(){
      this.date = this.$route.query.date;

      this.ms = parseInt(this.$route.query.ms);
      let date = new Date(this.ms).getFullYear()+"-"+(parseInt(new Date(this.ms).getMonth())+1)+"-"+new Date(this.ms).getDate();
      console.log(date);
      this.getEarlyList(date);
    }
  }
</script>

<style lang="stylus" scoped>
  .early-list{
    padding-top: 1.81rem;
  }
  .header{
    position fixed;
    top: 0;
    left:0;
    width 100%;
    height: 1.81rem;
    color: white;
    background: #609EF7;
    border-bottom-left-radius 0.2rem;
    border-bottom-right-radius 0.2rem;
  }
  .header-top{
    width:100%;
    height: 0.44rem;
    text-align center;
    line-height:0.44rem;
    font-size: 0.185rem;
    letter-spacing: 0.012rem;
    .icon-back{
      font-size: 0.17rem;
      margin-left: -0.2rem;
      color: white;
    }
    .svg{
      position absolute;
      left 0;
      top 0;
      width 0.58rem;
      height 100%;
    }
  }
  .header-content{
    width: 100%;
    height: 1.37rem;
  }
  .date{
    height: 0.87rem;
    line-height 0.87rem;
    text-align center;
    font-size: 0.17rem;
  }
  .flex-box{
    display flex;
    justify-content space-between;
    align-items center;
  }
  .list-item{
    z-index 1;
    box-sizing border-box;
    position relative;
    height: 0.74rem;
    margin: 0 auto;
    font-size: 0.17rem;
    background white;
  }
  .myself{
    width: 3.44rem;
    padding: 0 0.15rem;
    margin-top -0.5rem;
    margin-bottom 0.15rem;
    border-radius 0.04rem;
    box-shadow 0 0 20px rgba(95,157,247,0.2);
  }
  .list{
    z-index 9;
    width: 1em;
    margin-right: 0.15rem;
    text-align left;
    color: #666;
  }
  .avater{
    width: 0.47rem;
    height: 0.47rem;
    margin-right: 0.1rem;
    border-radius: 50%;
    img{
      width: 100%;
      height: 100%;
      border-radius 50%;
    }
  }
  .name{
    max-width: 6em;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    margin-bottom: 0.1rem;
    font-size: 0.17rem;
    line-height 1;
    color: #333;
  }
  .department{
    font-size: 0.14rem;
    line-height 1;
    color: #696969;
  }
  .time{
    margin-right 0.1rem;
    font-size: 0.16rem;
    color: #666;
  }
  .support{
    width: 0.44rem;
    height: 0.23rem;
    line-height: 0.23rem;
    font-size: 0.14rem;
    text-align center;
    color: #8BA5CA;
    border-radius: 0.11rem;
    border: 1px solid #8BA5CA;
  }
  .support-active{
    color: #FF8800;
    border: 1px solid #FF8800;
  }
  .content-wrapper{
    z-index 9;
    position relative;
    overflow-y auto;
    max-height 4.3rem;
    margin-top: 0.5rem;
  }
  .no-self{
    max-height 5.3rem;
    margin-top: -0.5rem;
  }
  .list-container{
    -webkit-overflow-scrolling: touch;
    box-sizing border-box;
    width: 3.44rem;
    margin: 0 auto;
    padding-left 0.12rem;
    background white;
    box-shadow 0 0 20px rgba(95,157,247,0.2);
    .list-item{
      padding-right 0.15rem;
    }
  }
  .list-container .list-item:not(:last-child){
    border-bottom: 1px solid #EBEBEB;
  }
  .list-container .list-item:nth-child(1)::before{
    content: "";
    display: block;
    position: absolute;
    left: -0.12rem;
    top: 0.22rem;
    width: 0.3rem;
    height: 0.3rem;
    border-top-right-radius 0.15rem;
    border-bottom-right-radius 0.15rem;
    background: #FD545C;
  }
  .list-container .list-item:nth-child(2)::before{
    content: "";
    display: block;
    position: absolute;
    left: -0.12rem;
    top: 0.22rem;
    width: 0.3rem;
    height: 0.3rem;
    border-top-right-radius 0.15rem;
    border-bottom-right-radius 0.15rem;
    background: #FF8800;
  }
  .list-container .list-item:nth-child(3)::before{
    content: "";
    display: block;
    position: absolute;
    left: -0.12rem;
    top: 0.22rem;
    width: 0.3rem;
    height: 0.3rem;
    border-top-right-radius 0.15rem;
    border-bottom-right-radius 0.15rem;
    background: #F8b466;
  }
  .list-container .list-item:nth-child(1) .list{
    color: white;
  }
  .list-container .list-item:nth-child(2) .list{
    color: white;
  }
  .list-container .list-item:nth-child(3) .list{
    color: white;
  }
  .no-more-data{
    padding 0.3rem 0;
    font-size 0.14rem;
    text-align center;
    color #999;
  }
  .active{
    color: #ff8800;
    border: 1px solid #ff8800;
  }
</style>
