
<template>
    <div class="affairs_box">
        <div class='header myaffairs_head' v-bind:style="{ background: bg_color}" >
            <div class="back" @click="goback()">
            <svg class="icon icon-back" aria-hidden="false">
                <use xlink:href="#icon-zuoyoujiantou"></use>
            </svg>
            </div>
            草稿箱
            <div v-if="draftsData.length" class="redact" @click="redact">编辑</div>
        </div>

        <div class="affairs_content">
            <div v-for="item in draftsData" :key="item.applyId">
             <div v-if="item.typecode == 1" @click="go_Apply(item,'leave')"  :key="index"  class="affairs_item myaffairs_shadow">
                    <div class="item_infor">
                        <div class="select" v-if="redactState">
                             <svg v-if="item.isDel" class="icon" style="font-size:0.16rem;color:#f80" aria-hidden="false">
                                <use xlink:href="#icon-xuanzhong2"></use>
                            </svg>
                            <svg v-else  class="icon" style="font-size:0.16rem;" aria-hidden="false">
                                <use xlink:href="#icon-meiyouxuanzhong"></use>
                            </svg>
                        </div>
                        <div class="affirs_child">
                            <div class="affairs_title">
                                <img :src="item.profileImg" @click="go_user(item.userId)"/>
                                <h2 >我的请假审批</h2>
                                <time >{{item.applyTime | timeFormat}}</time>
                            </div>
                            <div class="affairs_infor">
                                <p>请假类型:<span style="color:#609ef6" v-text='item.leaveType'></span></p>
                                <p>开始时间:<span>{{item.beginTime | slice}}</span></p>
                                <p>结束时间:<span>{{item.endTime | slice}}</span></p>
                            </div>
                        </div>
                    </div>

                    <div class="skip" tag="div">
                        查看详情
                    </div>
            </div>

            <div v-if="item.typecode == 'MY_'" @click="go_Apply(item,'all_oa')" :key="index"  class="affairs_item myaffairs_shadow">
                <div class="item_infor">
                    <div class="select" v-if="redactState">
                             <svg v-if="item.isDel" class="icon" style="font-size:0.16rem;color:#f80" aria-hidden="false">
                                <use xlink:href="#icon-xuanzhong2"></use>
                            </svg>
                            <svg v-else  class="icon" style="font-size:0.16rem;" aria-hidden="false">
                                <use xlink:href="#icon-meiyouxuanzhong"></use>
                            </svg>
                    </div>
                    <div class="affirs_child">
                        <div class="affairs_title">
                            <img :src="item.profileImg" @click="go_user(item.userId)"/>
                            <h2 >我的{{item.applyName}}</h2>
                            <time >{{item.applyTime | timeFormat}}</time>
                        </div>
                        <div class="affairs_infor">
                            <div class="request_infor lineHeight">
                                <span>提交人  :</span>
                                <p class="line1">{{item.userName}}</p>
                            </div>
                            <div class="request_infor lineHeight">
                                <span>部门&emsp; :</span>
                                <p class="line1">{{item.officeName}}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div  class="skip" tag="div">
                    查看详情
                </div>
            </div>

            <div v-if="item.typecode == 2" @click="go_Apply(item,'letterOfRequest')" :key="index"  class="affairs_item myaffairs_shadow">
                <div class="item_infor">
                    <div class="select" v-if="redactState">
                             <svg v-if="item.isDel" class="icon" style="font-size:0.16rem;color:#f80" aria-hidden="false">
                                <use xlink:href="#icon-xuanzhong2"></use>
                            </svg>
                            <svg v-else  class="icon" style="font-size:0.16rem;" aria-hidden="false">
                                <use xlink:href="#icon-meiyouxuanzhong"></use>
                            </svg>
                    </div>
                    <div class="affirs_child">
                        <div class="affairs_title">
                            <img :src="item.profileImg" @click="go_user(item.userId)"/>
                            <h2 >我的请示函</h2>
                            <time >{{item.applyTime | timeFormat}}</time>
                        </div>
                        <div class="affairs_infor">
                            <div class="request_infor lineHeight">
                                <span>主&emsp;&emsp;题 :</span>
                                <p class="line1">{{item.theme}}</p>
                            </div>
                             <div class="request_infor lineHeight">
                                <span>请示类别 :</span>
                                <p class="line1">{{item.letterTypeName}}</p>
                            </div>
                            <div class="request_infor margin10">
                                <span >请示内容 :</span>
                                <p class="line2" style="line-height:0.2rem;" v-html="item.content"></p>
                            </div>
                        </div>
                    </div>
                </div>

                <div  class="skip" tag="div">
                    查看详情
                </div>
            </div>

            <div v-if="item.typecode == 3"  @click="go_Apply(item,'contract')" :key="index"  class="affairs_item myaffairs_shadow">
                <div class="item_infor">
                    <div class="select" v-if="redactState">
                             <svg v-if="item.isDel" class="icon" style="font-size:0.16rem;color:#f80" aria-hidden="false">
                                <use xlink:href="#icon-xuanzhong2"></use>
                            </svg>
                            <svg v-else  class="icon" style="font-size:0.16rem;" aria-hidden="false">
                                <use xlink:href="#icon-meiyouxuanzhong"></use>
                            </svg>
                    </div>
                    <div class="affirs_child">
                        <div class="affairs_title">
                            <img :src="item.profileImg" @click="go_user(item.userId)"/>
                            <h2 >我的合同审批</h2>
                            <time >{{item.applyTime | timeFormat}}</time>
                        </div>
                        <div class="affairs_infor">
                        <div class="request_infor lineHeight">
                            <span>合同名称 :</span> 
                            <p class="line1">{{item.theme}}</p>
                        </div>
                            <div class="request_infor margin10">
                                <span>项目责任人 :</span>
                                <p class="line2" style="line-height:0.2rem;">{{item.title}}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="skip" tag="div">
                    查看详情
                </div>
            </div>

             <div v-if="item.typecode == 4" @click="go_Apply(item,'goOutWork')"  class="affairs_item myaffairs_shadow" >
                 <div class="item_infor">
                    <div class="select" v-if="redactState">
                             <svg v-if="item.isDel" class="icon" style="font-size:0.16rem;color:#f80" aria-hidden="false">
                                <use xlink:href="#icon-xuanzhong2"></use>
                            </svg>
                            <svg v-else  class="icon" style="font-size:0.16rem;" aria-hidden="false">
                                <use xlink:href="#icon-meiyouxuanzhong"></use>
                            </svg>
                    </div>
                    <div class="affirs_child">
                        <div>
                            <div class="affairs_title">
                                <img :src="item.profileImg"/>
                                <h2>{{item.title}}的公出审批</h2>
                                <time >{{item.applyTime | timeFormat}}</time>
                            </div>
                            <div class="affairs_infor">
                            <div class="request_infor lineHeight">
                                    <span >公出事由 :</span>
                                    <p class="line1" v-html="item.outsideReason"></p>
                                </div>
                                <div class="request_infor lineHeight">
                                    <span >公出类型 :</span>
                                    <p class="line1"> {{item.outsideType}}</p>
                                </div>
                                <div class="request_infor lineHeight">
                                    <span >公出地点 :</span>
                                    <p class="line1"> {{item.outsideAddress}}</p>
                                </div>
                                <div class="request_infor lineHeight">
                                    <span >开始时间 :</span>
                                    <p class="line1"> {{item.beginTime}}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                 </div>

                <div  class="skip" tag="div">
                    查看详情
                </div>
             </div>
             <div v-if="item.typecode == 5" @click="go_Apply(item,'trip')"   class="affairs_item myaffairs_shadow" >
                <div class="item_infor">
                    <div class="select" v-if="redactState">
                             <svg v-if="item.isDel" class="icon" style="font-size:0.16rem;color:#f80" aria-hidden="false">
                                <use xlink:href="#icon-xuanzhong2"></use>
                            </svg>
                            <svg v-else  class="icon" style="font-size:0.16rem;" aria-hidden="false">
                                <use xlink:href="#icon-meiyouxuanzhong"></use>
                            </svg>
                    </div>
                    <div class="affirs_child">
                        <div>
                            <div class="affairs_title">
                                <img :src="item.profileImg"/>
                                <h2>{{item.title}}的出差审批</h2>
                                <time >{{item.applyTime | timeFormat}}</time>
                            </div>
                            <div class="affairs_infor">
                                <div class="request_infor lineHeight">
                                    <span >标&emsp;&emsp;题 :</span>
                                    <p class="line1"> {{item.theme}}</p>
                                </div>
                                <div class="request_infor lineHeight">
                                    <span >出差地点 :</span>
                                    <p class="line1"> {{item.outsideAddress}}</p>
                                </div>
                                <div class="request_infor lineHeight">
                                    <span >开始时间 :</span>
                                    <p class="line1"> {{item.beginTime |slice}}</p>
                                </div>
                                <div class="request_infor lineHeight">
                                    <span >结束时间 :</span>
                                    <p class="line1"> {{item.endTime |slice}}</p>
                                </div>
                                <div class="request_infor margin10">
                                    <span>出差事由 :</span>
                                    <p class="line2" style="line-height:0.2rem;" v-html="item.content"></p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                 <div  class="skip" tag="div">
                        查看详情
                    </div>
            </div>
             <div v-if="item.typecode == 6" @click="go_Apply(item,'stamp')"   class="affairs_item myaffairs_shadow" >
                 <div class="item_infor">
                    <div class="select" v-if="redactState">
                             <svg v-if="item.isDel" class="icon" style="font-size:0.16rem;color:#f80" aria-hidden="false">
                                <use xlink:href="#icon-xuanzhong2"></use>
                            </svg>
                            <svg v-else  class="icon" style="font-size:0.16rem;" aria-hidden="false">
                                <use xlink:href="#icon-meiyouxuanzhong"></use>
                            </svg>
                    </div>
                    <div class="affirs_child">
                        <div>
                            <div class="affairs_title">
                                <img :src="item.profileImg"/>
                                <h2>{{item.title}}的用印审批</h2>
                                <time >{{item.applyTime | timeFormat}}</time>
                            </div>
                            <div class="affairs_infor">
                                <div class="request_infor lineHeight">
                                    <span >文件名称 :</span>
                                    <p class="line1"> {{item.sealFileName}}</p>
                                </div>
                                <div class="request_infor lineHeight">
                                    <span >文件类别 :</span>
                                    <p class="line1"> {{item.fileCategory}}</p>
                                </div>
                                <div class="request_infor lineHeight">
                                    <span >文件数量 :</span>
                                    <p class="line1"> {{item.fileQuantity}}</p>
                                </div>
                                <div class="request_infor lineHeight">
                                    <span >印章名称 :</span>
                                    <p class="line1"> {{item.sealName}}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                 </div>
                 <div  class="skip" tag="div">
                            查看详情
                 </div>
            </div> 
             <div v-if="item.typecode == 7" @click="go_Apply(item,'reimburse')"   class="affairs_item myaffairs_shadow" >
                 <div class="item_infor">
                    <div class="select" v-if="redactState">
                             <svg v-if="item.isDel" class="icon" style="font-size:0.16rem;color:#f80" aria-hidden="false">
                                <use xlink:href="#icon-xuanzhong2"></use>
                            </svg>
                            <svg v-else  class="icon" style="font-size:0.16rem;" aria-hidden="false">
                                <use xlink:href="#icon-meiyouxuanzhong"></use>
                            </svg>
                    </div>
                    <div class="affirs_child">
                        <div>
                            <div class="affairs_title">
                                <img :src="item.profileImg"/>
                                <h2>{{item.title}}的报销审批</h2>
                                <time >{{item.applyTime | timeFormat}}</time>
                            </div>
                            <div class="affairs_infor">
                                <div class="request_infor lineHeight">
                                    <span >报销金额 :</span>
                                    <p class="line1"> {{item.reimburseAmount}} 元</p>
                                </div>
                                <div class="request_infor lineHeight">
                                    <span >日&emsp;&emsp;期 :</span>
                                    <p class="line1"> {{item.reimburseDate | slice}}</p>
                                </div>
                                <div class="request_infor lineHeight">
                                    <span >报销类别 :</span>
                                    <p class="line1"> {{item.reimburseType }}</p>
                                </div>
                                <div class="request_infor lineHeight">
                                    <span >费用明细 :</span>
                                    <p class="line1"> {{item.reimburseDesc }}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                 </div>
                <div  class="skip" tag="div">
                            查看详情
                </div>
            </div>
            <div v-else-if="item.typecode == 8" @click="go_Apply(item,'payApply')"   class="affairs_item" >
                <div class="item_infor">
                    <div class="select" v-if="redactState">
                             <svg v-if="item.isDel" class="icon" style="font-size:0.16rem;color:#f80" aria-hidden="false">
                                <use xlink:href="#icon-xuanzhong2"></use>
                            </svg>
                            <svg v-else  class="icon" style="font-size:0.16rem;" aria-hidden="false">
                                <use xlink:href="#icon-meiyouxuanzhong"></use>
                            </svg>
                    </div>
                    <div class="affirs_child">
                        <div>
                            <div class="affairs_title">
                                <img :src="item.profileImg"/>
                                <h2>{{item.title}}的付款申请</h2>
                                <time >{{item.applyTime | timeFormat}}</time>
                            </div>
                            <div class="affairs_infor">
                                <div class="request_infor lineHeight">
                                    <span >付款金额 : </span>
                                    <p class="line1">{{item.payAmount}} 元</p>
                                </div>
                                <div class="request_infor lineHeight">
                                    <span>付款方式 :</span>
                                    <p class="line1"> {{item.payType}}</p>
                                </div>
                                <div class="request_infor lineHeight">
                                    <span >付款日期 :</span>
                                    <p class="line1">{{item.payDate |slice }} </p>
                                </div>
                                <div class="request_infor lineHeight">
                                    <span>收款人全称 :</span>
                                    <p class="line1">{{item.receiverName}}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div  class="skip" tag="div">
                            查看详情
                </div>
                
            </div>
            <div v-else-if="item.typecode == 9" @click="go_Apply(item,'dimission')"   class="affairs_item" >
                <div class="item_infor">
                    <div class="select" v-if="redactState">
                             <svg v-if="item.isDel" class="icon" style="font-size:0.16rem;color:#f80" aria-hidden="false">
                                <use xlink:href="#icon-xuanzhong2"></use>
                            </svg>
                            <svg v-else  class="icon" style="font-size:0.16rem;" aria-hidden="false">
                                <use xlink:href="#icon-meiyouxuanzhong"></use>
                            </svg>
                    </div>
                    <div class="affirs_child">
                        <div>
                            <div class="affairs_title">
                                <img :src="item.profileImg"/>
                                <h2>{{item.title}}的离职申请</h2>
                                <time >{{item.applyTime | timeFormat}}</time>
                            </div>
                            <div class="affairs_infor">
                                <div class="request_infor lineHeight">
                                    <span >职&emsp;&emsp;务 : </span>
                                    <p class="line1">{{item.position}} </p>
                                </div>
                                <div class="request_infor lineHeight">
                                    <span>入职日期 :</span>
                                    <p class="line1"> {{item.hireDate |slice}}</p>
                                </div>
                                <div class="request_infor lineHeight">
                                    <span >合同到期日 :</span>
                                    <p class="line1">{{item.contractEndDate |slice }} </p>
                                </div>
                                <div class="request_infor lineHeight">
                                    <span>最后工作日 :</span>
                                    <p class="line1">{{item.dimissionDate |slice }}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div  class="skip" tag="div">
                        查看详情
                </div>
            </div>

            <div v-else-if="item.typecode == 10" @click="go_Apply(item,'borrow')"   class="affairs_item" >
                <div class="item_infor">
                    <div class="select" v-if="redactState">
                             <svg v-if="item.isDel" class="icon" style="font-size:0.16rem;color:#f80" aria-hidden="false">
                                <use xlink:href="#icon-xuanzhong2"></use>
                            </svg>
                            <svg v-else  class="icon" style="font-size:0.16rem;" aria-hidden="false">
                                <use xlink:href="#icon-meiyouxuanzhong"></use>
                            </svg>
                    </div>
                    <div class="affirs_child">
                        <div>
                            <div class="affairs_title">
                                <img :src="item.profileImg"/>
                                <h2>{{item.title}}的借款申请</h2>
                                <time >{{item.applyTime | timeFormat}}</time>
                            </div>
                            <div class="affairs_infor">
                                <div class="request_infor lineHeight">
                                    <span >借款金额 : </span>
                                    <p class="line1">{{item.borrowAmount}} 元</p>
                                </div>
                                <div class="request_infor lineHeight">
                                    <span>借款日期 :</span>
                                    <p class="line1"> {{item.useDate  }}</p>
                                </div>
                                <div class="request_infor lineHeight">
                                    <span >归还日期 :</span>
                                    <p class="line1">{{item.returnDate  }} </p>
                                </div>
                                <div class="request_infor lineHeight">
                                    <span>借款事由 :</span>
                                    <p class="line2" style="line-height:0.2rem;">{{item.content  }}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div  class="skip" tag="div">
                        查看详情
                </div>
            </div>

            <div v-else-if="item.typecode == 12" @click="go_Apply(item,'absence')"   class="affairs_item" >
                <div class="item_infor">
                    <div class="select" v-if="redactState">
                             <svg v-if="item.isDel" class="icon" style="font-size:0.16rem;color:#f80" aria-hidden="false">
                                <use xlink:href="#icon-xuanzhong2"></use>
                            </svg>
                            <svg v-else  class="icon" style="font-size:0.16rem;" aria-hidden="false">
                                <use xlink:href="#icon-meiyouxuanzhong"></use>
                            </svg>
                    </div>
                    <div class="affirs_child">
                        <div>
                            <div class="affairs_title">
                                <img :src="item.profileImg"/>
                                <h2>{{item.title}}的补卡申请</h2>
                                <time >{{item.applyTime | timeFormat}}</time>
                            </div>
                            <div class="affairs_infor">
                                 <div class="request_infor lineHeight">
                                    <span> 提 &nbsp;交&nbsp;人 :</span><p class="line1">{{item.title}} </p>
                                </div>
                                <div class="request_infor lineHeight">
                                    <span>所属部门 :</span>
                                    <p class="line1">{{item.officeName }}</p>
                                </div>
                                <div class="request_infor lineHeight">
                                    <span >时&emsp;&emsp;间 :</span>
                                    <p class="line1">{{item.absenceDate|timeSlice }} </p>
                                </div>
                                <div class="request_infor lineHeight">
                                    <span>原&emsp;&emsp;因 :</span>
                                    <p class="line2" style="line-height:0.2rem;">{{item.absenceReason  }}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div  class="skip" tag="div">
                        查看详情 
                </div>
            </div> 

            <div v-else-if="item.typecode == 11" @click="go_Apply(item,'reception')"   class="affairs_item" >
                <div class="item_infor">
                    <div class="select" v-if="redactState">
                             <svg v-if="item.isDel" class="icon" style="font-size:0.16rem;color:#f80" aria-hidden="false">
                                <use xlink:href="#icon-xuanzhong2"></use>
                            </svg>
                            <svg v-else  class="icon" style="font-size:0.16rem;" aria-hidden="false">
                                <use xlink:href="#icon-meiyouxuanzhong"></use>
                            </svg>
                    </div>
                    <div class="affirs_child">
                        <div>
                            <div class="affairs_title">
                                <img :src="item.profileImg"/>
                                <h2>{{item.title}}的接待申请</h2>
                                <time >{{item.applyTime | timeFormat}}</time>
                            </div>
                            <div class="affairs_infor">
                               <div class="request_infor lineHeight">
                                    <span >来宾单位 : </span>
                                    <p class="line1">{{item.visitorCompany}} </p>
                                </div>
                                <div class="request_infor lineHeight">
                                    <span>到访日期 :</span>
                                    <p class="line1"> {{item.visitDate |timeSlice }}</p>
                                </div>
                                <div class="request_infor lineHeight">
                                    <span >接待等级 :</span>
                                    <p class="line1">{{item.receptionLevel}} </p>
                                </div>
                                <div class="request_infor lineHeight">
                                    <span>预算总费用 :</span>
                                    <p class="line1">{{item.totalBudget}} 元</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div  class="skip" tag="div">
                        查看详情
                </div>
            </div>
            <div v-else-if="item.typecode == 13" @click="go_Apply(item,'car')"   class="affairs_item" >
                <div class="item_infor">
                    <div class="select" v-if="redactState">
                             <svg v-if="item.isDel" class="icon" style="font-size:0.16rem;color:#f80" aria-hidden="false">
                                <use xlink:href="#icon-xuanzhong2"></use>
                            </svg>
                            <svg v-else  class="icon" style="font-size:0.16rem;" aria-hidden="false">
                                <use xlink:href="#icon-meiyouxuanzhong"></use>
                            </svg>
                    </div>
                    <div class="affirs_child">
                        <div>
                            <div class="affairs_title">
                                <img :src="item.profileImg"/>
                                <h2>{{item.title}}的用车申请</h2>
                                <time >{{item.applyTime | timeFormat}}</time>
                            </div>
                            <div class="affairs_infor">
                                <div class="request_infor lineHeight">
                                    <span >车辆类型 : </span>
                                    <p class="line1">{{item.carType}} </p>
                                </div>
                               <div class="request_infor lineHeight">
                                    <span >数量 (辆) : </span>
                                    <p class="line1">{{item.num}} </p>
                                </div>
                                <div class="request_infor lineHeight">
                                    <span>开始时间 :</span>
                                    <p class="line1"> {{item.beginTime |timeSlice }}</p>
                                </div>
                                <div class="request_infor lineHeight">
                                    <span >结束时间 :</span>
                                    <p class="line1">{{item.endTime|timeSlice }} </p>
                                </div>
                                <div class="request_infor lineHeight">
                                    <span>用车事由 :</span>
                                    <p class="line1">{{item.content}} 元</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div  class="skip" tag="div">
                        查看详情
                </div>
            </div> 
            <div v-else-if="item.typecode == 14" @click="go_Apply(item,'employee')"   class="affairs_item" >
                <div class="item_infor">
                    <div class="select" v-if="redactState">
                             <svg v-if="item.isDel" class="icon" style="font-size:0.16rem;color:#f80" aria-hidden="false">
                                <use xlink:href="#icon-xuanzhong2"></use>
                            </svg>
                            <svg v-else  class="icon" style="font-size:0.16rem;" aria-hidden="false">
                                <use xlink:href="#icon-meiyouxuanzhong"></use>
                            </svg>
                    </div>
                    <div class="affirs_child">
                        <div>
                            <div class="affairs_title">
                                <img :src="item.profileImg"/>
                                <h2>{{item.title}}的人员需求...</h2>
                                <time >{{item.applyTime | timeFormat}}</time>
                            </div>
                            <div class="affairs_infor">
                               <div class="request_infor lineHeight">
                                    <span >招聘岗位 : </span>
                                    <p class="line1">{{item.position}} </p>
                                </div>
                                <div class="request_infor lineHeight">
                                    <span>需求人数 :</span>
                                    <p class="line1"> {{item.num }}</p>
                                </div>
                                <div class="request_infor lineHeight">
                                    <span >到岗日期 :</span>
                                    <p class="line1">{{item.hireDate|timeSlice }} </p>
                                </div>
                                <div class="request_infor lineHeight">
                                    <span>申请理由 :</span>
                                    <p class="line1">{{item.content}} 元</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div  class="skip" tag="div">
                        查看详情
                </div>
            </div>
            <div v-else-if="item.typecode == 15" @click="go_Apply(item,'project')"   class="affairs_item" >
                <div class="item_infor">
                    <div class="select" v-if="redactState">
                             <svg v-if="item.isDel" class="icon" style="font-size:0.16rem;color:#f80" aria-hidden="false">
                                <use xlink:href="#icon-xuanzhong2"></use>
                            </svg>
                            <svg v-else  class="icon" style="font-size:0.16rem;" aria-hidden="false">
                                <use xlink:href="#icon-meiyouxuanzhong"></use>
                            </svg>
                    </div>
                    <div class="affirs_child">
                        <div>
                            <div class="affairs_title">
                                <img :src="item.profileImg"/>
                                <h2>{{item.title}}的项目立项...</h2>
                                <time >{{item.applyTime | timeFormat}}</time>
                            </div>
                            <div class="affairs_infor">
                                <div class="request_infor lineHeight">
                                    <span>项目名称 :</span><p class="line1">{{item.projectName}} </p>
                                </div>
                                <div class="request_infor lineHeight">
                                    <span>预估金额 :</span>
                                    <p class="line1">{{item.projectBudget }}</p>
                                </div>
                                <div class="request_infor lineHeight">
                                    <span >立项时间 :</span>
                                    <p class="line1">{{item.buildDate |timeSlice }} </p>
                                </div>
                                <div class="request_infor lineHeight">
                                    <span>项目周期 :</span>
                                    <p class="line2" style="line-height:0.2rem;">{{item.projectDate}}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div  class="skip" tag="div">
                        查看详情
                </div>
            </div>
            <div v-else-if="item.typecode == 16" @click="go_Apply(item,'regular')"   class="affairs_item" >
                <div class="item_infor">
                    <div class="select" v-if="redactState">
                             <svg v-if="item.isDel" class="icon" style="font-size:0.16rem;color:#f80" aria-hidden="false">
                                <use xlink:href="#icon-xuanzhong2"></use>
                            </svg>
                            <svg v-else  class="icon" style="font-size:0.16rem;" aria-hidden="false">
                                <use xlink:href="#icon-meiyouxuanzhong"></use>
                            </svg>
                    </div>
                    <div class="affirs_child">
                        <div>
                            <div class="affairs_title">
                                <img :src="item.profileImg"/>
                                <h2>{{item.title}}的员工转正...</h2>
                                <time >{{item.applyTime | timeFormat}}</time>
                            </div>
                            <div class="affairs_infor">
                               <div class="request_infor lineHeight">
                                    <span>职&emsp;&emsp;务 :</span><p class="line1">{{item.position}} </p>
                                </div>
                                <div class="request_infor lineHeight">
                                    <span>入司时间 :</span>
                                    <p class="line1">{{item.hireDate|timeSlice }}</p>
                                </div>
                                <div class="request_infor lineHeight">
                                    <span >试用开始时间 :</span>
                                    <p class="line1">{{item.beginTime |timeSlice }} </p>
                                </div>
                                <div class="request_infor lineHeight">
                                    <span>试用结束时间 :</span>
                                    <p class="line2" style="line-height:0.2rem;">{{item.endTime|timeSlice}}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div  class="skip" tag="div">
                        查看详情
                </div>
            </div>
            <div v-else-if="item.typecode == 17" @click="go_Apply(item,'meal')"   class="affairs_item" >
                <div class="item_infor">
                    <div class="select" v-if="redactState">
                             <svg v-if="item.isDel" class="icon" style="font-size:0.16rem;color:#f80" aria-hidden="false">
                                <use xlink:href="#icon-xuanzhong2"></use>
                            </svg>
                            <svg v-else  class="icon" style="font-size:0.16rem;" aria-hidden="false">
                                <use xlink:href="#icon-meiyouxuanzhong"></use>
                            </svg>
                    </div>
                    <div class="affirs_child">
                        <div>
                            <div class="affairs_title">
                                <img :src="item.profileImg"/>
                                <h2>{{item.title}}的就餐申请...</h2>
                                <time >{{item.applyTime | timeFormat}}</time>
                            </div>
                            <div class="affairs_infor">
                               <div class="request_infor lineHeight">
                                    <span>就餐人数 :</span><p class="line1">{{item.position}} </p>
                                </div>
                                <div class="request_infor lineHeight">
                                    <span>开始时间 :</span>
                                    <p class="line1">{{item.beginTime|timeSlice }}</p>
                                </div>
                                <div class="request_infor lineHeight">
                                    <span >结束时间 :</span>
                                    <p class="line1">{{item.endTime |timeSlice }} </p>
                                </div>
                                <div class="request_infor lineHeight">
                                    <span>就餐标准 :</span>
                                    <p class="line2" style="line-height:0.2rem;">{{item.mealStandard}}</p>
                                </div> 
                            </div>
                        </div>
                    </div>
                </div>
                <div  class="skip" tag="div">
                        查看详情
                </div>
            </div>
            <div v-else-if="item.typecode == 18" @click="go_Apply(item,'document')"   class="affairs_item" >
                <div class="item_infor">
                    <div class="select" v-if="redactState">
                             <svg v-if="item.isDel" class="icon" style="font-size:0.16rem;color:#f80" aria-hidden="false">
                                <use xlink:href="#icon-xuanzhong2"></use>
                            </svg>
                            <svg v-else  class="icon" style="font-size:0.16rem;" aria-hidden="false">
                                <use xlink:href="#icon-meiyouxuanzhong"></use>
                            </svg>
                    </div>
                    <div class="affirs_child">
                        <div>
                            <div class="affairs_title">
                                <img :src="item.profileImg"/>
                                <h2>{{item.title}}的行文呈批...</h2>
                                <time >{{item.applyTime | timeFormat}}</time>
                            </div>
                            <div class="affairs_infor">
                               <div class="request_infor lineHeight">
                                    <span>文件编号 :</span><p class="line1">{{item.documentNo}} </p>
                                </div>
                                <div class="request_infor lineHeight">
                                    <span>主&emsp;&emsp;送 :</span>
                                    <p class="line2" style="line-height:0.2rem;">{{item.sendTo}}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div  class="skip" tag="div">
                        查看详情
                </div>
            </div>
            <div v-else-if="item.typecode == 19" @click="go_Apply(item,'overtime')"   class="affairs_item" >
                <div class="item_infor">
                    <div class="select" v-if="redactState">
                             <svg v-if="item.isDel" class="icon" style="font-size:0.16rem;color:#f80" aria-hidden="false">
                                <use xlink:href="#icon-xuanzhong2"></use>
                            </svg>
                            <svg v-else  class="icon" style="font-size:0.16rem;" aria-hidden="false">
                                <use xlink:href="#icon-meiyouxuanzhong"></use>
                            </svg>
                    </div>
                    <div class="affirs_child">
                        <div>
                            <div class="affairs_title">
                                <img :src="item.profileImg"/>
                                <h2>{{item.title}}的加班申请</h2>
                                <time >{{item.applyTime | timeFormat}}</time>
                            </div>
                            <div class="affairs_infor">
                              <div class="request_infor lineHeight">
                                    <span>开始时间 :</span><p class="line1">{{item.beginTime}} </p>
                                </div>
                                <div class="request_infor lineHeight">
                                    <span>结束时间 :</span><p class="line1">{{item.endTime}} </p>
                                </div>
                                <div class="request_infor lineHeight">
                                    <span>时&emsp;&emsp;长 :</span>
                                    <p class="line1">{{item.duration}} 小时</p>
                                </div>
                                <div class="request_infor lineHeight">
                                    <span>加班原因 :</span>
                                    <p class="line1">{{item.content}} </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div  class="skip" tag="div">
                        查看详情
                </div>
            </div>
            <div v-else-if="item.typecode == 20" @click="go_Apply(item,'position')"   class="affairs_item" >
                <div class="item_infor">
                    <div class="select" v-if="redactState">
                             <svg v-if="item.isDel" class="icon" style="font-size:0.16rem;color:#f80" aria-hidden="false">
                                <use xlink:href="#icon-xuanzhong2"></use>
                            </svg>
                            <svg v-else  class="icon" style="font-size:0.16rem;" aria-hidden="false">
                                <use xlink:href="#icon-meiyouxuanzhong"></use>
                            </svg>
                    </div>
                    <div class="affirs_child">
                        <div>
                            <div class="affairs_title">
                                <img :src="item.profileImg"/>
                                <h2>{{item.title}}的员工调岗...</h2>
                                <time >{{item.applyTime | timeFormat}}</time>
                            </div>
                            <div class="affairs_infor">
                               <div class="request_infor lineHeight">
                                    <span>申请人 :</span><p class="line1">{{item.title}} </p>
                                </div>
                                <div class="request_infor lineHeight">
                                    <span>调岗人 :</span>
                                    <p class="line1">{{item.targetName}}</p>
                                </div>
                                <div class="request_infor lineHeight">
                                    <span>调岗前部门/岗位 :</span>
                                    <p class="line1">{{item.exOffAndPosi}}</p>
                                </div>
                                <div class="request_infor lineHeight">
                                    <span>调岗后部门/岗位 :</span>
                                    <p class="line1">{{item.afterOffAndPosi}}</p>
                                </div>
                                <div class="request_infor lineHeight">
                                    <span>调岗日期 :</span>
                                    <p class="line1">{{item.changeDate}}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div  class="skip" tag="div">
                        查看详情
                </div>
            </div>
            <div v-else-if="item.typecode == 21" @click="go_Apply(item,'buy')"   class="affairs_item" >
                <div class="item_infor">
                    <div class="select" v-if="redactState">
                             <svg v-if="item.isDel" class="icon" style="font-size:0.16rem;color:#f80" aria-hidden="false">
                                <use xlink:href="#icon-xuanzhong2"></use>
                            </svg>
                            <svg v-else  class="icon" style="font-size:0.16rem;" aria-hidden="false">
                                <use xlink:href="#icon-meiyouxuanzhong"></use>
                            </svg>
                    </div>
                    <div class="affirs_child">
                        <div>
                            <div class="affairs_title">
                                <img :src="item.profileImg"/>
                                <h2>{{item.title}}的采购申请</h2>
                                <time >{{item.applyTime | timeFormat}}</time>
                            </div>
                            <div class="affairs_infor">
                               <div class="request_infor lineHeight">
                                    <span>申请人 :</span><p class="line1">{{item.title}} </p>
                                </div>
                                <div class="request_infor lineHeight">
                                    <span>采购事由 :</span>
                                    <p class="line1">{{item.applyTheme}}</p>
                                </div>
                                <div class="request_infor lineHeight" v-if="item.buyType">
                                    <span>采购类型 :</span>
                                    <p class="line1">{{item.buyType}}</p>
                                </div>
                                <div class="request_infor lineHeight">
                                    <span>期望交付日期 :</span>
                                    <p class="line1">{{item.HopeDeliveryDate |timeSlice9}}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div  class="skip" tag="div">
                        查看详情
                </div>
            </div>

            <div v-else-if="item.typecode == 22" @click="go_Apply(item,'material')"   class="affairs_item" >
                <div class="item_infor">
                    <div class="select" v-if="redactState">
                             <svg v-if="item.isDel" class="icon" style="font-size:0.16rem;color:#f80" aria-hidden="false">
                                <use xlink:href="#icon-xuanzhong2"></use>
                            </svg>
                            <svg v-else  class="icon" style="font-size:0.16rem;" aria-hidden="false">
                                <use xlink:href="#icon-meiyouxuanzhong"></use>
                            </svg>
                    </div>
                    <div class="affirs_child">
                        <div>
                            <div class="affairs_title">
                                <img :src="item.profileImg"/>
                                <h2>{{item.title}}的物品领用申请</h2>
                                <time >{{item.applyTime | timeFormat}}</time>
                            </div>
                            <div class="affairs_infor">
                               <div class="request_infor lineHeight">
                                    <span>申请人&emsp; :</span><p class="line1">{{item.title}} </p>
                                </div>
                                <div class="request_infor lineHeight">
                                    <span>物品用途 :</span>
                                    <p class="line1">{{item.applyTheme}}</p>
                                </div>
                                <div class="request_infor lineHeight">
                                    <span>物品名称 :</span>
                                    <p class="line1">{{item.materialName}}</p>
                                </div>
                                <div class="request_infor lineHeight" v-if="item.num">
                                    <span>数&emsp;&emsp;量 :</span>
                                    <p class="line1">{{item.num }}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div  class="skip" tag="div">
                        查看详情
                </div>
            </div>
            <div v-else-if="item.typecode == 23" @click="go_Apply(item,'erpPermission')"   class="affairs_item" >
                <div class="item_infor">
                    <div class="select" v-if="redactState">
                             <svg v-if="item.isDel" class="icon" style="font-size:0.16rem;color:#f80" aria-hidden="false">
                                <use xlink:href="#icon-xuanzhong2"></use>
                            </svg>
                            <svg v-else  class="icon" style="font-size:0.16rem;" aria-hidden="false">
                                <use xlink:href="#icon-meiyouxuanzhong"></use>
                            </svg>
                    </div>
                    <div class="affirs_child">
                        <div>
                            <div class="affairs_title">
                                <img :src="item.profileImg"/>
                                <h2>{{item.title}}的权限异动申请</h2>
                                <time >{{item.applyTime | timeFormat}}</time>
                            </div>
                            <div class="affairs_infor">
                               <div class="request_infor lineHeight">
                                    <span>姓&emsp;&emsp;名 :</span><p class="line1">{{item.applyName}} </p>
                                </div>
                                <div class="request_infor lineHeight">
                                    <span>部&emsp;&emsp;门 :</span>
                                    <p class="line1">{{item.applyDept}}</p>
                                </div>
                                <div class="request_infor lineHeight">
                                    <span>异动原因 :</span>
                                    <p class="line1">{{item.moveReason}}</p>
                                </div>
                                <div class="request_infor lineHeight" >
                                    <span>异动类型 :</span>
                                    <p class="line1">{{item.moveType }}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div  class="skip" tag="div">
                        查看详情
                </div>
            </div>

            <div v-else-if="item.typecode == 24" @click="go_Apply(item,'recruitmentApproval')"   class="affairs_item" >
                <div class="item_infor">
                    <div class="select" v-if="redactState">
                             <svg v-if="item.isDel" class="icon" style="font-size:0.16rem;color:#f80" aria-hidden="false">
                                <use xlink:href="#icon-xuanzhong2"></use>
                            </svg>
                            <svg v-else  class="icon" style="font-size:0.16rem;" aria-hidden="false">
                                <use xlink:href="#icon-meiyouxuanzhong"></use>
                            </svg>
                    </div>
                    <div class="affirs_child">
                        <div>
                            <div class="affairs_title">
                                <img :src="item.profileImg"/>
                                <h2>{{item.title}}招聘审批</h2>
                                <time >{{item.applyTime | timeFormat}}</time>
                            </div>
                            <div class="affairs_infor">
                               <div class="request_infor lineHeight">
                                    <span>招聘职位 :</span><p class="line1">{{item.position}} </p>
                                </div>
                                <div class="request_infor lineHeight">
                                    <span>候选人姓名 :</span>
                                    <p class="line1">{{item.candidateName}}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div  class="skip" tag="div">
                        查看详情
                </div>
            </div>
            <div v-else-if="item.typecode == 25" @click="go_Apply(item,'performance')"   class="affairs_item" >
                <div class="item_infor">
                    <div class="select" v-if="redactState">
                             <svg v-if="item.isDel" class="icon" style="font-size:0.16rem;color:#f80" aria-hidden="false">
                                <use xlink:href="#icon-xuanzhong2"></use>
                            </svg>
                            <svg v-else  class="icon" style="font-size:0.16rem;" aria-hidden="false">
                                <use xlink:href="#icon-meiyouxuanzhong"></use>
                            </svg>
                    </div>
                    <div class="affirs_child">
                        <div>
                            <div class="affairs_title">
                                <img :src="item.profileImg"/>
                                <h2>{{item.title}}的绩效考核</h2>
                                <time >{{item.applyTime | timeFormat}}</time>
                            </div>
                            <div class="affairs_infor">
                               <div class="request_infor lineHeight">
                                    <span>考核周期 :</span><p class="line1">{{item.performanceCycle}} </p>
                                </div>
                                <div class="request_infor lineHeight">
                                    <span>考核人数 :</span>
                                    <p class="line1">{{item.assessNum}}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div  class="skip" tag="div">
                        查看详情
                </div>
            </div>
            <div v-else-if="item.typecode == 27" @click="go_Apply(item,'archAplly')"   class="affairs_item" >
                <div class="item_infor">
                    <div class="select" v-if="redactState">
                             <svg v-if="item.isDel" class="icon" style="font-size:0.16rem;color:#f80" aria-hidden="false">
                                <use xlink:href="#icon-xuanzhong2"></use>
                            </svg>
                            <svg v-else  class="icon" style="font-size:0.16rem;" aria-hidden="false">
                                <use xlink:href="#icon-meiyouxuanzhong"></use>
                            </svg>
                    </div>
                    <div class="affirs_child">
                        <div>
                            <div class="affairs_title">
                                <img :src="item.profileImg"/>
                                <h2>{{item.title}}的借阅申请</h2>
                                <time >{{item.applyTime | timeFormat}}</time>
                            </div>
                            <div class="affairs_infor">
                               <div class="request_infor lineHeight">
                                    <span>借阅名称 :</span><p class="line1">{{item.borrowName}} </p>
                                </div>
                                <div class="request_infor lineHeight">
                                    <span>归还时间 :</span>
                                    <p class="line1">{{item.dossierReturnDate}}</p>
                                </div>
                                <div class="request_infor lineHeight">
                                    <span>借阅理由 :</span>
                                    <p class="line1">{{item.borrowReason}}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div  class="skip" tag="div">
                        查看详情
                </div>
            </div>
            <div v-else-if="item.typecode == 28" @click="go_Apply(item,'archMoveApply')"   class="affairs_item" >
                <div class="item_infor">
                    <div class="select" v-if="redactState">
                             <svg v-if="item.isDel" class="icon" style="font-size:0.16rem;color:#f80" aria-hidden="false">
                                <use xlink:href="#icon-xuanzhong2"></use>
                            </svg>
                            <svg v-else  class="icon" style="font-size:0.16rem;" aria-hidden="false">
                                <use xlink:href="#icon-meiyouxuanzhong"></use>
                            </svg>
                    </div>
                    <div class="affirs_child">
                        <div>
                            <div class="affairs_title">
                                <img :src="item.profileImg"/>
                                <h2>{{item.title}}的移交申请</h2>
                                <time >{{item.applyTime | timeFormat}}</time>
                            </div>
                            <div class="affairs_infor">
                               <div class="request_infor lineHeight">
                                    <span>移交名称 :</span><p class="line1">{{item.transferName}} </p>
                                </div>
                                <div class="request_infor lineHeight">
                                    <span>移交时间 :</span>
                                    <p class="line1">{{item.transferDate}}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div  class="skip" tag="div">
                        查看详情
                </div>
            </div>
  
         </div>   
        </div>

        <div class="footer">
            <div class="del_box" v-if="redactState">
                <div @click="allSelect" >
                    <svg v-if="isAll"  class="icon" style="font-size:0.16rem;color:#f80" aria-hidden="false">
                        <use xlink:href="#icon-xuanzhong2"></use>
                    </svg>
                    <svg v-else  class="icon" style="font-size:0.16rem;" aria-hidden="false">
                        <use xlink:href="#icon-meiyouxuanzhong"></use>
                    </svg>
                        全选
                </div>
                <a class="del_btn" @click="deleted"  :style="{backgroundColor:(deleteArr.length?'#f80':'#ccc')}">删 除</a>
            </div>
            <router-link class='tab tab_user' tag="div" :to="{path:'myApply'}">
                <svg class="icon icon-user" aria-hidden="false">
                    <use  xlink:href="#icon-wodeshenqing-line"></use>
                </svg>
                <span>我的申请</span>
            </router-link>
            <div class="tab tab_drafts active" >
                <svg class="icon icon-drafts" aria-hidden="false">
                    <use  xlink:href="#icon-caogaoxiang-mian"></use>
                </svg>
                <span>草稿箱</span>
            </div>
        </div>

          <infinite-loading  spinner="bubbles" :on-infinite="onInfinite" ref="infiniteLoading">
            <span slot="no-more" class="no-more">
            暂无更多加载
            </span>
            <span slot="no-results" class="no-results">
            暂无结果
            </span>
        </infinite-loading>

        <Dialog
            lfText="确认"
            rgText="取消"
            content="确认删除所选内容?"
            v-on:lfClick="lf_click"
            v-on:rgClick="rg_click"
            v-show="isShow"
        ></Dialog>
    </div>
