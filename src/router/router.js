import Vue from 'vue'
import Router from 'vue-router'

import homerouters from "./homeRouter.js"
import workrouters from "./workRouter.js"
import oarouters from "./oaRouter.js"

let routeData = new Set([...workrouters,...homerouters,...oarouters]);

// console.log(...routeData)

Vue.use(Router)
const Home = r => require.ensure([], () => r(require('@/page/home/home.vue')), 'group-foo')
const Work = r => require.ensure([], () => r(require('@/page/work/works.vue')), 'group-foo')

// const NeatenWork = r => require.ensure([], () => r(require('@/page/work/neatenWork.vue')), 'group-foo')
const AddWork = r => require.ensure([], () => r(require('@/page/work/addWork.vue')), 'group-foo')
const Find = r => require.ensure([], () => r(require('@/page/find/find.vue')), 'group-foo')
const User = r => require.ensure([], () => r(require('@/page/user/User.vue')), 'group-foo')
const Record = r => require.ensure([], () => r(require('@/page/work/record.vue')), 'group-foo')
const Total = r => require.ensure([], () => r(require('@/page/work/total.vue')), 'group-foo')
const Exhibition = r => require.ensure([], () => r(require('@/page/home/exhibition.vue')), 'group-foo')
const Tender = r => require.ensure([], () => r(require('@/page/home/tender.vue')), 'group-foo')
const Dissertation = r => require.ensure([], () => r(require('@/page/home/dissertation.vue')), 'group-foo')
const Supply = r => require.ensure([], () => r(require('@/page/home/supply.vue')), 'group-foo')
const Newsdetail = r => require.ensure([], () => r(require('@/page/home/newsdetail.vue')), 'group-foo')
const Nologin = r => require.ensure([], () => r(require('@/page/work/nologin.vue')), 'group-foo')
const Agreement = r => require.ensure([], () => r(require('@/page/user/registertext.vue')), 'group-foo')
const Registertext = r => require.ensure([], () => r(require('@/page/user/agreement.vue')), 'group-foo')

const Help = r => require.ensure([], () => r(require('@/page/user/help.vue')), 'group-foo')
const Footprint = r => require.ensure([], () => r(require('@/page/work/footprint.vue')), 'group-work')
const Checkmap = r => require.ensure([], () => r(require('@/page/work/checkmap.vue')), 'group-work')
const Journal = r => require.ensure([], () => r(require('@/page/work/journal.vue')), 'group-work')
const Imchoice = r => require.ensure([], () => r(require('@/page/work/imchoice.vue')), 'group-work')
const Daynews = r => require.ensure([], () => r(require('@/page/work/daynews.vue')), 'group-work')
const Weeknews = r => require.ensure([], () => r(require('@/page/work/weeknews.vue')), 'group-work')
const Monthnews = r => require.ensure([], () => r(require('@/page/work/monthnews.vue')), 'group-work')
const Journaldetail = r => require.ensure([], () => r(require('@/page/work/Journaldetail.vue')), 'group-work')
const Application = r => require.ensure([], () => r(require('@/page/work/application.vue')), 'group-work')
const Edit = r => require.ensure([], () => r(require('@/page/work/edit.vue')), 'group-work')
const Create = r => require.ensure([], () => r(require('@/page/work/create.vue')), 'group-work')
const Search = r => require.ensure([], () => r(require('@/page/work/search.vue')), 'group-work')
const Pending = r => require.ensure([], () => r(require('@/page/work/pending.vue')), 'group-work')
const Department = r => require.ensure([], () => r(require('@/page/work/department.vue')), 'group-work')

