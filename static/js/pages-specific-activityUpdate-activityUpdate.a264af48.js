(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["pages-specific-activityUpdate-activityUpdate"],{"22b0":function(e,t,a){var i=a("24fb");t=i(!1),t.push([e.i,'@charset "UTF-8";\r\n/**\r\n * 这里是uni-app内置的常用样式变量\r\n *\r\n * uni-app 官方扩展插件及插件市场（https://ext.dcloud.net.cn）上很多三方插件均使用了这些样式变量\r\n * 如果你是插件开发者，建议你使用scss预处理，并在插件代码中直接使用这些变量（无需 import 这个文件），方便用户通过搭积木的方式开发整体风格一致的App\r\n *\r\n */\r\n/**\r\n * 如果你是App开发者（插件使用者），你可以通过修改这些变量来定制自己的插件主题，实现自定义主题功能\r\n *\r\n * 如果你的项目同样使用了scss预处理，你也可以直接在你的 scss 代码中使用如下变量，同时无需 import 这个文件\r\n */\r\n/* 引入uview样式 */\r\n/* 颜色变量 */\r\n/* 行为相关颜色 */\r\n/* 文字基本颜色 */\r\n/* 背景颜色 */\r\n/* 边框颜色 */\r\n/* 尺寸变量 */\r\n/* 文字尺寸 */\r\n/* 图片尺寸 */\r\n/* Border Radius */\r\n/* 水平间距 */\r\n/* 垂直间距 */\r\n/* 透明度 */\r\n/* 文章场景相关 */.cu-modal.bottom-modal.show[data-v-421281d7]{z-index:9999;overflow:hidden}.cu-modal.bottom-modal .cu-dialog[data-v-421281d7]{overflow-y:scroll}.cu-modal-content .option-list-pop[data-v-421281d7]{height:100%;max-height:80vh;overflow-y:scroll;padding:%?20?% 0 %?40?%}.cu-card > .cu-item[data-v-421281d7]{margin:0;padding:%?30?%}.cu-card.article > .cu-item .content .text-content[data-v-421281d7]{height:auto;padding:%?30?% 0 0}.cu-card.article > .cu-item .title[data-v-421281d7]{line-height:%?40?%}.view[data-v-421281d7] p img{width:100%}.uni-popup[data-v-421281d7]{z-index:9999}.uni-popup .option-list-pop[data-v-421281d7]{max-height:80vh;overflow:scroll}.uni-popup .btn-group[data-v-421281d7]{width:100%;display:-webkit-box;display:-webkit-flex;display:flex;-webkit-justify-content:space-around;justify-content:space-around;height:%?100?%;-webkit-box-align:center;-webkit-align-items:center;align-items:center;background-color:#fff;padding:%?20?% 0}',""]),e.exports=t},"2c94":function(e,t,a){"use strict";(function(e){var i=a("4ea4");a("4de4"),a("4160"),a("d81d"),a("4e82"),a("a434"),a("b64b"),a("159b"),Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0,a("96cf");var o=i(a("1da1")),n=i(a("eaae")),l={components:{bxform:n.default},data:function(){return{appName:"daq",optionFormType:"add",optionForm:{option_seq:0,option_view_no:"",answer:"",option_value:"",option_img_explain:""},optionsConfig:{},optionData:{},optionFormConfig:null,activityFormType:"form",itemFormType:"add",viewCfg:[],currentViewCfg:0,maxSeq:1,question_no:"",isQuestion:!1,questionType:"文本",activityNo:null,activityData:{activity_no:"",title:"",end_time:"",remark:"",end_remark:""},showModal:!1,showAddForm:!0,configCols:[{label:"问题编号",column:"item_no",disabled:!0,value:"",type:"input",display:!1,isRequire:!1,isShowExp:[{colName:"item_type",ruleType:"eq",value:"null"}],options:[]},{label:"问题类型",column:"item_type",value:"文本",type:"radioFk",display:!0,isRequire:!0,isShowExp:"",options:[{label:"文本",value:"文本"},{label:"数字",value:"数字"},{label:"选项",value:"选项"},{label:"图片",value:"图片"},{label:"时间日期",value:"时间日期"},{label:"地址",value:"地址"},{label:"引用",value:"引用"}]},{label:"问题名称",column:"item_title",value:"",type:"input",display:!0,isRequire:!0,isShowExp:[{colName:"item_type",ruleType:"neq",value:""}],options:[]},{label:"图片说明",column:"option_img_explain",value:"",type:"images",display:!0,isRequire:!1,isShowExp:[{colName:"item_type",ruleType:"neq",value:""}],options:[],srvInfo:{serviceName:"srv_bxfile_service",interfaceName:"add",app_no:this.appName?this.appName:"daq",table_name:"",columns:""}},{label:"选项列表",column:"options_list",value:"",type:"list",display:!0,isRequire:!1,isShowExp:[{colName:"item_type",ruleType:"eq",value:"选项"},{colName:"item_no",ruleType:"neq",value:""}],optionsConfig:{selectServiceName:"srvdaq_option_cfg_select",addServiceName:"srvdaq_option_cfg_add",deleteServiceName:"srvdaq_option_cfg_delete",updateServiceName:"srvdaq_option_cfg_update",appNo:"daq",conditions:[{colName:"item_no",ruleType:"eq",value:"item_no"}],key_col:{refed_col:"id",key_disp_col:"option_value",value:"option_value",no:"option_seq"},model:{item_no:"",option_value:"",option_seq:""}},options:[]},{label:"选项类型",column:"option_type",value:"单选",type:"radioFk",display:!0,isRequire:!0,isShowExp:[{colName:"item_type",ruleType:"eq",value:"选项"}],options:[{label:"单选",value:"单选"},{label:"多选",value:"多选"}]},{label:"是否必填",column:"is_require",value:"是",type:"radio",display:!0,isRequire:!0,isShowExp:[{colName:"item_type",ruleType:"neq",value:""}],options:["是","否"]},{label:"行数",column:"view_model",value:"input",type:"radioFk",display:!0,isRequire:!0,isShowExp:[{colName:"item_type",ruleType:"eq",value:"文本"}],options:[{value:"input",label:"单行"},{value:"textarea",label:"多行"}]},{label:"最大字数",column:"max_len",value:50,type:"number",display:!0,isRequire:!0,isShowExp:[{colName:"item_type",ruleType:"eq",value:"文本"}],options:[]},{label:"数字精度",column:"decimal_places",value:"Int",type:"radioFk",display:!0,isRequire:!0,isShowExp:[{colName:"item_type",ruleType:"eq",value:"数字"}],options:[{value:"number",label:"整数"},{value:"digit",label:"小数"}]},{label:"数字最大值",column:"max",value:100,type:"number",display:!0,isRequire:!0,isShowExp:[{colName:"item_type",ruleType:"eq",value:"数字"}],options:[]},{label:"数字最小值",column:"min",value:0,type:"number",display:!0,isRequire:!0,isShowExp:[{colName:"item_type",ruleType:"eq",value:"数字"}],options:[]},{label:"时间类型",column:"format",value:"date",type:"radioFk",display:!0,isRequire:!0,isShowExp:[{colName:"item_type",ruleType:"eq",value:"时间日期"}],options:[{value:"dateTime",label:"年月日时分秒"},{value:"date",label:"年月日"},{value:"time",label:"时分秒"}]},{label:"答案",column:"answer",value:"",type:"input",display:!1,isRequire:!1,isShowExp:[{colName:"item_type",ruleType:"neq",value:"图片"},{colName:"item_type",ruleType:"neq",value:"选项"},{colName:"item_type",ruleType:"neq",value:"用户"},{colName:"item_type",ruleType:"neq",value:"引用"}],options:[]},{label:"引用类型",column:"ref_type",value:"",type:"input",display:!1,isRequire:!1,isShowExp:[{colName:"item_type",ruleType:"eq",value:"引用"}],options:[]},{label:"目标APP",column:"srv_app",value:"",type:"treeSelector",option_list_v2:{refed_col:"app_no",srv_app:"config",serviceName:"srvconfig_app_list_select",key_disp_col:"app_name"},display:!1,isRequire:!1,isShowExp:[{colName:"item_type",ruleType:"eq",value:"引用"},{colName:"ref_type",ruleType:"eq",value:"all"}],options:[]},{label:"目标服务",column:"serviceName",value:"",type:"treeSelector",option_list_v2:{refed_col:"service_name",srv_app:"",srv_app_exp:{type:"column",value:"srv_app"},serviceName:"srvsys_service_select",key_disp_col:"service_view_name",conditions:[{colName:"service_type",ruleType:"eq",value:"select"}]},display:!1,isRequire:!1,isShowExp:[{colName:"item_type",ruleType:"eq",value:"引用"},{colName:"ref_type",ruleType:"eq",value:"all"}],options:[]},{label:"引用字段",column:"refed_col",value:"",type:"treeSelector",option_list_v2:{refed_col:"columns",srv_app:"",srv_app_exp:{type:"column",value:"srv_app"},serviceName:"srvsys_service_columnex_v2_select",key_disp_col:"label",conditions:[{colName:"service_name",value:"",ruleType:"eq",value_exp:{type:"column",value:"serviceName"}},{colName:"use_type",value:"list",ruleType:"eq"}]},display:!1,isRequire:!1,isShowExp:[{colName:"item_type",ruleType:"eq",value:"引用"},{colName:"ref_type",ruleType:"eq",value:"all"}],options:[]},{label:"显示字段",column:"key_disp_col",value:"",type:"treeSelector",option_list_v2:{refed_col:"columns",srv_app:"",srv_app_exp:{type:"column",value:"srv_app"},serviceName:"srvsys_service_columnex_v2_select",key_disp_col:"label",conditions:[{colName:"service_name",value:"",ruleType:"eq",value_exp:{type:"column",value:"serviceName"}},{colName:"use_type",value:"list",ruleType:"eq"}]},display:!1,isRequire:!1,isShowExp:[{colName:"item_type",ruleType:"eq",value:"引用"},{colName:"ref_type",ruleType:"eq",value:"all"}],options:[]},{label:"分值",column:"points",value:"",type:"Float",display:!1,isRequire:!1,isShowExp:[{colName:"item_type",ruleType:"neq",value:""}],options:[]},{label:"图片数量",column:"max_num",value:3,type:"number",display:!0,isRequire:!0,isShowExp:[{colName:"item_type",ruleType:"eq",value:"图片"}],options:[]}],inputBut:[{name:"上移",key:"up",icon:"cuIcon-top"},{name:"下移",key:"down",icon:"cuIcon-down"},{name:"编辑",key:"edit",icon:"cuIcon-edit"},{name:"删除",key:"delete",color:"red",icon:"cuIcon-deletefill"}]}},onLoad:function(){this.$route.query.hasOwnProperty("activity_no")&&(this.activityNo=this.$route.query.activity_no,this.getActivityInfo(this.activityNo))},computed:{itemModel:{get:function(){if(this.showModal)return this.configCols},set:function(e){this.configCols=this.configCols.map((function(t,a){return t.column===e.col&&(t.value=e.val),"options_list"===t.column&&(t["options"]=[]),t}))}}},methods:{getConfigCols:function(){this.deepClone(this.configCols)},updateOption:function(){},addOption:function(){},deleteOption:function(){},getOptionList:function(){this.getServiceUrl("daq","srvdaq_option_cfg_select","select"),model.option_no},hideOptionPopup:function(){this.optionData={},this.$refs.optionListPop.close(),this.showModal=!0},submitOption:function(){var t=this;return(0,o.default)(regeneratorRuntime.mark((function a(){var i,o,n,l,s;return regeneratorRuntime.wrap((function(a){while(1)switch(a.prev=a.next){case 0:if(i=t.$refs.bxformQuestion.getFieldModel(),i){a.next=3;break}return a.abrupt("return");case 3:if(e.log(t.optionData),o=t.optionData.model,n=t.getServiceUrl(t.optionsConfig.appNo,t.optionsConfig[t.optionData.type+"ServiceName"],t.optionData.type),l=[{serviceName:t.optionsConfig[t.optionData.type+"ServiceName"],condition:[{colName:"id",ruleType:"eq",value:o.id}],data:[i]}],"update"!==t.optionData.type||o.id){a.next=9;break}return a.abrupt("return");case 9:if("add"!==t.optionData.type||t.optionData.model.item_no){a.next=13;break}return a.abrupt("return");case 13:"add"===t.optionData.type&&t.optionData.model.item_no;case 14:return a.next=16,t.$http.post(n,l);case 16:s=a.sent,"SUCCESS"===s.data.state&&e.log("选项修改/添加成功",s.data.response[0].response),t.getActivityInfo(t.activityNo).then((function(e){t.showAddForm=!t.showAddForm,t.updateQuestions(t.viewCfg[t.currentViewCfg]),t.hideOptionPopup()})),uni.showToast({title:s.data.resultMessage,icon:"none"});case 20:case"end":return a.stop()}}),a)})))()},showOptionlist:function(e){var t=this;return(0,o.default)(regeneratorRuntime.mark((function a(){var i;return regeneratorRuntime.wrap((function(a){while(1)switch(a.prev=a.next){case 0:if(t.optionData=e.data,t.optionsConfig=e.config,t.showModal=!1,!e.data||!e.data.type||"draft"!==e.data.type){a.next=7;break}e.data.type="add",a.next=11;break;case 7:return a.next=9,t.getOptionData(e.data.model);case 9:i=a.sent,t.optionData.model=i;case 11:t.getOptionV2(e),t.$refs.optionListPop.open();case 13:case"end":return a.stop()}}),a)})))()},optionValueChange:function(t){e.log(t)},optionListPopChange:function(t){e.log(t)},getOptionData:function(e){var t=this;return(0,o.default)(regeneratorRuntime.mark((function a(){var i,o,n;return regeneratorRuntime.wrap((function(a){while(1)switch(a.prev=a.next){case 0:return i=t.getServiceUrl(t.appName?t.appName:"daq","srvdaq_option_cfg_select","select"),o={serviceName:"srvdaq_option_cfg_select",colNames:["*"],condition:[{colName:"option_no",ruleType:"eq",value:e.option_no}]},a.next=4,t.$http.post(i,o);case 4:if(n=a.sent,!("SUCCESS"===n.data.state&&n.data.data.length>0)){a.next=7;break}return a.abrupt("return",n.data.data[0]);case 7:case"end":return a.stop()}}),a)})))()},getOptionV2:function(t){var a=this;return(0,o.default)(regeneratorRuntime.mark((function i(){var o,n,l,s,r,u;return regeneratorRuntime.wrap((function(i){while(1)switch(i.prev=i.next){case 0:return o=t.data,n=t.config,l=o.type,s="daq",a.optionFormType=l,e.log(n[l+"ServiceName"]),i.next=7,a.getServiceV2(n[l+"ServiceName"],l,l,s||"daq");case 7:r=i.sent,u=r._fieldInfo.filter((function(e,t){if("item_no"===e.column&&(e.disabled=!0,e.display=!1),e.value||(e.value=""),"activity_no"===e.column&&(e["disabled"]=!0),o.model&&Object.keys(o.model).forEach((function(t){o.model[t]&&e.column===t&&(e.value=o.model[t])})),1===e["in_"+l])return e})),a.optionFormConfig=u;case 10:case"end":return i.stop()}}),i)})))()},deleteListOptions:function(t){var a=this,i=a.fieldData.optionsConfig.deleteServiceName,o=a.fieldData.optionsConfig.appNo,n=a.optionsDatas[t]["model"].id,l=[{serviceName:i,condition:[{colName:"id",ruleType:"eq",value:n}]}];"draft"!==a.optionsDatas[t]["type"]&&a.onRequest("delete",i,l,o).then((function(i){"SUCCESS"===i.data.state&&(a.optionsDatas.splice(t,1),e.log("删除成功",i.data))}))},valueChange:function(t){e.log("value-change",t),t.column&&"item_type"===t.column&&(this.questionType=t.value)},onFieldsItem:function(t){var a=this;e.log(t);for(var i=t.item,o=this.viewCfg,n=null,l=null,s=null,r=0;r<o.length;r++)i.column===o[r]["column"]&&(n=r);var u=["",""];switch(t.button.key){case"up":l=n-1,e.log("upIndex",l),u[0]=o[l],u[1]=o[n];break;case"down":s=n+1,e.log("downIndex",s),u[0]=o[n],u[1]=o[s];break;case"delete":break;default:break}if("up"!==t.button.key||2!==u.length||u[0])if("down"!==t.button.key||2!==u.length||u[1])if("up"===t.button.key||"down"===t.button.key){var c=u.map((function(e){return e.seq}));u[0]["seq"]=c[1],u[1]["seq"]=c[0],this.updateQuestion(u[0]).then((function(e){a.updateQuestion(u[1]).then((function(e){a.viewCfg=[],a.viewCfg.length=0,a.getActivityInfo(a.activityNo)}))}))}else"delete"===t.button.key?this.deleteQuestion(i):"edit"===t.button.key&&(this.isQuestion=!0,e.log("编辑 updates",o[n],this.configCols),this.question_no=t.item.column,this.currentViewCfg=n,this.updateQuestions(o[n]));else uni.showToast({title:"此问题已排在最末",icon:"none"});else uni.showToast({title:"此问题已排在最前",icon:"none"});e.log("需要编辑的列",u,n,this.configCols)},deleteQuestion:function(e){var t=this;uni.showModal({title:"提示",content:"确认删除此问题？",success:function(a){if(a.confirm){var i=t.getServiceUrl(t.appName?t.appName:"daq","srvdaq_item_cfg_delete","delete"),o=[{serviceName:"srvdaq_item_cfg_delete",condition:[{colName:"item_no",ruleType:"eq",value:e.column}]}];t.$http.post(i,o).then((function(e){"SUCCESS"===e.data.resultCode?(uni.showToast({title:"删除成功",icon:"none"}),t.getActivityInfo(t.activityNo)):uni.showToast({title:"删除失败",icon:"none"})}))}else uni.showToast({title:"取消删除",icon:"none"})}})},updateQuestions:function(t){var a=this;return(0,o.default)(regeneratorRuntime.mark((function i(){var o,n,l;return regeneratorRuntime.wrap((function(i){while(1)switch(i.prev=i.next){case 0:a.showAddForm=!a.showAddForm,o=t,n=t.item_type_attr,e.log("字段额外属性",n),l=a.configCols.map((function(e,t){switch(e.column){case"item_no":return e.value=o.column,e;case"item_type":switch(o.type){case"number":e.value="数字";break;case"input":e.value="文本";break;case"radio":case"radioFk":case"checkbox":case"checkboxFk":e.value="选项";break;case"images":e.value="图片";break;case"date":e.value="时间日期";break;case"time":e.value="时间日期";break;case"dateTime":e.value="时间日期";break;case"treeSelector":e.value="引用";default:break}return e;case"item_title":return e.value=o.label,e;case"option_type":return e.value="single"===n.radioType?"单选":"multi"===n.radioType?"多选":"",e;case"is_require":return e.value=!0===o.isRequire?"是":"否",e;case"max_len":return e.value=n.max_len,e;case"decimal_places":return e.value=n.decimal_places,e;case"max":return e.value=n.max,e;case"view_model":return e.value=n.view_model,"单行"===e.value?e.value="input":e.value="textarea",e;case"option_img_explain":return e.value=o.option_img_explain,e;case"options_list":return e.options=o._rawData.option_data,e;case"min":return e.value=n.min,e;case"format":return e.value=n.dateType,e;case"max_num":return e.value=n.max_num,e;case"format":return e.value=n.dateType,e;case"ref_type":return e.value=n.ref_type,e;case"srv_app":return e.value=n.srv_app,e;case"serviceName":return e.value=n.serviceName,e;case"refed_col":return e.value=n.refed_col,e;case"key_disp_col":return e.value=n.key_disp_col,e;default:break}return e})),a.configCols=l,a.showModal=!0;case 7:case"end":return i.stop()}}),i)})))()},updateQuestion:function(e){var t=this;return(0,o.default)(regeneratorRuntime.mark((function a(){var i,o,n;return regeneratorRuntime.wrap((function(a){while(1)switch(a.prev=a.next){case 0:return i=t.getServiceUrl(t.appName?t.appName:"daq","srvdaq_item_cfg_update","update"),o=[{serviceName:"srvdaq_item_cfg_update",condition:[{colName:"item_no",ruleType:"eq",value:e.column}],data:[{item_seq:e.seq}]}],a.next=4,t.$http.post(i,o);case 4:return n=a.sent,a.abrupt("return","SUCCESS"===n.data.resultCode);case 6:case"end":return a.stop()}}),a)})))()},showReview:function(){uni.redirectTo({url:"/pages/specific/questionnaire/questionnaire?formType=detail&activity_no="+this.activityNo})},getActivityInfo:function(t){var a=this;return(0,o.default)(regeneratorRuntime.mark((function i(){var o,n,l,s,r;return regeneratorRuntime.wrap((function(i){while(1)switch(i.prev=i.next){case 0:return o=a,n=a.getServiceUrl(a.appName?a.appName:"daq","srvdaq_init_view_select","select"),l={serviceName:"srvdaq_init_view_select",condition:[{colName:"activity_no",ruleType:"eq",value:t},{colName:"biz_type",ruleType:"eq",value:"cfg"}]},i.next=5,a.$http.post(n,l);case 5:s=i.sent,e.log("srvdaq_init_view_select",s),"SUCCESS"===s.data.state&&s.data.data.length>0&&(o.activityData=s.data.data[0],o.viewCfg=s.data.data[0].item_data,o.configCols=o.configCols.map((function(e){return"points"===e.column&&(e.isShowExp=null,"自测"===o.activityData.info_collect_type&&(e.display=!0)),"answer"===e.column&&"自测"===o.activityData.info_collect_type&&o.configCols.forEach((function(t){"item_type"===t.column&&"图片"!==t.value&&"选项"!==t.value&&(e.display=!0)})),e})),r=o.viewCfg.map((function(e){return e.item_seq})),o.maxSeq=r.sort()[r.length-1],o.viewCfg=a.viewCfg.map((function(e){return a.getConfig(e)})),o.viewCfg=o.arraySort(o.viewCfg,"seq"));case 8:case"end":return i.stop()}}),i)})))()},addItem:function(t){var a=this;return(0,o.default)(regeneratorRuntime.mark((function i(){var o,n,l,s,r,u,c,p;return regeneratorRuntime.wrap((function(i){while(1)switch(i.prev=i.next){case 0:if(o=a,n=a.$refs.bxformAddQuestion.getFieldModel(),e.log("itemData",n),a.showAddForm=!a.showAddForm,l=a.getServiceUrl(a.appName?a.appName:"daq","srvdaq_item_cfg_add","add"),s=[{serviceName:"srvdaq_item_cfg_add",data:[]}],a.isQuestion&&(l=a.getServiceUrl(a.appName?a.appName:"daq","srvdaq_item_cfg_update","operate"),s=[{serviceName:"srvdaq_item_cfg_update",condition:[{colName:"item_no",ruleType:"eq",value:a.question_no}],data:[]}]),!n){i.next=22;break}return r=a.getCoulmnConfig(n),e.log("newInput",r),r.activity_no=a.activityNo,a.isQuestion||(u=a.viewCfg.map((function(e){return e.seq})).filter((function(e){return e&&e})).sort(),r["item_seq"]=u&&u.length>0?u[u.length-1]+1:1),e.log("newInput",r),s[0].data.push(r),i.next=16,a.$http.post(l,s);case 16:c=i.sent,e.log("srvdaq_item_cfg_add",c),"SUCCESS"===c.data.state&&c.data.response.length>0&&(o.getActivityInfo(o.activityNo),t&&"save"===t&&(a.showAddForm=!a.showAddForm,p=c.data.response[0].response.effect_data[0].item_no,e.log("question_no",p),o.configCols=o.configCols.map((function(e,t){return"item_no"===e.column&&(e.value=p),"options_list"===e.column&&(e.display=!0,e.options=[]),e})),Array.isArray(o.optionFormConfig)&&(o.optionFormConfig=o.optionFormConfig.map((function(e){return"item_no"!==e.column&&(e.value=""),e}))))),"save"!==t?o.hideModal():a.isQuestion=!0,i.next=23;break;case 22:e.log("表单填写不完整");case 23:case"end":return i.stop()}}),i)})))()},DateChange:function(e){this.date=e.detail.value},toUpdate:function(){uni.redirectTo({url:"/pages/specific/activityUpdate/activityUpdate?id=1"})},toadded:function(){uni.redirectTo({url:"/pages/specific/added/added?activity_no="+this.activityNo+"&serviceName=srvdaq_activity_cfg_add&type=update"})},activeFc:function(t){uni.showToast({title:"获取输入成功"}),e.log(JSON.stringify(t))},showAdd:function(e){this.isQuestion=!1,this.showModal=!0},hideModal:function(e){"refresh"===e&&this.getActivityInfo(this.activityNo),this.configCols.map((function(e){"问题类型"===e.label?e.value="文本":e.value=""})),this.showAddForm=!this.showAddForm,this.showModal=!1},getConfig:function(e){var t={label:e.item_title,column:e.item_no,srvInfo:{serviceName:"srvdaq_activity_result_submit",appNo:this.appName?this.appName:"daq"},value:e.value,type:e.item_type,isRequire:"是"===e.is_require,isShowExp:[],options:[],seq:e.item_seq,display:!0,disabled:!1,item_type_attr:e.item_type_attr,buttons:[],points:e.points,answer:e.answer,option_img_explain:e.option_img_explain,_rawData:e,option_list_v2:e.option_list_v2};switch(t.buttons=this.inputBut,e.item_type){case"文本":t.type="textarea"===e.item_type_attr["view_model"]?"textarea":"input";break;case"图片":t.type="images",t["fileNum"]=e.item_type_attr["fileNum"];break;case"选项":t.type=e.item_type_attr.radioType&&"multi"===e.item_type_attr.radioType?"checkboxFk":"radioFk",t.options=e.option_data.map((function(e){return e.value=e.option_value,e.showimg=!1,e.label=e.option_view_no?e.option_view_no+". "+e.option_value:e.option_value,e}));break;case"时间日期":t.type=e.item_type_attr.dateType?e.item_type_attr.dateType:"dateTime";break;case"数字":t.type=e.item_type_attr.numberType?e.item_type_attr.numberType:"number";break;case"地址":t.type="cascader",t.srvInfo={serviceName:"srvconfig_area_adj_select",appNo:"config",isTree:!0,column:"no",showCol:"path_name"};break;case"引用":t.type="treeSelector",t.option_list_v2={refed_col:e.item_type_attr.refed_col,srv_app:e.item_type_attr.srv_app,serviceName:e.item_type_attr.serviceName,key_disp_col:e.item_type_attr.key_disp_col};break;default:t.type=e.item_type;break}return t}}};t.default=l}).call(this,a("5a52")["default"])},"3ae8":function(e,t,a){"use strict";var i=a("9c97e"),o=a.n(i);o.a},"5b29":function(e,t,a){"use strict";a.d(t,"b",(function(){return o})),a.d(t,"c",(function(){return n})),a.d(t,"a",(function(){return i}));var i={uniPopup:a("8a02").default},o=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("v-uni-view",[a("cu-custom",{attrs:{bgColor:"bg-blue",isBack:!1}},[a("template",{attrs:{slot:"backText"},slot:"backText"},[e._v("返回")]),a("template",{attrs:{slot:"content"},slot:"content"},[e._v("活动问题编辑")])],2),a("v-uni-view",{staticClass:"cu-card article"},[a("v-uni-view",{staticClass:"cu-item shadow"},[a("v-uni-view",{staticClass:"title"},[a("v-uni-text",[e._v(e._s(e.activityData.title))])],1),a("v-uni-view",{staticClass:"content"},[a("v-uni-view",{staticClass:"desc"},[a("v-uni-view",{staticClass:"text-content",domProps:{innerHTML:e._s(JSON.parse(JSON.stringify(e.activityData.remark).replace(/\<img/gi,"<img width=100% height=100%   ")))}})],1)],1)],1)],1),a("v-uni-view",{staticClass:"cu-bar bg-white solid-bottom margin-top"},[a("v-uni-view",{staticClass:"action"},[a("v-uni-text",{staticClass:"cuIcon-titles text-orange "}),e._v("已设置的问题：")],1)],1),a("v-uni-view",{staticClass:"cu-card article"},[a("v-uni-view",{staticClass:"cu-item shadow"},[e.viewCfg.length>0?a("bxform",{ref:"bxformActivity",attrs:{pageType:e.activityFormType,fields:e.viewCfg,BxformType:e.activityFormType},on:{"on-form-item":function(t){arguments[0]=t=e.$handleEvent(t),e.onFieldsItem.apply(void 0,arguments)}}}):e._e(),a("v-uni-view",{staticStyle:{width:"100%",height:"100upx",opacity:"0"}},[e._v("底部占位盒子")])],1)],1),a("v-uni-view",{staticClass:"cu-bar tabbar bg-white foot"},[a("v-uni-view",{staticClass:"action text-green",on:{click:function(t){arguments[0]=t=e.$handleEvent(t),e.toadded.apply(void 0,arguments)}}},[a("v-uni-view",{staticClass:"cuIcon-settingsfill"}),e._v("设置活动")],1),a("v-uni-view",{staticClass:"action text-gray",on:{click:function(t){arguments[0]=t=e.$handleEvent(t),e.showReview.apply(void 0,arguments)}}},[a("v-uni-view",{staticClass:"cuIcon-attentionfill"},[a("v-uni-view",{staticClass:" badge"})],1),e._v("预览")],1),a("v-uni-view",{staticClass:"action text-gray add-action"},[a("v-uni-button",{staticClass:"cu-btn cuIcon-add bg-green shadow",on:{click:function(t){arguments[0]=t=e.$handleEvent(t),e.showAdd.apply(void 0,arguments)}}}),e._v("添加问题")],1)],1),a("v-uni-view",{staticClass:"cu-modal bottom-modal",class:e.showModal?"show":""},[a("v-uni-view",{staticClass:"cu-dialog",on:{click:function(t){t.stopPropagation(),arguments[0]=t=e.$handleEvent(t)}}},[e.configCols.length>0&&e.showModal?a("v-uni-view",{staticClass:"cu-modal-content"},[a("bxform",{key:e.showAddForm,ref:"bxformAddQuestion",staticClass:"option-list-pop",attrs:{pageType:e.itemFormType,fields:e.itemModel,BxformType:e.itemFormType},on:{"show-option-list":function(t){arguments[0]=t=e.$handleEvent(t),e.showOptionlist.apply(void 0,arguments)},"value-blur":function(t){arguments[0]=t=e.$handleEvent(t),e.valueChange.apply(void 0,arguments)}}}),a("v-uni-view",{staticClass:"cu-bar btn-group"},[a("v-uni-button",{staticClass:"cu-btn bg-grey shadow-blur round",on:{click:function(t){arguments[0]=t=e.$handleEvent(t),e.hideModal.apply(void 0,arguments)}}},[e._v("取消")]),"选项"!==e.questionType||e.configCols[0].value?e._e():a("v-uni-button",{staticClass:"cu-btn bg-green shadow-blur round",on:{click:function(t){arguments[0]=t=e.$handleEvent(t),e.addItem("save")}}},[e._v("保存问题")]),"选项"===e.questionType&&e.configCols[0].value?a("v-uni-button",{staticClass:"cu-btn bg-blue shadow-blur round",on:{click:function(t){arguments[0]=t=e.$handleEvent(t),e.hideModal("refresh")}}},[e._v("完成")]):e._e(),"选项"!==e.questionType?a("v-uni-button",{staticClass:"cu-btn bg-blue shadow-blur round",on:{click:function(t){arguments[0]=t=e.$handleEvent(t),e.addItem.apply(void 0,arguments)}}},[e._v("提交")]):e._e()],1)],1):e._e()],1)],1),a("uni-popup",{ref:"optionListPop",attrs:{type:"bottom"},on:{change:function(t){arguments[0]=t=e.$handleEvent(t),e.optionListPopChange.apply(void 0,arguments)}}},[e.optionFormConfig?a("bxform",{ref:"bxformQuestion",staticClass:"option-list-pop",attrs:{pageType:e.optionFormType,fields:e.optionFormConfig,BxformType:e.optionFormType},on:{"value-blur":function(t){arguments[0]=t=e.$handleEvent(t),e.optionValueChange.apply(void 0,arguments)}}}):e._e(),a("v-uni-view",{staticClass:"btn-group"},[a("v-uni-button",{staticClass:"cu-btn bg-grey shadow-blur round",on:{click:function(t){arguments[0]=t=e.$handleEvent(t),e.hideOptionPopup.apply(void 0,arguments)}}},[e._v("取消")]),a("v-uni-button",{staticClass:"cu-btn bg-blue shadow-blur round",on:{click:function(t){arguments[0]=t=e.$handleEvent(t),e.submitOption.apply(void 0,arguments)}}},[e._v("提交")])],1)],1)],1)},n=[]},"9c97e":function(e,t,a){var i=a("22b0");"string"===typeof i&&(i=[[e.i,i,""]]),i.locals&&(e.exports=i.locals);var o=a("4f06").default;o("1a3f57cc",i,!0,{sourceMap:!1,shadowMode:!1})},"9da8":function(e,t,a){"use strict";a.r(t);var i=a("2c94"),o=a.n(i);for(var n in i)"default"!==n&&function(e){a.d(t,e,(function(){return i[e]}))}(n);t["default"]=o.a},d0c4:function(e,t,a){"use strict";a.r(t);var i=a("5b29"),o=a("9da8");for(var n in o)"default"!==n&&function(e){a.d(t,e,(function(){return o[e]}))}(n);a("3ae8");var l,s=a("f0c5"),r=Object(s["a"])(o["default"],i["b"],i["c"],!1,null,"421281d7",null,!1,i["a"],l);t["default"]=r.exports}}]);