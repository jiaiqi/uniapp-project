<template>
	<view class="queue-list-view">
		<view class="cu-bar bg-white">
			<view class=" text-bold" v-if="store_info&&store_info.name">
				{{store_info.name}}
			</view>
			<!-- <button class="cu-btn sm bg-blue" @click="getTodayQue"><text class="cuIcon-refresh margin-right-xs"></text>刷新</button> -->
		</view>
		<view class="queue-item" v-for="item in queue" :key="item.id" @click="toQueue(item)">
			<view class="que-header">
				<view class="que-name">
					{{ item.queue_name || "" }}
				</view>
				<button class="cu-btn sm bg-blue" @click="getTodayQue"><text
						class="cuIcon-refresh margin-right-xs"></text>刷新</button>
				<!-- 				<view class="que-status" :class="{
            'text-green':
              item.queue_status === '进行中' || item.queue_status === '开放中',
            'text-red': item.queue_status === '已结束',
            'text-yellow': item.queue_status === '待开始',
          }">
					{{ item.queue_status || "-" }}
				</view> -->
			</view>
			<view style="display: flex; justify-content: space-between;align-items: center;">
				<view class="que-date">
					<text>
						{{ dayjs().format("YYYY-MM-DD") }}
					</text>
					<text> （周{{ localDay }}，今日） </text>
				</view>
				<view class="que-status" :class="{
				    'text-green':
				      item.queue_status === '进行中' || item.queue_status === '开放中',
				    'text-red': item.queue_status === '已结束',
				    'text-yellow': item.queue_status === '待开始',
				  }">
					{{ item.queue_status || "-" }}
				</view>
				<!-- 		<view class="footer-item" style="display: flex; align-items: center">
					<view class="label">等待人数： </view>
					<view class="value text-orange" style="font-size: 20px; font-weight: bold">
						{{ item.wait_amount || " - " }}
					</view>
				</view> -->
			</view>
			<view class="que-footer">
				<view class="footer-item">
					<view class="label">当前叫号： </view>
					<view class="value text-blue big-font">{{ item.cur_no || " - " }}
					</view>
				</view>
				<view class="footer-item" style="display: flex; align-items: center">
					<view class="label">等待人数： </view>
					<view class="value text-orange" style="font-size: 20px; font-weight: bold">
						{{ item.wait_amount || " - " }}
					</view>
				</view>
			</view>
		</view>
		<uni-load-more :status="loadStatus" v-if="
        loadStatus !== 'noMore' ||
        (loadStatus === 'noMore' && queue.length !== 0)
      ">
		</uni-load-more>
		<view class="" style="margin-top: 30vh" v-if="loadStatus === 'noMore' && queue.length === 0">
			<u-empty text="未找到今日排队数据" mode="list"> </u-empty>
		</view>
	</view>
</template>

<script>
	export default {
		computed: {
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
				type: "", // manage
				store_no: "",
				store_info: null,
				queue_no: "",
				queue: [],
				loadStatus: "more",
				onrefresh: false
			}
		},
		methods: {
			async getStore() {
				// 查找店铺列表
				const serviceName = 'srvhealth_store_list_select'
				let req = {
					"serviceName": serviceName,
					"colNames": ["*"],
					"condition": [{
						colName: "store_no",
						ruleType: 'eq',
						value: this.store_no
					}, ],
					"page": {
						"pageNo": 1,
						"rownumber": 1
					},
				}
				let res = await this.$fetch('select', serviceName, req, 'health')
				if (res.success && Array.isArray(res.data) && res.data.length > 0) {
					this.store_info = res.data[0]
				}
			},
			toQueue(e) {
				return
				if (this.type !== 'manage' && e.queue_no && this.store_no && (e.queue_status === '进行中' || e
						.queue_status === '开放中')) {
					uni.navigateTo({
						url: `./queue?store_no=${this.store_no}&queue_no=${e.queue_no}`
					})
				} else if (e.queue_no && this.store_no && this.type === 'manage') {
					uni.navigateTo({
						url: `../queueManage/queueManage?store_no=${this.store_no}&queue_no=${e.queue_no}`
					})
				} else if (e && e.queue_status) {
					// uni.showToast({
					//   title: `该排队目前状态为${e.queue_status}，不可进行排队`,
					//   icon: 'none',
					//   mask: true
					// })
				}
			},
			async getTodayQue() {
				// 查询当日排队信息
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
							colName: 'queue_status',
							ruleType: 'in',
							value: '进行中'
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
				if (this.queue_no) {
					req.condition.push({
						colName: 'queue_no',
						ruleType: 'like',
						value: this.queue_no
					})
				}
				this.onrefresh = true
				this.loadStatus = 'loading'
				let res = await this.$fetch('select', 'srvhealth_store_queue_up_cfg_info_select', req, 'health')
				this.onrefresh = false
				if (res.success) {
					this.queue = res.data.map(item => {
						item.cur_no = isNaN(Number(item.cur_no)) ? 0 : item.cur_no
						return item
					})
					if (res.page.pageNo * res.page.rownumber >= res.page.total) {
						this.loadStatus = 'noMore'
					} else {
						this.loadStatus = 'more'
					}
				}
				return res
			},
		},
		onPullDownRefresh() {
			this.getTodayQue()
			setTimeout(() => {
				uni.stopPullDownRefresh()
			}, 500);
		},
		onShow() {
			if (this.store_no) {
				this.getTodayQue()
			}
		},
		onLoad(option) {
			if (option.queue_no) {
				this.queue_no = option.queue_no
			}
			if (option.store_no) {
				this.store_no = option.store_no
				this.getStore()
				this.getTodayQue()
			}
		}
	}
</script>

<style lang="scss" scoped>
	.add-btn {
		display: flex;
		justify-content: flex-end;
		padding-bottom: 10rpx;
		margin-bottom: 10rpx;
		border-bottom: #f1f1f1 1px solid;
	}

	.queue-list-view {
		padding: 0 20rpx;
		background-color: #fff;
		min-height: 100vh;

		.cu-bar {
			padding: 0 20rpx;
			display: flex;
			justify-content: space-between;
			color: #000;

			.text-bold {
				flex: 1;
				text-align: center;
				font-size: 16px;
			}
		}
		.queue-item {
			padding: 20rpx;
			// background-color: #f9f9f9;
			border-bottom: 1px #f1f1f1 solid;

			
			.que-header {
				display: flex;
				justify-content: space-between;

				.que-status {
					// font-weight: bold;
					font-size: 18px;
				}

				.que-name {
					font-weight: bold;
					font-size: 18px;
				}
			}

			.que-date {
				padding: 20rpx 0;
				color: #888;
			}

			.change-status {
				display: flex;
				padding: 10rpx 0;

				// justify-content: space-between;
				.label {
					// flex: 1;
				}

				.cu-btn {
					margin-right: 0;
				}
			}

			.que-footer {
				display: flex;
				justify-content: space-between;

				.footer-item {
					// margin-left: 20px;
					display: flex;
					align-items: center;

					.value {
						font-size: 30px;
						font-weight: bold;

						&.big-font {
							// font-size: 40px;
						}
					}

					&:first-child {
						margin-left: 0;
					}
				}
			}
		}
	}
</style>
