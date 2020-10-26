<template>
	<view>
		<cu-custom bgColor="bg-blue" :isBack="true">
			<block slot="backText">返回</block>
			<block slot="content">活动问题编辑</block>
		</cu-custom>
		<view class="cu-card article">
			<view class="cu-item shadow">
				<view class="title">
					<text>{{ activityData.title }}</text>
					<!-- <view class="text-cut">{{ activityData.title }}</view> -->
				</view>
				<view class="content">
					<view class="desc">
						<view class="text-content" v-html="JSON.parse(JSON.stringify(activityData.remark).replace(/\<img/gi, '<img width=100% height=100%   '))"></view>
						<!-- <view class="text-content">{{ activityData.remark }}</view> -->
					</view>
				</view>
			</view>
		</view>
		<view class="cu-bar bg-white solid-bottom margin-top">
			<view class="action">
				<text class="cuIcon-titles text-orange "></text>
				已设置的问题：
			</view>
		</view>
		<view class="cu-card article">
			<view class="cu-item shadow">
				<bxform ref="bxformActivity" v-if="viewCfg.length > 0" :pageType="activityFormType" @on-form-item="onFieldsItem" :fields="viewCfg" :BxformType="activityFormType"></bxform>
				<view style="width: 100%;height: 100upx;opacity:0;">底部占位盒子</view>
			</view>
		</view>
		<view class="cu-bar tabbar bg-white foot">
			<view class="action text-green" @click="toadded">
				<view class="cuIcon-settingsfill"></view>
				设置活动
			</view>
			<view class="action text-gray" @click="showReview">
				<view class="cuIcon-attentionfill"><view class=" badge"></view></view>
				预览
			</view>

			<view class="action text-gray add-action">
				<button class="cu-btn cuIcon-add bg-green shadow" @click="showAdd"></button>
				添加问题
			</view>
		</view>
		<view class="cu-modal bottom-modal" :class="showModal ? 'show' : ''">
			<view class="cu-dialog" @tap.stop>
				<view class="cu-modal-content" v-if="configCols.length > 0 && showModal">
					<bxform
						class="option-list-pop"
						ref="bxformAddQuestion"
						@show-option-list="showOptionlist"
						:pageType="itemFormType"
						:fields="itemModel"
						:BxformType="itemFormType"
						@value-blur="valueChange"
						:key="showAddForm"
					></bxform>
					<view class="cu-bar btn-group">
						<button class="cu-btn bg-grey shadow-blur round" @tap="hideModal">取消</button>
						<button class="cu-btn bg-green shadow-blur round" @click="addItem('save')" v-if="questionType === '选项' && !configCols[0].value">保存问题</button>
						<button class="cu-btn bg-blue shadow-blur round" @click="hideModal('refresh')" v-if="questionType === '选项' && configCols[0].value">完成</button>
						<button class="cu-btn bg-blue shadow-blur round" @click="addItem" v-if="questionType !== '选项'">提交</button>
					</view>
				</view>
			</view>
		</view>
		<uni-popup ref="optionListPop" type="bottom" @change="optionListPopChange">
			<bxform
				class="option-list-pop"
				v-if="optionFormConfig"
				ref="bxformQuestion"
				:pageType="optionFormType"
				:fields="optionFormConfig"
				:BxformType="optionFormType"
				@value-blur="optionValueChange"
			></bxform>
			<view class="btn-group">
				<button class="cu-btn bg-grey shadow-blur round" @tap="hideOptionPopup">取消</button>
				<button class="cu-btn bg-blue shadow-blur round" @tap="submitOption">提交</button>
			</view>
		</uni-popup>
	</view>
</template>

