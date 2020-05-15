<template>
    <section>
        <div v-for="(item,index) in list" :key="index" class="list">
            <div>
                <div style="padding-right: 0.15rem;" class="organization_item" @click="item.open=!item.open">
                    <span>{{item.name}}&nbsp; （{{item.personNO}}）</span>
                    <svg v-bind:class="{top_ul_yuan22:item.open}" style="width: 0.15rem;height: 0.15rem" class="icon"
                            aria-hidden="false">
                        <use xlink:href="#icon-back"></use>
                    </svg>
                </div>
                <div v-if="item.subOffice.length" style="padding-right: 0.15rem;"  v-show="item.open">
                    <AddressList
                        :list="item.subOffice"
                        v-on:pitchOn="pitchOn"
                    ></AddressList>
                </div>
            </div>
            <div  style="padding-left: 0.15rem" v-show="item.open">
                <div v-for="child in item.staff" :key="child.id" class="people_item" @click="chose_click(child)">
                    <svg v-show="child.mark_chose" style="font-size: 0.19rem;padding-right: 0.15rem" class="icon">
                        <use xlink:href="#icon-chenggong"></use>
                    </svg>
                    <svg v-show="!child.mark_chose" style="font-size: 0.19rem;padding-right: 0.15rem" class="icon">
                        <use xlink:href="#icon-meiyouxuanzhong"></use>
                    </svg>
                    <img :src=child.profileImg class="headImg" />
                    <div style="padding-left: 0.15rem">{{child.name}}</div>
                </div>
            </div>
        </div>
    </section>
</template>

<script>

    export default {
        name: 'AddressList',
        data() {
            return {


            }   
        },
        methods:{
            chose_click(item){
                this.$emit('pitchOn',item)
            },
            pitchOn(item){
                this.$emit('pitchOn',item)
            }
        },
        components:{
        },
        props:['list']
    }
</script>

<style lang="stylus" scoped>

    .list{
        padding-left 0.15rem;
    }

    .headImg{
        width 0.32rem
        height 0.32rem
        border-radius 0.32rem
    }

    .people_item, .organization_item{
        height 0.48rem;
        line-height 0.48rem;
        display flex;
        border-bottom 0.01rem solid #E6E6E6
        font-size 0.15rem
        align-items: center;
        padding-left 0.15rem;
    }

    .organization_item{
        
        span{
            flex 1;
        }

        
    }


</style>