</template>
<script>
    import InfiniteLoading from 'vue-infinite-loading';
    import Dialog  from '../../../components/oa/dialog.vue'  // 弹窗

    export default{
        data(){
            return{
                draftsData : [], //草稿箱数据
                pageNo:1,
                redactState:false,
                deleteArr:[],
                isAll:false,
                isShow:false,
            }   
        },
          components: {
            InfiniteLoading,
            Dialog
        },
        mounted(){
                let that = this;
                 this.axios.get('/work/apply/draft/list').then(function(res){
                            let data = [];
                            for(let i= 0;i<res.data.b.data.length;i++){
                                let obj = {};
                                for(let j = 0;j<res.data.b.data[i].extend.length;j++){
                                    obj[res.data.b.data[i].extend[j].key] = res.data.b.data[i].extend[j].value
                                }
                                obj.isDel = false;
                                data.push(obj)
                            }
                            that.draftsData = data;
                            
                 })
        },
        methods:{
            goback(){
                window.location.href = "epipe://?&mark=history_back"
            },
            delFor(item){
                if(this.redactState&&!item.isDel){
                    this.deleteArr.push(item.applyId)
                    item.isDel = true;
                }else{
                    item.isDel = false;
                    for(let i=0;i<this.deleteArr.length;i++){
                        if(this.deleteArr[i]==item.applyId){
                            this.deleteArr.splice(i,1)
                            break;
                        }
                    }
                }
            },
            go_Apply(item,typeName){
                this.delFor(item)
                if(this.redactState) return

                if(typeName=='all_oa'){
                    window.location.href = "epipe://?&mark=oaForm&_id="+item.applyId+"&type=1";
                }else{
                    window.location.href = "epipe://?&mark="+typeName+"&_id="+item.applyId;
                }
            },

            redact(){ //编辑
                this.redactState = !this.redactState

                if(!this.redactState){
                     for(let i=0;i<this.draftsData.length;i++){
                            if(this.draftsData[i].isDel) this.draftsData[i].isDel=!this.draftsData[i].isDel
                        }
                    this.deleteArr = [];
                    this.isAll = false;
                    return;
                }
            },
            allSelect(){ //全选
                this.isAll = !this.isAll;
                let arr = [];

                 for(let i=0;i<this.draftsData.length;i++){
                    this.draftsData[i].isDel = this.isAll;
                    if(this.isAll){
                        arr.push(this.draftsData[i].applyId)
                    }
                }
                this.deleteArr = arr;
            },
            deleted(){ //删除
                this.isShow = true;
            },
            lf_click(){
                let id ='';
                let that=this;
                for(let i=0;i<this.deleteArr.length;i++){
                    id+=this.deleteArr[i]+'|'
                }

                this.axios.post('/work/audit'+this.Service.queryString({
                    type:7,
                    applyId:id.slice(0,-1),
                })).then((res)=>{

                    if(res.data.h.code==200){
                        for(let i=0;i<that.draftsData.length;i++){
                            for(let j=0;j<that.deleteArr.length;j++){
                                // console.log(that.draftsData,that.draftsData[i])
                                // console.log(i,j)
                                // console.log(that.deleteArr)
                                // console.log('================================')
                                if(that.draftsData[i].applyId==that.deleteArr[j]){
                                    that.draftsData.splice(i,1)
                                }
                            }
                        }
                    }else{
                        that.$toast(res.data.h.msg)
                    }
                    that.redact()
                })
                this.isShow = false;
            },
            rg_click(){
                this.isShow = false;
            },
            onInfinite(){
                let that = this;
                this.axios.get('/work/apply/draft/list',{
                    params:{
                        pageNo:this.pageNo+1,
                    }
                }).then(function(res){

                        setTimeout(() => {
                                if (res.data.b.data.length == 0) {
                                    that.$refs.infiniteLoading.$emit('$InfiniteLoading:complete');
                                } else if (res.data.b.data) {
                                        let data = [];
                                        for(let i= 0;i<res.data.b.data.length;i++){
                                            let obj = {};
                                            for(let j = 0;j<res.data.b.data[i].extend.length;j++){
                                                obj[res.data.b.data[i].extend[j].key] = res.data.b.data[i].extend[j].value
                                            }
                                            data.push(obj)
                                        }
                                    that.draftsData = that.draftsData.concat(data)
                                    that.pageNo++;
                                    that.$refs.infiniteLoading.$emit('$InfiniteLoading:loaded');
                                }
                        }, 200);
                    }).catch(function (error) {
                        console.log(error);
                    });
                }
        },
        filters : {
            timeFormat : function(value) {
                let arr = ['一','二','三','四','五','六','日']
                let odate = value.split(" ")[0];
                let otime = new Date(odate);
                let time = new Date() - new Date(odate);
                time = parseInt( time/(24*60*60*1000))

                if(!time){
                    return value.slice(-8,-3)
                }else if(time == 1){
                    return '昨天 '+ value.slice(-8,-3)
                }else if(1<time<=7){
                    return  '星期'+arr[otime.getDay()]
                }else{ 
                    return value.slice(0,10)
                }
            },
            
            slice : function(value){
                return value.slice(0,-3)
            },
        }
    }

