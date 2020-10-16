<template>
	<view>
		<cu-custom bgColor="bg-gradual-green" :isBack="!serBtn">
			<block slot="backText" v-if="!serBtn">返回</block>
			<block slot="content">病症选择</block>
		</cu-custom>
		<Thetable :list="TableList" @delAlltabAllansw="delAlltabAllansw" ref="tabbox" @delHtml="deltab"></Thetable>
		<view class="box">
			<view class="cu-bar search bg-white">
				<view class="search-form round">
					<text class="cuIcon-search"></text>
					<input
						:adjust-position="false"
						v-model="searchValue"
						@keyup.enter="searchStart"
						@change="searchStart"
						type="text"
						:placeholder="'请输入病症搜索'"
						confirm-type="search"
					/>
				</view>
				<view class="action">
					<button v-if="serBtn" @click.stop="searchEnd" class="cu-btn bg-orange shadow-blur round">取消</button>
				</view>
			</view>
		</view>
		<view class="" v-show="!serBtn">
			<view class="wrapCont">
				<view class="box" v-for="(item, index) in dataItem" :key="index"><helang-checkbox :ref="`checkbox${index}`" @change="valueChange"></helang-checkbox></view>
			</view>
		</view>
		<view class="" v-show="serBtn">
			<view class="wrapCont">
				<view class="box" v-show="serseData.length > 0"><helang-checkbox ref="checkboxCheck" @change="valueChange"></helang-checkbox></view>
				<view class="box normalstyle" v-show="serseData.length == 0">没有找到相关内容</view>
			</view>
		</view>
		<view class="poupbox">
			<view class="mask" v-if="mask"></view>
			<view class="boxpou" v-if="mask">
				<view class="select">请完善</view>
				<view class="contentpop"><gpp-configuration-form ref="form" type="fill" :formTemplate="formTemplate" :isCard="true"></gpp-configuration-form></view>
				<view class="contYes">
					<view class="btn concel" @tap="confirm">提交</view>
					<view class="btn" @tap="cancel">取消</view>
				</view>
			</view>
		</view>
		<view class="boxbtn"><view class="btns" @click="lookobj">完成</view></view>
	</view>
</template>

