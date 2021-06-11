<template>
	<view v-html="wxOpenTags">

		<!-- 		<wx-open-launch-weapp id="launch-btn" username="gh_00a993e0e152" path="pages/index/index">
			<script type="text/wxtag-template">
		    <button class="btn">打开小程序</button>
		  </script>
		</wx-open-launch-weapp> -->
	</view>
</template>

<script>
	export default {
		data() {
			return {
				wxOpenTags: ''
			}
		},
		methods: {
			getSignature(formData) {
				let self = this;
				let linkurl = window.location.href.split('#')[0];
				let req = {
					serviceName: 'srvwx_app_signature_select',
					colNames: ['*'],
					condition: [{
							colName: 'app_no',
							ruleType: 'eq',
							value: this.$api.appNo.wxh5
						},
						{
							colName: 'page_url',
							ruleType: 'eq',
							value: linkurl
							// value: window.location + ''
						}
					]
				};
				uni.setStorageSync('linkUrl', null);
				self.$http.post(self.$api.getSignature, req).then(res => {
					if (res.data.state === 'SUCCESS') {
						let resData = res.data.data[0];
						console.log('getSignature', resData);
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
								'onMenuShareQZone',
							],
							openTagList: ['wx-open-launch-weapp']
						});
						self.$wx.ready(() => {
							// console.log('wx.ready()', self.wxUserInfo);
							// alert(JSON.stringify(self.wxUserInfo))
							// alert(JSON.stringify(self.formData))
							self.$wx.updateAppMessageShareData({
								//自定义“分享给朋友”及“分享到QQ”按钮的分享内容
								// imgUrl: self.wxUserInfo.headimgurl, // 分享图，默认当相对路径处理，所以使用绝对路径的的话，“http://”协议前缀必须在。
								desc: '分享' + self.formateDate(), // 摘要,如果分享到朋友圈的话，不显示摘要。
								title: '分享' + self.formateDate(), // 分享卡片标题
								// link:  window.location.href, // 分享出去后的链接，这里可以将链接设置为另一个页面。
								link: linkurl, // 分享出去后的链接，这里可以将链接设置为另一个页面。
								success: function() {
									// 分享成功后的回调函数
									// //// alert('分享成功')
									// self.saveShareRecord('朋友');
								},
								cancel: function() {
									// 用户取消分享后执行的回调函数
									// //// alert('分享失败')
								}
							}); // 自定义“分享到朋友圈”及“分享到QQ空间”按钮的分享内容
							self.$wx.updateTimelineShareData({
								imgUrl: self.formData
									.fileUrl, // 分享图，默认当相对路径处理，所以使用绝对路径的的话，“http://”协议前缀必须在。
								desc: '分享' + self.formateDate(), // 摘要,如果分享到朋友圈的话，不显示摘要。
								title: '分享' + self.formateDate(), // 分享卡片标题
								link: linkurl, // 分享出去后的链接，这里可以将链接设置为另一个页面。
								success: function() {
									// 分享成功后的回调函数
									// //// alert('分享成功')
									// self.saveShareRecord('朋友圈');
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
		},
		onReady() {
			// var btn = document.getElementById('launch-btn');
			// btn.addEventListener('launch', function(e) {
			// 	console.log('success');
			// });
			// btn.addEventListener('error', function(e) {
			// 	console.log('fail', e.detail);
			// });
			this.getSignature()


			//#ifdef H5  
			setTimeout(() => {
				this.wxOpenTags = `<wx-open-launch-weapp path="pages/index/index" id="launch-wxapp" username="gh_00a993e0e152">  
										<template>
			                <style>  
			                .btn-open-weapp{  
			          //           background: #07c160;  
			          //           position: relative;
													// display: block;
													// width: 184px;
													// margin-left: auto;
													// margin-right: auto;
													// padding: 8px 24px;
													// box-sizing: border-box;
													// font-weight: 700;
													// font-size: 17px;
													// text-align: center;
													// text-decoration: none;
													// color: #fff;
													// line-height: 1.41176471;
													// border-radius: 4px;
													// overflow: hidden;
													// -webkit-tap-highlight-color: #0000;
													// outline:none;
													display:block;
													margin:0 auto;
													margin-top:50vh;
													border-radius:5px;
													padding:10px 20px;
			                }  
			                </style>  
			                <button class="btn-open-weapp cu-btn bg-cyan" >打开小程序</button >  
												</template>
			        </wx-open-launch-weapp>`;
			}, 1000);
			//#endif
			// this.$wx.config({
			// 	debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印
			// 	appId: 'wx78d1d4139f97ffca', // 必填，公众号的唯一标识
			// 	timestamp: , // 必填，生成签名的时间戳
			// 	nonceStr: '', // 必填，生成签名的随机串
			// 	signature: '', // 必填，签名
			// 	jsApiList: [], // 必填，需要使用的JS接口列表
			// 	openTagList: [] // 可选，需要使用的开放标签列表，例如['wx-open-launch-app']
			// });
		}
	}
</script>

<style>
	.btn {
		padding: 12px
	}
</style>
