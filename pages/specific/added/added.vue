<template>
	<view>
		<cu-custom bgColor="bg-blue" :isBack="true">
			<block slot="backText">返回</block>
			<block slot="content">{{ navTitle }}</block>
		</cu-custom>
		<view class="" v-if="fields && fields.length > 0"><bxform ref="bxForm" :pageType="type" @value-blur="valueChange" :BxformType="type" :fields="fields"></bxform></view>
		<view class="padding-xl" style="background-color: #fff;">
			<button class="cu-btn block bg-blue margin-tb-sm lg" @click="toUpdate" v-if="fields && fields.length > 0">提交</button>
		</view>
	</view>
</template>

<script>
import bxform from '@/components/bx-form/bx-form.vue';
export default {
	components: { bxform },
	data() {
		return {
			appName: 'daq',
			navTitle: '',
			activity_no: '',
			activityData: null,
			fields: [],
			allFields: [],
			formData: {},
			loadedType: 'srvV2',
			colsV2Data: null,
			type: '',
			serviceName: ''
		};
	},
	onLoad(option) {
		if (option.type) {
			this.type = option.type;
			if (option.type === 'add') {
				this.navTitle = '创建问卷';
			} else if (option.type === 'update') {
				this.navTitle = '编辑问卷信息';
			}
		}
		if (option.serviceName) {
			this.serviceName = option.serviceName;
			if (option.activity_no) {
				// this.type = 'update';
				this.activity_no = option.activity_no;
				this.getActivityInfo(option.activity_no).then(() => {
					this.getFieldsV2();
				});
			} else {
				this.getFieldsV2();
			}
		}
	},
	methods: {
		valueChange(e, i) {
			this.formData[e.column] = i[e.column];
			this.fields = this.getShowFields(this.formData);
		},
		async getActivityInfo(e) {
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
				this.activityData = response.data.data[0];
				console.log('this.activityData', this.activityData);
				// this.setFieldsVals(this.activityData);
			}
		},
		DateChange(e) {
			this.date = e.detail.value;
		},
		toUpdate() {
			let self = this;
			let type = this.type;
			let itemData = self.$refs.bxForm.getFieldModel();
			if (!itemData) {
				return;
			}
			
			uni.showModal({
				title: '提示',
				content: type === 'add' ? '确认创建问卷？' : type === 'update' ? '确认修改问卷信息？' : '',
				success(res) {
					if (res.confirm) {
						console.log('itemData', itemData);
						let url = self.getServiceUrl(self.appName ? self.appName : 'daq', 'srvdaq_activity_cfg_add', 'add');
						let req = [{ serviceName: 'srvdaq_activity_cfg_add', data: [itemData] }];
						if (itemData) {
							console.log('itemData', itemData);
						
							if (self.activity_no) {
								url = self.getServiceUrl(self.appName ? self.appName : 'daq', 'srvdaq_activity_cfg_update', 'operate');
								req = [{ serviceName: 'srvdaq_activity_cfg_update', condition: [{ colName: 'activity_no', ruleType: 'eq', value: self.activity_no }], data: [itemData] }];
								self.$http.post(url, req).then(response => {
									console.log('srvdaq_activity_cfg_update', response);
									if (response.data.state === 'SUCCESS' && response.data.response.length > 0) {
										self.activieyData = self.getResData(response.data.response);
										uni.showToast({
											title: '编辑成功'
										});
										uni.redirectTo({
											url: '/pages/specific/activityUpdate/activityUpdate?activity_no=' + self.activity_no
										});
									} else {
									}
								});
							} else {
								Object.keys(itemData).forEach(key=>{
									if(!itemData[key]){
										delete itemData[key]
									}
								})
								url = self.getServiceUrl(self.appName ? self.appName : 'daq', 'srvdaq_activity_cfg_add', 'add');
								req = [{ serviceName: 'srvdaq_activity_cfg_add', data: [itemData] }];
								self.$http.post(url, req).then(response => {
									console.log('srvdaq_activity_cfg_add', response);
									if (response.data.state === 'SUCCESS' && response.data.response.length > 0) {
										self.activieyData = self.getResData(response.data.response);
										uni.showToast({
											title: '创建成功'
										});
										let activity_no = response.data.response[0].response.effect_data[0].activity_no;
										uni.redirectTo({
											url: '/pages/specific/activityUpdate/activityUpdate?activity_no=' + activity_no
										});
									}
								});
							}
						} else {
							console.log('表单填写不完整');
						}
					}
				}
			});
		},
		getFieldsV2: async function() {
			let colVs = await this.getServiceV2(this.serviceName, this.type, this.type, this.appName ? this.appName : 'daq');
			colVs = this.deepClone(colVs);
			console.log(colVs);
			this.colsV2Data = colVs;
			let type = this.type;
			console.log('colsV2Data', colVs);
			let fields = [];
			switch (type) {
				case 'update':
					fields = this.setFieldsDefaultVal(colVs._fieldInfo, this.activityData);
					this.formData = this.activityData;
					break;
				case 'add':
					fields = colVs._fieldInfo.map(item=>{
						if(item.defaultValue){
							item.value = item.defaultValue
						}
						return item
					});
					
					break;
				case 'detail':
					fields = this.setFieldsDefaultVal(colVs._fieldInfo, this.activityData);
					break;
				default:
					break;
			}
			if (fields && Array.isArray(fields)) {
				fields = fields.filter((item, index) => {
					if (!item.value) {
						item.value = '';
					}
					if (item.column === 'activity_no') {
						item['disabled'] = true;
					}
					if (item['in_' + type] === 1) {
						return item;
					}
				});
				this.allFields = fields;
				this.fields = this.getShowFields(this.formData);
			}
		},
		getShowFields(formData = {}) {
			// if(Object.values(formData).length>0){
			// 	this.allFields = this.allFields.map(item=>{
			// 		Object.keys(formData).forEach(key=>{
			// 			if(formData[key]&&item.column===key){
			// 				item.value = formData[key]
			// 			}
			// 		})
			// 		return item
			// 	})
			// }
			let allFields = this.allFields;
			allFields = allFields.filter(field => {
				if (field._colDatas.x_if) {
					let isShow = eval('(' + field._colDatas.x_if + ')');
					let result = isShow(formData);
					return result;
				} else {
					return true;
				}
			});
			return allFields;
		}
		// setFieldsVals: function(e) {
		//   let fields = this.fields;
		//   console.log('aaaaa', fields, e);
		//   if (e) {
		//     fields = fields.map((item, index) => {
		//       item['value'] = e[item.column];
		//       return item;
		//     });
		//   }
		//   // this.fields = fields;
		// }
	},
	watch: {
		// activityData: {
		//   handler: function(newOld, old) {
		//     this.setFieldsVals(newOld);
		//   },
		//   deep: true
		// },
		fields: {
			handler: function(newOld, old) {
				// if(newOld.length>0){
				//   this.setFieldsVals(this.activityData);
				// }
			},
			deep: true
		}
	}
};
</script>

<style lang="scss">
.cu-form-group {
	background-color: #ffffff;
	padding: 1upx 30upx;
	display: flex;
	flex-direction: column;
	align-items: self-start;
	min-height: 100upx;
	justify-content: space-between;
	.title {
		// min-width: calc(4em + 15px);
		width: 100vw;
		display: block;
	}
	uni-input {
		width: 100%;
		flex: 1;
	}

	text[class*='cuIcon-'] {
		font-size: 36upx;
		padding: 0;
		box-sizing: border-box;
	}

	textarea {
		margin: 32upx 0 30upx;
		height: 4.6em;
		width: 100%;
		line-height: 1.2em;
		flex: 1;
		font-size: 28upx;
		padding: 0;
	}
}
</style>