const EarlyList = r => require.ensure([], () => r(require('@/page/work/enterprise/EarlyList.vue')), 'group-enterprise')
const LateList = r => require.ensure([], () => r(require('@/page/work/enterprise/LateList.vue')), 'group-enterprise')
const NotClocking = r => require.ensure([], () => r(require('@/page/work/enterprise/NotClocking.vue')), 'group-enterprise')
const LeaveList = r => require.ensure([], () => r(require('@/page/work/enterprise/LeaveList.vue')), 'group-enterprise')
const OvertimeList = r => require.ensure([], () => r(require('@/page/work/enterprise/OvertimeList.vue')), 'group-enterprise')
const DailyReport = r => require.ensure([], () => r(require('@/page/work/enterprise/DailyReport.vue')), 'group-enterprise')
const OutputLive = r => require.ensure([], () => r(require('@/page/work/MES/output/OutputLive.vue')), 'group-mes')
const OutputDaily = r => require.ensure([], () => r(require('@/page/work/MES/output/OutputDaily.vue')), 'group-mes')
const OutputCount = r => require.ensure([], () => r(require('@/page/work/MES/output/OutputCount.vue')), 'group-mes')
const MaterielDaily = r => require.ensure([], () => r(require('@/page/work/MES/materiel/MaterielDaily.vue')), 'group-mes')
const MaterielCount = r => require.ensure([], () => r(require('@/page/work/MES/materiel/MaterielCount.vue')), 'group-mes')
const QualityDaily = r => require.ensure([], () => r(require('@/page/work/MES/quality/QualityDaily.vue')), 'group-mes')
const QualityCount = r => require.ensure([], () => r(require('@/page/work/MES/quality/QualityCount.vue')), 'group-mes')
const Power = r => require.ensure([], () => r(require('@/page/work/MES/energycontrol/Power.vue')), 'group-mes')
const Water = r => require.ensure([], () => r(require('@/page/work/MES/energycontrol/Water.vue')), 'group-mes')
const OEE = r => require.ensure([], () => r(require('@/page/work/MES/equipmentcontrol/OEE.vue')), 'group-mes')
const Warning = r => require.ensure([], () => r(require('@/page/work/MES/equipmentcontrol/Warning.vue')), 'group-mes')
const DeviceDetails = r => require.ensure([], () => r(require('@/page/work/MES/equipmentcontrol/DeviceDetails.vue')), 'group-mes')
const DetailsInfo = r => require.ensure([], () => r(require('@/page/work/MES/equipmentcontrol/DetailsInfo.vue')), 'group-mes')
const RunHistory = r => require.ensure([], () => r(require('@/page/work/MES/equipmentcontrol/RunHistory.vue')), 'group-mes')
const MachineList = r => require.ensure([], () => r(require('@/page/work/MES/equipmentcontrol/MachineList.vue')), 'group-mes')
const DetailsList = r => require.ensure([], () => r(require('@/page/work/MES/equipmentcontrol/DetailsList.vue')), 'group-mes')
const EnergyMonitoring = r => require.ensure([], () => r(require('@/page/work/MES/energymonitor/EnergyMonitoring.vue')), 'group-mes')
const TrendMonitoring = r => require.ensure([], () => r(require('@/page/work/MES/energymonitor/TrendMonitoring.vue')), 'group-mes')

const AccountLogin = r => require.ensure([], () => r(require('@/page/mall/login/AccountLogin.vue')), 'group-mall')
const VerificationLogin = r => require.ensure([], () => r(require('@/page/mall/login/VerificationLogin.vue')), 'group-mall')
const ForgetPassword = r => require.ensure([], () => r(require('@/page/mall/login/ForgetPassword.vue')), 'group-mall')
const Register = r => require.ensure([], () => r(require('@/page/mall/login/Register.vue')), 'group-mall')
const MallAgreement = r => require.ensure([], () => r(require('@/page/mall/login/MallAgreement.vue')), 'group-mall')
const MallHome = r => require.ensure([], () => r(require('@/page/mall/home/MallHome.vue')), 'group-mall')
const PlasticList = r => require.ensure([], () => r(require('@/page/mall/home/PlasticList.vue')), 'group-mall')
const ConduitList = r => require.ensure([], () => r(require('@/page/mall/home/ConduitList.vue')), 'group-mall')
const HardwareList = r => require.ensure([], () => r(require('@/page/mall/home/HardwareList.vue')), 'group-mall')
const SupplyDemandList = r => require.ensure([], () => r(require('@/page/mall/home/SupplyDemandList.vue')), 'group-mall')
const SupplyDemandDetail = r => require.ensure([], () => r(require('@/page/mall/home/SupplyDemandDetail.vue')), 'group-mall')
const GoodsClassification = r => require.ensure([], () => r(require('@/page/mall/class/GoodsClassification.vue')), 'group-mall')
const ClassSearch = r => require.ensure([], () => r(require('@/page/mall/class/ClassSearch.vue')), 'group-mall')
const GoodsDetail = r => require.ensure([], () => r(require('@/page/mall/goods/GoodsDetail.vue')), 'group-mall')
const HWphone = r => require.ensure([], () => r(require('@/page/mall/goods/HWphone.vue')), 'group-mall')
const TestDetail = r => require.ensure([], () => r(require('@/page/mall/goods/TestDetail.vue')), 'group-mall')
const MallSearch = r => require.ensure([], () => r(require('@/page/mall/home/MallSearch.vue')), 'group-mall')
const Login = r => require.ensure([], () => r(require('@/page/home/login.vue')), 'group-foo')

