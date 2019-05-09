<style>
</style>
<template>
  <section>
    <button @click="toast" style="width: 100%;height: 40px;background-color: #3478f6">点击登录</button>
  </section>
</template>
<script>
  export default {
    data () {
      return {

      }
    },
    methods: {
      toast(){
        let aa = () => {
          this.axios.post("/user/login/password?account=15013734209&password=123456").then(data => {
            window.localStorage.auth_token = data.data.b.authToken
            this.$toast("登录成功")
          })
        }
        aa()
      }
    },
    mounted(){

    }
  }
</script>
