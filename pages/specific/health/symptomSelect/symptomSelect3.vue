<template>
	<view class="symptoomSelectWrap">
		
		
		<view class="symptopm-tops">
			<cu-custom bgColor="bg-gradual-green" :isBack="!serBtn">
				<block slot="backText" v-if="!serBtn">返回</block>
				<block slot="content">病症选择</block>
			</cu-custom>
			<Thetable :list="chooseArr" @delAlltabAllansw="delAlltabAllansw" ref="tabbox" @delHtml="deltab"></Thetable>
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
						<button @click.stop="changeListType" class="cu-btn bg-olive shadow-blur round">切换</button>
						<button v-if="isSearch" @click.stop="searchEnd" class="cu-btn bg-orange shadow-blur round">取消</button>
					</view>
				</view>
			</view>
		</view>
		
		<view v-if="isChunk" class="symptom-bot-wrap">
			<view class="" v-if="symptomList.length > 0 && !isSearch">
				<view v-if="item.is_show" v-for="(item,index) in symptomList" class="wrapCont">
					<view  class="wrapCont-top">
						{{item[query.key]}}
					</view>
					<view v-if="alone.is_leaf === '否' && alone.children.length > 0" v-for="(alone,i) in item.children" class="wrapCont_row">
						<text>{{alone[query.key]}}</text>
						<view class="wrapCont_row_item_wrap">
							<view @click="chooseItem(single)" v-for="(single,idx) in alone.children" :class="single.is_checked?'actived':''" class="wrapCont_row_item">
								{{single.name}}
							</view>
						</view>
					</view>				
				</view>	
			</view>	
			<view v-else class="wrapCont">
				<view class="box" v-show="serseData.length > 0">
					<view @click="chooseItem(item)" v-for="(item,index) in serseData" class="wrapCont_row_item" :class="item.is_checked?'actived':''">
						{{item[query.key]}}
					</view>
				</view>
				<view class="box normalstyle" v-show="serseData.length == 0">没有找到相关内容</view>
			</view>				
			<!-- <view v-else class=""> -->
			
		<!-- </view> -->
			<view class="boxbtn"><view class="btns" @click="lookobj">完成</view></view>
		</view>
		<view v-else class="symptom-bot-wrap">
			<u-tabs active-color="#42b983" :list="symptomList" :is-scroll="false" :current="currentTab" @change="change"></u-tabs>
			<view class="" v-if="symptomList.length && symptomList[currentTab].children.length > 0 && !isSearch">
				<view v-if="symptomList[currentTab].is_show && items.is_leaf === '否'" v-for="(items,index) in symptomList[currentTab].children" class="wrapCont">
					<!-- <view  class="wrapCont-top">
						{{items[query.key]}}
					</view> -->
					<view v-if="items.is_leaf === '否' && items.children.length > 0" class="wrapCont_row">
						<text>{{items[query.key]}}</text>
						<view class="wrapCont_row_item_wrap">
							<view @click="chooseItem(single)" v-for="(single,idx) in items.children" :class="single.is_checked?'actived':''" class="wrapCont_row_item">
								{{single.name}}
							</view>
						</view>
					</view>				
				</view>	
			</view>	
			<view v-else class="wrapCont">
				<view class="box" v-show="serseData.length > 0">
					<view @click="chooseItem(item)" v-for="(item,index) in serseData" class="wrapCont_row_item" :class="item.is_checked?'actived':''">
						{{item[query.key]}}
					</view>
				</view>
				<view class="box normalstyle" v-show="serseData.length == 0">没有找到相关内容</view>
			</view>	
			<view class="boxbtn"><view class="btns" @click="lookobj">完成</view></view>
		</view>
		<view class="symptom_from">
			<u-popup v-model="show" width="85%" border-radius="14" mode="center">
				<view class="select">请完善</view>
				<view class="contentpop">
					<view class="contentpop_title">
						发烧症状
					</view>
					<scroll-view scroll-y="true" style="height: 540rpx;">
						<view class="contentpop_cen_bot">
							<view class="sym-check">
								<sym-from @checkedItemChange="checkedItemChange" :fromTypeData="fromTypeData"></sym-from>
							</view>
						</view>
						</scroll-view>
				</view>
				<view class="contYes">
					<view class="btn concel" @tap="confirm">提交</view>
					<view class="btn" @tap="cancel">取消</view>
				</view>
			</u-popup>
		</view>
		<u-toast ref="uToast" />
	</view>
