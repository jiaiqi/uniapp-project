<template>
	<view class="shop-wrap">
		<!-- 头部 -->
		<view class="header">
			<image class="header-bg" src="../../../../static/img/banner.jpg" mode=""></image>
			<!-- <view :class="showStoreBox ? 'header-bg-gray' : 'header-bg-black'"></view> -->
			<view class="header-top-Placeholder" ></view>
			<view class="container storeInfo hx-shadow">
				<image class="storeAvatar hx-shadow" src="../../../../static/img/3.png" mode=""></image>
				<view v-if="restAurn" class="hx-txt-18 hx-color-black hx-txt-weigth hx-mb-15 ">
					{{restAurn.name}}
				</view>
				<view class="hx-txt-14 hx-color-black ">
					店家说明,本店放心吃，地方名才
				</view>
				<!-- <view class="">
					后续再扩展优惠券，满减，折扣，活动等功能
				</view> -->
				<view class="shrink-box">
					<!-- <i class="hxicon" :class="showStoreBox ? 'icon-fold' : 'icon-unfold'" @click="showStoreBox = !showStoreBox"></i> -->
				</view>
			</view>
		</view>
		<!-- 主体 -->
		<view class="shop-main">
			<view class="shop-main-top">
				<scroll-view scroll-x class="bg-white nav" scroll-with-animation :scroll-left="scrollLeft">
					<view class="cu-item" :class="index==TabCur?'text-green cur':''" v-for="(item,index) in list" :key="index" @tap="tabSelect" :data-id="index">
						{{item.name}}
					</view>
				</scroll-view>
			</view>
			<view class="shop-main-sort">
				<view class="shop-main-sort-left">
					<text :class="index===currLabel?'pitch':''" v-for="(item,index) in labelList" @click="sortList(index,item.type)" class="shop-main-sort-item">
						{{item.name}}
					</text>
				</view>
				<view @click="changeTypes" class="shop-main-sort-right">
					<image v-if="changeType === 'doubleRow'" src="../../../../static/img/changelist.png" mode=""></image>
					<image v-else="changeType === 'singleRow'" src="../../../../static/img/changelist1.png" mode=""></image>
				</view>
			</view>
			<sPullScroll
				ref="pullScroll"
				:heightStyle="heightStyle"
				:pullDown="pullDown"
				:pullUp="loadData"
				:enablePullDown="true"
				:enablePullUp="true"
				:top="540"
				:fixed="true"
				:bottom="0"
				finishText="我是有底线的..."
			>
			<view :class="changeType==='singleRow'?'':'doubleRow'" class="shop-main-list">
				
				<view class="shop-main-list-wrap">
					<view @click="toDetail(item)" v-for="(item,index) in shopList" class="shop-main-list-item">
						<view class="item-left">
							<image v-if="!item.imgurl" src="../../../../static/img/none.png" mode=""></image>
							<image v-else :src="item.imgurl" mode=""></image>
						</view>
						<view class="item-right">
							<view class="item-right-top">
								<text>{{item.name}}</text>
								<text>{{item.intro?item.intro:'脆糯营养，口感好，健康绿色'}}</text>
							</view>
							<view class="hx-comment_basic-info_center_item" style="margin-bottom: 10px;">
								<view  class="hx-comment_basic-info_center_item_left">
									<text>评分</text>
								</view>
								<view  class="hx-comment_basic-info_center_item_center">
									<uni-rate size="14" :value="Number(item.mark)"></uni-rate>
								</view>
								<view class="hx-comment_basic-info_center_item_right">
									<text>{{item.mark}}</text>
								</view>
							</view>
							<view class="item-right-bot">
								<text>￥</text>
								<text>{{item.price}}</text>
							</view>
						</view>
					</view>	
				</view>
			</view>
			</sPullScroll>
		</view>
	</view>
</template>

