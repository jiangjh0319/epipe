<template>
    <div>
        <TopHead
        mark = 'mark'
        bgcolor = '#609df6'
        title="更多应聘条件" 
        v-on:history_back="history_back_click"
         ></TopHead>
         <div style="height:0.59rem"></div>
         <div class="content">
            <div class="styles input_group">
              <div class="bor_bottom">
                    <span class="title">职业资格证</span>
                    <input placeholder="请输入详细职业资格证要求"  v-model="data.qualifications" />
                </div>
                <div class="bor_bottom">
                    <span class="title">计算机</span>
                    <input placeholder="请输入计算机水平要求"  v-model="data.computerLevel" />
                </div>
                <div class="bor_bottom">
                    <span class="title">外语水平</span>
                    <input placeholder="请输入外语水平要求"  v-model="data.foreignLevel" />
                </div>
                <div class="bor_bottom">
                    <span class="title">经验与技能</span>
                    <input placeholder="请输入经验与技能要求"  v-model="data.skill" />
                </div>
                <div class="bor_bottom">
                    <span class="title">公文写作</span>
                    <input placeholder="请输入公文写作能力要求"  v-model="data.writings" />
                </div>
                <div class="bor_bottom">
                    <span class="title">必要条件</span>
                    <input placeholder="请输入必要条件"  v-model="data.condition" />
                </div>
                <div class="bor_bottom">
                    <span class="title">优先录用</span>
                    <input placeholder="请输入优先录用要求"  v-model="data.priority" />
                </div>
            </div>
         </div>
    </div>
</template>

<script>
import TopHead  from '../../../components/topheader.vue'  //header导航栏
    export default {
        data() {
            return {
                data:{},
            }
        },
        components:{
            TopHead,
        },
        methods:{
            history_back_click(){
                window.history.back(-1);
            },
             updata(){
                let that = this;
                eventBus.$emit('leaveType',{
                    index: 1,
                    name: JSON.stringify(this.data),
                    type: 'more',
                });
            },
        },
        created(){
            this.data = this.$route.query
        },
         beforeDestroy() {
            this.updata();
        },
    }
</script>

<style lang="stylus" scoped>

    .content{
        margin-bottom 0.3rem;
        padding 0 0.15rem;
    }

     .styles{
            margin-bottom 0.15rem;
            //  -webkit-box-shadow: 0 0 0.2rem rgba(238,65,54,.1);    
            //  box-shadow 0 0 0.2rem rgba(238,65,54,.1);
             background-color #fff;
             overflow hidden

             input{
                 box-sizing border-box
                 float right;
                 width 2.1rem;
                 height 0.44rem;
                 border none;
                 outline none;
                 font-size:0.14rem;
                 text-align right;
                 padding-right 0.15rem;
             }
             input::-webkit-input-placeholder{
                 font-size:0.13rem;
                 color:#666;
             }

             .title{
                 line-height 0.44rem;
                 font-size 0.15rem;
                 color #333;
                 font-weight:bold;
             }
        }

    .bor_bottom{
        position:relative;
    }

    .bor_bottom:after{
        position:absolute;
        content:'';
        display:block;
        bottom : 0;
        left:0;
        height:0.01rem;
        width:100%;
        background-color:#f5f5f5;
    }

    .choose{
         p{
            float:right;
            line-height 0.44rem;
        }
    }

     .input_group>div{
        overflow hidden;
        padding 0 0.15rem;
    }
</style>