</template>

<script>
import Thetable from '@/components/Thetable/Thetable.vue';
import symFrom from '@/components/bx-sym-from/bx-sym-from.vue'
// import template from "@/common/addFile.js";
export default {
	components: {
		Thetable,
		symFrom
	},
	data() {
		return {
			searchValue: '',
			currentTab: 0,
			currentMenu: 0,
			isChunk:uni.getStorageSync('is_chunk')?uni.getStorageSync('is_chunk'):true,
			TableList: [],
			poupName:null,
			mask: false,
			isSearch:false,
			dataItem: [],
			oriData:[],
			serBtn: false,
			serseData:[],
			symptomList:[],
			chooseArr:uni.getStorageSync('symptomList')?uni.getStorageSync('symptomList'):[],
			query:'',
			show:false,
			checkedData:[],
			current_item:"",
			fromTypeData:"" //表单类型和数据
			
		};
	},
	created() {
	},
	mounted(e) {
		if(this.query.type === 'symptom'){
			this.getSymptomList();
			uni.setStorageSync('is_chunk',this.isChunk)
		}
		
	},
	watch:{
		chooseArr:{
			handler(newval,oldval){
				console.log("------watch=========-----")
				let flattArr = this.flag(this.symptomList)
				if(newval.length > 0){
					newval.forEach(item=>{
						flattArr.forEach(fal=>{
							if(item.id === fal.id){
								fal.is_checked = item.is_checked
							}
						})
					})
					this.symptomList = this.assemblyData(flattArr)
				}				
			},
			deep:true,
			immediate: true
		}
	},
	onLoad(option) {
		let query = JSON.parse(decodeURIComponent(option.term))
		this.query = query
		 console.log("option-----",query)
	},
	methods: {
		changeListType(){
			this.isChunk = !this.isChunk
		},
		change(index) {
			this.currentTab = index;
			this.currentMenu = 0;
		},
		
		/** 复选框事件*/
		checkedItemChange(e,item){
			console.log(e,item)
			let self = this
			let checkedData = this.checkedData
			let data = this.fromTypeData
			if(this.checkedData.length >= 0){
				if(checkedData.indexOf(e.name) > -1){
					let word_index = checkedData.indexOf(e.name)
					checkedData.forEach((item,index)=>{
						checkedData.splice(word_index,1)
					})
				}else{
					checkedData.push(e.name)
				}
			}
			data.forEach((d,i)=>{
				if(d.title === item.title){
					if(checkedData.length > 0){
						let a  = checkedData.join()
						d.value = a
						self.$set(self.fromTypeData,i,d)
					}else{
						d.value = ""
						self.$set(self.fromTypeData,i,d)
					}
					
				}
			})
		},
		
		chooseItem(item){
			let fromTypeData = item.optional_para?JSON.parse(item.optional_para):""
			item.is_checked = !item.is_checked
			this.current_item = item
			if(this.chooseArr.indexOf(this.current_item)){
				
			}
			if(fromTypeData){
				fromTypeData.forEach(item=>{
					item['value'] = ''
					item['isfail'] = false
					if(item.type === 'num'){
						item.value = 0
					}
				})
				this.fromTypeData = fromTypeData
				if(item.is_checked){
					this.show = true
				}
			}
			
			console.log("----",item)
			let chooseArr = this.chooseArr
			if(item.is_checked){
				chooseArr.push(item)
			}else{
				if(chooseArr.length > 0){
					chooseArr.forEach((alo,i)=>{
						if(item.id === alo.id){
							chooseArr.splice(i,1)
						}
					})
				}
			}
		},
		lookobj() {
			uni.showModal({
				title: '提示',
				content: '确认提交?',
				success: (res) =>{
				 if (res.confirm) {
				   // uni.$emit('checkedItem', this.answerDataItem);
				   if(this.query.type === 'symptom'){
					   uni.setStorageSync('symptomList',this.chooseArr)
					   uni.$emit('symptomSelect',this.chooseArr)
				   }				  				  
				   uni.navigateBack();
				 } 
				}
			});
		},
	
		async getSymptomList(symptomList) {
			// 请求疾病列表
			let url = this.getServiceUrl(this.query.srvApp, this.query.serviceName, 'select');
			let req = {
				serviceName: this.query.serviceName,
				colNames: ['*'],
				relation_condition: {},
				order: []
			};
			let chooseData = uni.getStorageSync('symptomList')
			let res = await this.$http.post(url, req);
			if (res.data.state === 'SUCCESS') {
				if (Array.isArray(res.data.data) && res.data.data.length > 0) {
					res.data.data.forEach(item => {						
						item['is_checked'] = false
						if(chooseData && chooseData.length > 0){
							chooseData.forEach(choose=>{
								if(item.id === choose.id){
									item.is_checked = true
								}
							})
						}
					});
					let parentNode = this.assemblyData(res.data.data)
					this.symptomList = parentNode;
					
					// parentNode.forEach(parent => {
					// 	parent.children = [];
						
					// 	if (Array.isArray(parent.children) && parent.children.length > 0) {
					// 		parent.children.forEach(child => {
					// 			child.children = [];
					// 			res.data.data.forEach(item => {
					// 				if (item.parent_no === child.no) {
					// 					if (Array.isArray(symptomList)) {
					// 						symptomList.forEach(sym => {
					// 							if (sym.name === item.name) {
					// 								item.checked = true;
					// 							}
					// 						});
					// 					}
					// 					child.children.push(item);
					// 				}
					// 			});
					// 		});
					// 	}
					// });
				}
			}
		},	
		// flatteningArr(arr,key){
		// 	arr.forEach((item,index)=>{
		// 		if(item[key] && item[key].length > 0){
		// 			arr = [...arr,...item[key]]
		// 			delete item[key]
		// 			this.flatteningArr(arr,key)
		// 		}
		// 	})
		// 	return arr
		// },
		/**
		 * 扁平化数组
		 * */
		flag(arr) {
		  let result = []
		  for (let item of arr) {
		    var res = JSON.parse(JSON.stringify(item)) // 先克隆一份数据作为第一层级的填充
		    delete res['children']
		    result.push(res)
		    if (item.children instanceof Array && item.children.length > 0) { // 如果当前child为数组并且长度大于0，才可进入flag()方法
		      result = result.concat(this.flag(item.children))
		    }
		  }
		  return result
		},
		/**
		 * 对扁平化数组进行重新组装
		 * */
		assemblyData(arr){
			let flattArr = arr
			let parentNode = flattArr.filter(item => !item.parent_no);
			parentNode.forEach(parent => {
				parent.children = [];
				parent['is_show'] = false
				flattArr.forEach(item => {					
					if (item.parent_no === parent.no) {
						parent.children.push(item);
					}
				});
				if (Array.isArray(parent.children) && parent.children.length > 0) {
					parent.children.forEach(child => {
						child.children = [];
						flattArr.forEach(item => {
							if (item.parent_no === child.no) {								
								child.children.push(item);
								parent.is_show = true
							}
						});
					});
				}
			});
			return parentNode
		},
		delAlltabAllansw(type){
			this.chooseArr = []
			// uni.setStorageSync('symptomList',this.chooseArr)
			let alls = this.symptomList
			let flattArr = this.flag(alls)
			flattArr.forEach(item=>{
				item.is_checked = false
			})
			let newData = this.assemblyData(flattArr)			
			this.symptomList = newData;
		},
		deltab(item){
			let allArr = this.deepClone(this.chooseArr)
			allArr.forEach((items,index)=>{
				if(item.id === items.id){
					allArr.splice(index,1)
				}
			})
			// uni.setStorageSync('symptomList',allArr)
			this.chooseArr = allArr
			let flattArr = this.flag(this.symptomList)
			flattArr.forEach(flt=>{
				if(flt.id === item.id){
					flt.is_checked = false
				}
			})
			let newData = this.assemblyData(flattArr)	
			this.symptomList = newData
		},
		searchStart() {
			let searchVal = this.searchValue
			// let flattArr = this.flag(this.symptomList)
			
			let url = this.getServiceUrl('health', 'srvhealth_self_symptoms_select', 'select');
			let req = {
				serviceName: 'srvhealth_self_symptoms_select',
				colNames: ['*'],
				condition:[{
					colName:'name',
					ruleType:'like',
					value:searchVal
				}]
			};
			if(searchVal){
				this.$http.post(url,req).then(res=>{
					this.isSearch = true
					this.serseData = res.data.data
					console.log("搜索开始----",res.data.data)
				})
			}else{
				this.isSearch = false
			}
			
		},
		searchEnd() {
			this.isSearch = false
		},
		cancel() {
			let currtItem = this.current_item
			this.chooseArr.forEach((item,index)=>{
				if(item.id === currtItem.id){
					this.chooseArr.splice(index,1)
				}
			})
			let flattArr = this.flag(this.symptomList)
			flattArr.forEach(flt=>{
				if(flt.id === currtItem.id){
					flt.is_checked = false
				}
			})
			this.symptomList = this.assemblyData(flattArr)
			
			this.show = false;
		},
		confirm(){
			let data = this.fromTypeData
			let current_item = this.current_item
			let values = []
			let fromData = []
			let isPass = false
			data.forEach(item=>{				
				if(item.value){
					values.push(item.value)
				}
				if(item.required && item.value){
					isPass = true
				}else if(item.required && !item.value){
					isPass = false
				}
			})
			if(isPass){
				let str = values.join()
				this.$set(current_item,'answer',str)
				this.chooseArr.forEach(chose=>{
					if(chose.id === current_item.id){
						chose['fromTypeData'] = this.fromTypeData
					}
				})
				this.show = false
			}else{
				// uni.showToast({
				// 	title:'请完善信息',
				// 	duration: 2000,
				// 	icon:'none'
				// })
				data.forEach(must=>{
					if(must.required && !must.value){
						must.isfail = true
					}
				})
				this.$refs.uToast.show({
					title: '请完善信息',
					type: 'error'
				})
			}
			
		}
	}
};
</script>

