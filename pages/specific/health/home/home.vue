<template>
	<view class="health-wrap" @click="clickPage">
		<u-navbar
			back-text="返回"
			:back-text-style="backTextStyle"
			:back-icon-color="backTextStyle.color"
			:is-back="false"
			:border-bottom="true"
			:background="navBackground"
			v-if="showComponent !== 'article' && showComponent !== 'mineSelf' && showComponent !== 'pageIndex'"
		>
			<view class="header-wrap">
				<view class="title">{{ pageTitle }}</view>
				<view class="switch-date" @click="changeSignDate">
					<text>{{ selectDate }}</text>
					<u-icon name="calendar-fill" color="#333" size="30"></u-icon>
				</view>
				<view class="user-info" @click.stop="showUserList = !showUserList">
					<u-avatar :src="src" mode="circle" :size="60"></u-avatar>
					<view class="user-name" data-event="showUserList">
						<text class="text" data-event="showUserList">{{ userInfo.name }}</text>
						<u-icon name="arrow-down-fill" color="#333" size="28" :class="{ active: showUserList }"></u-icon>
					</view>
					<view class="user-list" :class="{ active: showUserList }">
						<view class="menu-item" :class="{ 'current-user': userInfo.name === item.name }" @click.stop="clickUserMenu(item)" v-for="(item, index) in userMenuList" :key="index">
							{{ item.name }}
						</view>
						<view class="menu-item" @click.stop="clickUserMenu('regulate')">人员管理</view>
					</view>
				</view>
			</view>
		</u-navbar>
		<overView v-if="showComponent === 'overview'"></overView>
		<articlePage v-if="showComponent === 'article'"></articlePage>
		<balancedDiet ref="diet" v-if="showComponent === 'balancedDiet'" :user-info="userInfo" :selectDate="selectDate"></balancedDiet>
		<healthRecord v-if="showComponent === 'healthRecord'"></healthRecord>
		<pageIndex v-if="showComponent === 'pageIndex'" @toPages="toPages" :userInfo="userInfo"></pageIndex>
		<mineSelf v-if="showComponent === 'mineSelf'"></mineSelf>
		<healthQuestionnaire v-if="showComponent === 'healthQuestionnaire'"></healthQuestionnaire>
		<u-tabbar v-model="currentNav" :list="navList" :mid-button="middleNav" :before-switch="switchNav" :active-color="navColor" :border-top="false"></u-tabbar>
		<u-popup v-model="showPopup" mode="bottom" border-radius="50">
			<view class="popup-box">
				<view class="icon-item" @click="toPages('food')">
					<image src="../../../../static/icon/health/yinshi.png" mode="" class="icon"></image>
					<text class="label">饮食</text>
				</view>
				<view class="icon-item" @click="toPages('sport')">
					<image src="../../../../static/icon/health/yundong.png" mode="" class="icon"></image>
					<text class="label">运动</text>
				</view>
				<view class="icon-item" @click="toPages('weight')">
					<image src="../../../../static/icon/health/tizhong.png" mode="" class="icon"></image>
					<text class="label">体重</text>
				</view>
				<view class="icon-item" @click="toPages('sleep')">
					<image src="../../../../static/icon/health/sleep.png" mode="" class="icon"></image>
					<text class="label">睡眠</text>
				</view>
				<view class="icon-item" @click="toPages('heartRate')">
					<image src="../../../../static/icon/health/xinlv.png" mode="" class="icon"></image>
					<text class="label">心率</text>
				</view>
				<view class="icon-item" @click="toPages('pressure')">
					<image src="../../../../static/icon/health/xueya.png" mode="" class="icon"></image>
					<text class="label">血压</text>
				</view>
				<view class="icon-item" @click="toPages('oxygen')">
					<image src="../../../../static/icon/health/xueyang.png" mode="" class="icon"></image>
					<text class="label">血氧</text>
				</view>
				<view class="icon-item" @click="toPages('glucose')">
					<image src="../../../../static/icon/health/xuetang.png" mode="" class="icon"></image>
					<text class="label">血糖</text>
				</view>
			</view>
			<view class="close-icon"><text @click="showPopup = false" class="cuIcon-close"></text></view>
		</u-popup>
		<view @click.self="closeDay" class="cu-modal" style="display: flex;align-items: center;" :class="modalName=='Modal'?'show':''">
			 <view style="height: 43vh;" class="cu-dialog">
				<bx-date-stamp v-show = "showTimeSignPicker" ref='ren' :markDays='markDays' :headerBar='true' @onDayClick='onDayClick'></bx-date-stamp>
			 </view>
		</view>
		<mx-date-picker
			style="z-index: 1290;"
			format="yyyy-mm-dd"
			:show="showDatePicker"
			:type="'date'"
			:value="selectDate"
			:showHoliday="false"
			@confirm="onDateSelected"
			@cancel="onDateSelected"
		/>
	</view>
