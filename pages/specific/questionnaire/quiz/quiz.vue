<template>
  <view class="quiz-wrap">
    <view class="quiz-top bg-black">
      <view class="center-countdown text-white" v-if="countdown">
        <text class="cuIcon-time margin-right-xs"></text>
        {{ countdown }}
      </view>
    </view>
    <view class="quiz-center" v-if="contentType === 'start'">
      <view class="quiz-title light bg-blue">
        <text class="cuIcon-titles text-blue"></text>
        {{ formData.title }}
      </view>
      <view class="quiz-remark">
        <view v-html="JSON.parse(JSON.stringify(formData.remark).replace(/\<img/gi, '<img width=100%  '))"></view>
        <view class="start-button">
          <button class="cu-btn" @click="startAnswer" v-if="formType!=='detail'&&formData.user_state!=='完成'">开始答题</button>
          <button class="cu-btn" @click="startAnswer" v-if="formType==='detail'||formData.user_state==='完成'">查看答题记录</button>
          </view>
      </view>
    </view>
    <view class="quiz-center" v-if="contentType === 'end'">
      <view class="quiz-title light bg-blue">
        <text class="cuIcon-titles text-blue"></text>
        {{ formData.title }}
      </view>
      <view class="quiz-remark">
        <view v-html="JSON.parse(JSON.stringify(formData.end_remark).replace(/\<img/gi, '<img width=100%  '))"></view>
        <view class="start-button" v-if="formType!=='detail'&&formData.user_state!=='完成'"><button class="cu-btn" @click="submitQuiz">提交</button></view>
      </view>
    </view>
    <view class="quiz-center" v-if="contentType === 'question'">
      <view class="quiz-title light bg-blue">
        <text class="cuIcon-titles text-blue"></text>
        {{ formData.title }}
      </view>
      <view class="quiz-question">
        <!-- <view class="quiz-question-title">{{ formData.item_data[currentQuestion]['item_title'] }} ( {{ formData.item_data[currentQuestion]['item_type'] }} )</view> -->
        <view class="quiz-question-contetn"><bxform ref="bxform" :fields="currentCols" :BxformType="'form'" pageType="add" @value-blur="saveValue"></bxform></view>
      </view>
      <view class="quiz-respond"></view>
    </view>
    <view class="quiz-bottom bg-black" v-if="contentType === 'question'">
      <view class="left" v-if="currentQuestion === 0" @click="changeQuestion('start')">返回</view>
      <view class="left" v-if="currentQuestion > 0" @click="changeQuestion('pre')">上一题</view>
      <view class="number">{{ currentQuestion + 1 }}/{{ formData.item_data.length }}</view>
      <view class="right" @click="changeQuestion('next')" v-if="currentQuestion < formData.item_data.length - 1">下一题</view>
      <view class="right" v-if="currentQuestion === formData.item_data.length - 1" @click="changeQuestion('end')">完成</view>
    </view>
  </view>
</template>

