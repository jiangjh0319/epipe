

/* ======== OA =============*/
const Copy = r => require.ensure([], () => r(require('@/page/work/oa/copy.vue')), 'group-foo')


const Leave = r => require.ensure([], () => r(require('@/page/work/leave.vue')), 'group-work')
const LeaveDetails = r => require.ensure([], () => r(require('@/page/work/leaveDetails.vue')), 'group-work')
const LetterOfRequest = r => require.ensure([], () => r(require('@/page/work/letterOfRequest.vue')), 'group-work')
const LeOfReDetails = r => require.ensure([], () => r(require('@/page/work/leOfReDetails.vue')), 'group-work')
const Project = r => require.ensure([], () => r(require('@/page/work/oa/project.vue')), 'group-foo')
const ProjectDetails = r => require.ensure([], () => r(require('@/page/work/oa/projectDetails.vue')), 'group-foo')
const Regular = r => require.ensure([], () => r(require('@/page/work/oa/regular.vue')), 'group-foo')
const RegularDetails = r => require.ensure([], () => r(require('@/page/work/oa/regularDetails.vue')), 'group-foo')
const Meal = r => require.ensure([], () => r(require('@/page/work/oa/meal.vue')), 'group-foo')
const MealDetails = r => require.ensure([], () => r(require('@/page/work/oa/MealDetails.vue')), 'group-foo')
const Document = r => require.ensure([], () => r(require('@/page/work/oa/document.vue')), 'group-foo')
const DocumentDetails = r => require.ensure([], () => r(require('@/page/work/oa/documentDetails.vue')), 'group-foo')
const Overtime = r => require.ensure([], () => r(require('@/page/work/oa/overtime.vue')), 'group-foo')
const OvertimeDetails = r => require.ensure([], () => r(require('@/page/work/oa/overtimeDetails.vue')), 'group-foo')

const Position = r => require.ensure([], () => r(require('@/page/work/oa/position.vue')), 'group-foo')
const PositionDetails = r => require.ensure([], () => r(require('@/page/work/oa/positionDetails.vue')), 'group-foo')

const Buy = r => require.ensure([], () => r(require('@/page/work/oa/buy.vue')), 'group-foo')
const BuyDetails = r => require.ensure([], () => r(require('@/page/work/oa/buyDetails.vue')), 'group-foo')

const Material = r => require.ensure([], () => r(require('@/page/work/oa/material.vue')), 'group-foo')
const MaterialDetails = r => require.ensure([], () => r(require('@/page/work/oa/materialDetails.vue')), 'group-foo')
const MoreEmployee = r => require.ensure([], () => r(require('@/page/work/oa/more_employee.vue')), 'group-foo')
const Menu = r => require.ensure([], () => r(require('@/page/work/oa/menu.vue')), 'group-foo')


const ErpPermission = r => require.ensure([], () => r(require('@/page/work/oa/erpPermission.vue')), 'group-foo')
const ErpPermissionDetails = r => require.ensure([], () => r(require('@/page/work/oa/erpPermissionDetails.vue')), 'group-foo')

// const Position = r => require.ensure([], () => r(require('@/page/work/oa/position.vue')), 'group-foo')
// const PositionDetails = r => require.ensure([], () => r(require('@/page/work/oa/positionDetails.vue')), 'group-foo')


export default [
    {
        path: '/leave',  //请假
        component: Leave,
        meta: {keepAlive: true}
    },
    {
        path: '/leaveDetails',  //请假详情
        component: LeaveDetails,
        meta: {keepAlive: true}
    },
    {
      path:'/letterOfRequest', //请示函
      component : LetterOfRequest,
      meta: {keepAlive: true}
    },
    {
      path:'/leOfReDetails', //请示函详情
      component : LeOfReDetails,
      meta: {keepAlive: true}
    },
    {
        path:'/copy',
        component:Copy,
    },
    {
        path:'/project',//项目立项申请
        component:Project,
		meta: {keepAlive: true}
    },{
        path:'/projectDetails', //项目立项
        component:ProjectDetails,
		meta: {keepAlive: true}
    },{
        path:'/regular',//员工转正申请
        component:Regular,
		meta: {keepAlive: true}
    },{
        path:'/regularDetails', //员工转正
        component:RegularDetails,
		meta: {keepAlive: true}
    },
    {
        path:'/meal',//就餐申请
        component:Meal,
		meta: {keepAlive: true}
    },{
        path:'/mealDetails', //就餐申请详情
        component:MealDetails,
		meta: {keepAlive: true}
    },
    {
        path:'/document',//行文呈批
        component:Document,
		meta: {keepAlive: true}
    },{
        path:'/documentDetails', //行文呈批详情
        component:DocumentDetails,
		meta: {keepAlive: true}
    },
    {
        path:'/overtime', //加班
        component:Overtime,
		meta: {keepAlive: true}
    },
    {
        path:'/overtimeDetails', //加班详情
        component:OvertimeDetails,
		meta: {keepAlive: true}
    },
    {
        path:'/position', //调岗
        component:Position,
		meta: {keepAlive: true}
    },
    {
        path:'/positionDetails', //调岗详情
        component:PositionDetails,
		meta: {keepAlive: true}
    },
    {
        path:'/buy', //采购
        component:Buy,
		meta: {keepAlive: true}
    },
    {
        path:'/buyDetails', //采购详情
        component:BuyDetails,
		meta: {keepAlive: true}
    },
    {
        path:'/material', //采购
        component:Material,
		meta: {keepAlive: true}
    },
    {
        path:'/materialDetails', //采购详情
        component:MaterialDetails,
		meta: {keepAlive: true}
    },
    {
        path:'/erpPermission', //
        component:ErpPermission,
		meta: {keepAlive: true}
    },
    {
        path:'/erpPermissionDetails', //
        component:ErpPermissionDetails,
		meta: {keepAlive: true}
    },
    {
        path:'/more_employee', //更多应聘条件
        component:MoreEmployee,
    },
    {
        path:'/menu', //菜单
        component:Menu,
    },
]