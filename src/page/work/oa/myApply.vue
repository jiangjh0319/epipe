
<template>
    <div class="affairs_box">
        <div class='header myaffairs_head' v-bind:style="{ background: bg_color}" >
            <div class="back" @click="goback()">
            <svg class="icon icon-back" aria-hidden="false">
                <use xlink:href="#icon-zuoyoujiantou"></use>
            </svg>
            </div>
            我的申请
            <div  class="redact" @click="go_search">
                <svg class="icon icon-back" aria-hidden="false">
                    <use xlink:href="#icon-sousuo2"></use>
                </svg>
            </div>
        </div>
        
        <div class="affairs_content" >
            <div v-for="(item,index) in leaveData" :key="index">
                <div v-if="item.typecode == 1"  @click="goDetails(item.applyId,item.fianlStatus,'leave')"   class="affairs_item myaffairs_shadow">
                    <div class="affirs_child">
                        <div class="affairs_title">
                            <img :src="item.profileImg" @click="go_user(item.userId)"/>
                            <h2 >我的请假审批</h2>
                            <time >{{item.applyTime | timeFormat}}</time>
                        </div>
                        <div class="affairs_infor">
                            <p>请假类型:<span style="color:#609ef6" v-text='item.leaveType'></span></p>
                            <p>开始时间:<span>{{item.beginTime | slice}}</span></p>
                            <p>结束时间:<span>{{item.endTime |slice}}</span></p>
                        </div>
                    </div>

                    <div    class="skip" >
                        查看详情
                    </div>
                </div>

                <div v-if="item.typecode=='MY_'"   @click="goDetails(item,'all_oa')" class="affairs_item myaffairs_shadow"  :key="item.id">
                    <div class="affirs_child">
                        <div>
                            <div class="affairs_title">
                                <img :src="item.profileImg"/>
                                <h2>我的{{item.applyName}}</h2>
                                <time >{{item.applyTime | timeSlice}}</time>
                            </div>
                            <div class="affairs_infor">
                                <p>提交人 :<span>{{item.userName}}</span></p>
                                <p>部门&emsp; :<span>{{item.officeName}}</span></p>
                            </div>
                        </div>
                        <div   class="skip" >
                            查看详情
                        </div>
                        <i v-if="item.readFlag=='0'&&isCopy"></i>
                    </div>
                </div>

                <div v-else-if="item.typecode == 2"  @click="goDetails(item.applyId,item.fianlStatus,'letterOfRequest','leOfRe')"  class="affairs_item myaffairs_shadow">
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
                            <div class="request_infor lineHeight" v-if="item.letterType">
                                <span>请示类别 :</span>
                                <p class="line1">{{item.letterTypeName}}</p>
                            </div>
                            <div class="request_infor margin10">
                                <span>请示内容 :</span>
                                <p class="line2" style="line-height:0.2rem;" v-html="item.content"></p>
                            </div>
                        </div>
                    </div>
                

                    <div    class="skip" >
                            查看详情
                    </div>

                </div>

                <div v-else-if="item.typecode == 3"  @click="goDetails(item.applyId,item.fianlStatus,'contract')"   class="affairs_item myaffairs_shadow">
                    <div class="affirs_child">
                        <div class="affairs_title">
                            <img :src="item.profileImg" @click="go_user(item.userId)"/>
                            <h2 >我的合同审批</h2>
                            <time >{{item.applyTime | timeFormat}}</time>
                        </div>
                        <div class="affairs_infor">
                        <div class="request_infor lineHeight">
                            <span class="lesp">合同名称 :</span>
                            <p class="line1">{{item.theme}}</p>
                        </div>
                            <div class="request_infor margin10">
                                <span>项目责任人 :</span>
                                <p class="line2" style="line-height:0.2rem;">{{item.title}}</p>
                            </div>
                        </div>
                    </div>
                

                    <div  class="skip" >
                            查看详情
                    </div>
                </div>

                <div v-else-if="item.typecode == 4"   @click="goDetails(item.applyId,item.fianlStatus,'goOutWork')"  class="affairs_item myaffairs_shadow"   :key="item.id">
                    <div class="affirs_child">
                        <div>
                            <div class="affairs_title">
                                <img :src="item.profileImg"/>
                                <h2>我的公出审批</h2>
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
                                    <p class="line1"> {{item.beginTime | slice}}</p>
                                </div>
                            </div>
                        </div>
                        <div  class="skip" tag="div">
                            查看详情
                        </div>

                    </div>
                 </div>
                <div v-else-if="item.typecode == 5"  @click="goDetails(item.applyId,item.fianlStatus,'trip')"   class="affairs_item" >
                    <div class="affirs_child">
                            <div>
                                <div class="affairs_title">
                                    <img :src="item.profileImg"/>
                                    <h2>我的出差审批</h2>
                                    <time >{{item.applyTime | timeFormat}}</time>
                                </div>
                                <div class="affairs_infor">
                                    <div class="request_infor lineHeight">
                                        <span >标&emsp;&emsp;题:</span>
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
                            <div  class="skip" tag="div">
                                查看详情
                            </div>
                    </div>
                </div>
                <div v-else-if="item.typecode == 6"  @click="goDetails(item.applyId,item.fianlStatus,'stamp')"   class="affairs_item" >
                    <div class="affirs_child">
                            <div>
                                <div class="affairs_title">
                                    <img :src="item.profileImg"/>
                                    <h2>我的用印审批</h2>
                                    <time >{{item.applyTime | timeFormat}}</time>
                                </div>
                                <div class="affairs_infor">
                                    <div class="request_infor lineHeight">
                                        <span >文件名称:</span>
                                        <p class="line1"> {{item.sealFileName}}</p>
                                    </div>
                                    <div class="request_infor lineHeight">
                                        <span >文件类别 :</span>
                                        <p class="line1"> {{item.fileCategory}}</p>
                                    </div>
                                    <div class="request_infor lineHeight">
                                        <span>文件数量 :</span>
                                        <p class="line1"> {{item.fileQuantity}}</p>
                                    </div>
                                    <div class="request_infor lineHeight">
                                        <span >印章名称 :</span>
                                        <p class="line1"> {{item.sealName}}</p>
                                    </div>
                                </div>
                            </div>
                            <div  class="skip" tag="div">
                                查看详情
                            </div>
                    </div>
                </div>
                <div v-else-if="item.typecode == 7"  @click="goDetails(item.applyId,item.fianlStatus,'reimburse')"  class="affairs_item" >
                    <div class="affirs_child">
                            <div>
                                <div class="affairs_title">
                                    <img :src="item.profileImg"/>
                                    <h2>我的报销审批</h2>
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
                                        <span>报销类别 :</span>
                                        <p class="line1"> {{item.reimburseType}}</p>
                                    </div>
                                    <div class="request_infor lineHeight">
                                        <span >费用明细 :</span>
                                        <p class="line1"> {{item.reimburseDesc}}</p>
                                    </div>
                                </div>
                            </div>
                            <div  class="skip" tag="div">
                                查看详情
                            </div>
                    </div>
                </div>
                <div v-else-if="item.typecode == 8" @click="goDetails(item.applyId,item.fianlStatus,'payApply')"   class="affairs_item" >
                <div class="affirs_child">
                        <div>
                            <div class="affairs_title">
                                <img :src="item.profileImg"/>
                                <h2>我的付款申请</h2>
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
                        <div  class="skip" tag="div">
                            查看详情
                        </div>
                </div>
                
            </div>
            <div v-else-if="item.typecode == 9"  @click="goDetails(item.applyId,item.fianlStatus,'dimission')"   class="affairs_item" >
                <div class="affirs_child">
                        <div>
                            <div class="affairs_title">
                                <img :src="item.profileImg"/>
                                <h2>{{item.employeeName}}的离职申请</h2>
                                <time >{{item.applyTime | timeFormat}}</time>
                            </div>
                            <div class="affairs_infor">
                                <div class="request_infor lineHeight">
                                    <span >岗&emsp;&emsp;位 : </span>
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
                        <div  class="skip" tag="div">
                            查看详情
                        </div>
                </div>
            </div>
            <div v-else-if="item.typecode == 10"  @click="goDetails(item.applyId,item.fianlStatus,'borrow')"   class="affairs_item" >
                <div class="affirs_child">
                        <div>
                            <div class="affairs_title">
                                <img :src="item.profileImg"/>
                                <h2>我的借款申请</h2>
                                <time >{{item.applyTime | timeSlice}}</time>
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
                        <div  class="skip" tag="div">
                            查看详情
                        </div>
                </div>
            </div>
             <div v-else-if="item.typecode == 11" @click="goDetails(item.applyId,item.fianlStatus,'reception')"   class="affairs_item" >
                <div class="affirs_child">
                        <div>
                            <div class="affairs_title">
                                <img :src="item.profileImg"/>
                                <h2>我的接待申请</h2>
                                <time >{{item.applyTime | timeSlice}}</time>
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
                        <div  class="skip" tag="div">
                            查看详情
                        </div>
                </div>
            </div>
             <div v-else-if="item.typecode == 12" @click="goDetails(item.applyId,item.fianlStatus,'absence')"   class="affairs_item" >
                <div class="affirs_child">
                        <div>
                            <div class="affairs_title">
                                <img :src="item.profileImg"/>
                                <h2>我的补卡申请</h2>
                                <time >{{item.applyTime | timeSlice}}</time>
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
                        <div  class="skip" tag="div">
                            查看详情
                        </div>
                </div>
            </div>
            <div v-else-if="item.typecode == 13" @click="goDetails(item.applyId,item.fianlStatus,'car')"   class="affairs_item" >
                <div class="affirs_child">
                        <div>
                            <div class="affairs_title">
                                <img :src="item.profileImg"/>
                                <h2>我的用车申请</h2>
                                <time >{{item.applyTime | timeSlice}}</time>
                            </div>
                            <div class="affairs_infor">
                                <div class="request_infor lineHeight">
                                    <span>车辆类型 :</span><p class="line1">{{item.carType}} </p>
                                </div>
                                <div class="request_infor lineHeight">
                                    <span>数量 (辆) :</span>
                                    <p class="line1">{{item.num }}</p>
                                </div>
                                <div class="request_infor lineHeight">
                                    <span >开始时间 :</span>
                                    <p class="line1">{{item.beginTime }} </p>
                                </div>
                                <div class="request_infor lineHeight">
                                    <span >结束时间 :</span>
                                    <p class="line1">{{item.endTime }} </p>
                                </div>
                                <div class="request_infor lineHeight">
                                    <span>用车事由 :</span>
                                    <p class="line2" style="line-height:0.2rem;">{{item.content}}</p>
                                </div>
                            </div>
                        </div>
                        <div  class="skip" tag="div">
                            查看详情
                        </div>
                </div>
            </div> 
            <div v-else-if="item.typecode == 14" @click="goDetails(item.applyId,item.fianlStatus,'employee')"   class="affairs_item" >
                <div class="affirs_child">
                        <div>
                            <div class="affairs_title">
                                <img :src="item.profileImg"/>
                                <h2>我的人员需求...</h2>
                                <time >{{item.applyTime | timeSlice}}</time>
                            </div>
                            <div class="affairs_infor">
                                <div class="request_infor lineHeight">
                                    <span>招聘岗位 :</span><p class="line1">{{item.position}} </p>
                                </div>
                                <div class="request_infor lineHeight">
                                    <span>需求人数 :</span>
                                    <p class="line1">{{item.num }}</p>
                                </div>
                                <div class="request_infor lineHeight">
                                    <span >到岗日期 :</span>
                                    <p class="line1">{{item.hireDate |timeSlice }} </p>
                                </div>
                                <div class="request_infor lineHeight">
                                    <span>申请理由 :</span>
                                    <p class="line2" style="line-height:0.2rem;">{{item.content}}</p>
                                </div>
                            </div>
                        </div>
                        <div  class="skip" tag="div">
                            查看详情
                        </div>
                </div>
            </div> 
            <div v-else-if="item.typecode == 15" @click="goDetails(item.applyId,item.fianlStatus,'project')"   class="affairs_item" >
                <div class="affirs_child">
                        <div>
                            <div class="affairs_title">
                                <img :src="item.profileImg"/>
                                <h2>我的的项目立项...</h2>
                                <time >{{item.applyTime | timeSlice}}</time>
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
                        <div  class="skip" tag="div">
                            查看详情
                        </div>
                </div>
            </div> 
            <div v-else-if="item.typecode == 16" @click="goDetails(item.applyId,item.fianlStatus,'regular')"   class="affairs_item" >
                <div class="affirs_child">
                        <div>
                            <div class="affairs_title">
                                <img :src="item.profileImg"/>
                                <h2>{{item.employeeName}}的员工转正...</h2>
                                <time >{{item.applyTime | timeSlice}}</time>
                            </div>
                            <div class="affairs_infor">
                                <div class="request_infor lineHeight">
                                    <span>岗&emsp;&emsp;位 :</span><p class="line1">{{item.position}} </p>
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
                        <div  class="skip" tag="div">
                            查看详情
                        </div>
                </div>
            </div> 
            <div v-else-if="item.typecode == 17" @click="goDetails(item.applyId,item.fianlStatus,'meal')"   class="affairs_item" >
                <div class="affirs_child">
                        <div>
                            <div class="affairs_title">
                                <img :src="item.profileImg"/>
                                <h2>我的就餐申请</h2>
                                <time >{{item.applyTime | timeSlice}}</time>
                            </div>
                            <div class="affairs_infor">
                                <div class="request_infor lineHeight">
                                    <span>就餐人数 :</span><p class="line1">{{item.num}} </p>
                                </div>
                                <div class="request_infor lineHeight">
                                    <span>开始时间 :</span>
                                    <p class="line1">{{item.beginTime |timeSlice}}</p>
                                </div>
                                <div class="request_infor lineHeight">
                                    <span >结束时间 :</span>
                                    <p class="line1">{{item.endTime  |timeSlice}} </p>
                                </div>
                                <div class="request_infor lineHeight">
                                    <span>就餐标准 :</span>
                                    <p class="line2" style="line-height:0.2rem;">{{item.mealStandard}}</p>
                                </div>
                            </div>
                        </div>
                        <div  class="skip" tag="div">
                            查看详情
                        </div>
                </div>
            </div>
            <div v-else-if="item.typecode == 18" @click="goDetails(item.applyId,item.fianlStatus,'document')"   class="affairs_item" >
                <div class="affirs_child">
                        <div>
                            <div class="affairs_title">
                                <img :src="item.profileImg"/>
                                <h2>我的行文呈批...</h2>
                                <time >{{item.applyTime | timeSlice}}</time>
                            </div>
                            <div class="affairs_infor">
                                <div class="request_infor lineHeight">
                                    <span>文件编号 :</span><p class="line1">{{item.documentNo}} </p>
                                </div>
                                <div class="request_infor lineHeight">
                                    <span>主&emsp;&emsp;送 :</span>
                                    <p class="line1">{{item.sendTo }}</p>
                                </div>
                            </div>
                        </div>
                        <div  class="skip" tag="div">
                            查看详情
                        </div>
                </div>
            </div>
            <div v-else-if="item.typecode == 19" @click="goDetails(item.applyId,item.fianlStatus,'overtime')"   class="affairs_item" >
                <div class="affirs_child">
                        <div>
                            <div class="affairs_title">
                                <img :src="item.profileImg"/>
                                <h2>我的加班申请</h2>
                                <time >{{item.applyTime | timeSlice}}</time>
                            </div>
                            <div class="affairs_infor">

                                <div class="request_infor lineHeight">
                                    <span>开始时间 :</span><p class="line1">{{item.beginTime |timeSlice}} </p>
                                </div>
                                <div class="request_infor lineHeight">
                                    <span>结束时间 :</span><p class="line1">{{item.endTime |timeSlice}} </p>
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
                        <div  class="skip" tag="div">
                            查看详情
                        </div>
                </div>
            </div>
            <div v-else-if="item.typecode == 20" @click="goDetails(item.applyId,item.fianlStatus,'position')"   class="affairs_item" >
                <div class="affirs_child">
                        <div>
                            <div class="affairs_title">
                                <img :src="item.profileImg"/>
                                <h2>我的员工调岗申请</h2>
                                <time >{{item.applyTime | timeSlice}}</time>
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
                                    <p class="line1">{{item.changeDate |timeSlice}}</p>
                                </div>
                            </div>
                        </div>
                        <div  class="skip" tag="div">
                            查看详情
                        </div>
                </div>
            </div>
            <div v-else-if="item.typecode == 21" @click="goDetails(item.applyId,item.fianlStatus,'buy')"   class="affairs_item" >
                <div class="affirs_child">
                        <div>
                            <div class="affairs_title">
                                <img :src="item.profileImg"/>
                                <h2>我的采购申请</h2>
                                <time >{{item.applyTime | timeSlice}}</time>
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
                        <div  class="skip" tag="div">
                            查看详情
                        </div>
                </div>
            </div>
            <div v-else-if="item.typecode == 22" @click="goDetails(item.applyId,item.fianlStatus,'material')"   class="affairs_item" >
                <div class="affirs_child">
                        <div>
                            <div class="affairs_title">
                                <img :src="item.profileImg"/>
                                <h2>我的物品领用申请</h2>
                                <time >{{item.applyTime | timeSlice}}</time>
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
                        <div  class="skip" tag="div">
                            查看详情
                        </div>
                </div>
            </div>
            <div v-else-if="item.typecode == 23" @click="goDetails(item.applyId,item.fianlStatus,'erpPermission')"   class="affairs_item" >
                <div class="affirs_child">
                        <div>
                            <div class="affairs_title">
                                <img :src="item.profileImg"/>
                                <h2>我的权限异动申请</h2>
                                <time >{{item.applyTime | timeSlice}}</time>
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
                        <div  class="skip" tag="div">
                            查看详情
                        </div>
                </div>
            </div>
            <div v-else-if="item.typecode == 24" @click="goDetails(item.applyId,item.fianlStatus,'recruitmentApproval')"   class="affairs_item" >
                <div class="affirs_child">
                        <div>
                            <div class="affairs_title">
                                <img :src="item.profileImg"/>
                                <h2>我的权限招聘</h2>
                                <time >{{item.applyTime | timeSlice}}</time>
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
                        <div  class="skip" tag="div">
                            查看详情
                        </div>
                </div>
            </div>
            <div v-else-if="item.typecode == 25" @click="goDetails(item.applyId,item.fianlStatus,'performance')"   class="affairs_item" >
                <div class="affirs_child">
                        <div>
                            <div class="affairs_title">
                                <img :src="item.profileImg"/>
                                <h2>我的绩效考核申请</h2>
                                <time >{{item.applyTime | timeSlice}}</time>
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
                        <div  class="skip" tag="div">
                            查看详情
                        </div>
                </div>
            </div>
             <div v-else-if="item.typecode == 27" @click="goDetails(item.applyId,item.fianlStatus,'archAplly')"   class="affairs_item" >
                <div class="affirs_child">
                        <div>
                            <div class="affairs_title">
                                <img :src="item.profileImg"/>
                                <h2>我的档案借阅申请</h2>
                                <time >{{item.applyTime | timeSlice}}</time>
                            </div>
                            <div class="affairs_infor">
                               <div class="request_infor lineHeight">
                                    <span>借阅名称 :</span><p class="line1">{{item.borrowName}} </p>
                                </div>
                                <div class="request_infor lineHeight">
                                    <span>提交人 :</span>
                                    <p class="line1">{{item.title}}</p>
                                </div>
                                <div class="request_infor lineHeight">
                                    <span>预计归还时间 :</span>
                                    <p class="line1">{{item.dossierReturnDate}}</p>
                                </div>
                                <div class="request_infor lineHeight">
                                    <span>借阅原因 :</span>
                                    <p class="line1">{{item.borrowReason}}</p>
                                </div>
                            </div>
                        </div>
                        <div  class="skip" tag="div">
                            查看详情
                        </div>
                </div>
            </div>
            <div v-else-if="item.typecode == 28" @click="goDetails(item.applyId,item.fianlStatus,'archMoveApply')"   class="affairs_item" >
                <div class="affirs_child">
                        <div>
                            <div class="affairs_title">
                                <img :src="item.profileImg"/>
                                <h2>我的档案移交申请</h2>
                                <time >{{item.applyTime | timeSlice}}</time>
                            </div>
                            <div class="affairs_infor">
                               <div class="request_infor lineHeight">
                                    <span>移交名称 :</span><p class="line1">{{item.transferName}} </p>
                                </div>
                                <div class="request_infor lineHeight">
                                    <span>提交人 :</span>
                                    <p class="line1">{{item.title}}</p>
                                </div>
                                <div class="request_infor lineHeight">
                                    <span>移交时间 :</span>
                                    <p class="line1">{{item.transferDate}}</p>
                                </div>
                            </div>
                        </div>
                        <div  class="skip" tag="div">
                            查看详情
                        </div>
                </div>
            </div>

            </div>

            <div>

            </div>
        </div>

        <div class="footer">
            <div class='tab tab_user active' >
                <svg class="icon icon-user active" aria-hidden="false">
                    <use  xlink:href="#icon-wodeshenqing-mian"></use>
                </svg>
                <span>我的申请</span>
            </div>
            <div class="tab tab_drafts" @click="tabEven">
                <svg class="icon icon-drafts" aria-hidden="false">
                    <use xlink:href="#icon-caogaoxiang-line"></use>
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
    </div>

