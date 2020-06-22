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

            this.axios.get('http://192.168.3.153:8780/dossierapi/v1/youguan/dossier/getByPage',{
            params:{
                pageNo:1,
                pageSize:10,
            },
            headers: {
                'accessToken': localStorage.getItem('auth_token') //设置token 其中K名要和后端协调好
            },
            }).then((response)=>{
                console.log(response)
            })
        }
    }
</script>

<style lang="stylus" scoped>

</style>












// this.axios.get('http://192.168.3.153:8780/dossierapi/v1/youguan/dossier/getByPage',{
//             params:{
//                 pageNo:1,
//                 pageSize:10,
//             },
//             headers: {
//                 'accessToken': localStorage.getItem('auth_token') //设置token 其中K名要和后端协调好
//             },
//             }).then((response)=>{
//                 console.log(response)
//             })