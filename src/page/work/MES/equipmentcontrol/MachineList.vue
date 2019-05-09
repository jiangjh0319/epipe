<template>
  <div class="machine-list-wrapper">
    <top-header :title="title"  bgcolor="#FD545C"></top-header>
    <div class="content-wrapper">
      <div class="content">
        <router-link :to="{path:'/detailslist',query:{id:item.machineId,workshopId:workshopId,worklineId:worklineId,workdate:workdate}}" class="machine-item" v-for="(item,index) in machineList" :key="index">
          <svg class="icon-machine" aria-hidden="false">
            <use xlink:href="#icon-shebei"></use>
          </svg>
          <div class="machine-name">{{item.machineId}}</div>
        </router-link>
      </div>
    </div>
  </div>
</template>
<script>
  const TopHeader = () => import("../../../../components/topheader.vue");
  export default {
    name: "MachineList",
    components:{
      TopHeader,
    },
    data(){
      return{
        title: '',
        lineId: "",
        workdate: "",
        workshopId:'',
        worklineId:'',
        machineList: [],
      }
    },
    created(){
      this.title = '运行历史-'+this.$route.query.name;
      this.lineId = sessionStorage.getItem("lineId");
      this.workdate = this.$route.query.workdate;
      this.workshopId = this.$route.query.workshopId;
      this.worklineId = this.$route.query.worklineId;
      this.getData(this.$route.query.id,this.lineId);
    },
    methods:{
      /*获取数据*/
      getData(id,lineId){
        if(id){
          this.$mes.get("/common/machineID",{
            machine: id,
            lineId: lineId
          }).then(res =>{
            console.log("设备列表",res);
            if(res.h.code === 200){
              this.machineList = res.b.list;
            }
          });
        }
      },
    }
  }
</script>
<style lang="stylus" scoped>
  .content-wrapper{
    position fixed;
    box-sizing border-box;
    top: 0.45rem;
    padding: 0.15rem;
    width 100%;
  }
  .content{
    display flex;
    justify-content space-between;
    padding 0.2rem 0.1rem;
    background: white;
  }
  .machine-item{
    width: 1.565rem;
    height: 1.01rem;
    text-align center;
    border: 1px solid #eee;
  }
  .icon-machine{
    width:0.45rem;
    height:0.45rem;
    margin-bottom:0.05rem;
    margin-top: 0.15rem;
  }
  .machine-name{
    width: 100%;
    overflow hidden;
    white-space nowrap;
    text-overflow ellipsis;
    font-size 0.16rem;
    color: #333;
    line-height: 1;
  }
</style>
