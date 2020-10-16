<template>
  <view>
    <view class="input-box" v-if="formInfo.formType == 'input'">
      <view class="input-item">
        <view class="input-label" :class="{ 'wy-form-item-label-required': formInfo.required == true }">{{ formInfo.label }}</view>
        <view class="input-body">
          <input v-model="inputValue" class="input" :type="formInfo.type" :placeholder="formInfo.placeholder" @blur="inputBlur" />
          <view class="icon" v-if="showIcon" @click="clearBtn"><icon type="clear" size="20" /></view>
        </view>
      </view>
      <view class="input-msg" v-if="errorMsg">{{ errorMsg }}</view>
    </view>
    <!-- <view class="input-box" v-if="formInfo.type == 'radio'">
			<view class="input-item">
				<view class="input-label">{{formInfo.label}}</view>
				<view class="input-body">
					<radio-group @change="radioChange($event)">
						<radio v-for="(i,index) in formInfo.options" :key='index' :value="i.value" :checked="i.value == formInfo.value"><span>{{i.label}}</span></radio>
					</radio-group>
				</view>
			</view>
		</view> -->
  </view>
</template>
<script>
// import ruleObject from '../utils/rule.js';
export default {
  name: 'wyFormItem',
  components: {},
  // model: {
  // 	prop: 'value',
  // 	event: 'input'
  // },
  props: {
    formInfo: {
      type: Object,
      default() {
        return {};
      }
    },
    resetInput: {
      type: Boolean,
      default: true
    },
    blo: {
      type: Boolean,
      default: true
    },
    value: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      validateState: false,
      errorMsg: '',
      inputInfo: {},
      inputValue: this.value,
      radioValue: '',
      showIcon: false,
      isRequired: false // 是否为必填
    };
  },
  methods: {
    //单选
    radioChange(event) {
      console.log(event);
      this.radioValue = event.detail.value;
      this.inputInfo = {
        name: this.formInfo.name,
        value: this.radioValue
      };
      this.$emit('inputInfo', this.inputInfo);
    },
    inputBlur() {
      this.check(this.inputValue);
      this.$emit('input', this.inputValue);
    },
    //清空
    clearBtn() {
      this.inputValue = '';
      this.$emit('input', this.inputValue);
    },
    //校验
    check(val) {
      let arr = [];
      this.formInfo.rules.forEach(item => {
        if (ruleObject[item.reg](val) == false) {
          this.errorMsg += item.msg;
          // this.validateState=false;
          arr.push(item.msg);
        } else {
          this.errorMsg = '';
          // this.validateState=true;
        }
      });
      this.$emit('validateState', arr.length>0 ? false : true);
      return  arr.length>0? false : true;
    }
  },
  watch: {
    blo: {
      handler(val) {
        if (this.formInfo.require) {
          this.check();
        }
      }
    },
    resetInput() {
      this.formInfo = {};
    },
    value: {
      deep: true,
      handler(newValue, oldValue) {
        this.inputValue = newValue;
        if (newValue) {
          this.showIcon = true;
          return newValue;
        } else {
          this.showIcon = false;
        }
      }
    }
  }
};
</script>

<style>
.input-item {
  display: flex;
  background: white;
  border-bottom: 1upx solid #eeeeee;
  line-height: 100upx;
  height: 100upx;
  position: relative;
}

.input-label {
  width: 150upx;
  text-align: center;
}

.wy-form-item-label-required:before {
  content: '*';
  color: red;
}

.input-body {
  position: relative;
  height: 100upx;
  width: calc(100% - 150upx);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.input {
  line-height: 100upx;
  height: 100upx;
  font-size: 28upx;
}

.icon {
}

.input-box {
  position: relative;
}

.input-msg {
  color: red;
  font-size: 14px;
  line-height: 100upx;
  position: absolute;
  right: 30px;
  top: 0;
}
</style>