</template>
<script>
    import InfiniteLoading from 'vue-infinite-loading';
    export default{
        data(){
            return{
                leaveData : [], //
                pageNo:1,
            }   
        },
         components: {
            InfiniteLoading
        },
        methods:{
            goback(){
                window.location.href = "epipe://?&mark=history_back"
            },
            tabEven(){
               this.$router.replace({path:'/drafts'});
            },
            go_user(id){
                window.location.href = "epipe://?&mark=userinfo&_id="+id;
            },  
            goDetails(id,type,typeName,details){

                if(type=='all_oa'){
                    window.location.href = "epipe://?&mark=oaDetails&_id="+id.applyId+'&data='+JSON.stringify({text:0});
                }else{
                    typeName=details?details:typeName
                    window.location.href = "epipe://?&mark="+typeName+"Details&_id="+id+'&data='+JSON.stringify({text:0});
                }

            },
            go_search(){
                this.$router.push({path:'/oaSearch',query:{tag:1,color:'#f80'}})
            },
            onInfinite(){
                let that = this;
                //供需
                this.axios.get('/work/my/apply/list',{
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

                                    that.leaveData = that.leaveData.concat(data)
                                    that.pageNo++;
                                    that.$refs.infiniteLoading.$emit('$InfiniteLoading:loaded');
                                }
                        }, 200);

                    }).catch(function (error) {
                        console.log(error);
                    });
                    
                }
        },
        mounted:function(){
              let that = this;
               this.axios.get('/work/my/apply/list').then((res)=>{
                        let data = [];
                        for(let i= 0;i<res.data.b.data.length;i++){
                            let obj = {};
                            for(let j = 0;j<res.data.b.data[i].extend.length;j++){
                                obj[res.data.b.data[i].extend[j].key] = res.data.b.data[i].extend[j].value
                            }
                            data.push(obj)
                        }
                        that.leaveData = data;
                    })
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
                value+=''
                return value.slice(0,-3)
            },

            statusName : function(value){
                if(value==0){
                    return '待审批'
                }else if(value == 1){
                    return '已同意'
                }else if(value == 2){
                    return '已拒绝'
                }
            }
        }
    }

