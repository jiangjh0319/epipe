<template>
    <div>

    </div>
</template>

<script>
    export default {
        data() {
            return {
            }
        },
        created(){
            let that = this;
            setTimeout(res=>{
             that.$router.replace({path:'/weeknews'})
            },1000)
        }
    }
</script>

<style  scoped>

</style>