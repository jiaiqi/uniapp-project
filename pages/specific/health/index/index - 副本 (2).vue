<template>
	<view class="index-wrap">
		<view class="selextbox switch-menu">
				<view class="boxshow">
					<view class="menu" :style="{color:(idxMenu==index?'#3e3e3e':'')}" v-for="(item,index) in menuList" @click="switchover(index)">{{item.title}}</view>
					<text :style="{left:leftOffset+'upx'}" class="line"></text>
				</view>
		</view>
		<view class="placeholder"></view>
			<view class="selextbox">
				<view class="allbox" v-if="isshowIndex">
					<view class="main-content main-content-t">
						<view class="energy-item ">
							<view class="number">{{ parseFloat(dietIn).toFixed(1) }}</view>
							<view class="text">摄入</view>
						</view>
						<view class="operate">-</view>
						<view class="energy-item">
							<view class="number">{{ parseFloat(sportOut).toFixed(1) }}</view>
							<view class="text">运动</view>
						</view>
						<view class="operate">-</view>
						<view class="energy-item">
							<view class="number">{{ basicOut ? parseFloat(basicOut).toFixed(1) : '0' }}</view>
							<view class="text">基础代谢</view>
						</view>
						<view class="operate">=</view>
						<view class="energy-item">
							<view class="number text-red" style="display: flex; width: 90px; justify-content: space-between;">
								<text style="width: 60%;">{{ parseFloat(energyChange) > 0 ? `+${parseFloat(energyChange).toFixed(1)}` : parseFloat(energyChange).toFixed(1) }}</text>
								<text class="units">大卡</text>
							</view>
							<view class="number text-red" style="display: flex; width: 90px; justify-content: space-between;">
								<text style="width: 60%;">
									{{ energyChange === 0 ? '0.0' : parseFloat(energyChange / 7.7) > 0 ? `+${parseFloat(energyChange / 7.7).toFixed(1)}` : parseFloat(energyChange / 7.7).toFixed(1) }}
								</text>
								<text class="units">g脂肪</text>
							</view>
							<view class="text">体重变化</view>
						</view>
					</view>
					<view class="main-content card">
						<view class="left">
							<view class="title">饮食</view>
							<view class="subtitle">今日摄入</view>
							<view class="data">
								<view class="num text-orange">{{ dietIn.toFixed(1) }}</view>
								<view class="unit text-bold">大卡</view>
							</view>
						</view>
						<view class="right"><canvas canvas-id="canvasRingFood" id="canvasRingFood" class="charts" @touchstart="touchRingDiet"></canvas></view>
					</view>
					<view class="main-content card">
						<view class="left">
							<view class="title">运动</view>
							<view class="subtitle">今日消耗</view>
							<view class="data">
								<view class="num text-green">{{ sportOut.toFixed(1) }}</view>
								<view class="unit text-bold">大卡</view>
							</view>
						</view>
						<view class="right"><canvas canvas-id="canvasRingSport" id="canvasRingSport" class="charts" @touchstart="touchRingSport"></canvas></view>
					</view>
					<view class="half-content">
						<view class="half-width">
							<view class="title" @click="toPages('sj')">健康数据</view>
						</view>
						<view class="half-width">
							<view class="title" @click="toPages('pc')">健康评测</view>
						</view>
						<view class="half-width">
							<view class="title" @click="toPages('sc')">慢病筛查</view>
						</view>
						<view class="half-width">
							<view class="title" @click="toPages('gj')">小工具</view>
						</view>
					</view>
				</view>
				<view style="margin: 0 auto;" v-else>
					<Article></Article>
				</view>
			</view>
	</view>
</template>

