<template>
	<view v-if="chartList.length > 0" class="nutrient-wrap">
		<view class="diet-wrap cu-list">
			<view class="title">
				<text>饮食记录</text>
				<view class="order">
					<text>热量</text>
					<!-- 				<u-dropdown :close-on-click-mask="mask" ref="uDropdown" :activeColor="activeColor" :borderBottom="borderBottom">
						<u-dropdown-item title="属性">
							<view class="slot-content">
								<view class="item-box">
									<view class="item" :class="[item.active ? 'active' : '']" @tap="tagClick(index)" v-for="(item, index) in dropList" :key="index">{{ item.label }}</view>
								</view>
								<u-button type="primary" @click="closeDropdown">确定</u-button>
							</view>
						</u-dropdown-item>
					</u-dropdown> -->
					<u-icon name="arrow-down-fill" color="#333" size="28"></u-icon>
				</view>
			</view>
			<view
				@touchstart="ListTouchStart"
				@touchmove="ListTouchMove"
				@touchend="ListTouchEnd"
				:data-target="'move-box-' + index"
				class="diet-item cu-item"
				v-for="(item, index) in dietList"
				:key="index"
				:class="modalName == 'move-box-' + index ? 'move-cur' : ''"
			>
				<view class="column diet-name">{{ item.name }}</view>
				<view class="column">{{ item.amount + ' ' + item.unit }}</view>
				<view class="column">{{ item.energy }}千卡</view>
				<!-- <view class="column"><text class="lg  cuIcon-delete" @click="deleteItem(item)"></text></view> -->
				<view class="move column" @click.stop="deleteItem(item)"><view class="">删除</view></view>
			</view>
		</view>
		<view class="main-box charts" v-for="item in chartList" :key="item.chartId">
			<view class="main-top">
				<view class="main-title">{{ item.chartName }}({{ item.units }})</view>
			</view>
			<uniCharts class="unicharts" :chartId="item.chartId" :chartOption="item.chartOption"></uniCharts>
			<!-- <f2 :chartId="item.chartId" :title="item.chartId" width="750" height="500" :initF2="initChart(item)"></f2> -->
		</view>
	</view>
</template>

