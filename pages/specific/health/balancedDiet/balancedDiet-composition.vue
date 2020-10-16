<template>
	<view class="balanced-diet">
		<view class="diet-wrap" style="flex: 1;overflow-y: scroll;">
			<view class="main-box symptom">
				<view class="record-box page-top">
					<view @click="toPersonal" class="record-item"><view class="label">基本信息</view></view>
					<view class="record-item"><view class="label">遗传史</view></view>
					<view class="record-item"><view class="label">疾病史</view></view>
				</view>
			</view>
			<view class="main-box">
				<view class="main-content main-content-t">
					<view class="energy-item ">
						<view class="text">饮食摄入</view>
						<view class="number">{{ parseFloat(dietIn).toFixed(1) }}</view>
					</view>
					<view class="operate">-</view>
					<view class="energy-item">
						<view class="text">运动消耗</view>
						<view class="number">{{ parseFloat(sportOut).toFixed(1) }}</view>
					</view>
					<view class="operate">-</view>
					<view class="energy-item">
						<view class="text">基础代谢</view>
						<view class="number">{{ basicOut ? parseFloat(basicOut).toFixed(1) : '0' }}</view>
					</view>
					<view class="operate">=</view>
					<view class="energy-item">
						<view class="text">体重变化</view>
						<view class="number text-red" style="display: flex; width: 90px; justify-content: space-between;">
							<text style="flex:1;">{{ parseFloat(energyChange) > 0 ? `+${parseFloat(energyChange).toFixed(1)}` : parseFloat(energyChange).toFixed(1) }}</text>
							<text class="units">大卡</text>
						</view>
						<view class="number text-red" style="display: flex; width: 90px; justify-content: space-between;">
							<text style="flex:1;">
								{{ energyChange === 0 ? '0.0' : parseFloat(energyChange / 7.7) > 0 ? `+${parseFloat(energyChange / 7.7).toFixed(1)}` : parseFloat(energyChange / 7.7).toFixed(1) }}
							</text>
							<text class="units">g脂肪</text>
						</view>
					</view>
				</view>
			</view>
			<view class="main-box-plus">
				<view class="indicator">
					<view class="cu-item arrow">
						<view class="content">
							<view class="content_left">
								<!-- <text>说明</text> -->
								<view class="content_left_legend">
									<view class="content_left_legend_leg"></view>
									<text class="content_left_legend_text">:过低</text>
								</view>
								<view class="content_left_legend">
									<view style="background-color: #8dc63f;" class="content_left_legend_leg"></view>
									<text class="content_left_legend_text">:正常</text>
								</view>
								<view class="content_left_legend">
									<view style="background-color: #ffb347;" class="content_left_legend_leg"></view>
									<text class="content_left_legend_text">:过高</text>
								</view>
							</view>
							<view style="display: flex;" class="content_right">
								<!-- <text class="text-black">指标状态：</text> -->
								<u-subsection :list="radioArr" :current="subIndex" :button-color="subColor" active-color="#fff" @change="changeSub"></u-subsection>
							</view>
						</view>
					</view>
				</view>
				<view v-for="(item, index) in energyList" :key="index" class="main-box">
					<view class="main-top">
						<view class="main-title">
							<text>{{ item.title }}</text>
							<text>({{ item.units }})</text>
						</view>
					</view>
					<view class="main-content ele-content">
						<view v-for="(alone, i) in item.matterList" v-show="subIndex === 1 ? alone.value < alone.EAR || alone.value > alone.UL : true" :key="i" class="ele-item">
							<view class="ele-item-wrap" v-if="subIndex === 1 ? alone.value < alone.EAR || alone.value > alone.UL : true">
								<text class="ele-item-name">{{ alone.name }}</text>
								<view class="bg-white probar">
									<view class="cu-progress progress-bar radius pro-rad">
										<view
											v-if="alone.value_left || alone.value_left === 0"
											class="pointer"
											:text="alone.value === 0 ? '0' : alone.value.toFixed(1)"
											:style="{ left: `${alone.value_left}px` }"
										></view>
										<view :num="alone.left_width ? alone.EAR : ''" class="bg-grey EAR" :style="{ width: alone.left_width ? alone.left_width + 'px' : '33%' }"></view>
										<view :num="alone.value" class="bg-olive regular" :style="{ width: alone.center_width ? alone.center_width + 'px' : '33%' }"></view>
										<view :num="alone.right_width ? alone.UL : ''" class="bg-red risk" :style="{ width: alone.right_width ? alone.right_width + 'px' : '33%' }"></view>
									</view>
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
			<view class="main-box symptom">
				<view class="title">
					<view class="label">饮食</view>
					<!-- <view class="num">({{dietRecord.length}})</view> -->
				</view>
				<view class="record-box">
					<view class="table" v-if="dietRecord">
						<view class="no-data" v-if="!dietRecord || dietRecord.length === 0">点击下方加号添加饮食运动记录</view>
						<view class="row" v-for="(item, index) in dietRecord" :key="index">
							<view class="readonly">
								<view class="column" @click="openPopup(dietRecord, index, 'htime', 'food')">{{ item.htime ? item.htime.slice(0, 5) : '' }}</view>
								<view class="column">{{ item.name }}</view>
								<view class="column" @click="openPopup(dietRecord, index, 'amount', 'food')">{{ item.amount + item.unit }}</view>
								<view class="column">{{ item.energy }}千卡</view>
								<view class="column"><text class="lg text-black cuIcon-delete" @click="deleteItem(item, 'food')"></text></view>
							</view>
						</view>
					</view>
				</view>
			</view>
			<view class="main-box symptom">
				<view class="title">
					<view class="label">运动</view>
					<!-- <view class="num">[{{sportsRecord.length}}]</view> -->
				</view>
				<view class="record-box">
					<view class="table">
						<view class="no-data" v-if="!sportsRecord || sportsRecord.length === 0">点击下方加号添加饮食运动记录</view>
						<view class="row" v-for="(item, index) in sportsRecord" :key="index">
							<view class="readonly">
								<view class="column" @click="openPopup(sportsRecord, index, 'htime', 'sport')">{{ item.htime ? item.htime.slice(0, 5) : '' }}</view>
								<view class="column">{{ item.name }}</view>
								<view class="column" @click="openPopup(sportsRecord, index, 'amount', 'sport')">{{ item.amount + item.unit }}</view>
								<view class="column">{{ item.energy }}千卡</view>
								<view class="column"><text class="lg text-black cuIcon-delete" @click="deleteItem(item, 'sport')"></text></view>
							</view>
						</view>
					</view>
				</view>
			</view>
			<view class="main-box symptom">
				<view class="title">症状</view>
				<view class="symptom-box">
					<view class="symptom-item" v-for="(item, index) in symptomList" :key="index">{{ item.name }}</view>
					<view class="symptom-item symptom-add" @click="addSymptom">+</view>
				</view>
			</view>
			<view class="main-box symptom">
				<view class="title">慢病风险</view>
				<view class="symptom-box">
					<!-- <view class="symptom-item" v-for="(item, index) in symptomList" :key="index">{{ item.name }}</view> -->
					<view class="symptom-item symptom-add">+</view>
				</view>
			</view>
		</view>
		<uni-popup ref="showtip" type="center" :mask-click="false" @change="change" style="z-index: 1025;">
			<view class="uni-tip">
				<text class="uni-tip-title">修改数据</text>
				<view class="input-box"><input type="text" @change="changeValue" v-model="currentVal" /></view>
				<view class="uni-tip-group-button">
					<text class="uni-tip-button" @click="cancel('cancel')">取消</text>
					<text class="uni-tip-button" @click="cancel('confirm')">确定</text>
				</view>
			</view>
		</uni-popup>
		<mx-date-picker
			style="z-index: 1290;"
			:format="dateFormat"
			:show="showTimePicker"
			:type="timeType"
			:value="currentVal"
			:show-tips="true"
			:begin-text="'入住'"
			:end-text="'离店'"
			:show-seconds="true"
			@confirm="onSelected"
			@cancel="onSelected"
		/>
	</view>
