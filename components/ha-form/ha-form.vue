<template>
  <view>
    <view v-for="(field, fieldIndex) in allFields" :key="fieldIndex">
      <form-item ref="formItem" :field="field" :pageType="pageType" :fieldsModel="fieldsModel" @onValueChange="valueChange"></form-item>
    </view>
  </view>
</template>

<script>
import FormItem from './ha-form-item.vue';
export default {
  components: {
    FormItem
  },
  props: {
    fields: {
      // 字段集合
      type: Array,
      default: () => []
    },
    pageType: {
      // 页面类型: form(表单,可编辑)/detail(展示,不可编辑)
      type: String,
      default: 'form'
    }
  },
  data() {
    return {
      allFields: [],
      oldFields: [],
      fieldsModel: {} // 字段值
    };
  },
  methods: {},
  watch: {
    fields: {
      deep: true,
      immediate: true,
      handler(newValue, oldValue) {
        if (newValue && typeof newValue === 'object') {
          this.allFields = this.deepClone(newValue);
        }
        if (oldValue && typeof oldValue === 'object') {
          this.oldFields = this.deepClone(oldValue);
        }
      }
    }
  },
  mounted() {
    
  }
};
</script>

<style></style>
