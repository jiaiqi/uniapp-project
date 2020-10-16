<template>
	<view class="shop-detail-wrap">
		<text>商铺详情</text>
	</view>
</template>

<script>
	export default {
		name:'shopDetail',
		data(){
			return {
				
			}
		},
		methods:{
			
		},
		onLoad(option) {
			console.log("option----",JSON.parse(decodeURIComponent(option.itemData)))
		}
	}
</script>

<style scoped lang="scss">
</style>