<script>
import helangCheckbox from '@/components/helang-checkbox/helang-checkbox.vue';
import gppConfigurationForm from '@/components/gpp-configurationForm/gpp-configurationForm.vue';
import Thetable from '@/components/Thetable/Thetable.vue';
// import template from "@/common/addFile.js";
export default {
	components: {
		helangCheckbox,
		gppConfigurationForm,
		Thetable
	},
	data() {
		return {
			searchValue: '',
			TableList: [],
			mask: false,
			dataItem: [
				{
					type: 'checkbox',
					index: null,
					column: 3,
					title: '全身:',
					list: [
						{
							text: '发烧'
						},
						{
							text: '腿疼'
						}
					],
					optionBox: [
						{
							formTitle: '发烧症状',
							parent: '发烧',
							object: [
								// {
								// 	textName: 'patientName',
								// 	subject: '姓名',
								// 	controlType: 'text',
								// 	isMustfill: true,
								// 	maxlength: 12
								// },
								{
									textName: 'symptom',
									subject: '当前是否有以下症状，如有请选择',

									controlType: 'checkbox',
									values: [
										{
											valueName: '发热',
											valueCode: '1'
										},
										{
											valueName: '咳嗽',
											valueCode: '2'
										},
										{
											valueName: '胸闷',
											valueCode: '3'
										},
										{
											valueName: '四肢无力',
											valueCode: '4'
										}
									]
								}
							]
						},
						{
							formTitle: '腿疼症状',
							parent: '腿疼',
							object: [
								{
									textName: 'patientName',
									subject: '姓名',
									controlType: 'text',
									isMustfill: true,
									maxlength: 12
								},
								{
									textName: 'symptom',
									subject: '当前是否有以下症状，如有请选择',
									controlType: 'checkbox',
									values: [
										{
											valueName: '发热',
											valueCode: '1'
										},
										{
											valueName: '咳嗽',
											valueCode: '2'
										},
										{
											valueName: '胸闷',
											valueCode: '3'
										},
										{
											valueName: '四肢无力',
											valueCode: '4'
										}
									]
								}
							]
						}
					]
				},
				{
					type: 'checkbox',
					index: null,
					column: 3,
					title: '五官:',
					list: [
						{
							text: '耳鼻喉'
						},
						{
							text: '眼烧'
						},
						{
							text: '口腔'
						},
						{
							text: '头颈'
						}
					],
					optionBox: []
				},
				{
					type: 'checkbox',
					index: null,
					column: 3,
					title: '消化:',
					list: [
						{
							text: '拉肚子'
						},
						{
							text: '胃疼'
						},
						{
							text: '肚子疼'
						},
						{
							text: '呕吐'
						}
					],
					optionBox: []
				},
				{
					type: 'checkbox',
					index: null,
					column: 3,
					title: '泌尿:',
					list: [
						{
							text: '尿频'
						},
						{
							text: '尿急'
						},
						{
							text: '尿痛'
						}
					],
					optionBox: []
				},
				{
					type: 'checkbox',
					index: null,
					column: 3,
					title: '精神:',
					list: [
						{
							text: '失眠'
						},
						{
							text: '抑郁'
						},
						{
							text: '网络成瘾'
						},
						{
							text: '恐慌'
						},
						{
							text: '压抑'
						},
						{
							text: '妄烧'
						},
						{
							text: '社交恐慌'
						}
					],
					optionBox: []
				}
			],
			formTemplate: '',
			listItemData: [],
			serBtn: false,
			newTableList: [],
			changeData: [],
			serseData: [],
			lakechekc: [],
			attrFalseData: [],
			attrTrueData: [],
			answerDataItem: [] //答案
		};
	},
	mounted(e) {
		this.$nextTick(function() {
			let item = this.dataItem;
			let listItemAll = [];
			for (let i in item) {
				let label = 'checkbox' + i;
				this.$set(item[i], 'ref', label); //传入当前组件ref
				this.$refs[label][0].set(item[i]);
				for (let j in item[i].list) {
					this.$set(item[i].list[j], 'ref2', label);
				}
				listItemAll = listItemAll.concat(item[i].list); // 所有标签  提供搜索
			}
			this.listItemData = listItemAll;
		});
	},
	methods: {
		lookobj() {
			uni.showModal({
				title: '提示',
				content: '确认提交?',
				success: (res) =>{
				 if (res.confirm) {
				   uni.$emit('checkedItem', this.answerDataItem);
				   uni.navigateBack();
				 } 
				}
			});
		},
		delAlltabAllansw(e) {
			console.log(e);
			if (!this.serBtn) {
				let item = this.dataItem;
				for (let i in item) {
					let label = 'checkbox' + i;
					this.$refs[label][0].cancelAll();
				}
				this.TableList = [];
				this.answerDataItem = [];
			} else {
				uni.showToast({
					title: '请在主页面删除',
					icon: 'none'
				});
			}
		},
		delAnswTab(val) {
			if (this.answerDataItem.length > 0) {
				this.answerDataItem.forEach((item, index, dataa) => {
					if (item.title == val) {
						dataa.splice(index, 1);
					}
				});
			}
		},
		searchStart() {
			this.attrFalseData = [];
			this.attrTrueData = [];
			let serValue = this.searchValue;
			let listtext = this.listItemData; ///搜索项
			let levelmenu = this.dataItem;
			let thReemenu = []; //所有标签下的表单配置
			let ultimately = []; // 查找到的标签

			let lastdata = {
				type: 'checkbox',
				index: null,
				column: 3,
				title: '搜索结果:',
				list: [],
				optionBox: [],
				ref: 'checkboxCheck'
			};
			if (serValue) {
				this.serBtn = true;
				for (let index in listtext) {
					if (listtext[index].text.indexOf(serValue) !== -1) {
						console.log(listtext[index].text, index);
						ultimately.push({ text: listtext[index].text, ref2: listtext[index].ref2, checked: false });
					}
				}
				for (let j in levelmenu) {
					thReemenu = thReemenu.concat(levelmenu[j].optionBox);
				}
				lastdata.list = ultimately;
				lastdata.optionBox = thReemenu;
				lastdata = JSON.parse(JSON.stringify(lastdata));
				this.serseData = lastdata.list;
				let sernewDataVal = [];
				for (let i in this.TableList) {
					for (let k in this.serseData) {
						if (this.TableList[i].text == this.serseData[k].text) {
							sernewDataVal.push(this.TableList[i].text);
						}
					}
				}
				for (let e in lastdata.list) {
					for (let w in sernewDataVal) {
						//过滤已存在标签
						if (lastdata.list[e].text == sernewDataVal[w]) {
							this.$set(lastdata.list[e], 'show', 'hide');
						}
					}
				}
				this.lakechekc = lastdata;

				let checkDataItemValue = this.dataItem;
				let ewdata = [];
				for (let t in checkDataItemValue) {
					for (let c in lastdata.list) {
						if (checkDataItemValue[t].ref == lastdata.list[c].ref2) {
							for (let p in checkDataItemValue[t].list) {
								if (checkDataItemValue[t].list[p].text == lastdata.list[c].text) {
									this.$set(lastdata.list[c], 'index2', p);
								}
							}
						}
					}
				}
				if (lastdata.list.length > 1) {
					for (let d in lastdata.list) {
						if (lastdata.list[d].show && lastdata.list[d].show == 'hide') {
							lastdata.list.splice(d, 1);
						}
					}
				}
				if (lastdata.list.length == 1) {
					if (lastdata.list[0].show && lastdata.list[0].show == 'hide') {
						lastdata.list.splice(0, 1);
					}
				}
				this.$refs.checkboxCheck.set(lastdata);
			} else {
				uni.showToast({
					title: '请输入搜索内容',
					icon: 'none'
				});
			}
		},
		searchEnd() {
			this.serBtn = false;
			this.searchValue = '';
			let checkfalse = this.attrFalseData;
			let checktrue = this.attrTrueData;
			let newchecktrue = [];

			checktrue = this.deWeight(checktrue, false);
			checkfalse = this.deWeight(checkfalse, true);
			if (checkfalse && checkfalse.length > 0) {
				for (let i in checktrue) {
					for (let j in checkfalse) {
						if (checktrue[i].text !== checkfalse[j].text) {
							newchecktrue.push(checktrue[i]);
						}
					}
				}
			} else {
				newchecktrue = checktrue;
			}
			// console.log(newchecktrue, '********new');
			// console.log(checktrue, '********t');
			// console.log(checkfalse, '********f');
			for (let k in newchecktrue) {
				if (newchecktrue[k] && newchecktrue[k].present && newchecktrue[k].present.ref2) {
					this.$refs[newchecktrue[k].present.ref2][0].change(newchecktrue[k].present.index2, true);
				} else {
					this.$refs[newchecktrue[k].ref2][0].change(newchecktrue[k].index2, true);
				}
			}
		},
		deltab(val) {
			if (!this.serBtn) {
				for (let i in this.TableList) {
					if (this.TableList[i].text == val.text) {
						this.TableList.splice(i, 1);
					}
				}
				console.log(val);
				if (val.ref == 'checkboxCheck') {
					this.$refs[val.ref2][0].change(val.checkIndex);
				} else {
					this.$refs[val.ref2][0].change(val.checkIndex2);
				}

				this.delAnswTab(val.text);
			} else {
				uni.showToast({
					title: '请在主页面删除',
					icon: 'none'
				});
			}
		},
		deWeight(arr, val) {
			if (arr.length >= 1) {
				for (var i = 0; i < arr.length - 1; i++) {
					for (var j = i + 1; j < arr.length; j++) {
						if (arr[i].text == arr[j].text || arr[i].checked == val) {
							arr.splice(j, 1);
							j--;
						}
					}
				}
				for (let k in arr) {
					if (arr[k].checked == val) {
						arr.splice(k, 1);
					}
				}
				return arr;
			}
		},
		valueChange(data) {
			console.log(data);
			let indexXlistval = 0;
			if (data.ref == 'checkboxCheck') {
				this.attrTrueData.push(data.present);
				let ewdata = [];
				let checkDataItemValue = this.dataItem;
				for (let t in checkDataItemValue) {
					if (checkDataItemValue[t].ref == data.present.ref2) {
						ewdata = checkDataItemValue[t].list;
					}
				}
				for (let x in ewdata) {
					if (ewdata[x].text == data.present.text) {
						indexXlistval = x;
					}
				}
				// this.$refs[data.present.ref2][0].change(indexXlistval,true)
			}
			this.changeData = data;
			if (data && data.arr && data.arr.length > 0 && data.option && data.option.parent && !data.bole) {
				//选中
				this.mask = true;
				this.formTemplate = [data.option];
			} else if (data && !data.state) {
				/// 取消选中
				for (let i in this.TableList) {
					if (this.TableList[i].text == data.text.text) {
						this.TableList.splice(i, 1);
					}
				}
				if (this.serBtn) {
					this.attrFalseData.push(data.text);
				}
				this.delAnswTab(data.text.text);
			} else {
				// 未配置表单信息
				uni.showModal({
					title:'提示',
					content:'未配置表单信息',
					showCancel:false
				})
			}
			if (data.present && data.present.text) {
				if (this.TableList.length > 0) {
					let isyes = false;
					for (let j in this.TableList) {
						if (this.TableList[j].text == data.present.text) {
							isyes = true;
						}
					}
					if (!isyes) {
						this.TableList.push({
							text: data.present.text,
							ref: data.ref,
							checkIndex: indexXlistval,
							ref2: data.present.ref2,
							checkIndex2: data.checkIndex
						});
					}
				} else {
					this.TableList.push({
						text: data.present.text,
						ref: data.ref,
						checkIndex: indexXlistval,
						ref2: data.present.ref2,
						checkIndex2: data.checkIndex
					});
				}
			}
		},
		confirm() {
			console.log(this.$refs.form.inputValidation());
			let itemIpunt = this.$refs.form.inputValidation();
			let itemIpuntVal = itemIpunt.value;
			let changeData = this.changeData;
			let arr = [];
			if (itemIpunt.checkFlag) {
				uni.showToast({
					title: '提交成功',
					icon: 'success'
				});
				let obj = [];
				changeData.option.object.forEach(item => {
					if (item.controlType === 'checkbox') {
						let checkstr = itemIpuntVal[item.textName];
						let str = '';
						item.values.forEach(a => {
							if (checkstr.indexOf(a.valueCode) != -1) {
								// str += a.valueName + '/';
								obj.push(a.valueName);
							}
						});
						obj.push(str);
					} else {
						obj.push(itemIpuntVal[item.textName]);
					}
				});

				let answSheet = {
					title: itemIpunt.table,
					label:itemIpunt.table,
					answObj: itemIpunt.value,  //表单选中的答案 
					strAnsw: obj  //标签中显示的表单答案字符串
				};
				this.answerDataItem.push(answSheet);
				for (let i in this.TableList) {
					if (this.TableList[i].text == this.$refs.form.inputValidation().table) {
						this.$set(this.TableList[i], 'Color', '#49bb3c');
						this.$set(this.TableList[i], 'answSheet', answSheet);
					}
				}
				this.mask = false;
			} else {
				uni.showToast({
					title: itemIpunt.message,
					icon: 'none'
				});
			}
		},
		cancel() {
			this.mask = false;
		}
	}
};
</script>