<style lang="scss" scoped>
.symptoomSelectWrap{
	overflow-x: hidden;
	height: 100vh;
	display: flex;
	flex-direction: column;
	.symptom-bot-wrap{
		// height: calc(100vh - 150px);
		flex: 1;
		overflow-y: scroll;
	}
}
.wrapCont {
	margin: 20upx;
	padding: 20upx;
	box-shadow: 0px 2px 10px 0px #d6d4d4;
	.wrapCont-top{
		    font-weight: 700;
		    font-size: 18px;
		    text-align: center;
	}
	.wrapCont_row{
		display: flex;
		flex-direction: column;
		margin: 20upx 0;
		text{
			&:first-child{
				font-size: 15px;
				font-weight: bold;
				margin-bottom: 10px;
				padding-right: 10px;
				box-sizing: border-box;
			}
		}
		.wrapCont_row_item_wrap{
			display: flex;
			flex-wrap: wrap;			
		}
	}
	.box{
		display: flex;
		flex-wrap: wrap;
	}
	
}
.wrapCont_row_item{
				line-height: 34px;
				    padding: 0 10px;
				    box-sizing: border-box;
				    border: #e5e5e5 solid 1px;
				    background-color: #fff;
				    color: #333;
				    position: relative;
				    overflow: hidden;
				    white-space: nowrap;
				    text-overflow: ellipsis;
					margin: 0 2px 2px 0;
				// min-width: 50upx;
				// max-width: ;
			}
			.actived{
				background-color: #f5fff9;
				color: #42b983;
				border: #42b983 solid 1px;
				&::before{
					content: '';
					    display: block;
					    width: 20px;
					    height: 20px;
					    background-color: #42b983;
					    position: absolute;
					    right: -1px;
					    bottom: -1px;
					    z-index: 1;
					    clip-path: polygon(100% 0, 0% 100%, 100% 100%);
				}
				&::after{
					content: '';
					    display: block;
					    width: 4px;
					    height: 8px;
					    border-right: #fff solid 2px;
					    border-bottom: #fff solid 2px;
					    transform: rotate(25deg);
					    position: absolute;
					    right: 2px;
					    bottom: 3px;
					    z-index: 2;
				}
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
	justify-content: center;
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
.select {
		width: 100%;
		text-align: center;
		font-size: 34upx;
		line-height: 80upx;
	}
.contentpop{
	height: 600upx;
	.contentpop_title{
		padding-left: 20upx;
		font-size: 16px;
		border-left: 4px solid rgb(107, 161, 255);
		margin-left: 30upx;
	}
	.contentpop_cen_tit{
		margin: 10px;
		color: #777777;
		margin-left: 0;
	}
}
.contentpop_cen_bot{
	height: 560upx;
	// overflow-y: scroll!important;
}
		.contYes {
			display: flex;
			justify-content: space-around;
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
		.navs-top{
			margin-right: 20upx;
		}
</style>