const ShopList = r => require.ensure([], () => r(require('@/page/mall/shop/ShopList.vue')), 'group-mall')
const InquiryList = r => require.ensure([], () => r(require('@/page/mall/shop/InquiryList.vue')), 'group-mall')
const ConfirmOrder = r => require.ensure([], () => r(require('@/page/mall/shop/ConfirmOrder.vue')), 'group-mall')
const ReceivingAdress = r => require.ensure([], () => r(require('@/page/mall/shop/ReceivingAdress.vue')), 'group-mall')
const Invoice = r => require.ensure([], () => r(require('@/page/mall/shop/Invoice.vue')), 'group-mall')
const SpecialInvoice = r => require.ensure([], () => r(require('@/page/mall/shop/SpecialInvoice.vue')), 'group-mall')
const ManageAddress = r => require.ensure([], () => r(require('@/page/mall/shop/ManageAddress.vue')), 'group-mall')

const MallUser = r => require.ensure([], () => r(require('@/page/mall/user/User.vue')), 'mall-user')
const MallSetting = r => require.ensure([], () => r(require('@/page/mall/user/Setting.vue')), 'mall-user')
const MallAddress = r => require.ensure([], () => r(require('@/page/mall/user/Address.vue')), 'mall-user')
const MallPassword = r => require.ensure([], () => r(require('@/page/mall/user/Password.vue')), 'mall-user')
const MallUserInfo = r => require.ensure([], () => r(require('@/page/mall/user/Info.vue')), 'mall-user')
const Permission= r => require.ensure([], () => r(require('@/page/user/permission.vue')), 'mall-user')
const MallAddressList = r => require.ensure([], () => r(require('@/page/mall/user/AddressList.vue')), 'mall-user')
const MallCollection = r => require.ensure([], () => r(require('@/page/mall/user/Collection.vue')), 'mall-user')
const MyOrder = r => require.ensure([], () => r(require('@/page/mall/user/MyOrder.vue')), 'mall-user')
const MyInquiryOrder = r => require.ensure([], () => r(require('@/page/mall/user/MyInquiryOrder.vue')), 'mall-user')
const MyCoupon = r => require.ensure([], () => r(require('@/page/mall/user/MyCoupon.vue')), 'mall-user')
const SlideDelTest = r => require.ensure([], () => r(require('@/page/mall/user/SlideDelTest.vue')), 'mall-user')
const OrderDetails = r => require.ensure([], () => r(require('@/page/mall/user/OrderDetails.vue')), 'mall-user')
const InquiryOrderDetails = r => require.ensure([], () => r(require('@/page/mall/user/InquiryOrderDetails.vue')), 'mall-user')
const RecentHistory = r => require.ensure([], () => r(require('@/page/mall/user/RecentHistory.vue')), 'mall-user')
const GoodsComment = r => require.ensure([], () => r(require('@/page/mall/user/GoodsComment.vue')), 'mall-user')
const ReturnList = r => require.ensure([], () => r(require('@/page/mall/user/ReturnList.vue')), 'mall-user')
const RefundList = r => require.ensure([], () => r(require('@/page/mall/user/RefundList.vue')), 'mall-user')


const StoreSearch = r => require.ensure([], () => r(require('@/page/mall/store/StoreSearch.vue')), 'mall-store')
const StoreHome = r => require.ensure([], () => r(require('@/page/mall/store/StoreHome.vue')), 'mall-store')
const StoreClass = r => require.ensure([], () => r(require('@/page/mall/store/StoreClass.vue')), 'mall-store')
const StoreInfo = r => require.ensure([], () => r(require('@/page/mall/store/StoreInfo.vue')), 'mall-store')

