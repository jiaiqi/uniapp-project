<template>
	<div class="symptom-select">
		<view class="search-bar">
			<u-search :show-action="true" action-text="搜索" placeholder="输入症状名称进行搜索" shape="squre" :animation="true"></u-search>
			<u-tabs :list="symptomList" :is-scroll="false" :current="currentTab" @change="change"></u-tabs>
		</view>
		<view class="menu-wrap" v-if="symptomList && symptomList.length > 0">
			<view class="menu-left">
				<view
					class="menu-item"
					:data-current="index"
					:class="{
						'menu-active': currentMenu == index,
						'radius-top': index === currentMenu + 1,
						'radius-bottom': index !== 0 && index === currentMenu - 1
					}"
					@tap.stop="swichMenu(index)"
					v-for="(item, index) in symptomList[currentTab].children"
					:key="item.no"
				>
					{{ item.name }}
				</view>
			</view>
			<view class="menu-right">
				<view class="symptom-item" v-for="(item, index) in symptomList[currentTab].children[currentMenu].children" :key="item.no">
					<view class="symptom-name">{{ item.name }}</view>
					<view class="check-box"><u-switch v-model="item.checked"></u-switch></view>
				</view>
			</view>
		</view>
		<view class="button-box" v-if="symptomList && symptomList.length > 0"><u-button type="primary" shape="circle" @click="submit">确定</u-button></view>
	</div>
</template>

<script>
export default {
	data() {
		return {
			currentTab: 0,
			currentMenu: 0,
			symptomParent: [],
			symptomList: []
		};
	},
	methods: {
		submit() {
			let data = this.deepClone(this.symptomList);
			let resultList = [];
			data.forEach(item => {
				if (item.children) {
					item.children.forEach(child => {
						if (child.children) {
							child.children.forEach(c => {
								if (c.checked) {
									resultList.push(c);
								}
							});
						}
					});
				}
			});
			console.log(resultList);
			uni.$emit('symptomSelect', resultList);
			uni.navigateBack();
		},
		async getSymptomList() {
			// 请求疾病列表
			let url = this.getServiceUrl('health', 'srvhealth_self_symptoms_select', 'select');
			let req = {
				serviceName: 'srvhealth_self_symptoms_select',
				colNames: ['*'],
				relation_condition: {},
				order: []
			};
			let res = await this.$http.post(url, req);
			if (res.data.state === 'SUCCESS') {
				if (Array.isArray(res.data.data) && res.data.data.length > 0) {
					let parentNode = res.data.data.filter(item => !item.parent_no);
					parentNode.forEach(parent => {
						parent.children = [];
						res.data.data.forEach(item => {
							if (item.parent_no === parent.no) {
								parent.children.push(item);
							}
						});
						if (Array.isArray(parent.children) && parent.children.length > 0) {
							parent.children.forEach(child => {
								child.children = [];
								res.data.data.forEach(item => {
									if (item.parent_no === child.no) {
										child.children.push(item);
									}
								});
							});
						}
					});
					this.symptomList = parentNode;
				}
			}
		},
		async selectSymptomList(condition) {
			// 请求疾病列表
			let url = this.getServiceUrl('health', 'srvhealth_self_symptoms_select', 'select');
			let req = {
				serviceName: 'srvhealth_self_symptoms_select',
				colNames: ['*'],
				condition: [{ colName: 'parent_no', ruleType: 'isnull' }],
				relation_condition: {},
				isTree: true,
				page: { pageNo: 1, rownumber: 10 },
				order: []
			};
			if (condition) {
				req.condition = condition;
			}
			let res = await this.$http.post(url, req);
			if (res.data.state === 'SUCCESS') {
				// 请求成功
				let symptomParent = res.data.data;
				if (Array.isArray(res.data.data) && res.data.data.length > 0) {
					for (let item of res.data.data) {
						let condition = [{ colName: 'parent_no', ruleType: 'eq', value: item.no }];
						if (item.is_leaf !== '是') {
							let data = await this.selectSymptomList(condition);
							if (data) {
								item['children'] = data;
							}
						}
					}
					if (!condition) {
						this.symptomList = res.data.data;
					}
					return res.data.data;
				}
			}
		},
		swichMenu(index) {
			this.currentMenu = index;
		},
		change(index) {
			this.currentTab = index;
			this.currentMenu = 0;
		}
	},
	created() {
		this.getSymptomList();
	}
};
</script>

<style scoped lang="scss">
.symptom-select {
	display: flex;
	flex-direction: column;
	.search-bar {
		width: 100%;
		height: 185rpx;
		background-color: #fff;
		padding: 20rpx;
	}
	.menu-wrap {
		width: 100%;
		height: calc(100vh - 335rpx);
		display: flex;
		border-top: 1px solid #f1f1f1;
		.menu-left {
			flex: 0.5;
			display: flex;
			flex-direction: column;
			// background-color: #fff;
			.menu-item {
				height: 100rpx;
				display: flex;
				justify-content: center;
				align-items: center;
				background-color: #f1f1f1;
				&.radius-bottom {
					border-bottom-right-radius: 10rpx;
				}
				&.radius-top {
					border-top-right-radius: 10rpx;
				}
				&.menu-active {
					position: relative;
					color: #000;
					font-size: 30rpx;
					font-weight: 600;
					background: #fff;
					border-radius: 0;
					&::before {
						content: '';
						position: absolute;
						border-left: 4px solid #2979ff;
						height: 32rpx;
						left: 0;
						top: 39rpx;
					}
				}
			}
		}
		.menu-right {
			background-color: #fff;
			flex: 1.5;
			display: flex;
			flex-direction: column;
			.symptom-item {
				border-bottom: 1px dashed #f1f1f1;
				height: 80rpx;
				display: flex;
				align-items: center;
				justify-content: space-between;
				padding: 0 40rpx;
				.symptom-name {
					min-width: 30%;
				}
			}
		}
	}
	.button-box {
		height: 150rpx;
		background-color: #fff;
		display: flex;
		justify-content: center;
		align-items: center;
		.u-btn {
			width: 70%;
		}
	}
}
</style>
