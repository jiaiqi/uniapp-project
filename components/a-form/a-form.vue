<template>
  <form ref="form">
    <wyFormItem
      class="input-box"
      v-for="(i, index) in formItem"
      :key="index"
      :checkoutEvent="blo"
      ref="inputs"
      v-model="search[i.name]"
      :formInfo="i"
      @validateState="validateState"
    ></wyFormItem>
    <button @click="reset">重置</button>
    <button @click="submit">提交</button>
  </form>
</template>

<script>
import wyFormItem from './a-form-item.vue';
export default {
  name: 'wyForm',
  components: {
    wyFormItem
  },
  data() {
    return {
      blo: true,
      validate: false,
      search: {
        user: 'ffff',
        pass: '',
        desc: ''
      },
      formData: {},
      formItem: [
        {
          formType: 'input', //类型
          required: true, //必填
          model: 'user',
          type: 'text', //input类型 idcard,digit,number,password
          name: 'user',
          label: '姓名', //label显示
          placeholder: '请输入姓名', //placeholder
          event: 'blur',
          rules: [
            {
              reg: 'checkChinese',
              msg: '1-20位汉字'
            }
          ]
        },
        {
          formType: 'input', //类型
          required: true,
          type: 'password',
          name: 'pass',
          label: '密码',
          placeholder: '请输入密码',
          event: 'blur',
          rules: [
            {
              reg: 'checkPass',
              msg: '字母数字组成'
            }
          ]
        },
        {
          formType: 'input', //类型
          required: true,
          type: 'textarea',
          name: 'desc',
          label: '备注',
          placeholder: '请输入备注',
          event: 'blur',
          rules: [
            {
              reg: 'checkPass',
              msg: '字母数字组成'
            }
          ]
        },
        {
          formType: 'radio', //类型
          type: 'radio',
          name: 'sex',
          label: '单选',
          value: '1',
          options: [
            {
              label: '女',
              value: '1'
            },
            {
              label: '男',
              value: '2'
            }
          ]
        }
      ]
    };
  },
  created() {},
  methods: {
    validateState(val) {
      this.validate = val;
    },
    submit() {
      console.log(this.search);
      this.blo = !this.blo;
      if (this.validate) {
        console.log(this.search);
      }
    },
    reset() {
      Object.keys(this.search).forEach(item => {
        this.search[item] = '';
      });
    }
  },
  watch: {
    search: function(val) {
      // console.log(val)
    }
  }
};
</script>

<style>
.input-box {
  font-size: 14px;
}
</style>