const Affairs = r => require.ensure([], () => r(require('@/page/work/affairs.vue')), 'group-work')
const Option= r => require.ensure([], () => r(require('@/page/work/option.vue')), 'group-work')
const Opinion = r => require.ensure([], () => r(require('@/page/work/opinion.vue')), 'group-work')
const Market = r => require.ensure([], () => r(require('@/page/home/market.vue')), 'group-foo')
const Interview = r => require.ensure([], () => r(require('@/page/home/interview.vue')), 'group-foo')
const Expert = r => require.ensure([], () => r(require('@/page/home/expert.vue')), 'group-foo')
const SpecialistAgencies = r => require.ensure([], () => r(require('@/page/home/specialistagencies.vue')), 'group-foo')
const GroupAgreement = r => require.ensure([], () => r(require('@/page/user/groupAgreement.vue')), 'group-foo')
const ExpertList = r => require.ensure([], () => r(require('@/page/home/expertList.vue')), 'group-foo')
const AgenciesList = r => require.ensure([], () => r(require('@/page/home/agenciesList.vue')), 'group-foo')
const HomeSearch = r => require.ensure([], () => r(require('@/page/home/homeSearch.vue')), 'group-foo')
const MyCollection = r => require.ensure([], () => r(require('@/page/user/myCollection.vue')), 'group-foo')
const DeliverExplain = r => require.ensure([], () => r(require('@/page/work/oa/deliverExplain.vue')), 'group-work')
const FinishAffairs = r => require.ensure([], () => r(require('@/page/work/oa/finishAffairs.vue')), 'group-work')
const UnFinishAffairs = r => require.ensure([], () => r(require('@/page/work/oa/unfinishAffairs.vue')), 'group-work')
const MyApply = r => require.ensure([], () => r(require('@/page/work/oa/myApply.vue')), 'group-work')
const Drafts = r => require.ensure([], () => r(require('@/page/work/oa/drafts.vue')), 'group-work')
const Imchoices = r => require.ensure([], () => r(require('@/page/work/oa/imchoices.vue')), 'group-work')
const AddressList = r => require.ensure([], () => r(require('@/page/work/addressList.vue')), 'group-work')
const Contract = r => require.ensure([], () => r(require('@/page/work/oa/contract.vue')), 'group-work')
const ContractDetails = r => require.ensure([], () => r(require('@/page/work/oa/contractDetails.vue')), 'group-work')
const goOutWork = r => require.ensure([], () => r(require('@/page/work/oa/goOutWork.vue')), 'group-work')
const goOutWorkDetails = r => require.ensure([], () => r(require('@/page/work/oa/goOutWorkDetails.vue')), 'group-work')
const ApproveBack = r => require.ensure([], () => r(require('@/page/work/oa/approveBack.vue')), 'group-work')
const AddressMap = r =>  require.ensure([], () => r(require('@/page/work/addressMap.vue')), 'group-work')
const WorkReport = r =>  require.ensure([], () => r(require('@/page/work/workReport.vue')), 'group-work')
const Trip = r =>  require.ensure([], () => r(require('@/page/work/oa/trip.vue')), 'group-work')
const TripDetails = r =>  require.ensure([], () => r(require('@/page/work/oa/tripDetails.vue')), 'group-work')
const SearchMore = r =>  require.ensure([], () => r(require('@/page/home/searchMore.vue')), 'group-foo')
const Pay = r =>  require.ensure([], () => r(require('@/page/work/pay/pay.vue')), 'group-work')
const WaitPay = r =>  require.ensure([], () => r(require('@/page/work/pay/waitPay.vue')), 'group-work')
const PayRecord = r =>  require.ensure([], () => r(require('@/page/work/pay/payRecord.vue')), 'group-work')
const PayDetails = r =>  require.ensure([], () => r(require('@/page/work/pay/payDetails.vue')), 'group-work')
const PayParticulars = r =>  require.ensure([], () => r(require('@/page/work/pay/payParticulars.vue')), 'group-work')
const ImmediatePay = r =>  require.ensure([], () => r(require('@/page/work/pay/immediatePay.vue')), 'group-work')
const Stamp = r => require.ensure([], () => r(require('@/page/work/oa/stamp.vue')), 'group-work')
const StampDetails = r => require.ensure([], () => r(require('@/page/work/oa/stampDetails.vue')), 'group-work')
const Reimburse = r => require.ensure([], () => r(require('@/page/work/oa/reimburse.vue')), 'group-work')
const ReimburseDetails = r => require.ensure([], () => r(require('@/page/work/oa/reimburseDetails.vue')), 'group-work')
const ReimburseType = r => require.ensure([], () => r(require('@/page/work/oa/reimburseType.vue')), 'group-work')
const PayApply = r => require.ensure([], () => r(require('@/page/work/oa/payApply.vue')), 'group-work')
const PayApplyDetails = r => require.ensure([], () => r(require('@/page/work/oa/payApplyDetails.vue')), 'group-work')
const Dimission = r => require.ensure([], () => r(require('@/page/work/oa/dimission.vue')), 'group-work')
const DimissionDetails = r => require.ensure([], () => r(require('@/page/work/oa/dimissionDetails.vue')), 'group-work')
const Borrow = r => require.ensure([], () => r(require('@/page/work/oa/borrow.vue')), 'group-work')
const BorrowDetails = r => require.ensure([], () => r(require('@/page/work/oa/borrowDetails.vue')), 'group-work')
const Reception = r => require.ensure([], () => r(require('@/page/work/oa/reception.vue')), 'group-work')
const ReceptionDetails = r => require.ensure([], () => r(require('@/page/work/oa/receptionDetails.vue')), 'group-work')
const Absence = r => require.ensure([], () => r(require('@/page/work/oa/absence.vue')), 'group-work')
const AbsenceDetails = r => require.ensure([], () => r(require('@/page/work/oa/absenceDetails.vue')), 'group-work')
const OaSearch = r => require.ensure([], () => r(require('@/page/work/oa/oaSearch.vue')), 'group-work')
const CompanyWall = r => require.ensure([], () => r(require('@/page/work/companyWall.vue')), 'group-work')
const CompanyWallList = r => require.ensure([], () => r(require('@/page/work/companyWallList.vue')), 'group-work')
const Car = r => require.ensure([], () => r(require('@/page/work/oa/car.vue')), 'group-work')
const Employee = r => require.ensure([], () => r(require('@/page/work/oa/employee.vue')), 'group-work')
const EmployeeDetails = r => require.ensure([], () => r(require('@/page/work/oa/employeeDetails.vue')), 'group-work')
const CarDetails = r => require.ensure([], () => r(require('@/page/work/oa/carDetails.vue')), 'group-work')
const ArticleDetails = r => require.ensure([], () => r(require('@/page/work/articleDetails.vue')), 'group-work')
const Agenda = r => require.ensure([], () => r(require('@/page/work/schedule/agenda.vue')), 'group-work')