<script>
// var wx = require('jweixin-module');
import bxform from '@/components/bx-form/bx-form.vue';
export default {
  components: {
    bxform
  },
  data() {
    return {
      starTime: 0,
      timer: null,
      nowTime: 0,
      total: 0, // 总共多少道题
      currentQuestion: 0, // 当前是第几道题
      formType: 'form', // 表单类型 预览:detail 正常:form
      activity_no: '', // 问卷编号
      status: '未开始',
      configCols: [],
      quizData: {}, //表单答题数据
      formData: {}, //问卷信息
      userInfo: {}, // 登录用户信息
      wxUserInfo: {}, // 微信用户信息
      questionData: {},
      fill_batch_no: '', //活动批次编号
      modalName: null,
      assessmentReport: [],
      contentType: 'start'
    };
  },
  computed: {
    currentCols() {
      if (Array.isArray(this.configCols) && this.configCols.length > 0) {
        return [this.configCols[this.currentQuestion]];
      }
    },
    countdown() {
      // 时间间隔
      if (this.nowTime) {
        let countdown = this.nowTime - this.starTime;
        return parseInt(countdown / 3600) + ' 小时 ' + parseInt((countdown % 3600) / 60) + ' 分 ' + parseInt((countdown % 3600) % 60) + ' 秒';
      }else{
        return `0 小时 0 分 0 秒`
      }
    }
  },
  methods: {
    changeQuestion(type) {
      let itemData = this.$refs.bxform.getFieldModel();
      console.log('itemData', itemData);
      if (type === 'pre' && this.currentQuestion > 0) {
        this.currentQuestion--;
      } else if (type === 'next' && this.currentQuestion < this.formData.item_data.length) {
        this.currentQuestion++;
      } else if (type === 'start') {
        //返回起始页
        this.contentType = 'start';
      } else if (type === 'end') {
        //返回结束页
        this.quizData = itemData;
        this.contentType = 'end';
      }
    },
    startAnswer() {
      if(!this.timer){
        this.start();
      }
      this.contentType = 'question';
    },
    submitQuiz() {
      this.submitForm();
    },
    hideModal(e) {
      this.modalName = null;
    },
    async seeReport() {
      // 查看评估结果
      uni.navigateTo({
        url: `/pages/specific/assessmentResult/assessmentResult?activity_no=${this.activity_no}&fill_batch_no=${this.fill_batch_no}`
      });
    },
    toCreate() {
      // 跳转到问卷列表页面
      uni.redirectTo({
        url: '/pages/specific/home/home'
      });
    },
    toFeedback() {
      // 跳转到意见反馈问卷
      uni.redirectTo({
        url: '/pages/specific/questionnaire/questionnaire?formType=form&activity_no=20200309125000000100&status=进行中'
      });
    },
    saveValue(e) {
      console.log('saveValue', e, this.status);
      if (e.value && this.status === '进行中') {
        // return
        let itemData = [
          {
            item_no: e.column,
            option_data: [e.value]
          }
        ];
        if (e.type === 'checkbox') {
          itemData = [
            {
              item_no: e.column,
              option_data: e.value
            }
          ];
        }
        if (Array.isArray(e.value)) {
          itemData = [
            {
              item_no: e.column,
              option_data: e.value
            }
          ];
        }

        const serviceName = 'srvdaq_activity_result_save';
        const url = this.getServiceUrl('daq', serviceName, 'operate');
        let req = [
          {
            serviceName: serviceName,
            data: [
              {
                activity_no: this.activity_no,
                item_data: itemData
              }
            ]
          }
        ];
        if (this.fill_batch_no) {
          req[0].data[0].fill_batch_no = this.fill_batch_no;
        }
        this.$http.post(url, req).then(res => {
          if (res.data.state === 'SUCCESS') {
            if (res.data.resultCode === 'SUCCESS') {
              console.log(res.data.response[0].response);
              let data = res.data.response[0].response;
              if (data.fill_batch_no && !this.fill_batch_no) {
                this.fill_batch_no = data.fill_batch_no;
              }
              // uni.showToast({
              // 	title: '提交成功',
              // 	icon: 'none'
              // });
            }
          } else {
            console.log(res);
          }
        });
      }
    },
    submitForm() {
      let self = this;
      let itemData = self.quizData;
      if (itemData !== false) {
        uni.showModal({
          title: '提示',
          content: '确认提交?',
          success: function(res) {
            if (res.confirm) {
              if (self.status !== '进行中') {
                uni.showToast({
                  title: '状态非进行中的问卷不支持提交',
                  icon: 'none'
                });
              } else {
                console.log('itemData', itemData);
                let resultData = [];
                Object.keys(itemData).forEach(item => {
                  let obj = {
                    item_no: item,
                    option_data: [itemData[item]]
                  };
                  if (Array.isArray(itemData[item])) {
                    obj.option_data = itemData[item];
                  }
                  if (itemData[item]) {
                    resultData.push(obj);
                  }
                });
                let serviceName = 'srvdaq_activity_result_submit';
                const url = self.getServiceUrl('daq', serviceName, 'operate');
                let req = [
                  {
                    serviceName: serviceName,
                    data: [
                      {
                        fill_batch_no: self.fill_batch_no,
                        activity_no: self.activity_no,
                        item_data: resultData
                      }
                    ]
                  }
                ];
                console.log('resultData', resultData);
                self.$http.post(url, req).then(res => {
                  if (res.data.state === 'SUCCESS') {
                    if (res.data.resultCode === 'SUCCESS') {
                      uni.showToast({
                        title: '提交成功',
                        icon: 'none'
                      });
                      self.formType = 'detail';
                      self.getQuestionnaireData(self.formData);
                    }
                  } else {
                    if (res.data.resultCode === 'FAILURE') {
                      uni.showToast({
                        title: res.data.resultMessage,
                        icon: 'none'
                      });
                    }
                    console.log(res);
                  }
                });
              }
            } else if (res.cancel) {
              console.log('用户点击取消');
            }
          }
        });
      }
    },
    getQuestionnaireData(questionData) {
      // 获取问卷数据
      let that = this;
      const serviceName = 'srvdaq_init_view_select';
      const url = this.getServiceUrl('daq', serviceName, 'select');
      const req = {
        serviceName: serviceName,
        colNames: ['*'],
        order: [{ colName: 'item_seq', orderType: 'asc' }],
        condition: [
          {
            colName: 'activity_no',
            ruleType: 'eq',
            value: this.activity_no
          },
          {
            colName: 'type', // 查看视图初始化
            ruleType: 'eq',
            value: 'use'
          }
        ]
      };
      if (this.status === '未开始') {
        req.condition = [
          {
            colName: 'activity_no',
            ruleType: 'eq',
            value: this.activity_no
          },
          {
            colName: 'biz_type',
            ruleType: 'eq',
            value: 'cfg'
          }
        ];
      }
      console.log(this.questionData);
      if (questionData && questionData.fill_batch_no) {
        req.condition = [
          {
            colName: 'activity_no',
            ruleType: 'eq',
            value: questionData.activity_no
          },
          {
            colName: 'type',
            ruleType: 'eq',
            value: 'use'
          },
          {
            colName: 'fill_batch_no',
            ruleType: 'eq',
            value: questionData.fill_batch_no
          }
        ];
      }
      if (this.activity_no && this.fill_batch_no) {
        req.condition = [
          {
            colName: 'activity_no',
            ruleType: 'eq',
            value: this.activity_no
          },
          {
            colName: 'type',
            ruleType: 'eq',
            value: 'use'
          },
          {
            colName: 'fill_batch_no',
            ruleType: 'eq',
            value: this.fill_batch_no
          }
        ];
      }
      if (this)
        this.$http
          .post(url, req)
          .then(res => {
            if (res.data.state === 'SUCCESS') {
              const data = res.data.data[0];
              this.activity_no = data.activity_no;
              let configCols = [];
              data.item_data.forEach(item => {
                configCols.push(this.getConfig(item));
              });
              if (data.logo) {
                this.getPicture(data.logo).then(url => {
                  this.$set(this.formData, 'fileUrl', url);
                });
              }
              if (data.user_data) {
                console.log('data.answer_times', data.answer_times);
                configCols.forEach(item => {
                  if (this.formType === 'detail') {
                    item.disabled = true;
                  }

                  data.user_data.forEach(items => {
                    if (item.column === items.item_no) {
                      if (item.item_type_attr && item.item_type_attr.radioType === 'multi') {
                        item.value = items.option_data;
                        console.log('items.option_data', items.option_data);
                      } else {
                        console.log('item_type', item);
                        item.value = items.option_data[0];
                      }
                    }
                  });
                });
              }
              this.formData = data;
              if (data.user_state === '完成') {
                this.formType = 'detail';
              }
              this.configCols = configCols;
              // alert("即将获取用户信息")
              this.getUserInfo();
            } else if (res.data.resultCode === '0011') {
              uni.showToast({
                title: '未登录',
                icon: 'none'
              });
            } else if (res.data.resultCode === 'FAILURE') {
              uni.showToast({
                title: res.data.resultMessage,
                icon: 'none'
              });
              if (res.data.resultMessage === '活动已结束') {
                this.updateState().then(response => {
                  uni.showModal({
                    title: '提示',
                    content: res.data.resultMessage + ',即将跳转到列表页面',
                    showCancel: false,
                    success(res) {
                      if (res.confirm) {
                        uni.navigateBack({
                          animationDuration: 2000
                        });
                      }
                    }
                  });
                });
              }
            }
          })
          .catch(err => {
            console.log('err', err);
          });
    },
    async updateState(e) {
      let reqData = [
        {
          status: '已结束'
        }
      ];
      let url = this.getServiceUrl('daq', 'srvdaq_activity_cfg_update', 'operate');
      let req = [
        {
          serviceName: 'srvdaq_activity_cfg_update',
          data: reqData,
          condition: [
            {
              colName: 'activity_no',
              ruleType: 'eq',
              value: this.activity_no
            }
          ]
        }
      ];
      let response = await this.$http.post(url, req);
      if (response.data.resultCode === 'SUCCESS') {
        // this.getList(this.currentTab)
      }
      return response;
      console.log(response);
    },
    async getUserInfo() {
      // 获取微信账号信息
      let url = this.$api.getUserInfo;
      let req = {
        serviceName: 'srvwx_basic_user_info_select',
        colNames: ['*'],
        condition: [
          {
            colName: 'app_no',
            ruleType: 'eq',
            value: this.$api.appNo.wxh5
          }
        ]
      };
      let res = await this.$http.post(url, req);
      if (res.data.state === 'SUCCESS' && res.data.data.length > 0) {
        const userInfo = res.data.data[0];
        this.wxUserInfo = userInfo;
        uni.setStorageSync('wxUserInfo', userInfo);
        // alert(JSON.stringify(userInfo));
      } else {
        uni.showToast({
          title: '未获取到当前微信用户信息',
          icon: 'none'
        });
      }
      this.getSignature();
    },
    async getPicture(file_no) {
      const serviceName = 'srvfile_attachment_select';
      const url = this.getServiceUrl('file', serviceName, 'select');
      const req = {
        serviceName: serviceName,
        colNames: ['*'],
        condition: [{ colName: 'file_no', value: file_no, ruleType: 'eq' }]
      };
      if (file_no !== null && file_no !== '' && file_no !== undefined) {
        let res = await this.$http.post(url, req);
        if (res.data.state === 'SUCCESS') {
          const data = res.data.data[0];
          if (data) {
            const fileurl = this.$api.srvHost + '/file/download?filePath=' + data.fileurl;
            return fileurl;
          }
        }
      }
    },
    getConfig(e) {
      let config = {
        label: e.item_title,
        column: e.item_no,
        srvInfo: {
          serviceName: 'srvdaq_activity_result_submit',
          appNo: 'daq'
        },
        value: e.value,
        type: e.item_type,
        isRequire: e.is_require === '是' ? true : false,
        isShowExp: [],
        options: [],
        item_type_attr: e.item_type_attr,
        display: true
      };
      if (this.formType === 'detail') {
        config.disabled = true;
      }
      switch (e.item_type) {
        case '文本':
          config.type = e.item_type_attr['view_model'] === 'textarea' ? 'textarea' : 'input';
          break;
        case '图片':
          config.type = 'images';
          config['fileNum'] = e.item_type_attr['fileNum'];
          break;
        case '选项':
          config.type = e.item_type_attr.radioType && e.item_type_attr.radioType === 'multi' ? 'checkbox' : 'radio';
          config.options = e.option_data.map(item => {
            return item.option_value;
          });
          break;
        case '时间日期':
          config.type = e.item_type_attr.dateType ? e.item_type_attr.dateType : 'dateTime';
          break;
        case '数字':
          config.type = e.item_type_attr.numberType ? e.item_type_attr.numberType : 'number';
          break;
        default:
          config.type = e.item_type;
          break;
      }
      return config;
    },
    saveShareRecord(share_type) {
      let url = this.$api.saveShareRecord;
      let req = [
        {
          serviceName: 'srvdaq_record_share_add',
          data: [
            {
              biz_no: this.activity_no,
              biz_type: 'daq',
              share_url: window.location.href,
              from_user: this.userInfo.user_no,
              share_type: share_type ? share_type : '朋友圈'
            }
          ]
        }
      ];
      this.$http.post(url, req).then(res => {
        console.log(res);
      });
    },
    getSignature(formData) {
      let self = this;
      let linkurl = window.location.href.split('#')[0];
      let req = {
        serviceName: 'srvwx_app_signature_select',
        colNames: ['*'],
        condition: [
          {
            colName: 'app_no',
            ruleType: 'eq',
            value: this.$api.appNo.wxh5
          },
          {
            colName: 'page_url',
            ruleType: 'eq',
            // value: linkurl
            value: uni.getStorageSync('linkUrl') ? uni.getStorageSync('linkUrl') : window.location.href.split('#')[0]
          }
        ]
      };
      if (uni.getStorageSync('linkUrl')) {
        console.log('linkUrl', uni.getStorageSync('linkUrl'));
        // alert('linkUrl' + uni.getStorageSync('linkUrl'));
      }
      uni.setStorageSync('linkUrl', null);
      self.$http.post(self.$api.getSignature, req).then(res => {
        if (res.data.state === 'SUCCESS') {
          let resData = res.data.data[0];
          console.log('getSignature', resData);
          uni.setStorageSync('signatureInfo', resData);
          wx.config({
            debug: false, // 调试阶段建议开启
            appId: resData.appId, // APPID
            timestamp: resData.timestamp, // 时间戳timestamp
            nonceStr: resData.noncestr, // 随机数nonceStr
            signature: resData.signature, // 签名signature
            // 需要调用的方法接口
            jsApiList: ['updateAppMessageShareData', 'updateTimelineShareData', 'onMenuShareTimeline', 'onMenuShareAppMessage']
          });

          wx.ready(() => {
            console.log('wx.ready()', self.wxUserInfo);
            linkurl = linkurl.replace(/formType=detail/, 'formType=form');
            wx.updateAppMessageShareData({
              //自定义“分享给朋友”及“分享到QQ”按钮的分享内容
              imgUrl: self.wxUserInfo.headimgurl
                ? self.wxUserInfo.headimgurl
                : self.formData.fileUrl
                ? self.formData.fileUrl
                : 'https://srvms.100xsys.cn:443/file/download?fileNo=20200306184125960100', // 分享图，默认当相对路径处理，所以使用绝对路径的的话，“http://”协议前缀必须在。
              desc: self.formData.summary, // 摘要,如果分享到朋友圈的话，不显示摘要。
              title: self.formData.title, // 分享卡片标题
              // link:  window.location.href, // 分享出去后的链接，这里可以将链接设置为另一个页面。
              link: linkurl, // 分享出去后的链接，这里可以将链接设置为另一个页面。
              success: function() {
                // 分享成功后的回调函数
                // uni.showModal({
                //     title: '提示',
                //     content: linkurl,
                //     success: function (res) {
                //         if (res.confirm) {
                //             console.log('用户点击确定');
                //         } else if (res.cancel) {
                //             console.log('用户点击取消');
                //         }
                //     }
                // });
                self.saveShareRecord('朋友');
              },
              cancel: function() {
                // 用户取消分享后执行的回调函数
                // //// alert('分享失败')
              }
            }); // 自定义“分享到朋友圈”及“分享到QQ空间”按钮的分享内容
            wx.updateTimelineShareData({
              imgUrl: self.wxUserInfo.headimgurl
                ? self.wxUserInfo.headimgurl
                : self.formData.fileUrl
                ? self.formData.fileUrl
                : 'https://srvms.100xsys.cn:443/file/download?fileNo=20200306184125960100', // 分享图，默认当相对路径处理，所以使用绝对路径的的话，“http://”协议前缀必须在。
              desc: self.formData.summary, // 摘要,如果分享到朋友圈的话，不显示摘要。
              title: self.formData.title, // 分享卡片标题
              link: linkurl, // 分享出去后的链接，这里可以将链接设置为另一个页面。
              success: function() {
                // 分享成功后的回调函数
                // //// alert('分享成功')
                self.saveShareRecord('朋友圈');
              },
              cancel: function() {
                // 用户取消分享后执行的回调函数
                // //// alert('分享失败')
              }
            });
          });
          wx.error(function(res) {
            // alert(JSON.stringify(res));
            console.log(res);
          });
        } else {
        }
      });
    },
    getParams(name) {
      let str = window.location.href;
      str = str.split('?')[1];
      let arr = str.split('&');
      let obj = {};
      arr.forEach(item => {
        obj[item.split('=')[0]] = item.split('=')[1];
      });
      if (obj[name]) {
        return obj[name];
      } else {
        return false;
      }
    },
    start() {
      // 开始计时
      this.timer = setInterval(() => {
        this.nowTime++;
      }, 1000);
    },
    pause() {
      // 暂停
      clearInterval(this.timer);
    },
    stop() {
      // 停止
      clearInterval(this.timer);
    },
    reset() {
      // 重新开始计时
      clearInterval(this.timer);
      this.start();
    }
  },
  mounted() {
  },
  onLoad(option) {
    if (option.formType && option.formType === 'detail') {
      this.formType = option.formType;
    } else {
      this.formType = 'form';
    }
    if (option.fill_batch_no) {
      this.fill_batch_no = option.fill_batch_no;
    }
    let questionData = option.questionData;
    if (questionData) {
      questionData = JSON.parse(decodeURIComponent(option.questionData));
    }
    if (questionData && questionData.fill_batch_no) {
      this.formType = 'detail';
      this.questionData = questionData;
      this.getQuestionnaireData(this.questionData);
    } else {
      if (option.status) {
        this.status = decodeURIComponent(option.status);
        console.log('status', this.status);
      }
      if (option.activity_no) {
        this.activity_no = option.activity_no;
        this.getQuestionnaireData();
      } else if (this.questionData.activity_no) {
        this.status = '已完成';
        this.activity_no = this.questionData.activity_no;
        this.getQuestionnaireData();
      } else {
        uni.showModal({
          title: '提示',
          content: '未知的问卷编号，即将跳转到问卷列表',
          showCancel: false,
          success(res) {
            if (res.confirm) {
              uni.reLaunch({
                url: '/pages/specific/home/home'
              });
            }
          }
        });
      }
    }
  },
  onShow() {},
  beforeDestroy() {
    clearInterval(this.timer);
  }
};
</script>

<style lang="scss" scoped>
.quiz-wrap {
  display: flex;
  flex-direction: column;
  height: 100vh;
  max-width: 1000px;
  margin: 0 auto;
  .quiz-top {
    // background-color: #333;
    display: flex;
    justify-content: center;
    height: 100upx;
    align-items: center;
  }
  .quiz-center {
    flex: 1;
    display: flex;
    flex-direction: column;
    .quiz-title {
      // background-color: #ffffff;
      line-height: 80upx;
      text-indent: 20upx;
      font-weight: 600;
      // letter-spacing: 1px;
    }
    .quiz-question {
      flex: 1;
      background-color: #fff;
      .quiz-question-title {
        margin: 10upx 0;
        padding: 10upx 20upx;
        background-color: #fff;
      }
    }
    .quiz-remark {
      width: 95%;
      height: auto;
      margin: 0 auto;
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
    }
    .start-button {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 300upx;
      .cu-btn {
        width: 300upx;
        background-color: #333;
        color: #eee;
      }
    }
  }
  .quiz-bottom {
    height: 80upx;
    display: flex;
    // background-color: #333;
    color: #eee;
    align-items: center;
    justify-content: space-around;
    padding: 0 100upx;
  }
}
</style>