</script>


<style scoped lang="stylus">

    .lesp{
        letter-spacing 3px;
    }

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

    .unfinish_head{
        background: #fd545c;
    }

    .finish_head{
        background #0fc37c;
    }

    .myaffairs_head{
        background: #f80;        
    }

    .finish_shadow{
        -webkit-box-shadow: 0 0 0.2rem rgba(15,195,124,.1);        
         box-shadow 0 0 0.2rem rgba(15,195,124,.1);
    }

    .unfinish_shadow{
        -webkit-box-shadow: 0 0 0.2rem rgba(238,65,54,.1);    
        box-shadow 0 0 0.2rem rgba(238,65,54,.1);
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
        padding-left:0.42rem;

        p{
            margin 0.1rem 0;
            // line-height 1em;
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
    .redact{
        position:absolute;
        right:0;
        top:0;
        margin-right:0.15rem;
        font-size 0.15rem;
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
        //    line-height 1em;
           left 0;
           right 0;
           margin auto;
           background-color #f5f5f5;
       }
    }

    .marginBot{
        margin-bottom 0.8rem;
    }

    .footLine:after{
        position absolute;         
        content '';
        z-index 1;
        height 0.01rem;
        width calc(100% - 0.3rem)
        left 0;
        right 0;
        top:0;
        bottom 0;
        margin auto;
        background-color #e6e6e6;       
    }

    .footer:after{
        display block;
        content '';
        position absolute;
        height 1px;
        width 200%;
        top 0;
        left -50%;
        transform scale(0.5);
        background-color #ccc;
        z-index 10
    }

    .footer{
        position fixed;
        width 100%;
        height 0.5rem;
        bottom 0;
        left 0;
        font-size:0.11rem;
        background-color #fff;
        z-index 3;

        .tab{
            float left;
            text-align center;
            height 100%;
            width 50%;
            padding-top:0.05rem;
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

        .tab_user:hover{
            
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
            width:2.4rem;
            line-height 1.2em;
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
        line-height:0.44rem;
        margin-bottom 0.15rem;
    }
</style>