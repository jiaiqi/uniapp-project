<template>
  <view class="file-upload">
    <!-- <view ref="input" class="input"></view> -->
	<view id="text" @click="chooseFile" class="file-item">
		<view class="file-item-left">
			<image src="/static/word.png" mode=""></image>
		</view>
		<view class="file-item-center">
			<view class="file-item-cen-t">
				选择本地文档
			</view>
			<view class="file-item-cen-b">
				点击选择本地文档
			</view>
		</view>
		<view class="file-item-right">
			<text class="lg text-gray" :class="'cuIcon-right'"></text>
		</view>
	</view>
    <!-- <view id="text" class="addNew" @click="chooseFile" v-if="fileResList.length<1"><text class="cuIcon-add"></text></view> -->
    <!-- <view class=""><text ref="fileTip" id="fileTip"></text></view> -->
    <!-- <view class="file-list">
      <view class="file-list-item" v-for="(item,index) in fileResList" :key="index">
        <view class="file-info" v-if="item.src_name">
          {{item.src_name}}
        </view>
      </view>
    </view> -->
  </view>
</template>

<script>
import ajax from '@/common/ajax.js';
import Emitter from '@/common/mixins/emitter.js';
export default {
  data() {
    return {
      fileList: [],
      fileInfo:{},
      fileResList:[],
	  currentUserInfo:uni.getStorageSync('login_user_info'),
	  doctor_no:'',
	  userno:''
    };
  },
  props: {
    srvInfo: {
      type: Object,
      default: () => {}
    }
  },
  mixins: [Emitter],
  onLoad(option) {
		if(option.doctor_no){
		  this.doctor_no = option.doctor_no
		}
		if(option.userno){
		 this.userno = option.userno
		}
  	console.log("option----->",option)
  },
  mounted() {
	  // #ifdef H5
	  if(this.$route.query.doctor_no){
		  this.doctor_no = 	this.$route.query.doctor_no
	  }
	  if(this.$route.query.userno){
	   this.userno = this.$route.query.userno
	  }
	  // #endif
	
	  // this.test()
	  // if(document.getElementById("text").click){
	  // }else{
		  
	  // }
  },
  methods: {
	 test(){
		 console.log("-------------")
		this.$nextTick(()=>{
		  setTimeout(()=>{
			  if(document.getElementById("text").click){
				  document.getElementById("text").click()
			  }else{
				  this.test()
			  }
		  },100)
		}) 
	 },
    chooseFile() {
      const self = this;
      let fileTip = document.getElementById('fileTip');
      var input = document.createElement('input');
      input.style = 'display:none';
      input.type = 'file';
      input.onchange = event => {
        self.fileChange(event);

        // const files = event.target.files
        // if (files && files[0]) {
        //   const file = files[0];
        //   if (file.size > 1024 * 1024 * 10) {
        //     fileTip.innerHTML = '文件大小不能超过10M!';
        //     input.value = '';
        //     return false;
        //   } else {
        //     fileTip.innerHTML = '';
        //     console.log(file)
        //     formData.append('file', file);
        //   }
        // }
      };
      input.click();
      // this.$refs.input.$el.appendChild(input);
    },
    fileChange(event) {
      const self = this;
      let formData = new FormData();
      const files = event.target.files;
      if (files && files[0]) {
        const file = files[0];
        self.fileList.push(file);
        if (file.size > 1024 * 1024 * 10) {
          // fileTip.innerHTML = '文件大小不能超过10M!';
          input.value = '';
          return false;
        } else {
          // fileTip.innerHTML = '';
          // formData.append('file', file);
          // formData.append('bx_auth_ticket', uni.getStorageSync('bx_auth_ticket'));
          // formData.append('serviceName', 'srv_bxfile_service');
          // formData.append('interfaceName', 'add');
          // formData.append('app_no', uni.getStorageSync('activeApp'));
          ajax({
            headers: {
              bx_auth_ticket: uni.getStorageSync('bx_auth_ticket')
            },
            withCredentials: false,
            file: file,
            data: {
              bx_auth_ticket: uni.getStorageSync('bx_auth_ticket'),
              serviceName: 'srv_bxfile_service',
              interfaceName: 'add',
              app_no: 'health'
			  
            },
            filename: 'file',
            action: self.$api.upload,
            onProgress: e => {
              // self.handleProgress(e, file);
            },
            onSuccess: res => {
              // self.handleSuccess(res, file);
			self.sendMessageLanguageInfo(res.file_no)
			  console.log("上传成功",res)
            },
            onError: (err, response) => {
              // self.handleError(err, response, file);
            }
          });
          // var xhr = new XMLHttpRequest();
          // xhr.open('POST', self.$api.upload, true);
          // xhr.setRequestHeader('bx_auth_ticket', uni.getStorageSync('bx_auth_ticket'));
          // xhr.onreadystatechange = function() {
          //   console.log(xhr.responseText)
          //   if (xhr.readyState == 4) {
          //     if (xhr.status == 200 || xhr.status == 304) {
          //       console.log(xhr.responseText)
          //       return xhr.responseText
          //     }
          //   }
          // };
          // xhr.send(formData);
          // return xhr
        }
      }
    },
	/*点击发送后添加图片或语音数据**/
	async sendMessageLanguageInfo(value){
		let url = this.getServiceUrl('health', 'srvhealth_consultation_chat_record_add', 'operate');
		let req = [{
			serviceName: 'srvhealth_consultation_chat_record_add',
			colNames: ['*'],
			data:[{
				sender_account:this.currentUserInfo.user_no,
				receiver_account:this.doctor_no?this.doctor_no:this.userno,
				msg_content_type:"文件",
				attachment:value
			}]
		}];		
		// req[0].data[0].attachment = value		
		console.log("res========>",req)
		let res = await this.$http.post(url, req);
		// if(res.data.state === 'SUCCESS'){
			
			console.log("发送成功",res)
			// this.getMessageInfo()
			// uni.redirectTo({
			//     url: ''
			// });
			setTimeout(()=>{
				// uni.redirectTo({
				//     url: ''
				// });
				// uni.navigateBack({
				// 	delta:0
				// })
			},1000)
			
			
		// }
	},
	
    getFile(file) {
      const fileList = this.fileList;
      let target;
      fileList.every(item => {
        target = file.uid === item.uid ? item : null;
        return !target;
      });
      return target;
    },
    handleProgress(e, file) {
      const _file = this.getFile(file);
      this.onProgress(e, _file, this.fileList);
      _file.percentage = e.percent || 0;
    },
    handleSuccess(res, file) {
      const _file = this.getFile(file);
      // this.fileList.push(_file)
      if (_file) {
        _file.status = 'finished';
        _file.response = res;
        // this.fileResList.push(res)
        this.$set(this.fileResList,0,res)
        this.fileInfo = res
        this.$emit('add',_file)
        // this.onSuccess(res, _file, this.fileList);
        // this.dispatch('FormItem', 'on-form-change', _file);
        // setTimeout(() => {
        //   _file.showProgress = false;
        // }, 1000);
      }
    },
    handleError(err, response, file) {
      const _file = this.getFile(file);
      const fileList = this.fileList;
      _file.status = 'fail';
      fileList.splice(fileList.indexOf(_file), 1);
      this.onError(err, response, file);
    },
    handleRemove(file) {
      const fileList = this.fileList;
      fileList.splice(fileList.indexOf(file), 1);
      this.onRemove(file, fileList);
    },
    handlePreview(file) {
      if (file.status === 'finished') {
        this.onPreview(file);
      }
    }
  }
};
</script>

<style scoped lang="scss">
.file-upload {
  .addNew {
    width: 125upx;
    height: 150upx;
    border: 1px solid #ccc;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 20upx;
    margin-right: 12rpx;
  }
}
.file-item{
	display: flex;
	width: 95%;
	margin: 20rpx auto;
	background-color: white;
	padding: 40rpx 10rpx;
	justify-content: end;
	align-items: center;
	box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
	border-radius: 10px;
	.file-item-center{
		width: 75%;
		.file-item-cen-t{
			font-size: 36rpx;
			margin-bottom: 15px;
			font-weight: 600;
		}
	}
	.file-item-left{
		margin-right: 30rpx;
		margin-left: 30rpx;
		image{
			width: 50rpx;
			height: 50rpx;
		}
	}
	.file-item-right{
		font-size: 36rpx;
		// margin-left: 50%;
	}
}
</style>
