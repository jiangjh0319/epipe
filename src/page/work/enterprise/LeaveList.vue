<template>
  <div class="not-clocking">
    <div class="header">
      <div class="header-top">
        <div class="svg" @click="goback">
          <svg class="icon icon-back" aria-hidden="false">
            <use xlink:href="#icon-zuoyoujiantou"></use>
          </svg>
        </div>
        早退榜
      </div>
      <div class="header-content">
        <div class="date">{{date}}</div>
      </div>
    </div>
    <div class="content-wrapper no-self">
      <div class="list-container" :class="{'list-container-empty': list.length===0}">
        <div class="list-item flex-box" v-for="(item,index) in list">
          <div class="flex-box">
            <div class="user-info flex-box" @click="userInfo">
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
          <div class="desc">
            <p>{{item.signTime}}</p>
          </div>
        </div>
      </div>
      <div class="no-more-data">暂时没有更多数据了~</div>
    </div>
  </div>
</template>

<script>
  export default{
    name: "Leave",
    data(){
      return{
        myself: true,
        list: [],
        date: "",
        ms: 0,
      }
    },
    methods:{
      goback(){
        window.history.back();
      },
      getNosignList(date){
        this.axios.get(this.Service.leavelist+"?checkDate="+date).then(res =>{
          console.log("早退榜",res);
          if(res.data.h.code === 200){
            this.list = res.data.b.data;
          }
        });
      },
      userInfo(){
        window.location.href = "epipe://?&mark=userinfo&_id="+this.list[index].userId;
      },
    },
    mounted(){
      this.date = this.$route.query.date;
      this.ms = parseInt(this.$route.query.ms);
      let date = new Date(this.ms).getFullYear()+"-"+(parseInt(new Date(this.ms).getMonth())+1)+"-"+new Date(this.ms).getDate();
      this.getNosignList(date);
    },
  }
</script>

<style lang="stylus" scoped>
  .not-clocking{
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
    margin-right: 0.17rem;
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
    overflow-y scroll;
    max-height 5.3rem;
    width: 3.44rem;
    margin: 0 auto;
    margin-top: -0.5rem;
    background: white;
    -webkit-overflow-scrolling: touch;
    box-shadow 0 0 20px rgba(95,157,247,0.2);
  }
  .list-container{
    box-sizing border-box;
    width: 3.44rem;
    margin: 0 auto;
    padding-left 0.15rem;
    background white;
    border-bottom: 1px solid #ebebeb;
    .list-item{
      padding-right 0.15rem;
    }
  }
  .list-container-empty{
    margin-bottom 1rem;
  }
  .list-container .list-item:not(:last-child){
    border-bottom: 1px solid #EBEBEB;
  }
  .no-more-data{
    padding 0.3rem 0;
    font-size 0.14rem;
    text-align center;
    color #999;
  }
  .desc{
    font-size: 0.16rem;
    color: #666;
    line-height 1;
  }
  .desc p:nth-child(2){
    margin-top 0.1rem;
  }
</style>