</script>


<style scoped lang="stylus">

    body{
        overflow hidden;
    }

    .affairs_box{
        overflow hidden;
        margin-bottom 0.5rem;
    }

    .header{
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 0.44rem;
        text-align: center;
        line-height: 0.44rem;
        color: #fff;
        font-size: 0.18rem;
        font-weight bold;
        letter-spacing: 0.012rem;
        
        .back{
            position: absolute;
            left: 0;
            width: 0.5rem;
            text-align: left;
            .icon-back{
                font-size: 0.17rem;
                font-weight:bold;
                margin-left: 0.1rem;
            }
        }
    }


    .finish_head{
        background #0fc37c;
    }

    .myaffairs_head{
        background: #f80;        
    }


    .myaffairs_shadow{
        -webkit-box-shadow: 0 0 0.2rem rgba(255,136,0,.1);    
        box-shadow 0 0 0.2rem rgba(255,136,0,.1);
    }



    .affairs_content{
        margin-top: 0.59rem;
        padding 0 0.15rem;
        overflow hidden;
    }

    .affairs_item{
        background-color #fff;
        padding 0.15rem;
        padding-bottom 0;
        border-radius 0.04rem;
        margin-bottom:0.15rem;
    }



    .affairs_title{
        display: flex;
        height :0.32rem;
        line-height 0.32rem;
        margin-bottom:0.1rem;

        img{
            width: 0.32rem;
            height: 0.32rem;
            border-radius: 50%;
            margin-right :0.1rem;
        }

        h2{
            flex 1;
            font-size:0.16rem;
            font-weight:bold;
            color:#333;
        }

        time{
            font-size:0.14rem;
            color:#999;
            font-weight:bold;
        }
    }

    .affairs_infor{
        font-size:0.15rem;
        color:#333;
        padding-left:0.4rem;

        p{
            margin 0.1rem 0;
            line-height 1.2em;
        }

        span{
            margin-left:0.15rem;
        }

        .result{
            font-size:0.14rem;
            color:#fd545c;
            margin 0.15rem 0;
        }
    }

    .skip{
        height 0.39rem;
        line-height 0.4rem;
        font-size:0.14rem;
        text-align center;
        color #666;
        border-top: 0.01rem solid  #e6e6e6;
    }

    .footLine{
       height 0.13rem;
       font-size:0.13rem;
       position relative;
       text-align center;
       color #999;
       padding 0 0.15rem;
       margin-bottom:0.3rem;
       margin-top:0.15rem;

       span{
           position absolute;
           width:0.91rem;
           z-index 2;
           line-height 1em;
           left 0;
           right 0;
           margin auto;
           background-color #f5f5f5;
       }
    }

    .marginBot{
        margin-bottom 0.8rem;
    }



    .footer{
        position fixed;
        width 100%;
        bottom 0;
        left 0;
        font-size:0.11rem;
        z-index 3;

        .tab{
            float left;
            text-align center;
            height 100%;
            width 50%;
            padding-top:0.05rem;
            height 0.5rem;
            background-color #fff;
            border-top:0.01rem solid #ccc;
        }

        .icon-user,.icon-drafts{
            display block;
            width 0.22rem;
            height 0.22rem;
            margin 0 auto;
            margin-bottom 0.03rem;
        }
        .active{
            color #f80;
        }

    }

    .line1{
        overflow: hidden;
        text-overflow:ellipsis;
        white-space: nowrap;
    }

    .line2{
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        overflow: hidden;
    }

    .request_infor{
        display flex;
        font-size 0.15rem;
        margin-bottom 0.03rem;

        span{
            margin-right 0.15rem;
            margin-left 0;
        }


        p{
            flex 1;
            color #333;
            max-width:2rem;
            word-wrap:break-word;
            word-break: break-all;
            margin 0
        }
    }

    .lineHeight{
        line-height : 0.15rem;
        margin-bottom 0.1rem;
    }

    .margin10{
        margin-bottom 0.1rem;
    }

     .no-results,.no-more{
        display:block;
        margin:0.10rem 0;
        margin-bottom 0.45rem;
    }

    .item_infor{
        display:flex;
    }

    .select{
        width:0.25rem;
        height:0.3rem;
        line-height:0.3rem;
        align-self: center;
    }

    .affirs_child{
        flex:1;
    }

    .redact{
        position:absolute;
        right:0;
        top:0;
        margin-right:0.15rem;
        font-size 0.15rem;
    }

    .del_box{
        overflow:hidden;
        background-color:#f5f5f5;
        padding:0 0.15rem;

        >div{
            float:left;
            font-size 0.15rem;
            margin-top:0.15rem;
        }

        .del_btn{
            display:block;
            width:0.6rem;
            text-align:center;
            height:0.25rem;
            line-height:0.25rem;
            background-color:#ccc;
            border-radius:3px;
            color:#fff;
            float:right;
            margin 0.13rem 0;
            font-size 0.15rem;
        }
    }

</style>