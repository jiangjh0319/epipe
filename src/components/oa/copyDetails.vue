<template>
    <div>
        <div class="styles copy">
                <p class="title">{{title?title:'抄送人'}}<span v-if="!title">（已抄送{{dataObj.receivers.length+newCopy.length}}人）</span></p>
                
                <ul class="list">
                    <li v-for="(item,index) in dataObj.receivers" class="list_item" :key="index"> 
                        <img class="imgHead" @click="go_user(item.receiverId)" :src="item.profileImg">
                        <span>
                            {{item.name}}
                         </span>
                    </li>
                    <li v-for="(item,index) in newCopy" class="list_item newCopy" :key="item.id">
                        <svg @click="remove(index)" style="font-size: 0.15rem" class="icon" aria-hidden="false">
                            <use xlink:href="#icon-shanchu"></use>
                        </svg>
                        <img class="imgHead" @click="go_user(item.receiverId)" :src="item.profileImg">
                        <span>
                            {{item.name}}
                         </span>
                    </li>
                    <li class="list_item" @click="go_imchoice(0)" v-if="dataObj.myselfApply==0" >
                        <svg style="font-size: 0.33rem;margin-top: 0.085rem" class="icon" aria-hidden="false">
                            <use xlink:href="#icon-tianjiarenyuan"></use>
                        </svg>
                        <div style="margin-top: 0.055rem">添加</div>
                   </li>
                </ul>
            </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
            }
        },
        methods:{
            go_imchoice:function(num){
                this.$router.push({path: 'imchoices', query: {bgcolor:this.color,num:num}})
            },
            remove:function(index){
                this.$emit('remove',index)
            },
            go_user(id){
                window.location.href = "epipe://?&mark=userinfo&_id="+id;
            }
        },
        props:['dataObj','newCopy','color','title']
    }
</script>

<style scoped lang="stylus">

    .imgHead{
        width 0.37rem;
        height 0.37rem;
        border-radius 50%; 
    }

    .copy{

        .list{
            overflow hidden;

            img{
                display block;
                margin 0 auto;
                margin-bottom 0.1rem;
            }
        }

        .list li:nth-child(5),.list li:nth-child(10),
        .list li:nth-child(15),.list li:nth-child(20),
        .list li:nth-child(25),.list li:nth-child(30){
                margin-right:0;
        }
        
        .list_item{
            float left;
            font-size 0.13rem;
            color #333;
            text-align center;
            margin 0 0.12rem;
            margin-top 0.15rem;

            span{
                display inline-block
                width 0.4rem;
                height:0.15rem;
                line-height 0.15rem;
                overflow: hidden;
                text-overflow:ellipsis;
                white-space: nowrap;
            }
        }
    }

    .styles{
        padding 0.15rem;
        margin-bottom 0.15rem;
        -webkit-box-shadow: 0 0 0.2rem rgba(96,157,246,.1);    
            box-shadow 0 0 0.2rem rgba(96,157,264,.1);
        background-color #fff;
    }

    .newCopy{
        position relative;

        svg{
            position absolute;
            top:-0.07rem;
            right:-0.07rem;
        }
    }

</style>