<script>
	import uCharts from '@/components/u-charts/u-charts.js';
	import Article from '@/pages/specific/health/article/article'
	var _self;
	var canvaRingSport = null;
	var canvaRingDiet = null;
	export default {
		components: {
			Article
		},
		data() {
			return {
				menuList:[
					{title:'首页'},
					{title:'发现'},
				],
				idxMenu:0,
				leftOffset:0,
				isshowIndex: true,
				cWidth: '',
				cHeight: '',
				pixelRatio: 1,
				sportChartData: {
					series: [{
							name: '无氧',
							data: 20
						},
						{
							name: '有氧',
							data: 40
						}
					]
				},
				dietChartData: {
					series: [{
							name: '蛋白质',
							data: 50
						},
						{
							name: '脂肪',
							data: 30
						},
						{
							name: '碳水',
							data: 20
						}
					]
				}
			};
		},
		methods: {
			toPages(e) {
				this.$emit('toPages', e);
			},
			switchover(val){
				this.idxMenu=val
				if(val == 0 ){
					this.isshowIndex=true
					this.leftOffset = 0
				}else{
					this.isshowIndex=false
					this.leftOffset = 96
				}
			},
			showRing(canvasId, chartData, type) {
				let canvas = new uCharts({
					$this: _self,
					canvasId: canvasId,
					type: 'ring',
					fontSize: 11,
					legend: {
						show: true,
						position: 'bottom'
					},
					extra: {
						pie: {
							offsetAngle: -45,
							ringWidth: 10 * _self.pixelRatio,
							labelWidth: 5
						}
					},
					background: '#FFFFFF',
					pixelRatio: _self.pixelRatio,
					series: chartData.series,
					animation: true,
					width: _self.cWidth * _self.pixelRatio,
					height: _self.cHeight * _self.pixelRatio,
					disablePieStroke: true,
					dataLabel: true
				});
				if (type === 'sport') {
					canvaRingSport = canvas;
				} else {
					canvaRingDiet = canvas;
				}
			},
			touchRingSport(e) {
				canvaRingSport.showToolTip(e, {
					format: function(item) {
						return item.name + ':' + item.data;
					}
				});
			},
			touchRingDiet(e) {
				canvaRingDiet.showToolTip(e, {
					format: function(item) {
						return item.name + ':' + item.data;
					}
				});
			}
		},
		props: {
			dietIn: {
				// 饮食摄入
				type: Number,
				default: 0
			},
			sportOut: {
				// 运动消耗
				type: Number,
				default: 0
			},
			basicOut: {
				// 基础代谢
				type: Number,
				default: 0
			},
			dietRecord: {
				// 运动记录
				type: Array,
				default: () => []
			},
			userInfo: {
				//当前用户信息
				type: Object,
				default: () => {}
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
			}
		},
		mounted() {
			_self = this;
			this.cWidth = uni.upx2px(420);
			this.cHeight = uni.upx2px(300);
			this.showRing('canvasRingFood', this.dietChartData, 'diet');
			this.showRing('canvasRingSport', this.sportChartData, 'sport');
		}
	};
</script>

<style lang="scss" scoped>
	.index-wrap {
		background-color: #f1f1f1;
		width: 100vw;
		padding-bottom: 30rpx;
		height: calc(100vh - 88rpx);
		overflow: scroll;
		.placeholder{
			height: 110rpx;
		}
		.switch-menu{
			padding: 3vw 3vw 0 calc(3vw + 20rpx);
			background-color: #FFF;
			margin-bottom: 20rpx;
			position: fixed;
			top: 0;
			width: 100%;
			z-index: 999;
			.boxshow{
				display: flex;
				position: relative;
				padding-bottom:20upx ;
				.line{
					display: block;
					width: 68upx;
					height: 5upx;
					background-color: #a3b5ff;
					position: absolute;
					bottom: 2px;
					transition: all .3s;
				}
				.menu{
					margin-right: 28upx;
					color: #a2a2a2;
				}
			}
			
		}
		.main-content {
			display: flex;
			align-items: center;
			justify-content: space-between;
			min-height: 150rpx;
			background-color: #fff;
			border-radius: 20upx;
			box-sizing: border-box;
			// padding: 0 20rpx;
			width: 93vw;
			margin-top: 20rpx;

			&.main-content-t {
				padding: 0 20rpx;
				margin-top: 0rpx;
			}

			.energy-item {
				display: flex;
				flex-direction: column;
				justify-content: space-around;

				.text {
					font-size: 20rpx;
					line-height: 50rpx;
					text-align: center;
				}

				.number {
					font-size: 30upx;
					text-align: center;
				}

				.text-red {
					color: #red;
				}

				.units {
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

			&.card {
				.left {
					display: flex;
					flex-direction: column;
					justify-content: center;
					padding: 20rpx 0 0rpx 20rpx;

					.title {
						font-size: 20rpx;
						font-weight: 800;
						line-height: 70rpx;
					}

					.subtitle {
						color: #666;
						line-height: 80rpx;
					}

					.data {
						display: flex;
						min-height: 100rpx;
						// padding: 0 0 20rpx;
						flex-direction: column;

						.num {
							font-size: 80rpx;
							font-weight: bold;
						}

						.unit {
							display: flex;
							align-items: flex-end;
							line-height: 70rpx;
							padding-left: 10rpx;
						}
					}
				}

				.right {
					flex: 1;
					display: flex;
					justify-content: flex-end;
					align-items: center;

					.charts {
						width: 400rpx;
						height: 300upx;
						background-color: #ffffff;
						display: flex;
						justify-content: center;
						align-items: center;
					}
				}
			}
		}

		.selextbox {
			display: flex;
			font-size: 34upx;
			font-weight: bold;
			.allbox{
				margin: 0 auto;
			}
		}
		
		
		.half-content {
			width: 93vw;
			display: flex;
			// justify-content: space-between;
			flex-wrap: wrap;

			.half-width {
				margin-top: 20rpx;
				min-height: 100rpx;
				margin-right: 20rpx;
				width: calc((100% - 40rpx) / 3);
				background-color: #fff;
				border-radius: 20rpx;
				display: flex;
				justify-content: center;
				align-items: center;
				background-color: rgba($color: #1890ff, $alpha: 0.8);
				color: #fff;
				font-size: 30rpx;
				letter-spacing: 5rpx;

				&:nth-child(3),
				&:nth-child(6) {
					margin-right: 0;
				}
			}
		}
	}
</style>