export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/home'
    }, {
      path: '/home',
      component: Home //首页
    }, {
      path: '/work',
      component: Work, //工作台
    }, {
      path: '/find',
      component: Find  //发现
    }, {
      path: '/user',
      component: User  //用户中心
    }, {
      path: '/record',
      component: Record  //考勤记录
    }, {
      path: '/total',
      component: Total  //考勤统计
    }, {
      path: '/exhibition',
      component: Exhibition  //展会
    },
    {
      path: '/supply',
      component: Supply  //供需
    },
    {
      path: '/dissertation',
      component: Dissertation  //优管专题
    },
    {
      path: '/tender',
      component: Tender  //优投标
    },
    {
      path: '/newsdetail',
      component: Newsdetail  //详情
    },
    {
      path: '/nologin',
      component: Nologin  //未登录页面
    },
    {
      path: '/agreement',  //隐私保护政策
      component: Agreement
    },
    {
      path: '/registertext',  //用户协议
      component: Registertext
    },
    {
      path: '/footprint',
      component: Footprint  //足迹
    },
    {
      path: '/checkmap',
      component: Checkmap //足迹详情
    },
    {
      path: '/help',
      component: Help //帮助
    },
    {
      path: '/journal',
      component: Journal  //日志列表
    },
    {
      path: '/imchoice',
      component: Imchoice  //选择联系人
    },
    {
      path: '/imchoices',
      component: Imchoices  //选择联系人2
    },
    {
      path: '/daynews',
      component: Daynews,  //日报
      meta: {keepAlive: true}
    },
    {
      path: '/weeknews',
      component: Weeknews, //周报
      meta: {keepAlive: true}
    },
    {
      path: '/monthnews',
      component: Monthnews,  //月报
      meta: {keepAlive: true}
    },
    {
      path: '/journaldetail',  //日志详情
      component: Journaldetail
    },
    {
      path: '/application',  //申请加入组织
      component: Application
    },
    {
      path: '/create',  //创建组织
      component: Create
    },
    {
      path: '/edit',  //编辑模板页面
      component: Edit
    },
    {
      path: '/search',  //搜索组织
      component: Search,
    },
    {
      path: '/pending',  //等待审核
      component: Pending,
    },
    {
      path: '/department',  //选择部门
      component: Department,
    },
    {
      path: '/outputlive',  //产出看板
      component: OutputLive,
    },
    {
      path: '/outputcount',  //产出统计
    },
    {
      path: '/outputdaily',  //产出看板
      component: OutputDaily,
    },
    {
      path: '/earlylist',  //早到榜
      component: EarlyList,
    },
    {
      path: '/notclocking',  //未打卡
      component: NotClocking,
    },
    {
      path: '/latelist',  //迟到榜
      component: LateList,
    },
    {
      path: '/leavelist',  //早退榜
      component: LeaveList,
    },
    {
      path: '/overtimelist',  //加班榜
      component: OvertimeList,
    },
    {
      path: '/dailyreport',  //企业日报
      component: DailyReport,
    },
    {
      path: '/materieldaily',  //消耗日报
      component: MaterielDaily,
    },
    {
      path: '/materielcount',  //消耗统计
      component: MaterielCount,
    },
    {
      path: '/qualitydaily',  //良率日报
      component: QualityDaily,
    },
    {
      path: '/qualitycount',  //良率统计
      component: QualityCount,
    },
    {
      path: '/power',  //电耗分析
      component: Power,
    },
    {
      path: '/water',  //水耗分析
      component: Water,
    },
    {
      path: '/oee',  //OEE分析
      component: OEE,
    },
    {
      path: '/warning',  //预警报警
      component: Warning,
    },
    {
      path: '/devicedetails',  //设备详情列表
      component: DeviceDetails,
    },
    {
      path: '/detailsinfo',  //设备详情信息
      component: DetailsInfo,
    },
    {
      path: '/runhistory',  //设备运行历史
      component: RunHistory,
      meta: {keepAlive: true}
    },
    {
      path: '/machinelist',  //设备列表
      component: MachineList,
    },
    {
      path: '/detailslist',  //详情列表
      component: DetailsList,
    },
    {
      path: '/energymonitoring',  //能源监控
      component: EnergyMonitoring,
    },
    {
      path: '/trendmonitoring',  //趋势监控
      component: TrendMonitoring,
    },
    //下面为商城部分
    {
      path: '/accountlogin',  //账号密码登录
      component: AccountLogin,
    },
    {
      path: '/verificationlogin',  //动态密码登录
      component: VerificationLogin,
    },
    {
      path: '/forgetpassword',  //忘记密码
      component: ForgetPassword,
    },
    {
      path: '/register',  //注册
      component: Register,
    },
    {
      path: '/mallagreement',  //注册协议
      component: MallAgreement,
    },{
      path: '/permission',  
      component: Permission,
    },
    {
      path: '/mallhome',  //商城首页
      component: MallHome,
    },
	  {
	  	path: '/plasticlist', //塑料汇
		  component: PlasticList,
	  },
	  {
		  path: '/conduitlist', //管道城
		  component: ConduitList,
	  },
	  {
		  path: '/hardwarelist', //智能硬件
		  component: HardwareList,
	  },
	  {
		  path: '/supplydemandlist',  //供需列表
		  component: SupplyDemandList,
	  },
	  {
		  path: '/supplydemanddetail',  //供需详情
		  component: SupplyDemandDetail,
	  },
    {
      path: '/goodsclassification',  //分类
      component: GoodsClassification,
    },
    {
      path: '/classsearch',  //分类搜索
      component: ClassSearch,
    },
    {
      path: '/goodsdetail',  //商品详情
      component: GoodsDetail,
    },
	  {
		  path: '/HWphone',  //华为专场
		  component: HWphone,
	  },
    {
      path: '/testdetail',  //商品详情测试
      component: TestDetail,
    },
    {
      path: '/mallsearch',  //商城搜索
      component: MallSearch,
    },
    {
		  path: '/shoplist',  //购物车列表
		  component: ShopList,
	  },
	  {
		  path: '/inquirylist',  //2b询价单列表
		  component: InquiryList,
	  },
    {
      path: '/malluser',  //商城个人中心
      component: MallUser,
    },
    {
      path: '/mallsetting',  //商城设置
      component: MallSetting,
    },
    {
      path: '/malladdress',  //商城收货地址设置
      component: MallAddress,
    },
    {
      path: '/mallpassword',  //商城修改密码
      component: MallPassword,
    },
    {
      path: '/malluserinfo',  //商城个人信息
      component: MallUserInfo,
    },
    {
      path: '/malladdresslist',  //商城地址列表
      component: MallAddressList,
    },
    {
      path: '/mallcollection',  //商城商品收藏
      component: MallCollection,
    },
    {
      path: '/confirmorder',  //确认订单
      component: ConfirmOrder,
    },
    {
      path: '/receivingadress',  //收货地址
      component: ReceivingAdress,
    },
    {
      path: '/invoice',  //发票
      component: Invoice,
    },
    {
      path: '/specialinvoice',  //专用发票
      component: SpecialInvoice,
    },
    {
      path: '/myorder',  //我的订单
      component: MyOrder,
    },
	  {
		  path: '/myinquiryorder',  //我的询价单
		  component: MyInquiryOrder,
	  },
	  {
		  path: '/mycoupon',  //我的优惠券
		  component: MyCoupon,
	  },
	  {
		  path: '/slidedeltest',  //优惠券删除测试
		  component: SlideDelTest,
	  },
    {
      path: '/manageaddress',  //专用发票
      component: ManageAddress,
    },
    {
      path: '/orderdetails',  //订单详情
      component: OrderDetails,
    },
	  {
		  path: '/inquiryorderdetails',  //询价单详情
		  component: InquiryOrderDetails,
	  },
    {
      path: '/recenthistory',  //最近浏览
      component: RecentHistory,
    },
    {
      path: '/goodscomment',  //商品评价
      component: GoodsComment,
    },
    {
      path: '/returnlist',  //退货单列表
      component: ReturnList,
    },
    {
      path: '/refundlist',  //退款单列表
      component: RefundList,
    },
	  {
	  	path: '/storesearch', //商城分类搜索
		  component: StoreSearch
	  },
	  {
		  path: '/storehome', //商城店铺首页
		  component: StoreHome
	  },
	  {
		  path: '/storeclass', //商城店铺分类
		  component: StoreClass
	  },
	  {
		  path: '/storeinfo', //商城店铺介绍
		  component: StoreInfo
	  },
    {
      path: '/affairs',  //OA事宜
      component: Affairs
    },
    {
      path: '/opinion',  //拒绝理由
      component: Opinion
    },
    {
      path: '/option',  //请假类型
      component: Option
    },
    {
      path: '/market',  //行情
      component: Market
    },
    {
      path: '/expert',  //专家库
      component: Expert
    },
    {
      path: '/interview',  //访谈
      component: Interview
    },
    {
      path: '/specialistAgencies',  //专业机构
      component: SpecialistAgencies
    },
    {
      path:'/groupAgreement',   //群服务协议
      component : GroupAgreement
    },
    {
      path:'/expertList',   //专家列表
      component : ExpertList
    },
    {
      path:'/agenciesList',   //机构列表
      component : AgenciesList
    },
    {
      path:'/homeSearch',  //首页搜索
      component : HomeSearch
    },
    {
      path:'/myCollection', //我的收藏
      component : MyCollection
    },
    {
      path:'/deliverExplain',//转交备注
      component : DeliverExplain
    },
    {
      path:'/finishAffair',//已办事宜
      component : FinishAffairs
    },
    {
      path:'/unfinishAffair',//待办事宜
      component : UnFinishAffairs
    },
    {
      path:'/myApply',//我的申请
      component : MyApply
    },
    {
      path:'/drafts',//草稿箱
      component : Drafts
    },
    {
      path:'/addressList',//新通讯录
      component : AddressList
    },
    {
      path:'/contract', //合同申请
      component : Contract,
      meta: {keepAlive: true}
    },
    {
      path:'/contractDetails', //合同详情
      component : ContractDetails,
      meta: {keepAlive: true}
    },
    {
      path:'/goOutWork', //公出工作
      component : goOutWork,
      meta: {keepAlive: true}
    },
    {
      path:'/goOutWorkDetails', //公出详情
      component : goOutWorkDetails,
      meta: {keepAlive: true}
    },
    {
      path:'/approveBack', //退回
      component : ApproveBack
    },
    {
      path:'/addressMap', //公出地点地图
      component : AddressMap
    },
    {
      path:'/workReport', //工作汇报
      component: WorkReport
    },
    {
      path:'/trip', //出差
      component:Trip,
      meta: {keepAlive: true}
    },
    {
      path:'/tripDetails', //出差详情
      component:TripDetails,
      meta: {keepAlive: true}
    },
    {
      path:'/stamp', //用印
      component:Stamp,
      meta: {keepAlive: true}
    },
    {
      path:'/stampDetails', //用印详情
      component:StampDetails,
      meta: {keepAlive: true}
    },
    {
      path:'/reimburse', //报销
      component:Reimburse,
      meta: {keepAlive: true}
    },
    {
	    path:'/reimburseDetails', //报销详情
      component:ReimburseDetails,
      meta: {keepAlive: true}
    },
    {
      path:'/payApply', //付款
      component:PayApply,
      meta: {keepAlive: true}
    },
    {
      path:'/borrow', //借款
      component:Borrow,
      meta: {keepAlive: true}
    },
    {
      path:'/borrowDetails', //借款详情
      component:BorrowDetails,
      meta: {keepAlive: true}
    },
    {
      path:'/reception', //接待
      component:Reception,
      meta: {keepAlive: true}
    },{
      path:'/receptionDetails', //接待详情
      component:ReceptionDetails,
      meta: {keepAlive: true}
    },
    {
      path:'/absence', //补卡
      component:Absence,
      meta: {keepAlive: true}
    },
    {
      path:'/absenceDetails', //补卡详情
      component:AbsenceDetails,
      meta: {keepAlive: true}
    },
    {
      path:'/payApplyDetails', //付款详情
      component:PayApplyDetails,
      meta: {keepAlive: true}
    },
    {
      path:'/dimission', //离职
      component:Dimission,
      meta: {keepAlive: true}
    },
    {
      path:'/dimissionDetails', //离职详情
      component:DimissionDetails,
      meta: {keepAlive: true}
    },
    {
      path:'/reimburseType', //报销详情
      component:ReimburseType,
    },
    {
      path:'/oaSearch', //报销详情
      component:OaSearch,
    },
    {
      path:'/searchMore', //搜索更多加载
      component:SearchMore,
    },
    {
      path:'/pay', //待缴费
      component:Pay,
    },
    {
      path:'/payRecord', //缴费记录
      component:PayRecord,
    },
    {
      path:'/payDetails', //缴费明细
      component:PayDetails
    },{
      path:'/immediatePay', //立即支付
      component:ImmediatePay
    },{
      path:'/payParticulars', //缴费详情
      component:PayParticulars
    },{
      path:'/waitPay', //待付款
      component:WaitPay,
    }
    // {
    //   path:'/neatenWork',
    //   component:NeatenWork
    // },
    ,{
      path:'/addWork',
      component:AddWork
    },{
      path:'/companyWall',
      component:CompanyWall
    },{
      path:'/companyWallList',
      component:CompanyWallList
    },{
      path:'/car',//用车
      component:Car,
		  meta: {keepAlive: true}
    },{
      path:'/employee',//用人
      component:Employee,
      meta: {keepAlive: true}
    },{
      path:'/employeeDetails',
      component:EmployeeDetails,
      meta: {keepAlive: true}
    },{
      path:'/carDetails',//用车详情
		  component:CarDetails,
		  meta: {keepAlive: true}
	  },{
      path:'/articleDetails',
      component:ArticleDetails
    },{
      path:'/login',
      component:Login
    },{
      path:'/agenda',
      component:Agenda,
    },
    ...routeData
  ],
})