<script>
import uniCharts from '@/components/uni-charts/uni-charts.vue';
import * as echarts from '@/components/echarts/echarts.min.js';
export default {
	name: 'nutrientRatio', // 营养素占比
	components: {
		uniCharts
		// f2
	},
	data() {
		return {
			listTouchStart: 0,
			chooseDate: '',
			modalName: null,
			borderBottom: false,
			activeColor: '#2979ff',
			dietOrder: 'energy',
			dropList: [
				{
					label: '琪花瑶草',
					active: true
				},
				{
					label: '清词丽句',
					active: false
				},
				{
					label: '宛转蛾眉',
					active: false
				},
				{
					label: '煦色韶光',
					active: false
				},
				{
					label: '鱼沉雁落',
					active: false
				},
				{
					label: '章台杨柳',
					active: false
				},
				{
					label: '霞光万道',
					active: false
				}
			],
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
							name: 'E',
							EAR: 14,
							key: 'vitamin_e',
							UL: 700,
							value: 0
						}
					]
				},
				{
					title: '水溶性维生素',
					units: 'mg/d',
					matterList: [
						{
							name: 'B1', //名字
							key: 'vitamin_b1',
							EAR: 1.3, // 平均需要量
							UL: 5, // 可耐受最高摄入量
							value: 0 // 当前值
						},
						{
							name: 'B2',
							key: 'vitamin_b2',
							EAR: 1.3,
							UL: 5,
							value: 0
						},
						{
							name: '烟酸',
							EAR: 12,
							key: 'vitamin_b3',
							UL: 50,
							value: 0
						},
						{
							name: '叶酸',
							EAR: 0.32,
							key: 'folic_acid',
							UL: 1,
							value: 0
						},
						{
							name: 'VC',
							EAR: 85,
							key: 'vitamin_c',
							UL: 2000,
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
							EAR: 650, // 低值
							UL: 2000, // 最大值
							key: 'element_ca',
							value: 0 // 当前值
						},
						{
							name: '磷', //名字
							EAR: 600, // 低值
							UL: 3500, // 最大值
							key: 'element_p',
							value: 0 // 当前值
						},
						{
							name: '镁',
							EAR: 280,
							UL: 1000,
							key: 'element_mg',
							value: 0
						},
						{
							name: '钾',
							EAR: 2000,
							UL: 3600,
							key: 'element_k',
							value: 0
						},
						{
							name: '钠',
							EAR: 1500,
							UL: 2000,
							key: 'element_na',
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
						},
						{
							name: '硒',
							EAR: 50,
							UL: 80,
							key: 'element_se',
							value: 0
						},
						{
							name: '铜',
							EAR: 0.6,
							UL: 8,
							key: 'element_cu',
							value: 0
						},
						{
							name: '锰',
							EAR: 4.5,
							UL: 11,
							key: 'element_mn',
							value: 0
						}
					]
				}
			],
			chartList: [],
			dietList: [],
			loginUserInfo: {},
			selectDate: this.formateDate(new Date(), 'date')
		};
	},
	methods: {
		deleteItem(item) {
			let self = this
			uni.showModal({
				title: '提示',
				content: '确定要删除吗?',
				success(res) {
					if (res.confirm) {
						let url = self.getServiceUrl('health', 'srvhealth_diet_record_delete', 'operate');
						let req = [{ serviceName: 'srvhealth_diet_record_delete', condition: [{ colName: 'id', ruleType: 'in', value: item.id }] }];
						self.$http.post(url, req).then(res => {
							if (res.data.state === 'SUCCESS') {
								uni.showToast({
									title: '删除成功'
								});
								self.getDietRecord().then(res=>{
									let energyData = { energy: self.energyList, diet: self.dietList };
									self.buildChartData(energyData).then(chartList=>{
										self.chartList = chartList;
									})
								})
							}
						});
					}
				}
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
						right: '0',
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
				resultData.chartOption.color = [
					'#f49d13',
					'#28ebb1',
					'#FCCE10',
					'#E87C25',
					'#27727B',
					'#FE8463',
					'#9BCA63',
					'#FAD860',
					'#F3A43B',
					'#60C0DD',
					'#D7504B',
					'#C6E579',
					'#F4E001',
					'#F0805A',
					'#26C0C0'
				];
				resultData.chartOption.legend.data = diet.map(item => item.name).concat(lineList);
				resultData.chartOption.xAxis.data = item.matterList.map(item => item.key);
				resultData.chartOption.series = dietList.map(dietItem => {
					let obj = {
						name: dietItem.name,
						type: 'bar',
						stack: '总量',

						itemStyle: {
							normal: {}
						},
						barWidth: 20,
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
						stack: 'total',
						smooth: true,
						sampling: 'average',
						areaStyle: {
							normal: {}
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
						obj.areaStyle.normal.color = 'rgba(255,255,255,0)';
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
				resultList.push(resultData);
			});
			return resultList;
		},
		async getDietRecord() {
			// 饮食记录
			let url = this.getServiceUrl('health', 'srvhealth_diet_record_select', 'select');
			let req = {
				serviceName: 'srvhealth_diet_record_select',
				colNames: ['*'],
				condition: [
					{ colName: 'userno', ruleType: 'like', value: this.loginUserInfo.user_no },
					{ colName: 'user_name', ruleType: 'like', value: uni.getStorageSync('current_user') },
					{ colName: 'hdate', ruleType: 'like', value: this.chooseDate ? this.chooseDate : this.selectDate.trim() }
				],
				order: [
					{
						colName: this.dietOrder,
						orderType: 'desc' // asc升序  desc降序
					}
				]
			};
			let res = await this.$http.post(url, req);
			if (res.data.state === 'SUCCESS') {
				this.dietList = res.data.data;
			}
		},
		// ListTouch触摸开始
		ListTouchStart(e) {
			this.listTouchStart = e.touches[0].pageX;
		},
		// ListTouch计算方向
		ListTouchMove(e) {
			this.listTouchDirection = e.touches[0].pageX - this.listTouchStart > 0 ? 'right' : 'left';
		},
		// ListTouch计算滚动
		ListTouchEnd(e) {
			if (this.listTouchDirection == 'left') {
				this.modalName = e.currentTarget.dataset.target;
			} else {
				this.modalName = null;
			}
			this.listTouchDirection = null;
		},
		closeDropdown() {
			this.$refs.uDropdown.close();
		},
		tagClick(index) {
			this.list[index].active = !this.list[index].active;
		}
	},
	async created() {
		let userInfo = uni.getStorageSync('login_user_info');
		this.loginUserInfo = userInfo;
		await this.getDietRecord();
		// .then(_=>{
		let energyData = { energy: this.energyList, diet: this.dietList };
		let chartList = await this.buildChartData(energyData);
		this.chartList = chartList;
		// })
	},
	onLoad(option) {
		// if (option.chartList) {
		// 	this.chartList = JSON.parse(option.chartList);
		// }
		this.chooseDate = option.date;
		let chartList = uni.getStorageSync('chartList');
		if (chartList) {
			// this.chartList = chartList;
			// if(array.isSealed())
		}
	}
};
</script>

<style lang="scss" scoped>
.nutrient-wrap {
	background-color: #fff;
	min-height: 100vh;
	padding: 20rpx;
	.main-box {
		padding: 20rpx;
		height: 700upx;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
		margin-top: 20rpx;
		&.charts {
			height: 600upx;
			.unicharts {
				height: calc(100% - 100upx);
			}
		}
		.main-top {
			display: flex;
			justify-content: space-between;
			align-items: center;
		}
		.main-title {
			margin: 20upx 0 20upx 0;
			font-size: 34upx;
			font-weight: 600;
			text-indent: 10upx;
			position: relative;
			text-indent: 45rpx;
			&::before {
				content: '';
				width: 8rpx;
				height: 20rpx;
				border-radius: 10rpx;
				background-color: #0081ff;
				position: absolute;
				left: 20rpx;
				top: 15rpx;
			}
		}
	}
	.diet-wrap {
		display: flex;
		flex-direction: column;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
		// padding: 0 20rpx;
		overflow: hidden;
		.title {
			margin: 20upx 0 10upx 0;
			font-size: 34upx;
			font-weight: 600;
			position: relative;
			text-indent: 45rpx;
			display: flex;
			justify-content: space-between;
			&::before {
				content: '';
				width: 8rpx;
				height: 20rpx;
				border-radius: 10rpx;
				background-color: #0081ff;
				position: absolute;
				left: 20rpx;
				top: 15rpx;
			}
		}
		.order {
			width: 200rpx;
			text-align: right;
			font-weight: normal;
			font-size: 14px;
			text-indent: 10rpx;
			margin-right: 20rpx;
		}
		.diet-item {
			display: flex;
			.column {
				flex: 1;
				display: flex;
				justify-content: center;
				align-items: center;
				background-color: #fff;
				min-height: 80rpx;
				border-top: 1rpx solid #f1f1f1;
				&:first-child {
					text-indent: 20px;
					justify-content: flex-start;
				}
				&:last-child {
					flex: 0.5;
					background-color: #fa3534;
					color: #fff;
				}
				&.move {
				}
			}
		}
	}
}
</style>