</template>

<script>
import MxDatePicker from '@/components/mx-datepicker/mx-datepicker.vue';
import xflSelect from '@/components/xfl-select/xfl-select.vue';
import bxform from '@/components/bx-form/bx-form.vue';
import uniCharts from '@/components/uni-charts/uni-charts.vue';
import guageChart from '@/components/gauge-chart/gauge-chart.vue';
import { ref, reactive, onMounted } from '@vue/composition-api'
export default {
	components: { MxDatePicker, xflSelect, bxform, uniCharts, guageChart },
	setup(){
		const obj = reactive({ count: 0 })
		const data = ref(0)
		onMounted(()=>{
			console.log('onMounted')
			console.log(obj,data)
		})
	},
	data() {
		return {
			subColor: '#ff9900',
			subIndex: 1,
			cWidth: '',
			cHeight: '',
			pixelRatio: 1,
			gaugeWidth: 15,
			backTextStyle: {
				color: '#333'
			},
			radioArr: [
				{
					key: '全部',
					name: '全部',
					value: 'all'
				},
				{
					key: '异常',
					name: '异常',
					value: 'anomaly'
				}
			],
			selectRadio: '',
			field: {},
			symptomList: [],
			list: [
				//要展示的数据
				'苹果',
				{ value: '香蕉', disabled: true },
				'葡萄',
				'芒果',
				'大白菜'
			],
			refresh: false,
			PageCur: 'basics',
			radio: '',
			// userInfo: {},
			loginUserInfo: {},
			dietRecord: [],
			sportsRecord: [],
			timeType: 'time',
			showTimePicker: false,
			dateFormat: 'hh:ii:ss',
			timeValue: '',
			dietIn: 0, //饮食摄入
			sportOut: 0, //运动消耗
			editable: false,
			currentType: 'food',
			currentData: [],
			currentColumn: '',
			currentIndex: 0,
			currentVal: null,
			nowDate: this.formateDate(new Date(), 'date'),
			selectDate: this.formateDate(new Date(), 'date'),
			addType: 'food',
			onSelect: '', //新增表单中打开时间选择器时 onSelect为form
			onEditor: '',
			formData: {
				userno: '',
				hdate: this.formateDate(new Date(), 'date'),
				htime: '',
				name: '',
				amount: '',
				unit: '',
				energy: ''
			},
			sportType: [],
			foodType: [],
			pageInfo: { total: 0, pageNo: 1, rownumber: 10 },
			picker: [],
			pickerIndex: -1,
			foodList: [],
			sportList: [],
			wxUserInfo: {},
			unit_energy: '', //当前选项每单位的能量
			KeepDays: '', //保持天数
			energyList: [
				{
					title: '脂溶性维生素',
					units: 'ug/d',
					matterList: [
						{
							name: 'A', //名字
							key: 'vitamin_a',
							EAR: 560, // 平均需要量
							UL: 3000, // 可耐受最高摄入量
							value: 0 // 当前值
						},
						{
							name: 'D',
							key: 'vitamin_d',
							EAR: 8,
							UL: 50,
							value: 0
						},
						{
							name: 'E',
							EAR: 14,
							key: 'vitamin_e',
							UL: 700,
							value: 0
						},
						{
							name: 'K',
							EAR: 50,
							key: 'vitamin_k',
							UL: 80,
							value: 0
						}
					]
				},
				{
					title: '常量矿物质',
					units: 'mg/d',
					matterList: [
						{
							name: '钙', //名字
							EAR: 800, // 低值
							UL: 1500, // 最大值
							key: 'element_ca',
							value: 0 // 当前值
						},
						{
							name: '镁',
							EAR: 350,
							UL: 800,
							key: 'element_mg',
							value: 0
						},
						{
							name: '钾',
							EAR: 1875,
							UL: 5625,
							key: 'element_k',
							value: 0
						}
					]
				},
				{
					title: '微量元素',
					units: 'mg/d',
					matterList: [
						{
							name: '铁', //名字
							EAR: 12, // 低值
							UL: 50, // 最大值
							key: 'element_fe',
							value: 0 // 当前值
						},
						{
							name: '锌',
							EAR: 12.5,
							UL: 45,
							key: 'element_zn',
							value: 0
						}
					]
				}
			]
		};
	},
	props: {
		userInfo: {
			type: Object,
			required: true,
			default: () => {}
		}
	},
	watch: {
		timeType(newValue, oldValue) {
			if (newValue === 'time') {
				this.dateFormat = 'hh:ii:ss';
			} else if (newValue === 'date') {
				this.dateFormat = 'yyyy-mm-dd';
			}
		}
	},
	computed: {
		energyChange() {
			return Number(this.dietIn) - Number(this.sportOut) - Number(this.basicOut);
		},
		age() {
			if (this.userInfo.birthday) {
				let age = new Date().getFullYear() - new Date(this.userInfo.birthday).getFullYear();
				return age;
			}
		},
		basicOut() {
			//基础代谢
			// IF(B4="男",IF(B3>=60,B2*13.4+490,IF(B3>=31,B2*11.5+830,B2*15.2+680)),IF(B3>=60,B2*10.4+600,IF(B3>=31,B2*8.6+830,B2*14.6+450)))
			if (this.userInfo.sex === '男') {
				if (this.age >= 60) {
					return this.userInfo.weight * 13.4 + 490;
				} else if (this.age >= 31 && this.age < 60) {
					return this.userInfo.weight * 11.5 + 830;
				} else {
					return this.userInfo.weight * 15.2 + 600; //<31
				}
			} else {
				if (this.age >= 60) {
					return this.userInfo.weight * 10.4 + 600;
				} else if (this.age >= 31 && this.age <= 60) {
					return this.userInfo.weight * 8.6 + 830;
				} else {
					return this.userInfo.weight * 14 + 450; //<31
				}
			}
			// const age =this.age
			// const sex = this.userInfo.sex
			// const weight = this.userInfo.weight
			// return sex==='男'?age>=60?weight*13.4+490:age>=31&&age<60?weight*11.5+830:weight*15.2+600:age>=60?weight*10.4+600:age>=31&&this.age<=60?weight*8.6+830:weight*14+450
		}
	},
	methods: {
		changeSub(e) {
			console.log(e);
			this.subIndex = e;
			if (e === 0) {
				this.subColor = '#5098ff';
			} else {
				this.subColor = '#ff9900';
			}
		},
		/*跳转到基本信息**/
		toPersonal() {
			uni.navigateTo({
				url: '/pages/specific/health/personalDetail/personalDetail?type=person'
			});
		},
		addSymptom() {
			// 跳转到症状选择页面
			uni.navigateTo({
				url: '/pages/specific/health/symptomSelect/symptomSelect'
			});
		},
		procEleData() {
			let energyList = this.energyList;
			energyList.forEach(item => {
				item.matterList.forEach(alone => {
					if (parseInt(alone.value) <= parseInt(alone.EAR)) {
						alone['status'] = 'anomaly';
					} else if (parseInt(alone.value) >= parseInt(alone.UL)) {
						alone['status'] = 'anomaly';
					} else {
						alone['status'] = 'regular';
					}
				});
			});
		},
		toAdd() {
			uni.navigateTo({
				url: '/pages/specific/health/balancedDiet/balancedDietDetail'
			});
		},
		getKeepDays() {
			let url = this.getServiceUrl('health', 'srvhealth_diet_record_select', 'select');
			let req = {
				serviceName: 'srvhealth_diet_record_select',
				colNames: ['*'],
				condition: [{ colName: 'userno', ruleType: 'like', value: this.loginUserInfo.user_no }],
				group: [
					{
						colName: 'hdate',
						type: 'distinct_count'
					}
				]
			};
			this.$http.post(url, req).then(res => {
				console.log(res.data.data);
				if (res.data.state === 'SUCCESS') {
					this.KeepDays = res.data.data[0].hdate;
				}
			});
		},
		selectChange(e) {
			console.log(e.newVal);
			if (e.newVal) {
				this.formData['name'] = e.newVal;
				let data = [];
				if (this.addType === 'food') {
					data = this.foodType;
				} else if (this.addType === 'sport') {
					data = this.sportType;
				}
				data.forEach(item => {
					if (item.name === e.newVal) {
						this.unit_energy = item.unit_energy;
						this.formData['unit'] = item.unit;
					}
				});
			}
		},
		PickerChange(e) {
			this.pickerIndex = e.detail.value;
		},
		deleteItem(item, type) {
			let self = this;
			uni.showModal({
				title: '提示',
				content: '确定删除此条记录?',
				success(res) {
					if (res.confirm) {
						uni.showLoading({
							mask: true,
							title: '正在删除...'
						});
						let serviceName = '';
						let url = '';
						if (type === 'food') {
							serviceName = 'srvhealth_diet_record_delete';
							url = self.getServiceUrl('health', 'srvhealth_diet_record_delete', 'operate');
						} else if (type === 'sport') {
							serviceName = 'srvhealth_body_activity_record_delete';
							url = self.getServiceUrl('health', 'srvhealth_body_activity_record_delete', 'operate');
						}
						let req = [{ serviceName: serviceName, condition: [{ colName: 'id', ruleType: 'in', value: item.id }] }];
						self.$http.post(url, req).then(res => {
							uni.hideLoading();
							if (res.data.resultCode === 'SUCCESS') {
								self.getDietRecord();
								self.getSportsRecord();
								uni.showToast({
									title: '删除成功!',
									icon: 'none'
								});
								this.refresh = !this.refresh;
							} else {
								uni.showToast({
									title: '删除失败!',
									icon: 'none'
								});
							}
						});
					} else if (res.cancel) {
						uni.showToast({
							title: '取消删除',
							icon: 'none'
						});
					}
				}
			});
		},
		updateData(data, type) {
			let serviceName = '';
			let url = '';
			let req = {};
			let obj = {};
			obj[this.currentColumn] = this.currentVal;
			if (type === 'food') {
				serviceName = 'srvhealth_diet_record_update';
				url = this.getServiceUrl('health', 'srvhealth_diet_record_update', 'operate');
				req = [
					{
						serviceName: 'srvhealth_diet_record_update',
						condition: [{ colName: 'id', ruleType: 'eq', value: data.id }],
						data: [obj]
					}
				];
				this.$http.post(url, req).then(res => {
					console.log(res.data);
					if (res.data.resultCode === 'SUCCESS') {
						uni.showToast({
							title: '修改成功'
						});
						this.getDietRecord();
					}
				});
			} else if (type === 'sport') {
				serviceName = 'srvhealth_body_activity_record_update';
				url = this.getServiceUrl('health', 'srvhealth_body_activity_record_update', 'operate');
				req = [
					{
						serviceName: 'srvhealth_body_activity_record_update',
						condition: [{ colName: 'id', ruleType: 'eq', value: data.id }],
						data: [obj]
					}
				];
				this.$http.post(url, req).then(res => {
					console.log(res.data);
					if (res.data.resultCode === 'SUCCESS') {
						uni.showToast({
							title: '修改成功'
						});
						this.getSportsRecord();
					}
				});
			}
		},
		changeDate() {
			// 切换日期
			this.dateFormat = 'yyyy-mm-dd';
			this.timeType = 'date';
			this.currentVal = new Date().getFullYear() + '-' + Number(new Date().getMonth() + 1) + '-' + new Date().getDate();
			this.showTimePicker = true;
		},
		onSelected(e) {
			//时间选择器
			this.showTimePicker = false;
			if (e) {
				this['time'] = e.value;
				//选择的值
				console.log('value => ' + e.value);
				//原始的Date对象
				console.log('date => ' + e.date);
				if (this.timeType === 'time') {
					if (this.onSelect === 'form') {
						this.formData['htime'] = e.value;
						this.onSelect = '';
						this.$refs.showForm.open();
					} else {
						const data = this.currentData;
						const index = this.currentIndex;
						let val = e.value;
						data[index][this.currentColumn] = val;
						if (this.currentType === 'food') {
							this.$set(this.dietRecord, index, data[index]);
						} else if (this.currentType === 'sport') {
							this.$set(this.sportsRecord, index, data[index]);
						}
					}
				} else if (this.timeType === 'date') {
					this.selectDate = e.value;
					this.getDietRecord();
					this.getSportsRecord();
				}
			} else if (this.onSelect === 'form') {
				this.$refs.showForm.open();
			}
		},
		cancel(type) {
			//popup弹出层点击事件
			if (type === 'confirm') {
				const data = this.currentData;
				const index = this.currentIndex;
				let val = this.currentVal;
				data[index][this.currentColumn] = val;
				console.log('item', data[index]);
				if (this.currentType === 'food') {
					this.$set(this.dietRecord, index, data[index]);
					this.updateData(data[index], 'food');
				} else if (this.currentType === 'sport') {
					this.$set(this.sportsRecord, index, data[index]);
					this.updateData(data[index], 'sport');
				}
			}
			this.$refs.showtip.close();
		},
		changeValue(val) {
			console.log(val);
		},
		openPopup(data, index, colName, type) {
			if (data.length > 0) {
				console.log(data, index, colName);
				this.currentData = data;
				this.currentColumn = colName;
				this.currentIndex = index;
				this.currentType = type;
				this.currentVal = data[index][colName];
				if (colName === 'htime') {
					this.dateFormat = 'hh:ii:ss';
					this.timeType = 'time';
					this.showTimePicker = true;
				} else {
					this.$nextTick(() => {
						this.$refs.showtip.open();
					});
				}
			}
		},
		async getBaseInfo() {
			// 使用user_no查找基本信息
			this.getDietRecord();
			this.getSportsRecord();
			this.getSportType();
			this.getFoodType();
		},
		/* 根据饮食记录查找食物**/
		async getChooseFood(str) {
			let url = this.getServiceUrl('health', 'srvhealth_diet_contents_select', 'select');
			let req = {
				serviceName: 'srvhealth_diet_contents_select',
				colNames: ['*'],
				condition: [
					{
						colName: 'name',
						ruleType: 'in',
						value: str
					}
				]
			};
			let res = await this.$http.post(url, req);
			console.log('res-------', res.data.data);
			return res.data.data;
		},
		async getDietRecord() {
			//饮食记录
			let url = this.getServiceUrl('health', 'srvhealth_diet_record_select', 'select');
			let req = {
				serviceName: 'srvhealth_diet_record_select',
				colNames: ['*'],
				condition: [
					{ colName: 'userno', ruleType: 'like', value: this.loginUserInfo.user_no },
					{ colName: 'user_name', ruleType: 'like', value: uni.getStorageSync('current_user') },
					{ colName: 'hdate', ruleType: 'like', value: this.selectDate.trim() }
				],
				page: { pageNo: 1, rownumber: 10 },
				order: []
			};
			let res = await this.$http.post(url, req);
			let energyList = this.energyList;
			energyList.forEach(item => {
				item.matterList.forEach(mat => {
					mat['value_left'] = 0;
					mat['right_width'] = 30;
					mat['left_width'] = (90 * mat.EAR) / mat.UL;
					mat['center_width'] = 90 - (90 * mat.EAR) / mat.UL;
				});
			});
			if (res.data.state === 'SUCCESS' && res.data.data.length > 0) {
				console.log(res.data.data);
				let strArr = [];
				res.data.data.forEach(item => {
					item['editable'] = false;
					strArr.push(item.name);
				});
				let str = strArr.join();
				let dietIn = 0;
				res.data.data.forEach(item => {
					dietIn += item.energy;
				});
				this.dietIn = dietIn;
				this.dietRecord = res.data.data;

				this.getChooseFood(str).then(a => {
					if (Array.isArray(a) && a.length > 0) {
						a.forEach(food => {
							res.data.data.forEach(re => {
								if (food.name === re.name) {
									food['amount'] = re.amount;
								}
							});
						});
						let chooseFood = a;
						if (chooseFood && chooseFood.length > 0) {
							let eledata = '';
							energyList.forEach(item => {
								item.matterList.forEach(mat => {
									mat.value = 0;
									chooseFood.forEach(fod => {
										for (let a in fod) {
											if (mat.key && mat.key == a) {
												mat.value = Number(mat.value) + Number(fod.amount) * Number(fod[a]);
												/**
												 * 共计 mat.EAR*2 + mat.UL-mat.EAR --> mat.EAR+mat.UL
												 * 左/右： mat.EAR
												 * 中间： mat.UL-mat.EAR
												 *
												 */
												if (mat.value && mat.value > (mat.UL - mat.EAR) * 3) {
													mat['value_left'] = 120 * 0.9;
													mat['left_width'] = ((mat.EAR * 120) / (mat.value / 0.9)).toFixed(1);
													mat['center_width'] = (((mat.UL - mat.EAR) * 120) / (mat.value / 0.9)).toFixed(1);
													mat['right_width'] = 120 - mat['left_width'] - mat['center_width'];
												} else {
													if (mat.value === 0 || mat.value === '0') {
														mat['value_left'] = 0;
														mat['right_width'] = 30;
														mat['left_width'] = (90 * mat.EAR) / mat.UL;
														mat['center_width'] = 90 - (90 * mat.EAR) / mat.UL;
													} else {
														// 40*mat.value/(mat.UL - mat.EAR)
														mat['value_left'] = ((40 * mat.value) / (mat.UL - mat.EAR)).toFixed(1);
														mat['left_width'] = (120 * mat.EAR) / (mat.EAR + mat.UL);
														mat['center_width'] = (120 * (mat.UL - mat.EAR)) / (mat.EAR + mat.UL);
														mat['right_width'] = (120 * mat.EAR) / (mat.EAR + mat.UL);
														if (mat.value < mat.EAR) {
															mat['value_left'] = ((mat['left_width'] * mat.value) / mat.EAR).toFixed(1);
														}
														if (mat.value >= mat.EAR && mat.value <= mat.UL) {
															mat['value_left'] = mat['left_width'] + (mat['center_width'] * (mat.value - mat.EAR)) / (mat.UL - mat.EAR);
														}
														if (mat.value > mat.UL) {
															mat['value_left'] = mat['left_width'] + mat['center_width'] + (mat['right_width'] * (mat.value - mat.UL)) / mat.EAR;
														}
														// mat['value_left'] = (120 * (mat.value/ ((mat.UL - mat.EAR) * 3))).toFixed(1);
													}
												}
											} else {
												if (mat.value == 0) {
													mat['value_left'] = 0;
													mat['right_width'] = 30;
													mat['left_width'] = (90 * mat.EAR) / mat.UL;
													mat['center_width'] = 90 - (90 * mat.EAR) / mat.UL;
												}
											}
										}
									});
								});
							});
							console.log('energyList-----', energyList);
						}
						// console.log("a====----",a)
					}
				});
			} else if (res.data.state === 'SUCCESS' && res.data.data.length === 0) {
				this.dietRecord = [];
				this.dietIn = 0;
				this.energyList.forEach(i => {
					i.matterList.forEach(at => {
						at.value = 0;
					});
				});
			}
			this.refresh = !this.refresh;
		},
		async getSportsRecord() {
			// 运动记录
			let url = this.getServiceUrl('health', 'srvhealth_body_activity_record_select', 'select');
			let req = {
				serviceName: 'srvhealth_body_activity_record_select',
				colNames: ['*'],
				condition: [
					{ colName: 'userno', ruleType: 'like', value: this.loginUserInfo.user_no },
					{ colName: 'user_name', ruleType: 'like', value: uni.getStorageSync('current_user') },
					{ colName: 'hdate', ruleType: 'like', value: this.selectDate.trim() }
				],
				page: { pageNo: 1, rownumber: 10 },
				order: []
			};
			let res = await this.$http.post(url, req);
			if (res.data.state === 'SUCCESS' && res.data.data.length > 0) {
				console.log(res.data.data);
				this.sportsRecord = res.data.data.map(item => {
					// item.energy = item.energy * this.userInfo.weight
					return item;
				});
				let sportOut = 0;
				res.data.data.forEach(item => {
					sportOut = item.energy * item.amount + sportOut;
					console.log(item, this.userInfo.weight, 'sportOut');
					item['editable'] = false;
				});
				this.sportOut = sportOut;
			} else if (res.data.state === 'SUCCESS' && res.data.data.length === 0) {
				this.sportsRecord = [];
				this.sportOut = 0;
			}
			this.refresh = !this.refresh;
		},
		async getFoodType() {
			// 食物类型
			let url = this.getServiceUrl('health', 'srvhealth_diet_contents_select', 'select');
			let req = { serviceName: 'srvhealth_diet_contents_select', colNames: ['*'], condition: [], page: { pageNo: 1, rownumber: 10 }, order: [] };
			let res = await this.$http.post(url, req);
			if (res.data.state === 'SUCCESS' && res.data.data.length > 0) {
				console.log(res.data.data);
				this.foodType = res.data.data;
			}
			this.refresh = !this.refresh;
		},
		async getSportType() {
			// 运动类型
			let url = this.getServiceUrl('health', 'srvhealth_body_activity_contents_select', 'select');
			let req = { serviceName: 'srvhealth_body_activity_contents_select', colNames: ['*'], condition: [], page: { pageNo: 1, rownumber: 10 }, order: [] };
			let res = await this.$http.post(url, req);
			if (res.data.state === 'SUCCESS' && res.data.data.length > 0) {
				console.log(res.data.data);
				this.sportType = res.data.data;
			}
			this.refresh = !this.refresh;
		},
		NavChange(e) {
			this.PageCur = e.currentTarget.dataset.cur;
		},
	},
	created() {
		let symptomList = uni.getStorageSync('symptomList');
		if (symptomList) {
			this.symptomList = symptomList;
		}
		uni.$on('checkedItem', datas => {
			let data = datas && datas.length > 0 ? datas : [];
			this.symptomList = data;
		});
		uni.$on('dietUpdate', () => {
			//饮食记录已改变，刷新数据
			this.getDietRecord();
		});
		uni.$on('sportUpdate', () => {
			//运动记录已改变，刷新数据
			this.getSportsRecord();
		});
		uni.$on('symptomSelect', e => {
			//症状已选择
			this.symptomList = e;
		});
	},
	mounted() {
		this.procEleData();
		let userInfo = uni.getStorageSync('login_user_info');
		if (userInfo && userInfo.user_no) {
			this.formData.userno = userInfo.user_no;
			this.loginUserInfo = userInfo;
			this.getBaseInfo();
		} else {
			alert('未发现登录用户信息');
		}
	}
};
</script>

