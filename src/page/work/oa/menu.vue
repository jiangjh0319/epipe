<template>
    <div>
        <TopHead
            bgcolor = '#fd545c'
            title="菜谱" 
         ></TopHead>
        <img src="./../../../assets/menu_1.png"/><img src="./../../../assets/menu_2.png"/><img src="./../../../assets/menu_3.png"/>
    </div>
</template>

<script>
    import TopHead  from '../../../components/topheader.vue'  //header导航栏

    export default {
        data() {
            return {
            }
        },
        components:{
            TopHead,
        }
    }
</script>

<style lang="stylus" scoped>

div{
    padding-top 0.22rem;
}

img{
    width 100%;
    display block;
}

</style>