<script>
	import uniRate from '@/components/uni-rate/uni-rate.vue'
	import sPullScroll from '@/components/s-pull-scroll';
	export default {
		name:'shopHome',
		comments:{uniRate},
		components:{sPullScroll,uniRate},
		data(){
			return {
				TabCur: 0,
				scrollLeft: 0,
				restAurn:null,
				changeType:'singleRow',
				heightStyle: 'calc(100vh-620upx)',
				pageInfo: {
					total: 0,
					rownumber: 10,
					pageNo: 1
				},
				labelList:[
					{
						name:'评分',
						type:'score'
					},{
					name:'价格',
					type:'price'
				}],
				currLabel:0,
				list: [{
						name: '商品'
					}],
				shopList:[
				// 	{
				// 	title:'白果王水果沙拉',
				// 	intro:'脆糯营养，口感好，健康绿色',
				// 	mark:3.5,
				// 	price:78
				// },{
				// 	title:'白果王水果沙拉',
				// 	intro:'脆糯营养，口感好，健康绿色',
				// 	mark:2,
				// 	price:78
				// },{
				// 	title:'白果王水果沙拉',
				// 	intro:'脆糯营养，口感好，健康绿色',
				// 	mark:1,
				// 	price:78
				// },{
				// 	title:'白果王水果沙拉',
				// 	intro:'脆糯营养，口感好，健康绿色',
				// 	mark:4,
				// 	price:78
				// },
				]
			}
		},
		onLoad() {
			this.getRestaurant()
		},
		methods:{
			onRefresh() {
				this.pageInfo.pageNo = 1;
				// this.getListData();
				this.$nextTick(() => {
					this.$refs.pullScroll.refresh();
				});
			},
			pullDown(pullScroll) {
				console.log(pullScroll.page);
				let page = this.pageInfo;
				this.pageInfo.pageNo = 1;
				let self = this;
				setTimeout(() => {
					this.loadData(pullScroll);
					// self.getDrawCoupon(self.req.serviceName, self.req.cond).then(callBackData => {
					// if (callBackData.page.rownumber * callBackData.page.pageNo >= callBackData.page.total) {
					// 	// finish(boolean:是否显示finishText,默认显示)
					// 	self.$refs.pullScroll.finish();
					// } else {
					// 	self.$refs.pullScroll.success();
					// }
					// });
					// this.loadData(pullScroll);
				}, 200);
			},
			loadData(pullScroll) {
				console.log('上拉加载');
				let page = this.pageInfo;
				this.pageInfo.pageNo = pullScroll.page;
				console.log(pullScroll.page);
				this.getFoodsList();
				// this.getDrawCoupon(this.req.serviceName, this.req.cond);
				// if (page.rownumber * page.pageNo >= page.total) {
				// 	// finish(boolean:是否显示finishText,默认显示)
				// 	pullScroll.finish();
				// } else {
				// 	pullScroll.success();
				// }
				// });
			},
			changeTypes(){
				if(this.changeType === 'singleRow'){
					this.changeType = 'doubleRow'
				}else{
					this.changeType = 'singleRow'
				}
			},
			sortList(i,type){
				let order = [{
					colName:'',
					orderType:'desc'
				}]
				if(type === 'price'){
					order[0].colName = 'price'
				}else if(type === 'score'){
					order[0].colName = 'mark'
				}
				this.currLabel = i
				this.getFoodsList(order)
			},
			toDetail(item){
				// uni.navigateTo({
				// 	url:'/pages/specific/health/shop/shopDetail?itemData=' + encodeURIComponent(JSON.stringify(item))
				// })
			},
			tabSelect(e) {
				this.TabCur = e.currentTarget.dataset.id;
				this.scrollLeft = (e.currentTarget.dataset.id - 1) * 60
			},
			async getRestaurant(){
				let url = this.getServiceUrl('health', 'srvhealth_restaurant_mgmt_select', 'select');
				let req = {
					serviceName: 'srvhealth_restaurant_mgmt_select',
					colNames: ['*'],
					condition:[{
						colName:'restaurant_no',
						ruleType:'eq',
						value:"RT202009231543410001"
					}],
					order:[]
				};
				
				let res = await this.$http.post(url, req);
				if(res.data.state === 'SUCCESS'){
					this.restAurn = res.data.data[0]
					this.getFoodsList()
				}
				
			},
			async getFoodsList(orders){
				let self = this
				let initOrder = [{
					colName:"mark",
					orderType:'desc'
				}]
				let url = this.getServiceUrl('health', 'srvhealth_mixed_food_nutrition_contents_select', 'select');
				let req = {
					serviceName: 'srvhealth_mixed_food_nutrition_contents_select',
					colNames: ['*'],
					condition:[],
					order: orders?orders:initOrder
				};
				let res = await this.$http.post(url, req);
				self.pageInfo.total = res.data.page.total;
				self.pageInfo.pageNo = res.data.page.pageNo;
				let page = self.pageInfo;
				if (page.rownumber * page.pageNo >= page.total) {
					// finish(boolean:是否显示finishText,默认显示)
					self.$refs.pullScroll.finish();
				} else {
					self.$refs.pullScroll.success();
				}
				if(res.data.state === 'SUCCESS'){
					this.shopList = res.data.data
					this.shopList.forEach((item,index)=>{
						self.getFilePath(item.image).then(url=>{
							let urls = self.$api.getFilePath + url[0].fileurl + '&bx_auth_ticket=' + uni.getStorageSync('bx_auth_ticket');
							this.$set(this.shopList[index], 'imgurl', urls);
						})
					})
					
					console.log("food------",this.shopList)
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.hx-color-black{
		color: #333333;
	}
	.hx-txt-14{
		font-size: 14px;
	}
	.hx-txt-weigth{
		font-weight: bold;
	}
	.hx-txt-18{
		font-size: 18px;
	}
	.hx-mt-15{
		margin-top: 15px;
	}
	.hx-mb-15{
			margin-bottom: 15px;
		}
	.shop-wrap{
		height: 100vh;
		background-color: #FFFFFF;
	}
	.shop-main{
		.shop-main-top{
			padding-left: 60upx;
			border-bottom: 2px solid #efefef;
		}
		.shop-main-sort{
			padding-top: 20upx;
			display: flex;
			justify-content: space-between;
			.shop-main-sort-left{
				width: 80%;
				font-size: 28upx;
				display: flex;
				justify-content: space-around;
				.pitch{
					color: red;
				}
				.shop-main-sort-item{
					
				}
			}
			.shop-main-sort-right{
				margin-right: 30upx;
				image{
					width: 40upx;
					height: 40upx;
				}
			}
		}
		.shop-main-list{
			// margin-top: 5px;
			height: calc(100vh - 310px);
			overflow-y: scroll;
			background-color: white;
			.shop-main-list-wrap{
				display: flex;
				justify-content: center;
				flex-direction: column;
				.shop-main-list-item{
					display: flex;
					padding: 5px 0 5px 15px;
					border-bottom: 1px solid #efefef;
					.item-left{
						width: 95px;
						height: 95px;
						image{
							width: 100%;
							height: 100%;
						}
					}
					.item-right{
						display: flex;
						flex-direction: column;
						justify-content: space-between;
						margin-left: 10px;
						.item-right-top{	
							display: flex;
							flex-direction: column;
							text{
								&:first-child{
									font-size: 16px;
									font-weight: 600;
									margin-bottom: 2px;
								}
							}
						}
						.hx-comment_basic-info_center_item{
								margin-bottom: 10px;
								display: flex;
								align-items: center;
								margin-top: 5px;
							.hx-comment_basic-info_center_item_center{
								margin: 0 5px;
							}
						}
						.item-right-bot{
							display: flex;
							color: red;
							align-items: center;
							text{
								&:first-child{
									font-size: 12px;
								}
								&:last-child{
									font-size: 18px;
									font-weight: 700;
								}
							}
						}
					}
				}
			}
			
		}
		
		.doubleRow{
			display: flex;
			flex-wrap: wrap;
			
			.shop-main-list-wrap{
				width: 100%;
				display: flex;
				flex-direction: row!important;
				flex-wrap: wrap;
				justify-content: start;
				.shop-main-list-item{
					width: 45%;
					display: flex;
					flex-direction: column;
					border-bottom: none;
					padding-left: 0;
					margin-left: 24upx;
					&:nth-child(2n+1){
						// margin-left: 40upx;
					}
					.item-left{
						width: 100%;
					}
					.item-right{
						.item-right-top{
							text{
								&:first-child{
									text-align: center;
									padding: 10upx 0;
								}
							}
						}
						.item-right-bot{
							display: flex;
							
						}
					}
				}
			}
			
		}
	}
	.header{
		position: relative;
		min-height: 230px;
		&-bg{
			position: absolute;
			left: 0;
			top: 0;
			z-index: 2;
			width: 100%;
			height: 142px;
		}
		&-bg-black{
			position: absolute;
			left: 0;
			top: 142px;
			bottom: 0;
			z-index: 1;
			background-color: #ffffff;
			width: 100%;
			transition: background-color 0.2s;
		}
		&-bg-gray{
			position: absolute;
			left: 0;
			top: 142px;
			bottom: -16px;
			z-index: 1;
			background-color: #afafaf;
			width: 100%;
			transition: background-color 0.2s;
		}
		&-top-Placeholder{
			height: 105px;
		}
		.storeInfo{
			position: relative;
			z-index: 2;
			background: #ffffff;
			height: 100px;
			border-radius: 6px;
			padding: 12px;
			margin-bottom: 4px;
			transition: all 0.2s;
			.shrink-box{
				position: absolute;
				bottom: 0;
				left: 0;
				right: 0;
				text-align: center;
				font-size: 20px;
				color: #a2a8ab;
			}
			.storeAvatar{
				position: absolute;
				width: 50px;
				height: 50px;
				right: 16px;
				top: -25px;
				background: #ffffff;
				border-radius: 4px;
				
			}
		}
	}
	.container{
		margin: 0 32upx;
	}
	.hx-shadow{
		box-shadow: 0px 6upx 16upx rgba(173, 173, 173, 0.2);
	}
	.tabs-box{
		width: 100%;
		position: sticky;
		top: calc(44px + var(--status-bar-height));
		z-index: 10;
		background-color: white;
		border-bottom: 1px solid #efefef;
		height: 40px;
		
		.hx-tabs{
			position: relative;
			display: flex;
			height:100%;
			&-item{
				display: flex;
				flex-direction: row;
				justify-content: center;
				align-items: center;
				width: 70px;
				color:#666666;
				text{
					font-size: 16px;
				}
				
			}
			&-active{
				color:#333333;
				font-weight: bold;
			}
			&-slider-box{
				position: absolute;
				display: flex;
				justify-content: center;
				bottom: 0;
				width: 70px;
			}
			&-slider{
				display: flex;
				background: #f6d200;
				width: 30px;
				height: 3px;
			}
		}
	}
</style>