<script>
import bxform from '@/components/bx-form/bx-form.vue';
export default {
	components: {
		bxform
		// bxform: e => import('@/components/bx-form/bx-form.vue')
	},
	data() {
		return {
			appName: 'daq',
			optionFormType: 'add',
			optionForm: {
				option_seq: 0, // 选项序号
				option_view_no: '', // 选项标识
				answer: '', //是否为答案
				option_value: '', //选项值
				option_img_explain: '' //选项图片说明
			},
			optionsConfig: {},
			optionData: {},
			optionFormConfig: null,
			activityFormType: 'form',
			itemFormType: 'add',
			viewCfg: [],
			currentViewCfg: 0,
			maxSeq: 1,
			question_no: '',
			isQuestion: false,
			questionType: '文本',
			activityNo: null,
			activityData: {
				activity_no: '',
				title: '', //---活动标题
				end_time: '', //--活动结束时间
				remark: '', //---活动简介
				end_remark: '' //--结束语
			},
			showModal: false,
			showAddForm: true,
			configCols: [
				{
					label: '问题编号',
					column: 'item_no',
					disabled: true,
					value: '',
					type: 'input',
					display: false,
					isRequire: false,
					isShowExp: [{ colName: 'item_type', ruleType: 'eq', value: 'null' }],
					options: []
				},
				{
					label: '问题类型',
					column: 'item_type',
					value: '文本',
					type: 'radioFk',
					display: true,
					isRequire: true,
					isShowExp: '',
					// options: ['文本', '数字', '选项', '图片', '时间日期'],
					options: [
						{
							label: '文本',
							value: '文本'
						},
						{
							label: '数字',
							value: '数字'
						},
						{
							label: '选项',
							value: '选项'
						},
						{
							label: '图片',
							value: '图片'
						},
						{
							label: '时间日期',
							value: '时间日期'
						},
						{
							label: '地址',
							value: '地址'
						},
						{
							label: '引用',
							value: '引用'
						}
					]
				},
				{
					label: '问题名称',
					column: 'item_title',
					value: '',
					type: 'input',
					display: true,
					isRequire: true,
					isShowExp: [{ colName: 'item_type', ruleType: 'neq', value: '' }],
					options: []
				},
				{
					label: '图片说明',
					column: 'option_img_explain',
					value: '',
					type: 'images',
					display: true,
					isRequire: false,
					isShowExp: [{ colName: 'item_type', ruleType: 'neq', value: '' }],
					options: [],
					srvInfo: {
						serviceName: 'srv_bxfile_service',
						interfaceName: 'add',
						app_no: this.appName ? this.appName : 'daq',
						table_name: '',
						columns: ''
					}
				},
				{
					label: '选项列表',
					column: 'options_list',
					value: '',
					type: 'list',
					display: true,
					isRequire: false,
					isShowExp: [{ colName: 'item_type', ruleType: 'eq', value: '选项' }, { colName: 'item_no', ruleType: 'neq', value: '' }],
					optionsConfig: {
						selectServiceName: 'srvdaq_option_cfg_select',
						addServiceName: 'srvdaq_option_cfg_add',
						deleteServiceName: 'srvdaq_option_cfg_delete',
						updateServiceName: 'srvdaq_option_cfg_update',
						appNo: 'daq',
						conditions: [
							{
								colName: 'item_no',
								ruleType: 'eq',
								value: 'item_no'
							}
						],
						key_col: {
							refed_col: 'id',
							key_disp_col: 'option_value',
							value: 'option_value',
							no: 'option_seq'
						},
						model: {
							item_no: '',
							option_value: '',
							option_seq: ''
						}
					},
					options: []
				},
				{
					label: '选项类型',
					column: 'option_type',
					value: '单选',
					type: 'radioFk',
					display: true,
					isRequire: true,
					isShowExp: [{ colName: 'item_type', ruleType: 'eq', value: '选项' }],
					options: [
						{
							label: '单选',
							value: '单选'
						},
						{
							label: '多选',
							value: '多选'
						}
					]
				},
				{
					label: '是否必填',
					column: 'is_require',
					value: '是',
					type: 'radio',
					display: true,
					isRequire: true,
					isShowExp: [{ colName: 'item_type', ruleType: 'neq', value: '' }],
					options: ['是', '否']
				},
				{
					label: '行数',
					column: 'view_model',
					value: 'input',
					type: 'radioFk',
					display: true,
					isRequire: true,
					isShowExp: [{ colName: 'item_type', ruleType: 'eq', value: '文本' }],
					options: [
						{
							value: 'input',
							label: '单行'
						},
						{
							value: 'textarea',
							label: '多行'
						}
					]
				},
				{
					label: '最大字数',
					column: 'max_len',
					value: 50,
					type: 'number',
					display: true,
					isRequire: true,
					isShowExp: [{ colName: 'item_type', ruleType: 'eq', value: '文本' }],
					options: []
				},
				{
					label: '数字精度',
					column: 'decimal_places',
					value: 'Int',
					type: 'radioFk',
					display: true,
					isRequire: true,
					isShowExp: [{ colName: 'item_type', ruleType: 'eq', value: '数字' }],
					options: [
						{
							value: 'number',
							label: '整数'
						},
						{
							value: 'digit',
							label: '小数'
						}
					]
				},
				{
					label: '数字最大值',
					column: 'max',
					value: 100,
					type: 'number',
					display: true,
					isRequire: true,
					isShowExp: [{ colName: 'item_type', ruleType: 'eq', value: '数字' }],
					options: []
				},
				{
					label: '数字最小值',
					column: 'min',
					value: 0,
					type: 'number',
					display: true,
					isRequire: true,
					isShowExp: [{ colName: 'item_type', ruleType: 'eq', value: '数字' }],
					options: []
				},
				{
					label: '时间类型',
					column: 'format',
					value: 'date',
					type: 'radioFk',
					display: true,
					isRequire: true,
					isShowExp: [{ colName: 'item_type', ruleType: 'eq', value: '时间日期' }],
					options: [
						{
							value: 'dateTime',
							label: '年月日时分秒'
						},
						{
							value: 'date',
							label: '年月日'
						},
						{
							value: 'time',
							label: '时分秒'
						}
					]
				},
				{
					label: '答案',
					column: 'answer',
					value: '',
					type: 'input',
					display: false,
					isRequire: false,
					isShowExp: [
						{ colName: 'item_type', ruleType: 'neq', value: '图片' },
						{ colName: 'item_type', ruleType: 'neq', value: '选项' },
						{ colName: 'item_type', ruleType: 'neq', value: '用户' },
						{ colName: 'item_type', ruleType: 'neq', value: '引用' }
					],
					options: []
				},
				{
					label: '引用类型',
					column: 'ref_type',
					value: '',
					type: 'input',
					display: false,
					isRequire: false,
					isShowExp: [{ colName: 'item_type', ruleType: 'eq', value: '引用' }],
					options: []
				},
				{
					label: '目标APP',
					column: 'srv_app',
					value: '',
					type: 'treeSelector',
					option_list_v2: {
						refed_col: 'app_no',
						srv_app: 'config',
						serviceName: 'srvconfig_app_list_select',
						key_disp_col: 'app_name'
					},
					display: false,
					isRequire: false,
					isShowExp: [{ colName: 'item_type', ruleType: 'eq', value: '引用' }, { colName: 'ref_type', ruleType: 'eq', value: 'all' }],
					options: []
				},
				{
					label: '目标服务',
					column: 'serviceName',
					value: '',
					type: 'treeSelector',
					option_list_v2: {
						refed_col: 'service_name',
						srv_app: '',
						srv_app_exp: {
							type: 'column',
							value: 'srv_app'
						},
						serviceName: 'srvsys_service_select',
						key_disp_col: 'service_view_name',
						conditions: [{ colName: 'service_type', ruleType: 'eq', value: 'select' }]
					},
					display: false,
					isRequire: false,
					isShowExp: [{ colName: 'item_type', ruleType: 'eq', value: '引用' }, { colName: 'ref_type', ruleType: 'eq', value: 'all' }],
					options: []
				},
				{
					label: '引用字段',
					column: 'refed_col',
					value: '',
					type: 'treeSelector',
					option_list_v2: {
						refed_col: 'columns',
						srv_app: '',
						srv_app_exp: {
							type: 'column',
							value: 'srv_app'
						},
						serviceName: 'srvsys_service_columnex_v2_select',
						key_disp_col: 'label',
						conditions: [
							{
								colName: 'service_name',
								value: '',
								ruleType: 'eq',
								value_exp: {
									type: 'column',
									value: 'serviceName'
								}
							},
							{ colName: 'use_type', value: 'list', ruleType: 'eq' }
						]
					},
					display: false,
					isRequire: false,
					isShowExp: [{ colName: 'item_type', ruleType: 'eq', value: '引用' }, { colName: 'ref_type', ruleType: 'eq', value: 'all' }],
					options: []
				},
				{
					label: '显示字段',
					column: 'key_disp_col',
					value: '',
					type: 'treeSelector',
					option_list_v2: {
						refed_col: 'columns',
						srv_app: '',
						srv_app_exp: {
							type: 'column',
							value: 'srv_app'
						},
						serviceName: 'srvsys_service_columnex_v2_select',
						key_disp_col: 'label',
						conditions: [
							{
								colName: 'service_name',
								value: '',
								ruleType: 'eq',
								value_exp: {
									type: 'column',
									value: 'serviceName'
								}
							},
							{ colName: 'use_type', value: 'list', ruleType: 'eq' }
						]
					},
					display: false,
					isRequire: false,
					isShowExp: [{ colName: 'item_type', ruleType: 'eq', value: '引用' }, { colName: 'ref_type', ruleType: 'eq', value: 'all' }],
					options: []
				},

				{
					label: '分值',
					column: 'points',
					value: '',
					type: 'Float',
					display: false,
					isRequire: false,
					isShowExp: [{ colName: 'item_type', ruleType: 'neq', value: '' }],
					options: []
				},
				{
					label: '图片数量',
					column: 'max_num',
					value: 3,
					type: 'number',
					display: true,
					isRequire: true,
					isShowExp: [{ colName: 'item_type', ruleType: 'eq', value: '图片' }],
					options: []
				}
			],
			inputBut: [
				{
					name: '上移',
					key: 'up',
					icon: 'cuIcon-top'
				},
				{
					name: '下移',
					key: 'down',
					icon: 'cuIcon-down'
				},
				{
					name: '编辑',
					key: 'edit',
					icon: 'cuIcon-edit'
				},
				{
					name: '删除',
					key: 'delete',
					color: 'red',
					icon: 'cuIcon-deletefill'
				}
				// {
				// 	name: '选项',
				// 	key: 'option',
				// 	icon: 'cuIcon-sort'
				// }
			]
		};
	},
	onLoad() {
		if (this.$route.query.hasOwnProperty('activity_no')) {
			this.activityNo = this.$route.query.activity_no;
			this.getActivityInfo(this.activityNo);
		}
	},
	computed: {
		itemModel: {
			get: function() {
				if (this.showModal) {
					return this.configCols;
				}
			},
			set: function(e) {
				this.configCols = this.configCols.map((item, index) => {
					if (item.column === e.col) {
						item.value = e.val;
					}
					if (item.column === 'options_list') {
						item['options'] = [];
					}
					return item;
					this.$set(this.configCols, index, item);
				});
			}
		}
	},
	methods: {
		getConfigCols() {
			let configCols = this.deepClone(this.configCols);
		},
		updateOption() {
			// 编辑选项
		},
		addOption() {
			// 新增选项
		},
		deleteOption() {
			// 删除选项
		},
		getOptionList() {
			// 查找选项列表
			let url = this.getServiceUrl('daq', 'srvdaq_option_cfg_select', 'select');
			let req = {
				serviceName: 'srvdaq_option_cfg_select',
				colNames: ['*'],
				condition: [{ colName: 'option_no', ruleType: 'eq', value: model.option_no }]
			};
		},
		hideOptionPopup() {
			this.optionData = {};
			this.$refs.optionListPop.close();
			// this.optionFormConfig = [];
			this.showModal = true;
		},
		async submitOption() {
			let fieldModel = this.$refs.bxformQuestion.getFieldModel();
			if (!fieldModel) {
				return;
			}
			console.log(this.optionData);
			let datas = this.optionData.model;
			let url = this.getServiceUrl(this.optionsConfig.appNo, this.optionsConfig[this.optionData.type + 'ServiceName'], this.optionData.type);
			let req = [
				{
					serviceName: this.optionsConfig[this.optionData.type + 'ServiceName'],
					condition: [{ colName: 'id', ruleType: 'eq', value: datas.id }],
					data: [fieldModel]
				}
			];
			if (this.optionData.type === 'update' && !datas.id) {
				// 编辑 没有id
				return;
			}
			if (this.optionData.type === 'add' && !this.optionData.model.item_no) {
				// 新增 没有item_no
				return;
			} else if (this.optionData.type === 'add' && !this.optionData.model.item_no) {
			}
			let res = await this.$http.post(url, req);
			if (res.data.state === 'SUCCESS') {
				console.log('选项修改/添加成功', res.data.response[0].response);
			}
			this.getActivityInfo(this.activityNo).then(_ => {
				this.showAddForm = !this.showAddForm;
				this.updateQuestions(this.viewCfg[this.currentViewCfg]);
				this.hideOptionPopup();
			});
			uni.showToast({
				title: res.data.resultMessage,
				icon: 'none'
			});
		},
		async showOptionlist(e) {
			this.optionData = e.data;
			this.optionsConfig = e.config;
			this.showModal = false;
			if (e.data && e.data.type && e.data.type === 'draft') {
				e.data.type = 'add';
			} else {
				let modelData = await this.getOptionData(e.data.model);
				this.optionData.model = modelData;
			}
			this.getOptionV2(e);
			this.$refs.optionListPop.open();
		},
		optionValueChange(e) {
			console.log(e);
		},
		optionListPopChange(e) {
			console.log(e);
		},
		async getOptionData(model) {
			let url = this.getServiceUrl(this.appName ? this.appName : 'daq', 'srvdaq_option_cfg_select', 'select');
			let req = {
				serviceName: 'srvdaq_option_cfg_select',
				colNames: ['*'],
				condition: [{ colName: 'option_no', ruleType: 'eq', value: model.option_no }]
			};
			let res = await this.$http.post(url, req);
			if (res.data.state === 'SUCCESS' && res.data.data.length > 0) {
				return res.data.data[0];
			}
		},
		async getOptionV2(e) {
			let { data, config } = e;
			let type = data.type;
			let appName = 'daq';
			this.optionFormType = type;
			console.log(config[type + 'ServiceName']);
			let colVs = await this.getServiceV2(config[type + 'ServiceName'], type, type, appName ? appName : 'daq');
			let fields = colVs._fieldInfo.filter((item, index) => {
				if (item.column === 'item_no') {
					item.disabled = true;
					item.display = false;
				}
				if (!item.value) {
					item.value = '';
				}
				if (item.column === 'activity_no') {
					item['disabled'] = true;
				}
				if (data.model) {
					Object.keys(data.model).forEach(key => {
						if (data.model[key] && item.column === key) {
							item.value = data.model[key];
						}
					});
				}
				if (item['in_' + type] === 1) {
					return item;
				}
			});
			this.optionFormConfig = fields;
		},
		deleteListOptions(index) {
			let self = this;
			let sers = self.fieldData.optionsConfig.deleteServiceName;
			let app = self.fieldData.optionsConfig.appNo;
			let key = self.optionsDatas[index]['model'].id;
			let req = [
				{
					serviceName: sers,
					condition: [
						{
							colName: 'id',
							ruleType: 'eq',
							value: key
						}
					]
				}
			];
			if (self.optionsDatas[index]['type'] !== 'draft') {
				self.onRequest('delete', sers, req, app).then(res => {
					if (res.data.state === 'SUCCESS') {
						self.optionsDatas.splice(index, 1);
						console.log('删除成功', res.data);
					}
				});
			}
		},
		valueChange(e) {
			console.log('value-change', e);
			// return
			if (e.column && e.column === 'item_type') {
				this.questionType = e.value;
				// this.showAddForm = !this.showAddForm;
			}
		},
		onFieldsItem(e) {
			console.log(e);
			let item = e.item;
			let fields = this.viewCfg;
			let index = null;
			let upIndex = null;
			let downIndex = null;
			for (let i = 0; i < fields.length; i++) {
				if (item.column === fields[i]['column']) {
					index = i;
				}
			}
			let updates = ['', ''];
			switch (e.button.key) {
				case 'up':
					upIndex = index - 1;
					console.log('upIndex', upIndex);
					updates[0] = fields[upIndex];
					updates[1] = fields[index];
					break;
				case 'down':
					downIndex = index + 1;
					console.log('downIndex', downIndex);
					updates[0] = fields[index];
					updates[1] = fields[downIndex];
					break;
				case 'delete':
					break;
				default:
					break;
			}
			if (e.button.key === 'up' && updates.length === 2 && !updates[0]) {
				uni.showToast({
					title: '此问题已排在最前',
					icon: 'none'
				});
			} else if (e.button.key === 'down' && updates.length === 2 && !updates[1]) {
				uni.showToast({
					title: '此问题已排在最末',
					icon: 'none'
				});
			} else if (e.button.key === 'up' || e.button.key === 'down') {
				let seqList = updates.map(item => item.seq);
				updates[0]['seq'] = seqList[1];
				updates[1]['seq'] = seqList[0];
				this.updateQuestion(updates[0]).then(res => {
					this.updateQuestion(updates[1]).then(res => {
						this.viewCfg = [];
						this.viewCfg.length = 0;
						this.getActivityInfo(this.activityNo);
					});
				});
			} else if (e.button.key === 'delete') {
				this.deleteQuestion(item);
			} else if (e.button.key === 'edit') {
				this.isQuestion = true;
				console.log('编辑 updates', fields[index], this.configCols);
				this.question_no = e.item.column;
				this.currentViewCfg = index;
				this.updateQuestions(fields[index]);
			}
			console.log('需要编辑的列', updates, index, this.configCols);
		},
		deleteQuestion(item) {
			let self = this;
			uni.showModal({
				title: '提示',
				content: '确认删除此问题？',
				success(res) {
					if (res.confirm) {
						let url = self.getServiceUrl(self.appName ? self.appName : 'daq', 'srvdaq_item_cfg_delete', 'delete');
						let req = [{ serviceName: 'srvdaq_item_cfg_delete', condition: [{ colName: 'item_no', ruleType: 'eq', value: item.column }] }];
						self.$http.post(url, req).then(res => {
							if (res.data.resultCode === 'SUCCESS') {
								uni.showToast({
									title: '删除成功',
									icon: 'none'
								});
								self.getActivityInfo(self.activityNo);
							} else {
								uni.showToast({
									title: '删除失败',
									icon: 'none'
								});
							}
						});
					} else {
						uni.showToast({
							title: '取消删除',
							icon: 'none'
						});
					}
				}
			});
		},
		async updateQuestions(item) {
			this.showAddForm = !this.showAddForm;
			let field = item;
			let itemAttr = item.item_type_attr;
			console.log('字段额外属性', itemAttr);
			let configCols = this.configCols.map((item, index) => {
				switch (item.column) {
					case 'item_no':
						item.value = field.column;
						return item;
						break;
					case 'item_type':
						switch (field.type) {
							case 'number':
								item.value = '数字';
								break;
							case 'input':
								item.value = '文本';
								break;
							case 'radio':
							case 'radioFk':
							case 'checkbox':
							case 'checkboxFk':
								item.value = '选项';
								break;
							case 'images':
								item.value = '图片';
								break;
							case 'date':
								item.value = '时间日期';
								break;
							case 'time':
								item.value = '时间日期';
								break;
							case 'dateTime':
								item.value = '时间日期';
								break;
							case 'treeSelector':
								item.value = '引用';
							default:
								break;
						}
						return item;
						break;
					case 'item_title':
						item.value = field.label;
						return item;
						break;
					case 'option_type':
						item.value = itemAttr.radioType === 'single' ? '单选' : itemAttr.radioType === 'multi' ? '多选' : '';
						return item;
						break;
					case 'is_require':
						item.value = field.isRequire === true ? '是' : '否';
						return item;
						break;
					case 'max_len':
						item.value = itemAttr.max_len;
						return item;
						break;
					case 'decimal_places':
						item.value = itemAttr.decimal_places;
						return item;
						break;
					case 'max':
						item.value = itemAttr.max;
						return item;
						break;
					case 'view_model':
						item.value = itemAttr.view_model;
						if (item.value === '单行') {
							item.value = 'input';
						} else {
							item.value = 'textarea';
						}
						return item;
						break;
					case 'option_img_explain':
						item.value = field.option_img_explain;
						return item;
						break;
					case 'options_list':
						item.options = field._rawData.option_data;
						return item;
						break;
					case 'min':
						item.value = itemAttr.min;
						return item;
						break;
					case 'format':
						item.value = itemAttr.dateType;
						return item;
						break;
					case 'max_num':
						item.value = itemAttr.max_num;
						return item;
						break;
					case 'format':
						item.value = itemAttr.dateType;
						return item;
						break;
					case 'ref_type':
						item.value = itemAttr.ref_type;
						return item;
						break;
					case 'srv_app':
						item.value = itemAttr.srv_app;
						return item;
						break;
					case 'serviceName':
						item.value = itemAttr.serviceName;
						return item;
						break;
					case 'refed_col':
						item.value = itemAttr.refed_col;
						return item;
						break;
					case 'key_disp_col':
						item.value = itemAttr.key_disp_col;
						return item;
						break;
					default:
						break;
				}
				return item;
			});
			this.configCols = configCols;
			this.showModal = true;
		},
		async updateQuestion(item) {
			let url = this.getServiceUrl(this.appName ? this.appName : 'daq', 'srvdaq_item_cfg_update', 'update');
			let req = [{ serviceName: 'srvdaq_item_cfg_update', condition: [{ colName: 'item_no', ruleType: 'eq', value: item.column }], data: [{ item_seq: item.seq }] }];
			let res = await this.$http.post(url, req);
			return res.data.resultCode === 'SUCCESS';
		},
		showReview() {
			// formType: 表单类型 预览:preview 正常:normal
			uni.redirectTo({
				url: '/pages/specific/questionnaire/questionnaire?formType=detail&activity_no=' + this.activityNo
			});
		},
		async getActivityInfo(e) {
			let self = this;
			let url = this.getServiceUrl(this.appName ? this.appName : 'daq', 'srvdaq_init_view_select', 'select');
			let req = {
				serviceName: 'srvdaq_init_view_select',
				condition: [
					{
						colName: 'activity_no',
						ruleType: 'eq',
						value: e
					},
					{
						colName: 'biz_type',
						ruleType: 'eq',
						value: 'cfg'
					}
				]
			};
			let response = await this.$http.post(url, req);
			console.log('srvdaq_init_view_select', response);
			if (response.data.state === 'SUCCESS' && response.data.data.length > 0) {
				self.activityData = response.data.data[0];
				self.viewCfg = response.data.data[0].item_data;
				self.configCols = self.configCols.map(item => {
					if (item.column === 'points') {
						// 分值
						item.isShowExp = null;
						if (self.activityData.info_collect_type === '自测') {
							item.display = true;
						}
					}
					if (item.column === 'answer') {
						// 答案
						if (self.activityData.info_collect_type === '自测') {
							self.configCols.forEach(field => {
								if (field.column === 'item_type') {
									if (field.value !== '图片' && field.value !== '选项') {
										item.display = true;
									}
								}
							});
						}
					}
					return item;
				});
				let seqList = self.viewCfg.map(item => item.item_seq);
				self.maxSeq = seqList.sort()[seqList.length - 1];
				self.viewCfg = this.viewCfg.map(item => {
					return this.getConfig(item);
				});
				self.viewCfg = self.arraySort(self.viewCfg, 'seq');
			}
		},
		async addItem(type) {
			let self = this;
			let itemData = this.$refs.bxformAddQuestion.getFieldModel();
			console.log('itemData', itemData);
			this.showAddForm = !this.showAddForm;
			let url = this.getServiceUrl(this.appName ? this.appName : 'daq', 'srvdaq_item_cfg_add', 'add');
			let req = [
				{
					serviceName: 'srvdaq_item_cfg_add',
					data: []
				}
			];
			if (this.isQuestion) {
				url = this.getServiceUrl(this.appName ? this.appName : 'daq', 'srvdaq_item_cfg_update', 'operate');
				req = [
					{
						serviceName: 'srvdaq_item_cfg_update',
						condition: [{ colName: 'item_no', ruleType: 'eq', value: this.question_no }],
						data: []
					}
				];
			}
			if (itemData) {
				let newInput = this.getCoulmnConfig(itemData);
				console.log('newInput', newInput);
				newInput.activity_no = this.activityNo;
				if (!this.isQuestion) {
					let seqList = this.viewCfg
						.map(item => item.seq)
						.filter(item => {
							return item && item;
						})
						.sort();
					newInput['item_seq'] = seqList && seqList.length > 0 ? seqList[seqList.length - 1] + 1 : 1;
				}
				console.log('newInput', newInput);
				req[0].data.push(newInput);
				let response = await this.$http.post(url, req);
				console.log('srvdaq_item_cfg_add', response);
				if (response.data.state === 'SUCCESS' && response.data.response.length > 0) {
					self.getActivityInfo(self.activityNo);
					if (type && type === 'save') {
						this.showAddForm = !this.showAddForm;
						let question_no = response.data.response[0].response.effect_data[0].item_no;
						console.log('question_no', question_no);
						self.configCols = self.configCols.map((item, index) => {
							if (item.column === 'item_no') {
								item.value = question_no;
							}
							if (item.column === 'options_list') {
								item.display = true;
								item.options = [];
							}
							return item;
						});
						self.optionFormConfig = self.optionFormConfig.map(item => {
							if (item.column !== 'item_no') {
								item.value = '';
							}
							return item;
						});
					}
				}
				if (type !== 'save') {
					self.hideModal();
				} else {
					this.isQuestion = true;
				}
			} else {
				console.log('表单填写不完整');
			}
		},
		DateChange(e) {
			this.date = e.detail.value;
		},
		toUpdate() {
			uni.redirectTo({
				url: '/pages/specific/activityUpdate/activityUpdate?id=' + 1
			});
		},
		toadded() {
			uni.redirectTo({
				url: '/pages/specific/added/added?activity_no=' + this.activityNo + '&serviceName=srvdaq_activity_cfg_add&type=update'
			});
		},
		activeFc(res) {
			uni.showToast({
				title: '获取输入成功'
			});
			console.log(JSON.stringify(res));
		},
		showAdd(e) {
			this.isQuestion = false;
			this.showModal = true;
		},
		hideModal(e) {
			if (e === 'refresh') {
				this.getActivityInfo(this.activityNo);
			}
			this.configCols.map(item => {
				if (item.label === '问题类型') {
					item.value = '文本';
				} else {
					item.value = '';
				}
			});
			this.showAddForm = !this.showAddForm;
			this.showModal = false;
		},
		getConfig(e) {
			let config = {
				label: e.item_title,
				column: e.item_no,
				srvInfo: {
					serviceName: 'srvdaq_activity_result_submit',
					appNo: this.appName ? this.appName : 'daq'
				},
				value: e.value,
				type: e.item_type,
				isRequire: e.is_require === '是' ? true : false,
				isShowExp: [],
				options: [],
				seq: e.item_seq,
				display: true,
				disabled: false,
				item_type_attr: e.item_type_attr,
				buttons: [],
				points: e.points,
				answer: e.answer,
				option_img_explain: e.option_img_explain,
				_rawData: e,
				option_list_v2: e.option_list_v2
			};
			config.buttons = this.inputBut;
			switch (e.item_type) {
				case '文本':
					config.type = e.item_type_attr['view_model'] === 'textarea' ? 'textarea' : 'input';
					break;
				case '图片':
					config.type = 'images';
					config['fileNum'] = e.item_type_attr['fileNum'];
					break;
				case '选项':
					// radio-single-单选 checkbox-multi-多选
					config.type = e.item_type_attr.radioType && e.item_type_attr.radioType === 'multi' ? 'checkboxFk' : 'radioFk';
					config.options = e.option_data.map(item => {
						item.value = item.option_value;
						item.showimg = false;
						item.label = item.option_view_no ? item.option_view_no + '. ' + item.option_value : item.option_value;
						return item;
						// return item.option_value;
					});
					break;
				case '时间日期':
					config.type = e.item_type_attr.dateType ? e.item_type_attr.dateType : 'dateTime';
					break;
				case '数字':
					config.type = e.item_type_attr.numberType ? e.item_type_attr.numberType : 'number';
					break;
				case '地址':
					config.type = 'cascader';
					config.srvInfo = {
						serviceName: 'srvconfig_area_adj_select',
						appNo: 'config',
						isTree: true,
						column: 'no',
						showCol: 'path_name' //要展示的字段
					};
					break;
				case '引用':
					config.type = 'treeSelector';
					config.option_list_v2 = {
						refed_col: e.item_type_attr.refed_col,
						srv_app: e.item_type_attr.srv_app,
						serviceName: e.item_type_attr.serviceName,
						key_disp_col: e.item_type_attr.key_disp_col
					};
					break;
				default:
					config.type = e.item_type;
					break;
			}
			return config;
		}
	}
};
</script>

<style lang="scss" scoped>
.cu-modal.bottom-modal.show {
	z-index: 9999;
	overflow: hidden;
}
.cu-modal.bottom-modal .cu-dialog {
	overflow-y: scroll;
}
.cu-modal-content {
	.option-list-pop {
		height: 100%;
		max-height: 80vh;
		overflow-y: scroll;
		padding: 20rpx 0 40rpx;
	}
}
.cu-card > .cu-item {
	margin: 0;
	padding: 30upx;
}

.cu-card.article > .cu-item .content .text-content {
	height: auto;
	padding: 30rpx 0 0;
}
.cu-card.article > .cu-item .title {
	line-height: 40rpx;
}
.view {
	/deep/ p {
		img {
			width: 100%;
		}
	}
}
.uni-popup {
	z-index: 9999;
	.uni-popup__wrapper-box {
		// height: 100vh;
	}
	.option-list-pop {
		max-height: 80vh;
		overflow: scroll;
	}
	.btn-group {
		width: 100%;
		display: flex;
		justify-content: space-around;
		height: 100rpx;
		align-items: center;
		background-color: #fff;
		padding: 20rpx 0;
	}
}
</style>