<style lang="scss" scoped>
.wrapCont {
	margin: 20upx;
	padding: 20upx;
	box-shadow: 0px 2px 10px 0px #d6d4d4;
}

.box {
	margin: 10px 0;
}

.poupbox {
	.mask {
		background: rgba(0, 0, 0, 0.6);
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		z-index: 888;
	}

	.boxpou {
		z-index: 999;
		width: 88%;
		max-height: 800upx;
		min-height: 600upx;
		// box-shadow: 0px 2px 6px 0px #d6d4d4;
		position: fixed;
		background: #ffffff;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		margin: auto;
		border-radius: 5px;
		animation: 0.3s opacity2;

		.contentpop {
			height: 600upx;
			overflow: scroll;
		}

		.select {
			width: 100%;
			text-align: center;
			font-size: 34upx;
			line-height: 80upx;
		}

		.contYes {
			display: flex;
			justify-content: space-around;
			position: absolute;
			bottom: 0;
			width: 100%;
			.btn {
				width: 50%;
				text-align: center;
				color: rgb(0, 122, 255);
				border-top: 1px solid #d5d5d6;
				line-height: 100upx;
				font-weight: bold;
			}
			.concel {
				border-right: 1px solid #d5d5d6;
			}
		}
	}
}

@keyframes opacity2 {
	0% {
		opacity: 0;
	}

	50% {
		opacity: 0.5;
	}

	100% {
		opacity: 1;
	}
}
.normalstyle {
	color: #848080;
	text-align: center;
}
.boxbtn {
	width: 100vw;
}

.btns {
	margin: 20px auto;
	height: 40px;
	width: 90%;
	background: linear-gradient(to right, #ffc458, #ff635f);
	font-size: 16px;
	color: #ffffff;
	text-align: center;
	line-height: 40px;
	border-radius: 30px;
}
</style>