</template>
<script>
import overView from '@/pages/specific/health/overview/overview.vue';
import balancedDiet from '@/pages/specific/health/balancedDiet/balancedDiet';
import articlePage from '@/pages/specific/health/article/article';
import healthRecord from '@/pages/specific/health/record/record';
import mineSelf from '@/pages/specific/health/personal/personal';
// import mineSelf from '@/pages/specific/health/mineSelf/mineSelf';
import pageIndex from '@/pages/specific/health/index/index';
import healthQuestionnaire from '@/pages/specific/health/healthQuestionnaire/healthQuestionnaire';
import MxDatePicker from '@/components/mx-datepicker/mx-datepicker.vue';
import bxDateStamp from '@/components/bx-date-stamp/bx-date-stamp.vue'
export default {
	components: {
		overView,
		balancedDiet,
		articlePage,
		healthRecord,
		mineSelf,
		pageIndex,
		healthQuestionnaire,
		MxDatePicker,
		bxDateStamp
	},
	data() {
		return {
			selectDate: this.formateDate(new Date(), 'date'), //当前(选择的)日期
			showDatePicker: false, // 是否显示日期选择器
			showComponent: 'pageIndex', //
			modalName:'',
			showTimeSignPicker:false,
			markDays:[],
			showPopup: false,
			currentNav: 0,
			pageTitle: '今日概览',
			showUserList: false,
			backTextStyle: {
				color: '#333'
			},
			userMenuList: [],
			src: uni.getStorageSync('wxUserInfo') ? uni.getStorageSync('wxUserInfo').headimgurl : 'http://pic2.sc.chinaz.com/Files/pic/pic9/202002/hpic2119_s.jpg',
			navBackground: {
				backgroundColor: '#fff'
			},
			userInfo: { name: '' },
			middleNav: false,
			navColor: '#0bc99d',
			navList: [
				{
					iconPath: '/static/icon/health/home.png',
					selectedIconPath: '/static/icon/health/home_active.png',
					text: '首页',
					// count: 2,
					isDot: true,
					customIcon: false
				},
				{
					iconPath: '/static/icon/health/health.png',
					selectedIconPath: '/static/icon/health/health_active.png',
					text: '健康',
					customIcon: false
				},
				{
					iconPath: '/static/icon/health/mine.png',
					selectedIconPath: '/static/icon/health/mine_active.png',
					text: '我的',
					// count: 23,
					isDot: false,
					customIcon: false
				}
			],
			wxUserInfo: {},
			loginUserInfo: {},
			formData: {}
		};
	},
	onLoad() {
		uni.setStorageSync('activeApp', 'health');
		let userInfo = uni.getStorageSync('login_user_info');
		if (userInfo && userInfo.user_no) {
			this.formData.userno = userInfo.user_no;
			this.loginUserInfo = userInfo;
			this.getUserInfo();
			this.getCurrUserInfo().then(_ => {
				if (uni.getStorageSync('current_user_info')) {
					this.userInfo = uni.getStorageSync('current_user_info');
				} else {
					let userList = uni.getStorageSync('user_info_list');
					if (Array.isArray(userList) && userList.length > 0) {
						this.userInfo = userList[0];
						uni.setStorageSync('current_user_info', userList[0]);
					}
				}								
			});
		} else {
			this.getUserInfo();
			alert('未发现登录用户信息');
		}
	},
	methods: {
		async getDietAllRecord() {
			//饮食记录
			let url = this.getServiceUrl('health', 'srvhealth_diet_record_select', 'select');
			let req = {
				serviceName: 'srvhealth_diet_record_select',
				colNames: ['*'],
				condition: [
					{ colName: 'userno', ruleType: 'like', value: this.loginUserInfo.user_no },
					{ colName: 'user_name', ruleType: 'like', value: uni.getStorageSync('current_user') },
				],
				page: { pageNo: 1, rownumber: 10 },
				order: []
			};
			let res = await this.$http.post(url, req);
			console.log("00000000000000")
			if(res.data.state === 'SUCCESS'){
				this.getSportsAllRecord(res.data.data)
			}
		},
		async getSportsAllRecord(data) {
			// 运动记录
			let url = this.getServiceUrl('health', 'srvhealth_body_activity_record_select', 'select');
			let req = {
				serviceName: 'srvhealth_body_activity_record_select',
				colNames: ['*'],
				condition: [
					{ colName: 'userno', ruleType: 'like', value: this.loginUserInfo.user_no },
					{ colName: 'user_name', ruleType: 'like', value: uni.getStorageSync('current_user') },
				],
				page: { pageNo: 1, rownumber: 10 },
				order: []
			};
				let res = await this.$http.post(url, req);
				if(res.data.state === 'SUCCESS'){
					let arr = [...data,...res.data.data]
					let timeArr = []
					arr.forEach(item=>{
						timeArr.push(item.hdate)
					})
					
					let allRecord = Array.from(new Set(timeArr))
					this.markDays = allRecord
					console.log("allRecord-----",allRecord)
				}
			},
		closeDay(e){
				this.modalName = ''  
				this.showTimeSignPicker = false
		},
		onDayClick(data){
				  this.curDate = data.date;
				  this.showTimeSignPicker = false
				  this.selectDate = data.date
				  this.modalName = ''
				  this.$refs.diet.getDietRecord(this.selectDate);
				  this.$refs.diet.getSportsRecord(this.selectDate);
				  this.$refs.diet.changeSub(4);
				  
				  // this.getDietRecord();
				  // this.getSportsRecord();
		},
		changeSignDate(){
				  this.modalName = 'Modal'
				  let dietRecord = null;
				 //  this.$refs.diet.getDietRecord().then(r=>{
					//   console.log("r-----",r)
				 //  })
				 // let sportsRecord = this.$refs.diet.getSportsRecord();
				 this.showTimeSignPicker = !this.showTimeSignPicker
				 // console.log("dietRecord:",dietRecord,"sportsRecord:",sportsRecord)
		},
		onDateSelected(e) {
			// 隐藏时间选择器
			this.showDatePicker = false;
			if (e) {
				//选择的值
				console.log('value => ' + e.value);
				//原始的Date对象
				console.log('date => ' + e.date);
				this.selectDate = e.value
				this.$refs.diet.selectDate = e.value;
				this.$refs.diet.changeSub(1);
				this.$refs.diet.getDietRecord();
				this.$refs.diet.getSportsRecord();
			}
		},
		toPages(e) {
			// 跳转到记录页面
			let url = '';
			let condType = '';
			switch (e) {
				case 'zz':
					this.currentNav = 1;
					this.showComponent = 'balancedDiet';
					this.pageTitle = '健康追踪';
					break;
				case 'sj':
					this.currentNav = 1;
					this.showComponent = 'healthRecord';
					this.pageTitle = '健康数据';
					break;
				case 'pc':
					this.currentNav = 1;
					this.showComponent = 'healthQuestionnaire';
					this.pageTitle = '健康评测';
					break;
				case 'gj':
					this.currentNav = 1;
					this.pageTitle = '健康工具';
					break;
				case 'sc':
					this.currentNav = 1;
					this.showComponent = 'overview';
					this.pageTitle = '慢病筛查';
					break;
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
			if (e !== 'food' && e !== 'sport') {
				this.showPopup = false;
				uni.navigateTo({
					url: '/pages/specific/health/otherIndicator/otherIndicator?type=' + e
				});
			} else {
				if (url) {
					uni.navigateTo({
						url: url
					});
				}
			}
			this.showPopup = false;
		},
		switchNav(e) {
			let healthNav = {
				iconPath: '/static/icon/health/health.png',
				selectedIconPath: '/static/icon/health/health_active.png',
				text: '健康'
			};
			this.navColor = '#0bc99d';
			if (e === 0) {
				this.showComponent = 'pageIndex';
				this.pageTitle = '首页';
				this.navList[1] = healthNav;
				this.middleNav = false;
			} else if (e === 1) {
				if (this.showComponent === 'balancedDiet' && this.navList[1].text === '记录') {
					this.showPopup = true;
				} else {
					this.navColor = '#5098ff';
					this.middleNav = true;
					this.pageTitle = '健康追踪';
					this.showComponent = 'balancedDiet';
					this.navList[1] = {
						iconPath: 'https://cdn.uviewui.com/uview/common/min_button.png',
						selectedIconPath: 'https://cdn.uviewui.com/uview/common/min_button_select.png',
						text: '记录',
						midButton: true,
						customIcon: false
					};
					this.getDietAllRecord()
				}
			} else if (e === 2) {
				this.showComponent = 'mineSelf';
				this.navList[1] = healthNav;
				this.middleNav = false;
			}
			return true;
		},
		clickPage(e) {
			if (this.showUserList) {
				this.showUserList = false;
			}
		},
		/*查询当前登录人创建得用户信息**/
		async getCurrUserInfo() {
			const url = this.getServiceUrl('health', 'srvhealth_person_info_select', 'select');
			let user = uni.getStorageSync('login_user_info').user_no;
			let req = {
				serviceName: 'srvhealth_person_info_select',
				colNames: ['*'],
				condition: [{ colName: 'create_user', ruleType: 'eq', value: user }],
				order: [
					{
						colName: 'create_time',
						orderType: 'asc'
					}
				]
			};
			const res = await this.$http.post(url, req);
			this.userMenuList = res.data.data;
			if (Array.isArray(res.data.data) && res.data.data.length > 0) {
				uni.setStorageSync('current_user', res.data.data[0].name);
			}
			uni.setStorageSync('user_info_list', res.data.data);
		},
		clickUserMenu(e) {
			console.log(e);
			if (e === 'regulate') {
				let viewTemp = {
					title: 'name',
					tip: 'sex',
					img: 'pic',
					footer: 'job'
				};
				let cond = [
					{
						colName: 'create_user',
						ruleType: 'eq',
						value: 'user_no'
					}
				];
				uni.navigateTo({
					url:
						'/pages/public/list/list?serviceName=srvhealth_person_info_select&navigationBarTitle=我的车辆&pageType=list&type=skip&viewTemp=' +
						decodeURIComponent(JSON.stringify(viewTemp)) +
						'&cond=' +
						decodeURIComponent(JSON.stringify(cond))
				});
			} else if (e === 'health') {
				uni.navigateTo({
					url: '/pages/specific/health/balancedDiet/balancedDiet'
				});
			} else {
				uni.setStorageSync('current_user', e.name);
				uni.setStorageSync('current_user_info', e);
				this.userInfo = e;
				this.$refs.diet.resetRadioArr()
				this.$refs.diet.changeSub(4);
				this.$refs.diet.getDietRecord();
				this.$refs.diet.getSportsRecord();
			}
			this.showUserList = false;
		},
		clickUserList(e) {
			console.log(e);
		},
		getDate(type) {
			const date = new Date();
			let year = date.getFullYear();
			let month = date.getMonth() + 1;
			let day = date.getDate();

			if (type === 'start') {
				year = year - 60;
			} else if (type === 'end') {
				year = year + 2;
			}
			month = month > 9 ? month : '0' + month;
			day = day > 9 ? day : '0' + day;
			return `${year}-${month}-${day}`;
		},
		getSignature(formData) {
			let self = this;
			let linkurl = window.location.href.split('#')[0];
			let req = {
				serviceName: 'srvwx_app_signature_select',
				colNames: ['*'],
				condition: [
					{
						colName: 'app_no',
						ruleType: 'eq',
						value: this.$api.appNo.wxh5
					},
					{
						colName: 'page_url',
						ruleType: 'eq',
						value: linkurl
					}
				]
			};
			console.log('linkurl', linkurl);
			uni.setStorageSync('linkUrl', null);
			self.$http.post(self.$api.getSignature, req).then(res => {
				if (res.data.state === 'SUCCESS') {
					let resData = res.data.data[0];
					uni.setStorageSync('signatureInfo', resData);
					self.$wx.config({
						debug: false, // 调试阶段建议开启
						appId: resData.appId, // APPID
						timestamp: resData.timestamp, // 时间戳timestamp
						nonceStr: resData.noncestr, // 随机数nonceStr
						signature: resData.signature, // 签名signature
						// 需要调用的方法接口
						jsApiList: [
							'updateAppMessageShareData',
							'updateTimelineShareData',
							'onMenuShareTimeline',
							'onMenuShareAppMessage',
							'onMenuShareWeibo',
							'onMenuShareQQ',
							'onMenuShareQZone'
						]
					});
					self.$wx.ready(() => {
						console.log('wx.ready()', self.wxUserInfo);
						self.$wx.updateAppMessageShareData({
							//自定义“分享给朋友”及“分享到QQ”按钮的分享内容
							imgUrl: self.wxUserInfo.headimgurl, // 分享图，默认当相对路径处理，所以使用绝对路径的的话，“http://”协议前缀必须在。
							desc: '百想健康', // 摘要,如果分享到朋友圈的话，不显示摘要。
							title: '百想健康', // 分享卡片标题
							// link:  window.location.href, // 分享出去后的链接，这里可以将链接设置为另一个页面。
							link: linkurl, // 分享出去后的链接，这里可以将链接设置为另一个页面。
							success: function() {
								// 分享成功后的回调函数
							},
							cancel: function() {
								// 用户取消分享后执行的回调函数
								// //// alert('分享失败')
							}
						}); // 自定义“分享到朋友圈”及“分享到QQ空间”按钮的分享内容
						self.$wx.updateTimelineShareData({
							imgUrl: self.formData.fileUrl, // 分享图，默认当相对路径处理，所以使用绝对路径的的话，“http://”协议前缀必须在。
							desc: '百想健康', // 摘要,如果分享到朋友圈的话，不显示摘要。
							title: '百想健康', // 分享卡片标题
							link: linkurl, // 分享出去后的链接，这里可以将链接设置为另一个页面。
							success: function() {
								// 分享成功后的回调函数
							},
							cancel: function() {
								// 用户取消分享后执行的回调函数
								// //// alert('分享失败')
							}
						});
					});
					self.$wx.error(function(res) {
						uni.showModal({
							title: '提示',
							content: JSON.stringify(res),
							success() {}
						});
					});
				} else {
					uni.showToast({
						title: '获取签名失败',
						icon: 'none'
					});
				}
			});
		},
		initLogin() {
			let that = this;
			let code = null;
			// code = this.getParams('code');
			// 公众号环境
			code = this.$route.query.code;
			console.log('code:', code);
			let isWeixinClient = this.isWeixinClient();
			console.log('是否微信环境', isWeixinClient);
			if (isWeixinClient) {
				//微信环境
				if (code) {
					// 已经得到code,进行验证登录
					alert('已获取到code,即将进行验证登录');
					this.saveWxUser();
				} else {
					//公众号 未授权 -> 获取授权
					alert('未发现code,尝试获取重定向链接');
					that.getAuthorized();
				}
			} else if (!isWeixinClient) {
				// 非微信环境(H5或APP)
				uni.showToast({
					title: '请在微信中访问此页面',
					icon: 'none',
					duration: 3000
				});
			}
		},
		async getAuthorized() {
			// 公众号环境获取回调地址(在回调地址中获取code)
			let url = this.getServiceUrl('wx', 'srvwx_public_page_authorization', 'operate');
			let req = [
				{
					data: [
						{
							app_no: this.$api.appNo.wxh5,
							redirect_uri: window.location.href
						}
					],
					serviceName: 'srvwx_public_page_authorization'
				}
			];
			let response = await this.$http.post(url, req);
			console.log('response:', response);
			if (response.data.response[0].response.authUrl) {
				alert('redirctUrl:' + response.data.response[0].response.authUrl);
				window.location.href = response.data.response[0].response.authUrl;
			} else {
				uni.showToast({
					title: response.data.resultMessage,
					icon: 'none'
				});
			}
		},
		saveWxUser() {
			// 静默登录(验证登录)
			let that = this;
			let req = [
				{
					data: [
						{
							code: that.$route.query.code,
							app_no: that.$api.appNo.wxh5
						}
					],
					serviceName: 'srvwx_app_login_verify'
				}
			];
			const url = this.getServiceUrl('wx', 'srvwx_app_login_verify', 'operate');
			this.$http.post(url, req).then(response => {
				if (response.data.resultCode === 'SUCCESS' && response.data.response[0].response) {
					console.log('授权成功', response);
					let resData = response.data.response[0].response;
					let expire_timestamp = parseInt(new Date().getTime() / 1000) + resData.expire_time; //过期时间的时间戳(秒)
					uni.setStorageSync('bx_auth_ticket', resData.bx_auth_ticket);
					uni.setStorageSync('expire_time', resData.expire_time); // 有效时间
					uni.setStorageSync('expire_timestamp', expire_timestamp); // 过期时间
					if (resData.login_user_info.user_no) {
						uni.setStorageSync('login_user_info', resData.login_user_info);
						console.log('resData.login_user_info', resData.login_user_info);
					}
					if (resData.login_user_info.data) {
						uni.setStorageSync('visiter_user_info', resData.login_user_info.data[0]);
					}
					uni.setStorageSync('isLogin', true);
					uni.showToast({
						title: '授权成功',
						icon: 'none'
					});
					this.getUserInfo();
				} else {
					uni.setStorageSync('isLogin', false);
					console.log('授权失败');
					uni.showToast({
						title: '授权失败',
						icon: 'none'
					});
					alert('授权失败' + JSON.stringify(response));
				}
			});
		},
		async getUserInfo() {
			let url = this.$api.getUserInfo;
			let req = {
				serviceName: 'srvwx_basic_user_info_select',
				colNames: ['*'],
				condition: [
					{
						colName: 'app_no',
						ruleType: 'eq',
						value: this.$api.appNo.wxh5
					}
				]
			};
			let res = await this.$http.post(url, req);
			if (res.data.state === 'SUCCESS' && res.data.data.length > 0) {
				const userInfo = res.data.data[0];
				this.wxUserInfo = userInfo;
				uni.setStorageSync('wxUserInfo', userInfo);
				if (userInfo.headimgurl) {
					this.src = userInfo.headimgurl;
				}
				this.getSignature();
			}
		}
	}
};
</script>

<style lang="scss" scoped>
.health-wrap {
	background-color: #f1f1f1;
	height: 100vh;
	overflow-y: hidden;
	/deep/ .u-navbar {
		border-bottom: 1px solid #f1f1f1;
	}
}
.header-wrap {
	// 顶部导航栏
	color: #333;
	display: flex;
	align-items: center;
	justify-content: space-between;
	flex: 1;
	padding: 0 30rpx;
	.title {
		// 顶部标题
		font-weight: 700;
	}
	.switch-date {
		height: 50rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		.u-icon {
			padding-left: 10rpx;
		}
	}
	.user-info {
		display: flex;
		align-items: center;
		position: relative;
		.user-name {
			min-width: 100rpx;
			display: flex;
			.text {
				padding: 0 10rpx 0 20rpx;
			}
			.u-icon {
				transition: all 0.5s;
				&.active {
					transform: rotate(90deg);
				}
			}
		}
		.user-list {
			position: absolute;
			box-sizing: border-box;
			width: 200rpx;
			height: 0;
			border-radius: 10rpx;
			right: 0;
			opacify: 0;
			transition: all 0.5s;
			overflow: hidden;
			background-color: #fff;
			&.active {
				border: 1px solid #ddd;
				opacify: 1;
				height: auto;
				top: 70rpx;
				z-index: 999;
			}
			.menu-item {
				min-height: 80rpx;
				font-weight: bold;
				border-bottom: 1px solid #fef0f0;
				font-size: 16px;
				display: flex;
				align-items: center;
				padding-left: 30rpx;
				&.current-user {
					color: #0586ff;
				}
			}
			.user {
				width: 100%;
				height: 50rpx;
				padding: 5rpx;
				text-align: center;
				display: flex;
				align-items: center;
				justify-content: center;
				border-bottom: 1rpx solid #fff;
			}
		}
	}
}
.popup-box {
	display: flex;
	justify-content: center;
	padding: 50rpx 0 20rpx;
	flex-wrap: wrap;
	.icon-item {
		// width: 33%;
		min-width: 22%;
		margin: 0 auto;
		display: flex;
		flex-direction: column;
		height: 210rpx;
		align-items: center;
		.icon {
			width: 130rpx;
			height: 130rpx;
			border-radius: 100%;
			background-color: rgba($color: orange, $alpha: 0.1);
			padding: 30rpx;
		}
		.label {
			padding: 10rpx 0;
		}
	}
}
.close-icon {
	width: 100%;
	padding-bottom: 20rpx;
	display: flex;
	justify-content: center;
	align-items: center;
	.cuIcon-close {
		padding: 20rpx;
		border-radius: 50%;
		background-color: #f1f1f1;
		font-size: 40rpx;
	}
}
</style>
