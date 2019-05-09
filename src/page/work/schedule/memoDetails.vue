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
        mounted() {
            this.axios.get('/agenda/reminder/info?reminderId='+this.$route.query.id).then(res=>{

            })
        },


    }
</script>

<style scoped>

</style>