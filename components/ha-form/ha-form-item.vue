<template>
  <view class="ha-form-item">
    <view class="title">
      <text class="text-red text-shadow" v-show="fieldData.isRequire">*</text>
      {{ fieldData.label }}:
    </view>
    <view class="item-content">
      <radio-group @change="radioChange" v-if="fieldData.type === 'radio'" class="radio-group">
        <radio
          :key="index"
          :disabled="fieldData.disabled ? fieldData.disabled : false"
          v-for="(itema, index) in fieldData.options"
          class="radio"
          :checked="itema === fieldData.value"
          :value="itema"
        >
          <span style="flex: 1;">{{ itema }}</span>
        </radio>
      </radio-group>
    </view>
  </view>
</template>

<script>
  export default {
    props: {
      field: {
        type: Object,
        default() {
          return {
          };
        }
      },
    },
    data() {
      return {
        fieldData:{}
      }
    },
    watch: {
      field:{
        immediate:true,
        deep:true,
        handler(newValue, oldValue) {
          if(typeof newValue==='object'){
            this.fieldData = this.deepClone(newValue)
          }
        }
      }
    },
  }
</script>

<style scoped lang="scss">
.ha-form-item{
  width: 100%;
  .title{
    display: flex;
    width: 100%;
    min-height: 80upx;
    align-items: center;
    padding-left: 20upx;
  }
  .item-content{
    .radio-group{
      display: flex;
      flex-direction: column;
    }
   }
}
</style>