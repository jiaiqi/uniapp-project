<template>
	<view class="page-wrap">
		<view class="top-bg">

		</view>
		<view class="button" @click="showModal('editInfo')">

		</view>
		<!-- <button  class=" button"></button> -->
		<view class="cu-modal bottom-modal" @click="hideModal" :class="{show:modalName==='editInfo'}">
			<view class="cu-dialog" @click.stop="">
				<view class="edit-info">
					111
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				modalName:""
			}
		},
		methods: {
			showModal(name){
				this.modalName = name
			},
			hideModal(){
				this.modalName = ''
			},
		}
	}
</script>

<style lang="scss" scoped>
	.page-wrap {
		height: 100vh;
		background-color: #8a1b1f;
		background-size: 100% 100%;
		background-repeat: no-repeat;
		background-image: url(../../../static/img/100year_bg_full.png);
		position: relative;

		.top-bg {
			background-image: url(../../../static/img/100year_top.png);
			background-size: 100%;
			width: 100vw;
			height: 600rpx;
		}

		.button {
			width: 100vw;
			height: 600rpx;
			background-size: 100%;
			background-image: url(../../../static/img/100year_button_1.png);
			position: absolute;
			bottom:0;
		}
		.edit-info{
			min-height: 30vh;
		}
		// .button{
		// 	position: absolute;
		// 	width: 620rpx;
		// 	left: calc((100vw - 620rpx) / 2);
		// 	bottom: 300rpx;
		// 	height: 160rpx;
		// 	border-radius: 30rpx;
		// 	background-color: transparent;
		// 	outline: none;
		// 	display: flex;
		// 	justify-content: center;
		// 	align-items: center;
		// 	color: #FFF5D4;
		// 	font-size:70rpx;
		// 	font-family: '宋体';
		// 	&::after{
		// 		border: none;
		// 	}
		// }
	}
</style>
