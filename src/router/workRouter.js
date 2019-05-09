
const NeatenWork = r => require.ensure([], () => r(require('@/page/work/neatenWork.vue')), 'group-foo')



/* ======== 日程安排 =============*/
const Meeting = r => require.ensure([], () => r(require('@/page/work/schedule/meeting.vue')), 'group-foo')
const Memo = r => require.ensure([], () => r(require('@/page/work/schedule/memo.vue')), 'group-foo')
const Plan = r => require.ensure([], () => r(require('@/page/work/schedule/plan.vue')), 'group-foo')
const MeetingDetails = r => require.ensure([], () => r(require('@/page/work/schedule/meetingDetails.vue')), 'group-foo')
const MemoDetails = r => require.ensure([], () => r(require('@/page/work/schedule/memoDetails.vue')), 'group-foo')
const PlanDetails = r => require.ensure([], () => r(require('@/page/work/schedule/planDetails.vue')), 'group-foo')



export default [
    {
        path:'/neatenWork',
        component:NeatenWork
    },{
        path:'/meeting', //会议
        component:Meeting,
		meta: {keepAlive: true}

    },{
        path:'/meetingDetails', //会议详情
        component:MeetingDetails,
    },{
        path:'/memo', //备忘录
        component:Memo,
    },{
        path:'/memoDetails', //备忘录详情
        component:MemoDetails
    },{
        path:'/plan', //日程计划
        component:Plan,
		meta: {keepAlive: true}
    },
    {
        path:'/planDetails', //日程详情
        component:PlanDetails,
    },
    
    
]