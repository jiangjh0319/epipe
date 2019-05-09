<template>
  <section>
    <p class="title">优管APP 帮助</p>
    <p class="title_small">基本功能</p>
    <p>如何下载安装 优管？</p>
    <p>访问优管官网 www.epipe.cn，点击“下载”选择对应客户端下载。</p>
    <p class="title_small">手机收不到验证码的原因？</p>
    <p>1、请您先确认是否点击了“免费获取验证码”的按钮，60秒后即可重新发送；</p>
    <p>2、若仍未收到验证短信，此种情况可能是由于通信网络异常造成的，请您稍后一段时间重新尝试操作或者重启手机后再试；如仍收不到验证码，请您检查手机有无短信拦截设置或联系通讯运营商查看短信发送情况。</p>
    <p class="title_small">如何修改头像等个人信息？</p>
    <p>1、PC端：登录优管网，用户中心中点击左侧 “个人头像”进行修改；</p>
    <p>2、手机端：在底部菜单找到“我的”，点击个人资料，选择头像进行修改。</p>
    <p class="title_small">如何修改优管登录密码？</p>
    <p>1、PC端：登录优管网，用户中心点击“修改密码”的标识进行修改；</p>
    <p>2、手机端：在底部菜单找到“我的”，在“设置-账号与安全”中进行修改。</p>
    <p class="title_small">如何使用优管拨打电话？</p>
    <p>点击通讯录--个人资料页面的“电话”图标，，即可拨打电话</p>
    <p  class="title_small">拨号盘在哪儿？</p>
    <p>点击“电话”按钮，进入拨号盘。</p>
    <p class="title_small">如何查看组织架构？</p>
    <p>点击“工作台-组织通讯录”，即可查看对应组织架构。</p>
    <p  class="title_small">是否可以看到组织成员的手机号和其他资料？</p>
    <p>可以看到对应组织成员的手机号和其他资料。</p>
    <p>管理员必读</p>
    <p class="title_small">身为组织管理人员，想要为组织引进优管，应该怎么做？</p>
    <p>您可以首先注册优管，让公司行政或者技术人员成为组织管理员，管理员在组织管理后台导入企业通讯录。</p>
    <p class="title_small">如何注册企业账号？</p>
    <p>可以联系优管客服人员，并提交企业的相关资质证书附件，由优管客服人员在后台注册。</p>
    <p class="title_small">管理员登录账号设置规则是什么？</p>
    <p>1、管理员账号具备唯一性，因此被注册过的账号无法再次被注册；</p>
    <p>2、必须使用手机号码注册。</p>
    <p class="title_small">如何添加部门？</p>
    <p>登录组织管理员后台，点击“部门管理”--添加，即可添加相应部门。</p>
    <p>登录组织管理员后台，点击“部门管理”，点击对应的部门进行编辑即可。</p>
    <p class="title_small">如何添加员工信息到企业通讯录中？</p>
    <p>登录组织管理员后台，点击“成员管理”列表的“添加”符号即可添加员工信息。</p>
    <p class="title_small">员工信息哪些信息必须要填写？</p>
    <p>姓名、手机号必须填写，否则无法保存；</p>
    <p>管理后台允许批量导入员工信息；PS：首先需要下载导入模板。</p>
    <p class="title_small">如何编辑员工信息？</p>
    <p>登录组织管理员后台，点击“成员管理”，点击对应的部门的员工选择“编辑”即可。</p>
    <p class="title_small">如何设置考勤规则？</p>
    <p>登录组织管理员后台，点击“考勤管理”，选择考勤规则管理，进入相应的设置</p>
    <p>工作台</p>
    <p class="title_small">任何人都可以访问工作台吗？</p>
    <p>只有加入到企业组织，而且企业组织在后台已经添加，才可以访问工作台的内容</p>
    <p class="title_small">如何打卡进行考勤？</p>
    <p>进入工作台，选择“考勤”，进入后，就进入考勤打卡页面。点击“打卡”操作，就可以完成考勤打卡了</p>
    <p class="title_small">一天可以多次打卡吗？</p>
    <p>系统限制用户，一天最多可以打卡10次</p>
    <p class="title_small">可以查看打卡记录和统计吗？</p>
    <p>进入工作台，选择“考勤”，点击 记录 和 统计，就可以查看每一天的打卡记录，以及每个月的打卡统计</p>
    <p class="title_small">在任何地方都可以进行打卡考勤吗？</p>
    <p>只有在允许的地点范围内，才能进行打卡考勤，这样的打卡才有效。 而允许的地点范围，则是由企业管理员，通过管理后台进行考勤规则设定的。</p>
    <p class="title_small">外勤可以在任何地方签到吗？</p>
    <p>外勤是可以在任何地方进行签到的，但每一次的签到，都要建立在某一个外勤任务的基础上，这样方便跟踪和统计。</p>
  </section>
</template>

<script>
  export default {
    data () {
      return {
        total:''
      }
    },
    components: {

    },mounted() {

    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  section{
    line-height: 0.3rem;
    padding: 0.15rem 0.15rem 0.3rem 0.15rem;
    background-color: #fff;
  }
  .title{
    font-size: 0.19rem;
    text-align: center;
    height: 0.32rem;
    font-weight: bold;
    text-indent:0em;
  }
  .title_small{
    font-size: 0.16rem;
    font-weight: bold;
  }
  p{
    text-indent:2em;
    white-space: normal;
  }
</style>