<style lang="scss">
.balanced-diet {
	display: flex;
	flex-direction: column;
	width: calc(100%);
	margin: 0 auto;
	padding-bottom: 220rpx;
	// margin-top: 20rpx;
	overflow-y: auto;
	// margin: 0 auto;
	// padding-top: 40upx;
	box-sizing: border-box;
	height: 100vh;
	background-color: #f1f1f1;
	.over-view {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		// background-color: #fq;
		.view-item {
			height: 150rpx;
			border-radius: 5rpx;
			display: flex;
			background-color: #fff;
			color: #666;
			justify-content: center;
			align-items: center;
			flex-direction: column;
			margin-top: 20rpx;
			&:nth-child(2) {
				margin-right: 20rpx;
			}
			&:nth-child(2),
			&:nth-child(3) {
				width: calc(50% - 30rpx);
			}
			&:nth-child(1),
			&:nth-child(4) {
				width: calc(100% - 40rpx);
			}
			.number {
				font-size: 40rpx;
				display: flex;
				justify-content: center;
				align-items: center;
				flex-wrap: wrap;
				.units {
					margin-left: 10rpx;
					font-size: 24rpx;
				}
				.label {
					width: 100%;
					font-size: 24rpx;
					color: #333;
					text-align: center;
				}
			}
			&:nth-child(4) {
				flex-direction: row;
				justify-content: space-around;
				.number {
					font-size: 50rpx;
					align-items: flex-end;
					.units {
						line-height: 30rpx;
					}
				}
			}
		}
	}
	.headline {
		font-size: 40upx;
		height: 80upx;
		font-weight: 600;
		text-align: center;
	}
	.top {
		display: flex;
		justify-content: space-between;
		width: 95%;
		margin: 0 auto;
		.top-item {
			display: flex;
			flex-wrap: wrap;
			height: 150upx;
			justify-content: space-between;
			align-items: center;
			&:first-child {
				width: 150upx;
				height: 150upx;
				.head-img {
					width: 100%;
					height: 100%;
					border-radius: 10upx;
				}
			}
			&:nth-child(2) {
				flex: 1;
				margin: 0 20upx;
			}
			&:last-child {
				width: 200upx;
				justify-content: space-around;
			}
			.info {
				width: 45%;
				text-align: center;
				height: 50upx;
				line-height: 50upx;
			}
			.top-item-bottom {
				display: flex;
				display: flex;
				justify-content: center;
				align-items: center;
				.the-date {
					padding: 0 10upx;
				}
			}
		}
	}
	.main-box-plus {
		// margin: 0 20rpx;
		// box-shadow: 2px 2px 2px 1px rgba(0, 0, 0, 0.2);
		// border-bottom-left-radius: 20rpx;
		// border-bottom-right-radius: 20rpx;
		// border-radius: 20rpx;
		overflow: hidden;
	}
	.main-box {
		display: flex;
		flex-direction: column;
		box-sizing: border-box;
		width: 100%;

		&.symptom {
			background-color: #fff;
			margin: 20rpx 0;
			width: calc(100%);
			// box-shadow: 2px 2px 2px 1px rgba(0, 0, 0, 0.2);
			// border-radius: 20rpx;
			overflow: hidden;
			&:first-child {
				// margin-top: 0;
				margin-bottom: 0;
				box-shadow: none;
				padding: 10rpx 0;
				// margin:10rpx  ;
				// margin: 0 10rpx;
				background-color: #f1f1f1;
			}
			// border: 1px solid #fff;
			.title {
				padding: 10rpx;
				font-weight: bold;
				font-size: 34rpx;
				display: flex;
				// justify-content: space-between;
				.num {
					font-weight: 300;
					color: #999;
					line-height: 34rpx;
				}
			}
			.record-box {
				width: 100%;
				display: flex;
				// background-color: #f1f1f1;
				&.page-top {
					// background-color: #f1f1f1;
				}
				.record-item {
					flex: 1;
					height: 80rpx;
					display: flex;
					justify-content: center;
					align-items: center;
					margin: 0 10rpx;
					background-color: #fff;
					border-radius: 10rpx;
					font-weight: 700;
					font-size: 30rpx;
					letter-spacing: 2px;
					box-shadow: 2px 2px 2px 1px rgba(0, 0, 0, 0.2);
					// &:last-child{
					// 	margin-right: 5rpx;
					// }
					&:active {
						transform: translate(1px, 2px);
					}
				}
				.table {
					width: 100%;
					.no-data {
						width: 100%;
						height: 60rpx;
						padding-bottom: 50rpx;
						display: flex;
						justify-content: center;
						align-items: center;
						color: #999;
					}
					.row {
						padding-left: 20rpx;
						// border-top: 1px #f1f1f1 solid;
						&:nth-child(2n + 1) {
							// color: #fbbd08;
							background-color: #fef2ced2;
						}
						&:nth-child(2n) {
							// color: #0081ff;
							background-color: #cce6ff;
							// background-color: rgba($color: #f1f1f1, $alpha: 0.7);
						}
						.readonly {
							width: 100%;
							display: flex;
							min-height: 60upx;
							align-items: center;
							.column {
								// text-indent: 20upx;
								flex: 1;
								// text-align: left;
								display: flex;
								.units {
									flex: 1;
								}
								justify-content: center;
								&:first-child {
									flex: 0.5;
								}
								&:nth-child(5) {
									flex: 0.3;
								}
								// input{
								// 	width: 100%;
								// }
							}
						}
					}
				}
			}
			.symptom-box {
				width: 100%;
				display: flex;
				padding: 10rpx;
				flex-wrap: wrap;
				justify-content: flex-start;

				.symptom-item {
					min-width: 140rpx;
					background-color: #ff8383;
					color: #fff;
					// min-height: 60rpx;
					padding: 10rpx 20rpx;
					flex: 1;
					display: flex;
					justify-content: center;
					align-items: center;
					border-radius: 10rpx;
					max-width: 170rpx;
					// margin: 0 auto;
					margin-right: 10rpx;
					margin-bottom: 20rpx;
					letter-spacing: 2px;
					&.symptom-add {
						background-color: #f1f1f1;
						font-size: 40px;
						color: #999;
						font-weight: 100;
					}
				}
			}
		}
		.main-top {
			display: flex;
			justify-content: space-between;
			align-items: center;
			background-color: #fff;
		}
		.main-title {
			// border-left: 2px solid #f43f3b;
			// height: 80upx;
			// line-height: 80upx;
			margin: 20upx 0 20upx 0;
			font-size: 34upx;
			font-weight: 600;
			text-indent: 10upx;
			// background-color: rgba($color: #999, $alpha: 0.3);
		}
		.main-content {
			display: flex;
			align-items: center;
			justify-content: space-between;
			// min-height: 150upx;
			box-sizing: border-box;
			background-color: #fff;
			.energy-item {
				min-height: 100upx;
				display: flex;
				flex-direction: column;
				justify-content: space-around;
				.text {
					font-size: 20upx;
				}
				.number {
					font-size: 30upx;
					text-align: right;
				}
				.text-red {
					color: #red;
				}
				.units {
					min-width: 65rpx;
					padding-left: 10upx;
					font-size: 20upx;
					color: #000;
				}
			}
			.operate {
				font-size: 60upx;
				font-weight: 600;
				width: 60upx;
				text-align: center;
			}
			.table {
				width: 100%;
				.row {
					.readonly {
						width: 100%;
						display: flex;
						min-height: 60upx;
						align-items: center;
						.column {
							// text-indent: 20upx;
							flex: 1;
							// text-align: left;
							display: flex;
							.units {
								flex: 1;
							}
							&:nth-child(3) {
								flex: 0.7;
								display: flex;
								justify-content: center;
							}
							&:nth-child(4) {
								flex: 0.7;
								display: flex;
								justify-content: center;
							}
							&:nth-child(5) {
								flex: 0.3;
							}
							// input{
							// 	width: 100%;
							// }
						}
					}
				}
			}
			.ele-item {
				display: flex;
				// justify-content: space-between;
				align-items: center;
				justify-content: center;
				margin-right: 8rpx;
				width: 48%;
				margin-bottom: 10px;
				.ele-item-wrap {
					width: 100%;
					display: flex;
					justify-content: space-between;
					align-items: center;
					// justify-content: center;
					.probar {
						width: 100%;
						// padding: 40upx 20upx;
						padding: 0 10rpx;
						position: relative;
						.pointer {
							position: absolute;
							width: 8rpx;
							height: 30rpx;
							background-color: red;
							z-index: 20;
							top: 0;
							border-radius: 20rpx;
							&::after {
								position: absolute;
								content: attr(text);
								font-size: 10px;
								top: -25rpx;
								color: red;
							}
						}
						.progress-bar {
							height: 30rpx;
							width: 240rpx;
							position: relative;
						}
					}
					.ele-item-name {
						font-size: 14px;
						font-weight: 700;
						min-width: 20%;
						text-align: right;
					}
					.ele-item-num {
						text-align: center;
						background: #39b54a;
						// background-image: linear-gradient(45deg, #39b54a, #8dc63f);
						padding: 4px 5px;
						border-radius: 4px;
						font-size: 12px;
						min-width: 75px;
						:nth-child(2) {
							font-size: 14px;
							font-weight: 700;
						}
					}
					.max {
						// background-image: linear-gradient(45deg, #f43f3b, #ec008c);
						background-color: #e54d42;
					}
				}
			}
		}
		.main-content-t {
			background: #fff;
			color: #333;
			padding: 20rpx;
			font-size: 17px;
			font-weight: bold;
			// border-radius: 20rpx;
			margin: 20rpx 0;
			// box-shadow: 2px 2px 2px 1px rgba(0, 0, 0, 0.2);
			// border-radius: 20rpx;
			.number {
				.units {
					color: #000;
					font-weight: 100;
					padding-left: 0;
				}
			}
		}
		.ele-content {
			flex-wrap: wrap;
			justify-content: end;
		}
	}
	/* 提示窗口 */
	.uni-tip {
		/* #ifndef APP-NVUE */
		display: flex;
		flex-direction: column;
		/* #endif */
		padding: 15px;
		width: 300px;
		background-color: #fff;
		border-radius: 10px;
		input {
			// border: 2px solid #999;
			// height: 60upx;
			// border-radius: 10upx;
		}
		.title {
			width: auto;
		}
		.cu-form-group + .cu-form-group {
			border-top: none;
		}
	}

	.uni-tip-title {
		margin-bottom: 10px;
		text-align: center;
		font-weight: bold;
		font-size: 16px;
		color: #333;
	}

	.uni-tip-content {
		// padding: 15px;
		font-size: 14px;
		color: #666;
	}

	.uni-tip-group-button {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
		margin-top: 20px;
		background-color: #fff;
	}

	.uni-tip-button {
		flex: 1;
		text-align: center;
		font-size: 14px;
		color: #3b4144;
	}
	.cu-form-group {
		background-color: #fff;
		width: 100%;
		height: 150upx;
	}
}
.radioModal {
	display: flex;
	justify-content: center;
	align-items: center;
	.cu-dialog {
		height: 15vh;
	}
}
.radioModal /deep/ uni-radio::before,
uni-checkbox::before {
	right: 9px;
}
.pro-rad {
	overflow: inherit;
	height: 10px;
	background-color: transparent;
}
.tootio-item-wrap {
	position: absolute;
	width: 80rpx;
	top: -50rpx;
	right: 104rpx;
	.tootio-item {
		background-color: #8dc63f;
		border-color: #8dc63f;
		color: #ffffff;
		&::before {
			border-color: #8dc63f transparent transparent;
		}
	}
}
.regular {
	position: relative;

	// &::after {
	// 	position: absolute;
	// 	content: attr(num);
	// right: 33%;
	// 	top: -15px;
	// 	color: #8dc63f;
	// }
}
.max-risk {
	// &::after {
	right: 8%;
	.tootio-item {
		background-color: #ffb347;
		border-color: #ffb347;
		color: #ffffff;
		&::before {
			border-color: #ffb347 transparent transparent;
		}
	}
	// align-content: ;: #ffb347;
	// }
}
.min-low {
	// &::after {
	left: 30rpx;
	.tootio-item {
		background-color: #00c2ff;
		border-color: #00c2ff;
		color: #ffffff;
		&::before {
			border-color: #00c2ff transparent transparent;
		}
	}
	// 	color: #00c2ff;
	// }
}
.EAR,
.risk {
	position: relative;
	background-color: #cfcfcf;
	border-top-left-radius: 5px;
	border-bottom-left-radius: 5px;
	// border-right: 1px solid #ffffff;
	&::after {
		position: absolute;
		content: attr(num);
		right: -8px;
		// bottom: -20px;
		// top: -12px;
		color: #333;
		z-index: 2;
		// color: #999999;
	}
}
.risk {
	border-radius: 0;
	border: none;
	border-top-right-radius: 5px;
	border-bottom-right-radius: 5px;
	background-color: rgb(255, 179, 71);
	&::after {
		position: absolute;
		content: attr(num);
		left: -10px;
		// bottom: -20px;
		// color: #999999;
		color: #fff;

		color: #333;
		z-index: 2;
	}
}
.indicator {
	background-color: #ffffff;
	text-align: right;
	padding-top: 20rpx;
	padding-right: 30rpx;
	font-size: 15px;
	// margin: 0 10rpx;
	// box-shadow: 2px 2px 2px 2px rgba(0, 0, 0, 0.2);
	// border-top-left-radius: 20rpx;
	// border-top-right-radius: 20rpx;
	.cu-item {
		.content {
			font-weight: 700;
			display: flex;
			justify-content: space-between;
			.content_left {
				display: flex;
				.content_left_legend {
					display: flex;
					align-items: center;
					margin-left: 20upx;
					.content_left_legend_leg {
						width: 12px;
						height: 12px;
						background-color: #999;
						border-radius: 3px;
					}
				}
			}
		}
	}
}

.tootio-item {
	position: relative;
	width: 100%;
	height: 25px;
	border: 2px solid #3377aa;
	top: 0px;
	border-radius: 12rpx;
	color: #000000;
	font-size: 12px;
	&::before {
		position: absolute;
		content: '';
		width: 0;
		height: 0;
		border-width: 5px 5px;
		border-style: solid;
		border-color: #3377aa transparent transparent;
		bottom: -12px;
		left: 12px;
	}
}
.add-button {
	position: fixed;
	bottom: 20upx;
	left: calc(50% - 50upx);
	width: 100upx;
	height: 100upx;
	border-radius: 50%;
	background-color: #0081ff;
	z-index: 100;
	display: flex;
	justify-content: center;
	align-items: center;
	font-size: 24px;
	color: white;
}
</style>
