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
					<view class="main-box-title">能量等式</view>
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
			<view class="main-box main-box-plus">
				<view class="title" @click="toChart">
					<view class="label">
						营养素摄入情况分析
						<text class="cuIcon-rankfill"></text>
					</view>
					<!-- <button class="cu-btn bg-blue" @click.stop="toAddDiet" v-if="subIndex === 1 || subIndex === 0">选餐</button> -->
					<!-- <view class="num">[{{sportsRecord.length}}]</view> -->
				</view>
				<view class="indicator">
					<button
						class="cu-btn text-white"
						:class="{
							'active-btn': index === subIndex
						}"
						:style="{ 'background-color': index === 0 ? '#5098ff' : index === 1 ? '#999' : index === 2 ? 'rgb(141, 198, 63)' : index === 3 ? '#ff9900' : '' }"
						v-for="(item, index) in radioArr"
						@click="changeSub(index)"
						:key="index"
					>
						{{ item.label }}
					</button>
					<view class="tips" v-if="!hasRecord">请先添加您的饮食记录</view>
				</view>
				<view v-for="(item, index) in energyList" :key="index" class="main-box">
					<view class="main-top">
						<view class="main-title">
							<text>{{ item.title }}</text>
							<text>({{ item.units }})</text>
						</view>
					</view>
					<view class="main-content ele-content" v-if="energyList.length > 0">
						<view v-for="(alone, i) in item.matterList" :key="i" class="ele-item" @click="toDetail(alone, item)">
							<view class="ele-item-wrap" v-if="subIndex === 1 ? alone.value < alone.EAR || alone.value > alone.UL : true">
								<text class="ele-item-name">{{ alone.shortName }}</text>
								<view class="bg-white probar">
									<view class="cu-progress progress-bar radius pro-rad">
										<view
											v-if="alone.value_left || alone.value_left === 0"
											class="pointer"
											:text="alone.value === 0 ? alone.shortName==='E'?0 + 'mg/d':'0' :alone.shortName==='E'?alone.value + 'mg/d': alone.value.toFixed(2)"
											:style="{ left: `${alone.value_left}px` }"
										></view>
										<view :num="alone.left_width ? alone.EAR : ''" class="bg-grey EAR" :style="{ width: alone.left_width ? alone.left_width + 'px' : '33%' }"></view>
										<view
											:num="alone.value"
											class="bg-olive regular"
											:style="{
												width: alone.center_width ? alone.center_width + 'px' : '33%',
												'border-top-right-radius': !alone.UL ? '5px' : '',
												'border-bottom-right-radius': !alone.UL ? '5px' : ''
											}"
										></view>
										<view
											:status="alone.value < alone.EAR ? '不足' : alone.UL && alone.value > alone.UL ? '过多' : '正常'"
											:num="alone.right_width && alone.UL ? alone.UL : ''"
											class="bg-red risk"
											:class="{
												lack: alone.value < alone.EAR,
												normal: alone.value >= alone.EAR && (alone.value <= alone.UL || !alone.UL),
												over: alone.UL && alone.value > alone.UL
											}"
											:style="{
												width: alone.UL && alone.right_width ? alone.right_width + 'px' : !alone.UL ? 0 : '33%'
											}"
										></view>
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
					<view class="cuIcon-add" @click="toPages('food')"></view>
				</view>
				<view class="record-box" @click.self="foodListDisplay = !foodListDisplay" :class="{ showall: foodListDisplay, readmore: dietRecord.length > 3 }">
					<view class="table" v-if="dietRecord">
						<view class="no-data" v-if="!dietRecord || dietRecord.length === 0" @click="toPages('food')">点击添加饮食运动记录</view>
						<view class="row" v-for="(item, index) in dietRecord" :key="index">
							<view class="readonly" @click="(showEditModal = true), (currentRecord = deepClone(item)), (currentRecordType = 'food')">
								<view class="img"><u-image width="100%" height="100%" :src="$api.downloadFile + item['image'] + '&bx_auth_ticket=' + bx_auth_ticket"></u-image></view>
								<view class="column center">
									<view class="name">{{ item.name }}</view>
									<view class="number">{{ item.amount * item.unit_weight_g + item.unit }}</view>
								</view>
								<view class="column time">{{ item.htime ? item.htime.slice(0, 5) : '' }}</view>
								<view class="column">
									<text class="heat">
										<text class="text text-orange">{{ item.energy }}</text>
										千卡
									</text>
									<text class=" cuIcon-right"></text>
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
			<view class="main-box symptom">
				<view class="title">
					<view class="label">运动</view>
					<view class="cuIcon-add" @click="toPages('sport')"></view>
					<!-- <view class="num">[{{sportsRecord.length}}]</view> -->
				</view>
				<view class="record-box" @click.self="sportListDisplay = !sportListDisplay" :class="{ showall: sportListDisplay, readmore: sportsRecord.length > 3 }">
					<view class="table">
						<view class="no-data" v-if="!sportsRecord || sportsRecord.length === 0" @click="toPages('sport')">点击添加饮食运动记录</view>
						<view class="row" v-for="(item, index) in sportsRecord" :key="index">
							<view class="readonly" @click="(showEditModal = true), (currentRecord = deepClone(item)), (currentRecordType = 'sport')">
								<view class="img"><u-image width="100%" height="100%" :src="$api.downloadFile + item['image'] + '&bx_auth_ticket=' + bx_auth_ticket"></u-image></view>
								<view class="column center">
									<view class="name">{{ item.name }}</view>
									<view class="number">{{ item.amount + item.unit }}</view>
								</view>
								<view class="column time">{{ item.htime ? item.htime.slice(0, 5) : '' }}</view>
								<!-- <view class="column" @click="openPopup(sportsRecord, index, 'htime', 'sport')">{{ item.htime ? item.htime.slice(0, 5) : '' }}</view> -->
								<!-- <view class="column">{{ item.name }}</view> -->
								<!-- <view class="column">{{ item.amount + item.unit }}</view> -->
								<!-- <view class="column" @click="openPopup(sportsRecord, index, 'amount', 'sport')">{{ item.amount + item.unit }}</view> -->
								<view class="column ">
									<text class="heat">
										<text class="text text-green">{{ item.energy }}</text>
										千卡
									</text>
									<text class=" cuIcon-right"></text>
								</view>
								<!-- <view class="column"><text class="lg text-black cuIcon-delete" @click="deleteItem(item, 'sport')"></text></view> -->
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
					<view class="symptom-item" v-for="(item, index) in diseaseList" :key="index" v-show="item.disease_name">{{ item.disease_name }}</view>
					<view class="symptom-item symptom-add">+</view>
				</view>
			</view>
		</view>
		<view class="cu-modal bottom-modal" :class="{ show: showEditModal }" @click.self="(showEditModal = false), (currentRecord = null)">
			<view class="cu-dialog" v-if="currentRecord">
				<view class="title-bar">
					<view class="btn" @click="(showEditModal = false), (currentRecord = null)">取消</view>
					<view class="date">
						<!-- 			<text
							class="margin-right-xs"
							@click="
								timeType = 'date';
								showTimePicker = true;
								currentVal = currentRecord.hdate;
							"
						>
							{{ currentRecord.hdate }}
						</text>
						<text
							@click="
								timeType = 'time';
								showTimePicker = true;
								currentVal = currentRecord.htime;
							"
						>
							{{ currentRecord.htime }}
						</text> -->
						{{ currentRecord.hdate + ' ' + currentRecord.htime }}
					</view>
					<view class="btn" @click="UpdateDietInfo">确认</view>
				</view>
				<view class="diet-info">
					<view class="img"><u-image width="100%" height="100%" :src="currentDietImgUrl"></u-image></view>
					<view class="info">
						<view class="name">{{ currentRecord.name }}</view>
						<view class="weight">
							<text class="label">热量:</text>
							<text class="heat">
								{{ currentRecord.energy }}
								<text class="unit">千卡</text>
							</text>
							/{{ currentRecord.unit_weight_g ? currentRecord.amount * currentRecord.unit_weight_g : currentRecord.amount }}
							<text class="unit">{{ currentRecord.unit }}</text>
						</view>
						<!-- <view class="element">{{ elementData.label }}:{{ (currentRecord.amount * currentRecord[elementData.key]).toFixed(1) }}{{ elementData.units.split('/')[0] }}</view> -->
						<view class="amount">
							数量:
							<view class="number-box">
								<text @click="changeCurrentVal('minus')" class="symbol">-</text>
								<input @change="changeValue" v-model="currentRecord.amount" type="digit" disabled />
								<text @click="changeCurrentVal('plus')" class="symbol">+</text>
							</view>
						</view>
					</view>
				</view>
				<view class="delete-bar">
					<text class="cuIcon-delete" @click="deleteItem(currentRecord)"></text>
					<!-- 删除此条记录 -->
				</view>
				<view class="number-bar"></view>
				<view class="unit-bar"></view>
			</view>
		</view>
		<uni-popup ref="showtip" type="center" :mask-click="false" style="z-index: 1025;">
			<view class="uni-tip">
				<text class="uni-tip-title">修改数据</text>
				<!-- <u-number-box v-model="currentVal" @change="changeValue" :min="1" :max="100" :step="0.5"></u-number-box> -->
				<view class="number-box">
					<text @click="changeCurrentVal('minus')">-</text>
					<input @change="changeValue" v-model="currentVal" type="digit" />
					<text @click="changeCurrentVal('plus')">+</text>
				</view>
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
			:value="showTimePicker ? currentVal : ''"
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
import * as echarts from '@/components/echarts/echarts.min.js';
let self;
export default {
	components: { MxDatePicker, xflSelect, bxform, uniCharts, guageChart },
	data() {
		return {
			foodListDisplay: false,
			sportListDisplay: false,
			showEditModal: false, // 是否显示食物/运动记录编辑弹框
			subColor: '#999',
			subIndex: 4,
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
					label: '全部(17)',
					value: 'all',
					num: 0
				},
				{
					key: '不足',
					name: '不足',
					label: '不足(17)',
					value: 'lack',
					num: 0
				},
				{
					key: '正常',
					name: '正常',
					label: '正常(0)',
					value: 'normal',
					num: 0
				},
				{
					key: '过高',
					name: '过高',
					label: '过高(0)',
					value: 'over',
					num: 0
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
			currentRecord: {}, // 当前编辑的记录
			currentRecordType: {}, // 当前编辑的记录类型 食物/运动
			currentColumn: '',
			currentIndex: 0,
			currentVal: 0,
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
			symptomDiseaseList: [], // 病症-疾病对照
			diseaseList: [],
			energyListWrap: [
				{
					title: '有机物',
					units: 'g/d',
					matterList: [
						{
							label: '蛋白',
							name: '蛋白',
							shortName: '蛋白',
							key: 'protein',
							EAR: 0.9, // 平均需要量
							UL: 0, // 可耐受最高摄入量
							value: 0 // 当前值
						}
					]
				},
				{
					title: '脂溶性维生素',
					units: 'ug/d',
					matterList: [
						{
							label: '维生素A',
							name: 'VA',
							shortName: 'A',
							key: 'vitamin_a',
							EAR: 560, // 平均需要量
							UL: 3000, // 可耐受最高摄入量
							value: 0 // 当前值
						},
						// {
						// 	name: 'D',
						// 	key: 'vitamin_d',
						// 	EAR: 8,
						// 	UL: 50,
						// 	value: 0
						// },
						{
							label: '维生素E',
							name: 'VE',
							shortName: 'E',
							EAR: 14,
							key: 'vitamin_e',
							UL: 700,
							value: 0
						}
						// {
						// 	name: 'K',
						// 	EAR: 50,
						// 	key: 'vitamin_k',
						// 	UL: 80,
						// 	value: 0
						// }
					]
				},
				{
					title: '水溶性维生素',
					units: 'mg/d',
					matterList: [
						{
							label: '维生素B1',
							name: 'VB1', //名字
							shortName: 'B1',
							key: 'vitamin_b1',
							EAR: 1.3, // 平均需要量
							UL: 0, // 可耐受最高摄入量
							value: 0 // 当前值
						},
						{
							label: '维生素B2',
							name: 'B2',
							shortName: 'B2',
							key: 'vitamin_b2',
							EAR: 1.3,
							UL: 0,
							value: 0
						},
						{
							label: '烟酸(vb3)',
							shortName: 'B3',
							name: '烟酸',
							EAR: 12,
							key: 'vitamin_b3',
							UL: 0,
							value: 0
						},
						// {
						// 	name: 'B6',
						// 	EAR: 1.2,
						// 	key: 'vitamin_b6',
						// 	UL: 60,
						// 	value: 0
						// },
						// {
						// 	name: 'B12',
						// 	EAR: 2,
						// 	key: 'vitamin_b12',
						// 	UL: 20,
						// 	value: 0
						// },
						{
							label: '叶酸',
							shortName: 'B9',
							name: '叶酸',
							EAR: 0.32,
							key: 'folic_acid',
							UL: 0,
							value: 0
						},
						{
							label: '维生素C',
							shortName: 'C',
							name: 'VC',
							EAR: 85,
							key: 'vitamin_c',
							UL: 0,
							value: 0
						}
					]
				},
				{
					title: '常量矿物质',
					units: 'mg/d',
					matterList: [
						{
							label: '钙',
							name: '钙', //名字
							shortName: '钙',
							EAR: 650, // 低值
							UL: 2000, // 最大值
							key: 'element_ca',
							value: 0 // 当前值
						},
						{
							label: '磷',
							name: '磷', //名字
							shortName: '磷',
							EAR: 600, // 低值
							UL: 3500, // 最大值
							key: 'element_p',
							value: 0 // 当前值
						},
						{
							label: '镁',
							name: '镁',
							shortName: '镁',
							EAR: 280,
							UL: 1000,
							key: 'element_mg',
							value: 0
						},
						{
							label: '钾',
							shortName: '钾',
							name: '钾',
							EAR: 2000,
							UL: 3600,
							key: 'element_k',
							value: 0
						}
						// {
						// 	label: '钠',
						// 	name: '钠',
						// 	name: '钠',
						// 	shortName: '钠',
						// 	EAR: 1500,
						// 	UL: 2000,
						// 	key: 'element_na',
						// 	value: 0
						// }
					]
				},
				{
					title: '微量元素',
					units: 'mg/d',
					matterList: [
						{
							name: '铁', //名字
							label: '铁', //名字
							shortName: '铁',
							EAR: 12, // 低值
							UL: 50, // 最大值
							key: 'element_fe',
							value: 0 // 当前值
						},
						{
							name: '锌',
							label: '锌', //名字
							shortName: '锌',
							EAR: 12.5,
							UL: 45,
							key: 'element_zn',
							value: 0
						},
						{
							label: '硒', //名字
							name: '硒',
							shortName: '硒',
							EAR: 50,
							UL: 80,
							key: 'element_se',
							value: 0
						},
						{
							name: '铜',
							label: '铜', //名字
							shortName: '铜',
							EAR: 0.6,
							UL: 8,
							key: 'element_cu',
							value: 0
						},
						{
							label: '锰', //名字
							shortName: '锰',
							name: '锰',
							EAR: 4.5,
							UL: 11,
							key: 'element_mn',
							value: 0
						}
					]
				}
			],
			energyList: []
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
		symptomList: {
			handler(newValue, oldValue) {
				console.log('-----------');
				if (Array.isArray(newValue) && newValue.length > 0) {
					this.getSymptomDiseaseList(newValue);
				} else {
					this.diseaseList = [];
				}
			}
		},
		timeType(newValue, oldValue) {
			if (newValue === 'time') {
				this.dateFormat = 'hh:ii:ss';
			} else if (newValue === 'date') {
				this.dateFormat = 'yyyy-mm-dd';
			}
		}
	},
	computed: {
		bx_auth_ticket() {
			return uni.getStorageSync('bx_auth_ticket');
		},
		currentDietImgUrl() {
			let currentDiet = this.currentRecord;
			if (currentDiet && currentDiet.image) {
				return this.$api.downloadFile + currentDiet['image'] + '&bx_auth_ticket=' + uni.getStorageSync('bx_auth_ticket');
			}
		},
		hasRecord() {
			return this.dietRecord.length > 0;
		},
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
		toAddDiet() {
			// 跳转到选餐页面
			let energyList = this.deepClone(this.energyListWrap);
			let condition = [];
			let elementList = [];
			energyList.forEach(en => {
				en.matterList.forEach(ele => {
					if (this.dietRecord.length > 0 && ele.EAR > ele.value) {
						ele.diff = ele.value / ele.EAR;
						elementList.push(ele);
					}
				});
			});
			elementList = elementList.sort(function(a, b) {
				return a.diff - b.diff;
			});
			const condType = {
				type: 'food',
				serviceName: 'srvhealth_diet_contents_select',
				colName: 'name',
				imgCol: 'image',
				wordKey: {
					title: 'name',
					unit: 'unit',
					energy: 'unit_energy'
				}
			};
			if (elementList.length > 0) {
				condType.order = [
					{
						colName: elementList[0].key,
						orderType: 'desc' // asc升序  desc降序
					}
				];
			}
			const url = '/pages/specific/health/dietSelect/dietSelect?condType=' + encodeURIComponent(JSON.stringify(condType));
			uni.navigateTo({
				url: url
			});
		},
		async getFoodList(diet) {
			let foodNameList = diet.map(item => item.name);
			let url = this.getServiceUrl('health', 'srvhealth_diet_contents_select', 'select');
			let req = {
				serviceName: 'srvhealth_diet_contents_select',
				colNames: ['*'],
				condition: [{ colName: 'name', ruleType: 'in', value: foodNameList.toString() }]
			};
			let res = await this.$http.post(url, req);
			if (res.data.state === 'SUCCESS') {
				diet = diet.map(item => {
					let obj = null;
					res.data.data.map(food => {
						if (food.name === item.name) {
							obj = Object.assign(food, item);
						}
					});
					return obj;
				});
				return diet;
			}
		},
		async buildChartData(e) {
			let { energy, diet } = e;
			let dietList = await this.getFoodList(diet);
			this.foodList = dietList;
			let normalData = {
				chartName: ' ',
				chartId: '',
				units: '',
				chartOption: {
					color: [],
					legend: {
						data: [],
						show: true,
						orient: 'vertical',
						right: '3%',
						top: 'top'
					},
					grid: {
						top: '5%',
						left: '3%',
						right: '100',
						bottom: '0',
						containLabel: true
					},
					xAxis: {
						type: 'category'
					},
					yAxis: {
						type: 'value'
					},
					series: []
				}
			};
			let resultList = [];
			let lineList = ['最高', '最低'];
			energy.forEach(item => {
				let resultData = this.deepClone(normalData);
				resultData.chartName = item.title;
				resultData.chartId = item.title;
				resultData.units = item.units;
				resultData.chartOption.color = ['#f49d13', '#28ebb1', '#f6d748', '#9967FA', '#44aff0', '#d34e58', '#f49d13', '#f6d748', '#9967FA', '#44aff0'];
				resultData.chartOption.legend.data = diet.map(item => item.name).concat(lineList);
				resultData.chartOption.xAxis.data = item.matterList.map(item => item.key);
				resultData.chartOption.series = dietList.map(dietItem => {
					let obj = {
						name: dietItem.name,
						type: 'bar',
						stack: '总量',
						label: {
							normal: {
								show: false
							}
						},
						data: []
					};
					resultData.chartOption.xAxis.data.map(ele => {
						if (dietItem[ele]) {
							obj.data.push(dietItem.amount * dietItem[ele]);
						} else {
							obj.data.push(0);
						}
					});
					return obj;
				});
				let lineSeries = [];
				lineList.forEach((l, index) => {
					let obj = {
						name: l,
						type: 'line',
						// smooth: true,
						// stack: '总量',
						sampling: 'average',
						areaStyle: {
							normal: {
								color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
									{
										offset: 0,
										color: 'rgba(40,235,177,0.5)'
									},
									{
										offset: 1,
										color: 'rgba(244,157,19,0.5)'
									}
								])
							}
						},
						label: {
							normal: {
								show: false
							}
						},
						data: []
					};
					if (index === 0) {
						obj.areaStyle.normal.color = 'rgba(40,235,177,0.2)';
					} else {
						obj.areaStyle.normal.color = 'rgba(244,157,19,0.2)';
					}
					item.matterList.forEach(mat => {
						resultData.chartOption.xAxis.data.forEach(x => {
							if (mat.key === x) {
								if (l === '最低') {
									obj.data.push(mat.EAR);
								} else {
									obj.data.push(mat.UL);
								}
							}
						});
					});
					lineSeries.push(obj);
					resultData.chartOption.series.unshift(obj);
				});
				resultData.chartOption.xAxis.data = item.matterList.map(item => item.name);
				// resultData.chartOption.series = lineSeries.concat(resultData.chartOption.series);
				// resultData.chartOption.series = resultData.chartOption.series.concat(lineSeries);
				resultList.push(resultData);
			});
			return resultList;
		},
		changeCurrentVal(e) {
			if (e === 'minus') {
				if (this.currentRecord.amount >= 1) {
					this.currentRecord.amount = this.currentRecord.amount - 0.5;
				}
			} else {
				this.currentRecord.amount = this.currentRecord.amount + 0.5;
			}
		},
		toDetail(e, item) {
			// if (e.value === 0) {
			// 	uni.showToast({
			// 		title: '当前日期的饮食记录中不含该营养素',
			// 		icon: 'none',
			// 		duration: 3000,
			// 		mask: true
			// 	});
			// 	return;
			// }
			e.units = item.units;
			uni.navigateTo({
				url: '/pages/specific/elementDetail/elementDetail?data=' + JSON.stringify(e) + '&user_no=' + this.loginUserInfo.user_no + '&date=' + this.selectDate
			});
		},
		async toChart() {
			// 跳转到食物营养素占比页面
			if (this.dietRecord.length === 0) {
				return;
			}
			let energyData = { energy: this.energyListWrap, diet: this.dietRecord };
			let chartList = await this.buildChartData(energyData);
			uni.setStorageSync('chartList', chartList);
			uni.navigateTo({
				url: '/pages/specific/health/nutrientRatio/nutrientRatio?date=' + this.selectDate,
				// url: '/pages/specific/health/nutrientRatio/nutrientRatio?chartList=' + encodeURIComponent(JSON.stringify(chartList)),
				complete() {
					uni.$emit('sendEnergyList', chartList);
				}
			});
		},
		async getSymptomDiseaseList(symptomList) {
			if (Array.isArray(symptomList) && symptomList.length > 0) {
				const symptomNoList = symptomList.map(item => item.no);
				const symptomNoStr = symptomNoList.toString();
				if (symptomNoStr) {
					const url = this.getServiceUrl('health', 'srvhealth_symptoms_disease_select', 'select');
					const req = {
						serviceName: 'srvhealth_symptoms_disease_select',
						colNames: ['*'],
						condition: [
							{
								colName: 'symptoms_no',
								ruleType: 'in',
								value: symptomNoStr
							}
						]
					};
					const res = await this.$http.post(url, req);
					if (res.data.state === 'SUCCESS' && Array.isArray(res.data.data)) {
						let diseaseList = res.data.data.map(item => {
							return {
								disease_no: item.disease_no,
								disease_name: item._disease_no_disp,
								symptoms_no: item.symptoms_no,
								symptoms_name: item._symptoms_no_disp
							};
						});
						let diseaseNameList = diseaseList.map(item => item.disease_name);
						// 去重
						diseaseNameList = [...new Set(diseaseNameList)];
						diseaseList = diseaseNameList.map(item => {
							let obj = {
								disease_name: item,
								disease_no: '',
								symptoms_info: []
							};
							diseaseList.map(disease => {
								if (item === disease.disease_name) {
									obj.disease_no = disease.disease_no;
									obj.symptoms_info.push({
										no: disease.symptoms_no,
										name: disease.symptoms_name
									});
								}
							});
							return obj;
						});
						this.diseaseList = diseaseList;
					}
				}
			}
		},
		changeSub(e, showSub, data) {
			// 切换展示营养素状态(异常||全部)
			console.log(e);
			if (this.subIndex === e && !showSub) {
				this.subIndex = 4;
			} else {
				this.subIndex = e;
			}
			let energyListWrap = this.deepClone(this.energyListWrap);
			if (data) {
				energyListWrap = this.deepClone(data);
			}
			this.energyList.length = 0;
			switch (this.subIndex) {
				case 0:
					this.subColor = '#5098ff';
					this.energyList = energyListWrap;
					break;
				case 1:
					this.subColor = '#999';
					this.energyList = energyListWrap.filter(item => {
						item.matterList = item.matterList.filter(ele => {
							return ele.value < ele.EAR;
						});
						return item.matterList.length > 0;
					});
					break;
				case 2:
					this.subColor = 'rgb(141, 198, 63)';
					this.energyList = energyListWrap.filter(item => {
						item.matterList = item.matterList.filter(ele => {
							return ele.UL ? ele.value >= ele.EAR && ele.value <= ele.UL : ele.value >= ele.EAR;
						});
						return item.matterList.length > 0;
					});
					break;
				case 3:
					this.subColor = '#ff9900';
					this.energyList = energyListWrap.filter(item => {
						item.matterList = item.matterList.filter(ele => {
							return ele.UL ? ele.value > ele.UL : false;
						});
						return item.matterList.length > 0;
					});
					break;
				case 4:
					this.energyList = [];
					break;
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
			let term = {
				serviceName: 'srvhealth_self_symptoms_select',
				srvApp: 'health',
				key: 'name',
				type: 'symptom'
			};
			uni.navigateTo({
				url: '/pages/specific/health/symptomSelect/symptomSelect3?term=' + encodeURIComponent(JSON.stringify(term))
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
		async UpdateDietInfo() {
			let self = this;
			let dietInfo = this.deepClone(this.currentRecord);
			let serviceName = 'srvhealth_diet_record_update';
			let cond = [
				{
					colName: 'name',
					ruleType: 'eq',
					value: dietInfo.name
				}
			];
			let recordType = await this.getFoodType(cond);
			let ele = null;
			debugger;
			if (this.currentRecordType === 'sport') {
				serviceName = 'srvhealth_body_activity_record_update';
				recordType = await this.getSportType(cond);
			}
			if (Array.isArray(recordType) && recordType.length > 0) {
				ele = recordType[0];
				dietInfo.energy = dietInfo.amount * ele.unit_energy;
			}
			let url = this.getServiceUrl('health', serviceName, 'operate');
			let req = [
				{
					serviceName: serviceName,
					condition: [{ colName: 'id', ruleType: 'eq', value: dietInfo.id }],
					data: [
						{
							amount: dietInfo.amount,
							energy: dietInfo.energy
						}
					]
				}
			];
			let res = await this.$http.post(url, req);
			if (res.data.state === 'SUCCESS') {
				await self.getDietRecord();
				await self.getSportsRecord();
				console.log(self.elementData);
				self.showEditModal = false;
			}
		},
		deleteItem(item) {
			let self = this;
			let type = this.currentRecordType;
			uni.showModal({
				title: '提示',
				content: '确定删除此条记录?',
				success(res) {
					if (res.confirm) {
						uni.showLoading({
							mask: true,
							title: '正在删除...'
						});
						self.showEditModal = false;
						let serviceName = '';
						let url = '';
						if (type === 'food') {
							serviceName = 'srvhealth_diet_record_delete';
							url = self.getServiceUrl('health', 'srvhealth_diet_record_delete', 'operate');
						} else if (type === 'sport') {
							serviceName = 'srvhealth_body_activity_record_delete';
							url = self.getServiceUrl('health', 'srvhealth_body_activity_record_delete', 'operate');
						}
						debugger;
						let req = [{ serviceName: serviceName, condition: [{ colName: 'id', ruleType: 'in', value: item.id }] }];
						self.$http.post(url, req).then(res => {
							uni.hideLoading();
							if (res.data.resultCode === 'SUCCESS') {
								if (type === 'food') {
									self.getDietRecord();
								} else if (type === 'sport') {
									self.getSportsRecord();
								}
								uni.showToast({
									title: '删除成功!',
									icon: 'none'
								});
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
				this.foodType.forEach(item => {
					if (item.name === data.name) {
						obj['energy'] = item.unit_energy * obj[this.currentColumn];
					}
				});
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
				this.sportType.forEach(item => {
					if (item.name === data.name) {
						obj['energy'] = item.unit_energy * obj[this.currentColumn];
					}
				});
				this.sportType.forEach(item => {
					if (item.name === data.name) {
						obj['energy'] = item.unit_energy * obj[this.currentColumn];
					}
				});
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
			this.currentVal = val.value;
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
			await this.getNutrientRecommended();
			this.getDietRecord().then(res => {
				let condition = null;
				if (Array.isArray(res) && res.length > 0) {
					res = res.map(item => item.name);
					condition = [
						{
							colName: 'name',
							ruleType: 'in',
							value: res.toString()
						}
					];
					this.getFoodType(condition);
				}
			});
			this.getSportsRecord().then(res => {
				let condition = null;
				if (Array.isArray(res) && res.length > 0) {
					res = res.map(item => item.name);
					condition = [
						{
							colName: 'name',
							ruleType: 'in',
							value: res.toString()
						}
					];
					this.getSportType(condition);
				}
			});
		},
		async getNutrientRecommended() {
			let url = this.getServiceUrl('health', 'srvhealth_nutrient_values_recommended_select', 'select');
			let req = {
				serviceName: 'srvhealth_nutrient_values_recommended_select',
				colNames: ['*'],
				order: [
					{
						colName: 'nutrient',
						orderType: 'desc' // asc升序  desc降序
					}
				]
			};
			let res = await this.$http.post(url, req);
			if (Array.isArray(res.data.data) && res.data.data.length > 0) {
				let result = res.data.data.filter(item => {
					if ((item.sex && item.sex.indexOf(self.userInfo.sex) !== -1) || !item.sex) {
						if (item.age_start && item.age_end) {
							return self.age >= item.age_start && self.age < item.age_end;
						} else if (item.age_start && !item.age_end) {
							return self.age >= item.age_start;
						} else if (!item.age_start && !item.age_end) {
							return true;
						} else {
							return false;
						}
					}
				});
				result.forEach(item => {
					self.energyListWrap.forEach(energy => {
						energy.matterList.forEach(mat => {
							if (item.nutrient === mat.name) {
								// mat.EAR = item.val_ear ? item.val_ear : mat.EAR;
								mat.UL = item.val_ul ? item.val_ul : mat.UL;
								mat.EAR = item.val_rni ? item.val_rni : mat.EAR;
								if (energy.title !== '水溶性维生素') {
									mat.UL = item.val_ul ? item.val_ul : mat.UL;
									// mat.UL = item.val_ul ? item.val_ul : mat.UL;
								} else {
									mat.UL = 0;
								}
								if (mat.name === '蛋白') {
									mat.EAR = item.val_rni ? item.val_rni * self.userInfo.weight : mat.EAR;
									// mat.UL = item.val_rni ? item.val_rni * self.userInfo.weight : mat.UL;
								}
							}
						});
					});
				});
				return result;
			}
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
		async getDietRecord(chooseDate = null) {
			//饮食记录
			if (chooseDate) {
				this.selectDate = chooseDate;
			}
			let url = this.getServiceUrl('health', 'srvhealth_diet_record_select', 'select');
			let req = {
				serviceName: 'srvhealth_diet_record_select',
				colNames: ['*'],
				condition: [
					{ colName: 'userno', ruleType: 'like', value: this.loginUserInfo.user_no },
					{ colName: 'user_name', ruleType: 'like', value: uni.getStorageSync('current_user') },
					{ colName: 'hdate', ruleType: 'like', value: chooseDate ? chooseDate : this.selectDate.trim() }
				],
				order: [
					{
						colName: 'create_time',
						orderType: 'desc'
					}
				]
			};
			let res = await this.$http.post(url, req);
			let energyList = this.energyListWrap;
			energyList.forEach(item => {
				item.matterList.forEach(mat => {
					mat['value_left'] = 0;
					mat['right_width'] = 30;
					mat['left_width'] = (90 * mat.EAR) / mat.UL;
					mat['center_width'] = 90 - (90 * mat.EAR) / mat.UL;
					if (item.title === '水溶性维生素') {
						mat['right_width'] = 0;
						mat['left_width'] = 30;
						mat['center_width'] = 90;
					}
					if (item.title === '有机物') {
						mat['right_width'] = 0;
						mat['left_width'] = 50;
						mat['center_width'] = 70;
					}
					if (mat.center_width * 3 < mat.left_width || mat.center_width * 3 < mat.right_width) {
						mat.left_width = mat.left_width - mat['center_width'];
						mat.right_width = mat.right_width - mat['center_width'];
						mat['center_width'] = 3 * mat['center_width'];
					}
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
									food['amount'] = food['amount'] ? food['amount'] + re.amount : re.amount;
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
												// if (mat.name === '蛋白') {
												// 	debugger
												// 	mat.UL = this.userInfo.weight * mat.UL;
												// 	mat.EAR = this.userInfo.weight * mat.EAR;
												// }
												mat.value = Number(mat.value) + Number(fod.amount) * Number(fod[a]);
												/**
												 * 共计 mat.EAR*2 + mat.UL-mat.EAR --> mat.EAR+mat.UL
												 * 左/右： mat.EAR
												 * 中间： mat.UL-mat.EAR
												 */
												if (mat.UL && mat.value && mat.value > (mat.UL - mat.EAR) * 4) {
													mat['value_left'] = (120 * 0.9) / 2;
													mat['left_width'] = (mat.EAR * 120) / ((mat.value * 2) / 0.9);
													mat['center_width'] = ((mat.UL - mat.EAR) * 120) / ((mat.value * 2) / 0.9);
													mat['right_width'] = 120 - mat['left_width'] - mat['center_width'];
												} else {
													if (!mat.UL) {
														mat['right_width'] = 0;
														mat['left_width'] = 50;
														mat['center_width'] = 70;
														if (mat.value <= mat.EAR) {
															mat['value_left'] = (mat['left_width'] * mat.value) / mat.EAR;
														} else {
															mat['value_left'] = (mat['left_width'] * mat.value) / mat.EAR;
															// mat['value_left'] = 50 + mat.value;
														}
														if (mat['value_left'] > 110) {
															mat['value_left'] = 110;
														}
														return;
													}
													if (mat.value === 0 || mat.value === '0') {
														mat['value_left'] = 0;
														mat['right_width'] = 30;
														mat['left_width'] = (90 * mat.EAR) / mat.UL;
														mat['center_width'] = 90 - (90 * mat.EAR) / mat.UL;
													} else {
														mat['value_left'] = (40 * mat.value) / (mat.UL - mat.EAR);
														mat['left_width'] = (120 * mat.EAR) / (mat.EAR + mat.UL);
														mat['right_width'] = (120 * mat.EAR) / (mat.EAR + mat.UL) > 30 ? (120 * mat.EAR) / (mat.EAR + mat.UL) : 30;
														// mat['center_width'] = (120 * (mat.UL - mat.EAR)) / (mat.EAR + mat.UL);
														if (mat['left_width'] + mat['right_width'] > 80) {
															mat['right_width'] = 20;
															mat['left_width'] = (100 * mat.EAR) / mat.UL;
														}
														mat['center_width'] = 120 - mat['left_width'] - mat['right_width'];

														if (mat.value < mat.EAR) {
															mat['value_left'] = (mat['left_width'] * mat.value) / mat.EAR;
														}
														if (mat.value >= mat.EAR && mat.value <= mat.UL) {
															mat['value_left'] = mat['left_width'] + (mat['center_width'] * (mat.value - mat.EAR)) / (mat.UL - mat.EAR);
														}
														if (mat.value > mat.UL) {
															mat['value_left'] = mat['left_width'] + mat['center_width'] + (mat['right_width'] * (mat.value - mat.UL)) / mat.EAR;
														}
														// mat['value_left'] = (120 * (mat.value/ ((mat.UL - mat.EAR) * 3)));
													}
													if (mat['value_left'] > 110) {
														mat['value_left'] = 110;
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
						}
					}
					this.radioArr.forEach((radio, index) => {
						radio.num = 0;
						energyList.forEach(item => {
							item.matterList.forEach(ele => {
								switch (index) {
									case 0:
										radio.num++;
										break;
									case 1:
										if (ele.value < ele.EAR) {
											radio.num++;
										}
										break;
									case 2:
										if (ele.value >= ele.EAR && ele.value <= ele.UL) {
											radio.num++;
										} else if (ele.value >= ele.EAR && ele.UL === 0) {
											radio.num++;
										}
										break;
									case 3:
										if (ele.UL && ele.value > ele.UL) {
											radio.num++;
										}
										break;
								}
							});
						});
						radio.label = radio.name + '(' + radio.num + ')';
					});
				});
			} else if (res.data.state === 'SUCCESS' && res.data.data.length === 0) {
				this.dietRecord = [];
				this.dietIn = 0;
				this.energyListWrap.forEach(i => {
					i.matterList.forEach(at => {
						at.value = 0;
					});
				});
			}
			this.energyList = this.deepClone(energyList);
			this.changeSub(4);
			return res.data.data;
		},
		async getSportsRecord(chooseDate = null) {
			// 运动记录
			if (chooseDate) {
				this.selectDate = chooseDate;
			}
			let url = this.getServiceUrl('health', 'srvhealth_body_activity_record_select', 'select');
			let req = {
				serviceName: 'srvhealth_body_activity_record_select',
				colNames: ['*'],
				condition: [
					{ colName: 'userno', ruleType: 'like', value: this.loginUserInfo.user_no },
					{ colName: 'user_name', ruleType: 'like', value: uni.getStorageSync('current_user') },
					{ colName: 'hdate', ruleType: 'like', value: chooseDate ? chooseDate : this.selectDate.trim() }
				],
				order: [
					{
						colName: 'create_time',
						orderType: 'desc'
					}
				]
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
					sportOut = item.energy + sportOut;
					console.log(item, this.userInfo.weight, 'sportOut');
					item['editable'] = false;
				});
				this.sportOut = sportOut;
			} else if (res.data.state === 'SUCCESS' && res.data.data.length === 0) {
				this.sportsRecord = [];
				this.sportOut = 0;
			}
			return res.data.data;
		},
		async getFoodType(cond) {
			// 食物类型
			let url = this.getServiceUrl('health', 'srvhealth_diet_contents_select', 'select');
			let req = { serviceName: 'srvhealth_diet_contents_select', colNames: ['*'], condition: [], order: [] };
			if (cond) {
				req.condition = cond;
			}
			let res = await this.$http.post(url, req);
			if (res.data.state === 'SUCCESS' && res.data.data.length > 0) {
				console.log(res.data.data);
				this.foodType = res.data.data;
			}
			return res.data.data;
		},
		async getSportType(cond) {
			// 运动类型
			let url = this.getServiceUrl('health', 'srvhealth_body_activity_contents_select', 'select');
			let req = { serviceName: 'srvhealth_body_activity_contents_select', colNames: ['*'], condition: [], order: [] };
			if (cond) {
				req.condition = cond;
			}
			let res = await this.$http.post(url, req);
			if (res.data.state === 'SUCCESS' && res.data.data.length > 0) {
				console.log(res.data.data);
				this.sportType = res.data.data;
			}
			return res.data.data;
		},
		NavChange(e) {
			this.PageCur = e.currentTarget.dataset.cur;
		},
		resetRadioArr() {
			this.radioArr = [
				{
					key: '全部',
					name: '全部',
					label: '全部(17)',
					value: 'all',
					num: 0
				},
				{
					key: '不足',
					name: '不足',
					label: '不足(17)',
					value: 'lack',
					num: 0
				},
				{
					key: '正常',
					name: '正常',
					label: '正常(0)',
					value: 'normal',
					num: 0
				},
				{
					key: '过高',
					name: '过高',
					label: '过高(0)',
					value: 'over',
					num: 0
				}
			];
		},
		toPages(e) {
			let condType = {};
			let url = '';
			switch (e) {
				case 'food':
					condType = {
						type: 'food',
						serviceName: 'srvhealth_diet_contents_select',
						colName: 'name',
						imgCol: 'image',
						wordKey: {
							title: 'name',
							unit: 'unit',
							energy: 'unit_energy'
						}
					};
					url = '/pages/specific/health/dietSelect/dietSelect?condType=' + encodeURIComponent(JSON.stringify(condType));
					break;
				case 'sport':
					condType = {
						type: 'sport',
						serviceName: 'srvhealth_body_activity_contents_select',
						colName: 'name',
						imgCol: 'image',
						wordKey: {
							title: 'name',
							unit: 'unit',
							energy: 'unit_energy'
						}
					};
					url = '/pages/specific/health/dietSelect/dietSelect?condType=' + encodeURIComponent(JSON.stringify(condType));
					break;
			}
			if (url) {
				uni.navigateTo({
					url: url
				});
			}
		}
	},
	created() {
		let symptomList = uni.getStorageSync('symptomList');
		if (symptomList) {
			this.symptomList = symptomList;
		} else {
			this.symptomList = [];
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
		self = this;
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
		background-color: #fff;
		overflow: hidden;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding-bottom: 20rpx;
		transition: height 0.6s ease;
		height: auto;
		.cu-btn {
			// margin-top: 20px;
		}
		.title {
			width: 100%;
			padding: 10rpx;
			min-height: 100rpx;
			font-weight: bold;
			font-size: 34rpx;
			font-weight: bold;
			display: flex;
			text-align: left;
			justify-content: space-between;
			align-items: center;
		}
	}
	.main-box {
		display: flex;
		flex-direction: column;
		box-sizing: border-box;
		width: 100%;
		border-top: 1px dashed #f1f1f1;
		padding: 10rpx 0;
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
				justify-content: space-between;
				.cuIcon-add {
					&:active {
						transform: scale(1.5);
						font-weight: 700;
					}
				}
				.num {
					font-weight: 300;
					color: #999;
					line-height: 34rpx;
				}
			}
			.record-box {
				width: 100%;
				display: flex;
				&.readmore {
					transition: all 1s;
					height: 200px;
					overflow: hidden;
					position: relative;
					&::before {
						color: #409eff;
						height: 60px;
						line-height: 60px;
						width: 100%;
						text-align: center;
						background-image: linear-gradient(-180deg, rgba(255, 255, 255, 0) 0%, rgb(255, 255, 255) 60%);
						content: '点击展开全部记录';
						bottom: 0;
						position: absolute;
						z-index: 90;
					}
					&.showall {
						min-height: 200px;
						height: auto;
						padding-bottom: 40px;
						&::before {
							content: '点击收起';
						}
					}
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
					padding: 10rpx 0;
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
						padding: 0 20rpx;
						// border-top: 1px #f1f1f1 solid;
						&:nth-child(2n + 1) {
							// color: #fbbd08;
							// background-color: #fef2ced2;
						}
						&:nth-child(2n) {
							// color: #0081ff;
							// background-color: #cce6ff;
							// background-color: rgba($color: #f1f1f1, $alpha: 0.7);
						}
						.readonly {
							width: 100%;
							display: flex;
							min-height: 120rpx;
							align-items: center;
							&:active {
								background-color: #f1f1f1;
								box-shadow: 0px 0px 20px 8px #f1f1f1;
							}
							// box-shadow: 4px 3px 5px 0px rgba(0, 0, 0, 0.12);
							// border-bottom: 1rpx dotted #f1f1f1;
							.img {
								width: 110rpx;
								height: 110rpx;
								padding: 1px;
								border-radius: 10rpx;
								overflow: hidden;
								border: 1px solid #f1f1f1;
								box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
							}
							.column {
								// flex: 1;
								display: flex;
								min-height: 80rpx;
								justify-content: flex-end;
								align-items: flex-end;
								&.time {
									justify-content: center;
									padding: 0 10rpx;
									color: #999;
								}
								&.center {
									flex-direction: column;
									padding-left: 50rpx;
									align-items: flex-start;
									justify-content: flex-start;
									height: 120rpx;
									min-width: 140rpx;
									.name {
										font-weight: 700;
										font-size: 15px;
										line-height: 70rpx;
									}
									.number {
										font-size: 12px;
										color: #999;
									}
								}
								.heat {
									color: #999;
									margin-right: 10rpx;
									font-size: 12px;
									.text {
										font-size: 16px;
										padding-right: 2px;
									}
								}
								.cuIcon-right {
									color: #999;
								}
								&:last-child {
									flex: 1;
								}
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
					min-height: 110rpx;
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
			// margin: 20upx 0 0upx 0;
			font-size: 16px;
			font-weight: 700;
			text-indent: 10upx;
			letter-spacing: 1px;
		}
		.main-content {
			display: flex;
			align-items: center;
			justify-content: space-between;
			// min-height: 150upx;
			box-sizing: border-box;
			flex-wrap: wrap;
			background-color: #fff;
			.main-box-title {
				width: 100%;
				text-align: center;
				font-size: 14px;
				color: #666;
			}
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
					text-align: center;
				}
				.text-red {
					color: #red;
					text-align: right;
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
				align-items: center;
				justify-content: center;
				width: 50%;
				margin-top: 30rpx;
				.ele-item-wrap {
					width: 100%;
					display: flex;
					justify-content: space-between;
					align-items: center;
					// justify-content: center;
					.probar {
						// width: 100%;
						// padding: 40upx 20upx;
						padding: 0 10rpx;
						position: relative;
						flex: 1;
						.pointer {
							position: absolute;
							width: 8rpx;
							height: 30rpx;
							background-color: rgba(250, 65, 65, 0.6);
							z-index: 20;
							top: 0;
							border-radius: 20rpx;
							transition: left 1s;
							&::after {
								position: absolute;
								content: attr(text);
								font-size: 14px;
								top: -30rpx;
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
						min-width: 30px;
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
		.number-box {
			display: flex;
			justify-content: center;
			padding: 20rpx;
			text {
				background: rgb(242, 243, 245);
				color: rgb(50, 50, 51);
				width: 30px;
				height: 27px;
				line-height: 27px;
				display: flex;
				justify-content: center;
				align-content: center;
				font-size: 20px;
			}
			input {
				width: 100rpx;
				color: rgb(50, 50, 51);
				font-size: 14px;
				background: rgb(242, 243, 245);
				height: 27px;
				width: 43px;
				text-align: center;
				position: relative;
				padding: 0;
				margin: 0 3px;
				display: flex;
				align-items: center;
				justify-content: center;
			}
		}
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
		color: #333;
		z-index: 2;
	}
	&::before {
		position: absolute;
		content: attr(status);
		right: -26px;
		color: #333;
		font-size: 10px;
		z-index: 2;
	}
	&.lack {
		&::before {
			color: #333;
		}
	}
	&.normal {
		&::before {
			color: #8dc63f;
		}
	}
	&.over {
		&::before {
			color: #ffb347;
		}
	}
}
.indicator {
	background-color: #ffffff;
	text-align: center;
	font-size: 15px;
	width: 100%;
	padding: 10rpx 0;
	.cu-btn {
		margin-right: 10rpx;
		padding: 0 10px;
		font-size: 12px;
		&:last-child {
			margin-right: 0rpx;
		}
		&.active-btn {
			// font-weight: 700;
			letter-spacing: 2px;
			font-size: 14px;
			padding: 0 20px;
			// height: 40px;
			margin: 0 10px;
			// border-radius: 30px;
		}
	}
	.tips {
		color: #999;
		font-size: 12px;
		padding-top: 20rpx;
	}
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
.cu-modal.show {
	z-index: 999;
}
.cu-dialog {
	width: 100vw;
	.title-bar {
		display: flex;
		justify-content: space-between;
		min-height: 80rpx;
		align-items: center;
		.btn {
			padding: 030rpx;
			color: #0081ff;
			font-size: 28rpx;
		}
	}
	.diet-info {
		display: flex;
		padding: 20rpx;
		justify-content: space-around;
		.img {
			width: 200rpx;
			height: 200rpx;
			border-radius: 10rpx;
			overflow: hidden;
			// padding: 2px;
			box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
		}
		.info {
			min-width: 400rpx;
			padding-left: 50rpx;
			display: flex;
			flex-direction: column;
			.name {
				font-weight: 700;
				font-size: 16px;
			}
			.element {
				color: #8dc63f;
			}
			.weight {
				padding: 10rpx 0;
				// color: #999;
				color: #ffb347;
				.heat {
					color: #ffb347;
					font-size: 16px;
				}
				.unit {
					font-size: 12px;
				}
			}
			.amount {
				display: flex;
				align-items: center;
				.number-box {
					display: flex;
					justify-content: center;
					padding: 20rpx;
					text {
						background: rgb(242, 243, 245);
						color: rgb(50, 50, 51);
						width: 30px;
						height: 27px;
						line-height: 27px;
						display: flex;
						justify-content: center;
						align-content: center;
						font-size: 20px;
					}
					input {
						width: 100rpx;
						color: rgb(50, 50, 51);
						font-size: 14px;
						background: rgb(242, 243, 245);
						height: 27px;
						width: 43px;
						text-align: center;
						position: relative;
						padding: 0;
						margin: 0 3px;
						display: flex;
						align-items: center;
						justify-content: center;
					}
					.symbol {
						&:active {
							// box-shadow: 0 0 20px rgba(0, 0, 0, 0.5);
							transform: scale(1.5);
						}
					}
				}
			}
		}
	}
	.delete-bar {
		flex: 1;
		padding: 10rpx 20rpx;
		color: #999;
		border-top: 1px solid #f1f1f1;
		display: flex;
		justify-content: center;
		align-items: center;
		font-size: 50rpx;
		height: 150rpx;
		.cuIcon-delete {
			display: inline-block;
			height: 80rpx;
			line-height: 80rpx;
			text-align: center;
			width: 80rpx;
			border-radius: 100%;
			border: #666 1px solid;
			color: #666;
			&:active {
				box-shadow: 0 0 20px rgba(0, 0, 0, 0.5);
				transform: scale(1.1);
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
