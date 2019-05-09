/**
 * Created by lenovo on 2017/6/12.
 */
const Service = {
  host: "http://3msapi.epipe.cn/api",
  // host: "http://192.168.3.166:8181/api", //测试
  newHomeNews: "/topnews/getWaterfallPagedList",//新版首页新闻
  detailNewHomeNews: "/content/getDetails",//新版首页新闻详情
  content_show: "/content/show/index", //首页广告图
  category_banner: "/content/show/index", //二级页面广告图
  content_headline: "/content/headline/list", //新闻 分页
  content_Detail: "/content/headline/detail", //新闻详情
  checkRecord: "/check/sign/record", //某天打卡
  checkStatic: "/check/sign/static", //某月打卡统计
  outSignRecord: "/outsign/record/list", //足迹
  outSignInfo: "/outsign/record/info", //足迹详情
  organAddress: "/organ/addressbook", //IM通讯录
  reportAdd: "/work/report/add", //工作汇报新增
  selectReceiver: "/work/report/select/receiver", //模糊查询通讯录人
  reportReceiver: "/work/report/get/receiver", //查询工作日志抄送人
  workList: "/work/report/list", //查询日志 列表
  reportQuery: "/work/report/query", //根据条件查询工作汇报
  reportDetail: "/work/report/detail", //根据ID查询工作汇报详情
  reportDelete: "/work/report/delete", //删除工作汇报
  updataInfo: "/user/edit",  //更新个人信息
  search: "/organ/select",  //搜索企业信息
  createOrg: "/organ/user/create/organ", //提交创建组织申请
  organization: "/organ/user/apply",  //用户从属组织查询
  mobile: "/user/bind/mobile",  //绑定手机号码
  revoke: "/organ/user/revoke/organ",  //撤销申请
  department: "/organ/office/select",  //组织部门查询
  userInfo: "/user/info",    //用户信息查询
  application: "/organ/user/apply/organ",  //申请加入组织
  daily: "/check/report/daily",  //企业日报 考勤
  earlylist: "/check/report/daily/rank",  //早到榜
  latelist: "/check/report/late/list",  //迟到榜
  leavelist: "/check/report/earlySign/list",  //早退榜
  overtimelist: "/check/report/overtime/list",  //早退榜
  noSign: "/check/report/nosign/list",  //未打卡
  slogan: "/organ/work/setting",  //工作台信息设置
  like: "/check/report/daily/rank/zan",  //点赞
  message: "/company/message/tolist",  //消息助手
  saveLeave : '/work/leave/apply/save', //请假申请
  leaveUpdate : '/work/leave /update', //同意，拒绝，撤销请假
  affairsList:'/work/unhandle/list',//待办 已办事宜
  resource :'/content/getPagedListByProgramCode?programCodes=', //首页的 专家库、专业机构、行情、访谈
  // resource : "http://3msapi.epipe.cn/api/resourceMain/getWaterfallPagedListByProgramCode?programCodes=",  //首页的 专家库、专业机构、行情、访谈
  // resource : "http://192.168.3.166:8181/api/resourceMain/getWaterfallPagedListByProgramCode?programCodes=",
  queryString: function (params, postFlag) {
    let paramUrl = "";
    for (let key in params) {
      if (!postFlag && paramUrl == "") {
        paramUrl += "?" + key + "=" + params[key];
      } else {
        paramUrl += "&" + key + "=" + params[key];
      }
    }
    return paramUrl;
  },
  getCookie: function (name) {
    var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
    if (arr = document.cookie.match(reg))
      return unescape(arr[2]);
    else
      return null;
  }
};
module.exports = Service;
