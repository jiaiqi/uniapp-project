<template>
	<view class="queue-wrap">
		<view class="queue-content">
			<view class="queue-header">
				<view class="queue-name" v-if="todayQue && todayQue.queue_name">
					{{ todayQue.queue_name || "" }}
				</view>
			</view>
			<view class="que-date" v-if="todayQue && todayQue.queue_date">
				<text>
					{{ dayjs(todayQue.queue_date).format("YYYY-MM-DD") }}
				</text>
				<text> （周{{localDay }}，今日） </text>
			</view>
			<view class="queue-remark" v-if="todayQue && todayQue.queue_remark">
				<view class="remark-title">说明：</view>
				<view class="remark-content">{{ todayQue.queue_remark }}</view>
			</view>
			<view class="current-number" v-if="todayQue&&todayQue.id">
				<view class="current-number-item">
					<view class="label">最新叫号：</view>
					<view class="text-red number" v-if="todayQue&&todayQue.cur_no">{{todayQue.cur_no}}</view>
					<view class="text-red number" v-else>未叫号</view>
				</view>
				<view class="current-number-item">
					<view class="label">排队人数：</view>
					<view class="text-red number">{{total||0}}人</view>
				</view>
			</view>
			<view class="my-queue" v-if="queInfo ">
				<view class="left">
					<view class=" profile-info" v-if="queInfo">
						<view class="label">
							<view class="margin-right-xs text">
								{{ queInfo.nick_name || "" }}
							</view>
						</view>
						<!-- <view class="status text-blue value">{{ queInfo.status }}</view> -->
					</view>
					<view class="queue-info">
						<view class="label">排队状态： </view>
						<view class="value text-blue">{{ queInfo.status }}</view>
						<!-- <view class="status text-blue">{{ queInfo.status }}</view> -->
					</view>
					<view class="queue-info">
						<view class="label">您的排号： </view>
						<view class="value text-blue">{{ queInfo.seq }}</view>
						<!-- <view class="status text-blue">{{ queInfo.status }}</view> -->
					</view>

					<view class="queue-info" v-if="queInfo.status === '排队中'">
						<view class="label">前面等待人数： </view>
						<text class="value text-blue">{{ waitAmount }}<text
								class="status text-blue margin-right">人</text></text>
					</view>
					<view class="queue-info" v-if="waitAmount && todayQue && todayQue.avg_wait_time&&queInfo&&queInfo.status==='排队中'">
						<view class="label">预估等待： </view>
						<text class="value text-blue">{{
            waitAmount * todayQue.avg_wait_time
          }}<text class="status text-blue">分钟</text></text>

					</view>
				</view>
			</view>
			<view class="que-button" v-if="
          todayQue && todayQue.id && todayQue.queue_status === '进行中'
        ">
				<view class="tip" v-if="todayQue && todayQue.refreshTime">刷新时间：{{ todayQue.refreshTime }}</view>
				<button class="button cu-btn bg-cyan light" @click="getTodayQueueInfo">
					<text class="cuIcon-refresh margin-right-xs"></text> 刷新
				</button>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		mapState
	} from 'vuex'
	let timer = null
	export default {
		computed: {
			queStatus() {
				if (!this.queInfo) {
					return '未抽号'
				} else if (this.queInfo?.status) {
					return this.queInfo.status
				}
			},
			curWaitAmount() {
				if (Array.isArray(this.queList)) {
					return this.queList.length
				} else {
					return 0
				}
			},
			overWait() {
				// 当前用户后面等待的人数
				if (this.queInfo && this.queInfo.seq && this.lastQueInfo && this.lastQueInfo.seq) {
					if (this.lastQueInfo.seq - this.queInfo.seq > 0) {
						return this.lastQueInfo.seq - this.queInfo.seq
					}
				}
			},
			waitAmount() {
				if (this.queInfo?.seq && this.currentQuer?.seq) {
					let num = this.queInfo.seq - this.currentQuer.seq
					if (num < 0) {
						num = 0
					}
					return num
				} else {
					return 0
				}
			},
			currentQuer() {
				// 队首
				if (this.queList.length > 0) {
					return this.queList[0]
				}
			},
			localDay() {
				let day = new Date()
				day = day.getDay()
				let result = ''
				switch (day) {
					case 0:
						result = '日'
						break;
					case 1:
						result = '一'
						break;
					case 2:
						result = '二'
						break;
					case 3:
						result = '三'
						break;
					case 4:
						result = '四'
						break;
					case 5:
						result = '五'
						break;
					case 6:
						result = '六'
						break;
				}
				return result
			}
		},
		data() {
			return {
				qr_no: "",
				store_no: "",
				queue_no: "",
				todayQue: null, //当日排队信息
				queInfo: null, //当前用户排队信息
				lastQueInfo: null,
				total: 0, //排队人总数
				queList: [],
				setTimer: false,
				tip: "",
				onrefresh: false
			}
		},
		methods: {
			async getTodayQueueInfo() {
				// 查询当日排队信息
				clearInterval(timer)
				timer = setInterval(() => {
					this.getTodayQueueInfo()
				}, 10 * 1000);
				if (this.onrefresh) {
					return
				}
				let req = {
					"serviceName": "srvhealth_store_queue_up_cfg_info_select",
					"colNames": ["*"],
					"condition": [{
							colName: 'store_no',
							ruleType: 'eq',
							value: this.store_no
						},
						{
							colName: 'queue_no',
							ruleType: 'eq',
							value: this.queue_no
						},
						{
							colName: "queue_date",
							ruleType: 'like',
							value: this.dayjs().format("YYYY-MM-DD")
						}
					],
					"page": {
						"pageNo": 1,
						"rownumber": 20
					}
				}
				this.onrefresh = true
				let res = await this.$fetch('select', 'srvhealth_store_queue_up_cfg_info_select', req, 'health')
				this.onrefresh = false
				if (res.success && res.data.length > 0) {
					res.data[0].refreshTime = this.dayjs().format("HH:mm:ss")
					debugger
					this.todayQue = res.data[0]
					uni.setNavigationBarTitle({
						title: res.data[0].queue_name
					})
					this.getQueList()
					this.getQueInfo()
					this.getLastPerson()
				}
			},
			async getQueList() {
				// 查找排队列表
				if (this.todayQue && this.todayQue.queue_no) {
					let req = {
						"serviceName": "srvhealth_store_queue_up_list_select",
						"colNames": ["*"],
						"condition": [{
								colName: 'status',
								ruleType: 'eq',
								value: '排队中'
							},
							{
								colName: "queue_no",
								ruleType: 'eq',
								value: this.todayQue.queue_no
							}
						],
						"page": {
							"pageNo": 1,
							"rownumber": 30
						}
					}
					let res = await this.$fetch('select', 'srvhealth_store_queue_up_list_select', req, 'health')
					this.queList = res.data
					this.total = res.page.total
				}
			},
			async getQueInfo() {
				if (this.todayQue && this.todayQue.queue_no && this.qr_no) {
					let req = {
						"serviceName": "srvhealth_store_queue_up_list_select",
						"colNames": ["*"],
						order: [{
							colName: "create_time",
							orderType: 'desc'
						}],
						"condition": [{
							colName: "qr_no",
							ruleType: 'eq',
							value: this.qr_no
						}],
						"page": {
							"pageNo": 1,
							"rownumber": 1
						}
					}
					let res = await this.$fetch('select', 'srvhealth_store_queue_up_list_select', req, 'health')
					if (res.success && res.data.length > 0) {
						this.queInfo = res.data[0]
					} else if (res.data.length === 0 && this.fill_batch_no) {
						uni.showModal({
							title: '提示',
							content: '是否自动抽号？',
							showCancel: true,
							success: ({
								confirm,
								cancel
							}) => {
								if (confirm) {
									this.startQue()
								} else {
									this.queInfo = null
								}
							}
						})
					} else {
						this.queInfo = null
					}
				}

			},
			async getLastPerson() {
				let req = {
					"serviceName": "srvhealth_store_queue_up_list_select",
					"colNames": ["*"],
					"condition": [{
							colName: 'status',
							ruleType: 'ne',
							value: '完成'
						},
						{
							colName: 'status',
							ruleType: 'ne',
							value: '已过号'
						},
						{
							colName: "queue_no",
							ruleType: 'eq',
							value: this.todayQue.queue_no
						},
						{
							colName: "store_no",
							ruleType: 'eq',
							value: this.store_no
						}
					],
					"order": [{
						colName: "create_time",
						orderType: "desc"
					}],
					"page": {
						"pageNo": 1,
						"rownumber": 1
					}
				}
				let res = await this.$fetch('select', 'srvhealth_store_queue_up_list_select', req, 'health')
				if (res.success && res.data.length > 0) {
					this.lastQueInfo = res.data[0]
				}
			},
		},
		// 页面周期函数--监听页面加载
		async onLoad(option) {
			if (option.qr_no) {
				this.store_no = option.store_no
				this.queue_no = option.queue_no
				this.qr_no = option.qr_no
				this.getTodayQueueInfo()
				clearInterval(timer)
				timer = setInterval(() => {
					this.getTodayQueueInfo()
				}, 10 * 1000);
				return
			}
		},
		onUnload() {
			clearInterval(timer)
		},
		beforeDestroy() {
			clearInterval(timer)
		},
		onHide() {
			clearInterval(timer)
		},
		onShow() {
			if (this.store_no && this.queue_no) {
				clearInterval(timer)
				timer = setInterval(() => {
					this.getTodayQueueInfo()
				}, 5000);
			}
		},
		// 页面处理函数--监听用户下拉动作
		onPullDownRefresh() {
			this.getTodayQueueInfo()
			uni.stopPullDownRefresh();
		},
	};
