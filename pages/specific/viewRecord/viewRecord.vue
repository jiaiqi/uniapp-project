<template>
  <view>
    <view class="search-bar">
      <view class="cu-bar search bg-white fixed">
        <view class="search-form round">
          <text class="cuIcon-search"></text>
          <input @focus="searchBarFocus" @blur="serachBarBlur" :adjust-position="false" type="text" v-model="searchVal" :placeholder="placeholder" confirm-type="search" />
        </view>
        <view class="action"><button class="cu-btn bg-blue shadow-blur round" @click="toSearch">搜索</button></view>
      </view>
      <view style="height: 100upx;width: 100%;">占位</view>
    </view>
    <bx-list
      ref="bxList"
      :serviceName="serviceName"
      :condition="condition"
      :searchWords="searchVal"
      :pageType="pageType"
      :viewTemp="viewTemp"
      searchColumn="user_no"
      :fixed="true"
      :top="0"
      :listConfig="listConfig"
      :rownumber="5"
      @click-list-item="clickItem"
    ></bx-list>
  </view>
</template>

<script>
import bxList from '@/components/bx-list/bx-list.vue';
export default {
  components: { bxList },
  data() {
    return {
      activity_no: '',
      serviceName: '',
      listData: [],
      searchVal:'',
      placeholder:'输入搜索关键词',
      listConfig: {},
      viewTemp: {
        title: 'user_no',
        tip: 'user_type',
        // img: 'img',
        // price: 'current_price',
        footer: 'create_time'
      },
      condition: [],
      page: { total: 0, pageNo: 1, rownumber: 5 },
      pageType: 'list'
    };
  },
  methods: {
    clickItem(e) {
      console.log('questionData', e);
      if (e.fill_batch_no) {
        uni.navigateTo({
          url: '/pages/specific/questionnaire/questionnaire?questionData=' + encodeURIComponent(JSON.stringify(e))
        });
      }
    },
    async getListData() {
      let serviceName = this.serviceName;
      let url = this.getServiceUrl('daq', serviceName, 'select');
      let req = { serviceName: serviceName, colNames: ['*'], condition: [{ colName: 'activity_no', ruleType: 'eq', value: this.activity_no }] };
      let res = await this.$http.post(url, req);
      if (res.data.state === 'SUCCESS') {
        this.listData = res.data.data;
        this.page.total = res.data.page.total;
        this.page.pageNo = res.data.page.pageNo;
      }
    },
    async getListV2() {
      let colVs = await this.getServiceV2(this.serviceName, 'list', 'list', 'daq');
      colVs.srv_cols = colVs.srv_cols.filter(item => item.in_list === 1);
      console.log('colVs', colVs);
      this.listConfig = colVs;
      return colVs;
    },
    searchBarFocus(e) {
      console.log('searchBarFocus:', e);
    },
    serachBarBlur(e) {
      console.log('serachBarBlur:', e);
    },
    toSearch() {
      let keywords = this.searchVal;
      this.$refs.bxList.toSearch();
    },
  },
  onLoad(option) {
    if (option.activity_no) {
      this.activity_no = option.activity_no;
      if (option.record_type === 'view') {
        this.serviceName = 'srvdaq_record_view_select';
      } else if (option.record_type === 'feedback') {
        this.serviceName = 'srvdaq_record_reply_select';
      }
      this.condition = [{ colName: 'activity_no', ruleType: 'eq', value: this.activity_no }];
      this.getListV2();
    } else {
      uni.showModal({
        title: '提示',
        content: '未知的问卷编号，点击返回首页',
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
};
</script>

<style lang="scss"></style>