</script>

<style scoped lang="scss">
	.queue-wrap {
		text-align: center;
		// background-color: #f1f1f1;
		padding-top: 20px;
		margin-bottom: 30rpx;
		min-height: 100vh;
		background-color: #fff;
		.queue-content {
			min-height: 80vh;
			overflow: auto;
		}
	}

	.current-number {
		padding: 20rpx;
		border-radius: 20rpx;
		margin: 20px;
		display: flex;
		justify-content: space-between;
		flex-direction: column;
		align-items: flex-start;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
		font-size: 16px;

		.current-number-item {
			display: flex;
			width: 100%;
		}

		.label {
			flex: 1;
			// min-width: 130px;
			text-align: left;
		}

		.number {
			flex: 1;
			text-align: left;
			font-size: 24px;
			font-weight: bold;
		}
	}

	.queue-header {
		display: flex;
		justify-content: space-between;
		padding: 0 20px;

		.right {
			.profile {
				width: 100rpx;
				height: 100rpx;
				border-radius: 10rpx;
			}

			.label {
				font-weight: bold;
				color: #333;
			}
		}
	}

	.queue-name {
		font-weight: bold;
		font-size: 18px;
		text-align: center;
	}

	.que-date {
		text-align: left;
		padding: 0 20px;
		color: #666;
		font-size: 18px;
	}

	.queue-remark {
		display: flex;
		flex-direction: column;
		padding: 20rpx;
		color: #666;
		font-size: 16px;
		// background-color: #f9f9f9;
		margin: 10rpx 20rpx;
		align-items: flex-start;

		.remark-content {
			padding: 10rpx 0;
			min-height: 50px;
			height: auto;
			text-align: left;
		}
	}

	.queue-card {
		padding: 20rpx;
		margin-top: 20px;
		display: flex;
		justify-content: center;

		.card-item {
			padding: 20rpx;
			width: 150px;
			height: 150px;
			background-color: #deebf7;
			border-radius: 20px;
			display: flex;
			flex-direction: column;
			justify-content: center;

			&:first-child {
				margin-right: 20px;
			}

			.card-label {
				margin-bottom: 10px;
				font-weight: bold;
			}

			.card-content {
				font-size: 50px;
				font-weight: bold;
				color: #00b050;
			}
		}
	}

	.my-queue {
		padding: 20rpx;
		margin: 20px;
		border-radius: 20rpx;
		display: flex;
		align-items: center;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);

		.left {
			flex: 1;
			position: relative;
			padding-top: 30px;
		}

		.right {
			.profile {
				width: 100rpx;
				height: 100rpx;
				border-radius: 10rpx;
			}

			.label {
				font-weight: bold;
				color: #333;
			}
		}

		.profile-info {
			display: flex;
			width: 100%;
			justify-content: center;
			position: absolute;
			top: -10px;

			.label {
				display: flex;
				align-items: center;
				font-size: 18px;
			}

			.profile {
				width: 60rpx;
				height: 60rpx;
				border-radius: 60rpx;
			}
		}

		.queue-info {
			text-align: left;
			display: flex;
			align-items: center;
			font-size: 16px;
			// padding: 10rpx 0;
			justify-content: space-between;

			&.profile-info {
				padding: 0;
				justify-content: flex-start;

				.label {
					display: flex;
					align-items: center;
				}

				.profile {
					width: 60rpx;
					height: 60rpx;
					border-radius: 60rpx;
				}
			}

			.label {
				min-width: 130px;
				flex: 1;
			}

			.value {
				flex: 1;
				font-weight: bold;
				font-size: 24px;
				// color: #00b050;
			}

			.status {
				font-size: 24px;
			}
		}
	}

	.que-num {
		.font-bold {
			font-weight: bold;
		}

		.num {
			display: flex;
			justify-content: center;
			align-items: center;
			font-size: 40px;
			margin-top: 10rpx;
			position: relative;

			.num {
				position: relative;
			}

			.tip {
				font-size: 16px;
				position: absolute;
				right: 50px;
			}
		}
	}

	.que-card {
		// box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
		margin: 20rpx;
		background-color: #fff;
		display: flex;
		flex-direction: column;
		width: calc(100% - 40rpx);
		padding: 20rpx;
		border-radius: 20rpx;
	}

	.que-button {
		margin: 10rpx auto 30px;

		.tip {
			color: #666;
		}

		.button {
			margin-top: 20rpx;
			padding: 20rpx;
			width: 55%;
			font-size: 20px;
			height: auto;
			font-weight: bold;
		}
	}

	.cu-timeline {
		.cu-time {
			width: auto;
			padding: 20rpx;
		}

		.timeline-tips {
			color: #e54d42;
			font-weight: bold;
			margin-top: 20rpx;
		}

		.profile-info {
			// width: 100%;
			display: flex;
			flex-direction: column;
			justify-content: flex-end;
			align-items: center;

			// position: absolute;
			// right: 0;
			// top: 0;
			.text {
				font-size: 14px;
				color: #333;
			}

			.profile {
				width: 80rpx;
				height: 80rpx;
				border-radius: 20rpx;
				margin-bottom: 10rpx;
			}
		}

		.card-item {
			padding: 20rpx 20rpx 20rpx 100rpx;

			.content {
				background-color: #deebf7;
				border-radius: 20rpx;
				display: flex;
				align-items: center;
				padding: 20rpx;
				flex-wrap: wrap;
				position: relative;
			}

			.label {
				color: #e54d42;
				font-size: 16px;
				display: flex;
				flex-direction: column;
			}

			.value {
				flex: 1;
				width: 100%;
				font-size: 50px;
				color: #00b050;
				font-weight: bold;
				position: relative;
				display: flex;
				justify-content: center;

				&.mr-80 {
					margin-right: 80rpx;
				}

				.value_text {
					flex: 1;
					// margin-left: 80rpx;
					text-align: center;
				}
			}
		}
	}

	.realname-form {
		text-align: left;

		.cu-form-group {
			.title {
				min-width: 150rpx;
			}
		}
	}
</style>
