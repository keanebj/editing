import cropperUpload from '@/components/cropperUpload/index.vue'
export default {
  name: 'SourceMaterialEnter',
  components: {
    cropperUpload
  },
  data() {
    return {
      data: [],
      vievShow: true,
      isLoading: true,
      isSubmit: false,
      requestCount: 0,
      hasImg: true,
      videoItem: {
        select: ''
      },
      enterSelects: {

      },
      temptimer: null,
      labels:'',
      labelMaxCount: 5,
      isHideLabelClose: false,
      isHideLabel: true,
      titleContentCount: 0,
      titleMaxCount: 22,
      zhaiyaoMaxCount: 50,
      zhaiyaoContentCount: 0,
      zhaiyao: '',
      placelabel: "通过空格键区分标签最多5个",
      label: '',
      labelArr: [],
      select: 'politics',
      videoId: -1,
      formValidate: {
        videoname: '',
        title: '',
        summary: '',//摘要
        cover: '',
        keyword: '',
        materialtype: '',
        videoid: '',
        uploading: true
      },
      ruleValidate: {
        title: [
          { required: true, message: '标题不能为空', trigger: 'blur'}
        ],
        cover: [
          { required: true, message: '封面不能为空', trigger: 'blur'}
        ]
      },
      materialSize: 0,
      materialTime: '',
      stopUploading: true,
      uploadError: false,
      transcodeNotifyUrl: '',
      fileError: 0,
      routeLeave: false
    }
  },
  computed: {
    material:function () {
      return this.$store.getters.getMaterial
    }
  },
  watch: {
    material:function () {
    	if (this.material.code < 0 || this.material.code >6) {
    		this.material.percent = 0;
				this.uploadError = true;
				this.vievShow = false;
			}
      if (this.material.code >=2) {
        this.vievShow = false;
        if (this.uploading && this.stopUploading) {
        	qaVideo.uploader.startUpload();
        }
      }else{
        this.vievShow = true;
      }
      if (this.material.speed == undefined) {
      	this.material.speed = '计算中...'
      }
      if (this.material.code < 5) {
        this.material.percent = 0;
      }
      var size = parseInt(this.material.percent)*parseInt(this.material.size_text)/100
      this.materialSize = size.toFixed(2)+"MB";
      // var allsec = Math.round(((100-parseInt(this.material.percent))/100)*this.material.size/(parseInt(this.material.speed)*1000));
      var speed = 0;
        if(this.material.speed && this.material.speed.indexOf('MB/s') > -1){
            //MB
            speed=parseFloat(this.material.speed)*1024*1024;
        }else if(this.material.speed && this.material.speed.indexOf('KB/s') > -1){
            //KB
            speed=parseFloat(this.material.speed)*1024;
        }else{
            //B
            speed=this.material.speed;
        }
        let allsec=parseInt((this.material.size-this.material.size*this.material.percent/100)/speed);
      var minu = parseInt(allsec/60) >= 10 ? parseInt(allsec/60) : '0'+parseInt(allsec/60);
      var sec = allsec%60 >= 10 ? allsec%60 : '0'+allsec%60;
      if (this.material.speed == '计算中...') {
      	this.materialTime = '计算中...'
      }else{
      	this.materialTime = minu + ':' + sec
      }
      if (this.material.code == 6) {
      	var $ = qaVideo.get('$')
				if ($('.material_xx_con').find('.moxie-shim').length > 0) {
					$('.material_xx_con')[0].removeChild($('.material_xx_con').find('.moxie-shim')[0]);
					this.initUpload('picks', 'AKIDiJjz3vMbP1SgknteIk270g9QvMbjpXGo', 1, 1, null, null)
				}else{
					this.initUpload('picks', 'AKIDiJjz3vMbP1SgknteIk270g9QvMbjpXGo', 1, 1, null, null)
				}
      	
        this.formValidate.videoname = this.material.name;//视频名字
        // this.formValidate.videourl = '#'//视频地址
        this.formValidate.materialtype = this.formValidate.select;//视频类型
//      this.formValidate.duration = "0";// 视频时长
        this.formValidate.size = this.material.size_text;//视频大小
        this.formValidate.videoid = this.material.serverFileId;//视频id
//      this.$http.get('api/video/upload/' + this.formValidate.videoid).then(({data}) => {
//        if (data.status == 1) {
//          this.formValidate.videourl = data.info.basicinfo.sourceVideoUrl;
//        }else{
//          this.errorProcess(data)
//        }
//      }, (err) => {
//        this.$Notice.error({title:error.data.message,desc: false});
//      })
        this.material.percent = '100';
        
        this.$http.get('api/material/init/' + this.videoId,{
        		params: {
	          	fileid: this.material.serverFileId
        		}
        }).then((response) => {
        	if (response.data.status == 1) {
        		
        	}else{
        		this.$Notice.error({title:response.data.message,desc: false});
        	}
        }, ({error}) => {
        	this.$Notice.error({title:error.data.message,desc: false});
        })
      }
    }
  },
  mounted() {
    if (this.$route.query.id) {
    	this.initUpload('picks', 'AKIDiJjz3vMbP1SgknteIk270g9QvMbjpXGo', 1, 1, null, null)
      this.$http.get('/api/material/' + this.$route.query.id).then(({data}) => {
        this.vievShow = false;
        this.material.code = 6;
        this.material.percent = 100;
        this.material.name = data.material.videoname;
        this.formValidate = data.material
        this.zhaiyao = data.material.summary;
        this.select = data.material.materialtype;
        if (data.material.keyword == '') {
        	this.labelArr = []; 
        }else{
        	this.labelArr = data.material.keyword.split(" ");
        }
        this.videoId = data.material.id;
        this.hasImg = false;
        this.uploading = true;
        
        
//      var $ = qaVideo.get('$')
//				console.log($('.material_xx_con').find('.moxie-shim').length)
//				$('.material_xx_con')[0].removeChild($('.material_xx_con').find('.moxie-shim')[0]);
      }, (err) => {
        this.$Notice.error({title:error.data.message,desc: false});
      })
    }else {
    	this.initUpload('pick', 'AKIDiJjz3vMbP1SgknteIk270g9QvMbjpXGo', 1, 1, null, null)
    	this.$http.post('api/material').then((response) => {
	  		if (response.data.status == 1) {
	  			this.videoId = response.data.id;
	  		}else{
	  			this.$Notice.error({title:response.data.message,desc: false});
	  		}
	  	}, ({error}) => {
	  		this.$Notice.error({title:error.data.message,desc: false});
	  	})
    }
    
    
    if (this.vievShow) {
    	this.uploading = true;
    }
  }, 
  created() {
    if (this.material.code == 2) {
      qbVideo.uploader.startUpload();
      this.uploading = false;
      this.vievShow = false;
    }
    this.$http.get('/api/material/type').then(({data}) => {

      this.enterSelects = data.materialtypes;
    }, (err) => {
      this.$Notice.error({title:error.data.message,desc: false});
    })
    if (this.material.code == 2) {
      qbVideo.uploader.startUpload();
      this.uploading = false;
      this.vievShow = false;
    }
  },
  updated () {
    let keypadleft=this.$refs.keywordContainer.clientWidth;
    this.$refs.keywordInput.style.paddingLeft=keypadleft+'px';
    this.placelabel=keypadleft>10?'':'每个关键字最多5个字';
  },
  beforeDestory () {
  	
  },
  methods: {
  	cancleSave () {
  		this.routeLeave = true;
  		this.$router.push('/manage/material')
  	},
    onSave () {
//    this.$Modal.confirm({
//      title: '确认保存',
//      content: '保存此视频到素材管理？',
//      onOk: () => {
        	if (this.material.code > 5) {
        		this.routeLeave = true;
        		this.saveMaterial();
        	}else{
        		this.$Notice.error({
        			title:'视频上传完成才能保存！',
        			desc: false
        		});
        	}
//      }
//    })
    },
    saveMaterial: function () {
      this.formValidate.summary = this.zhaiyao;//摘要
      this.formValidate.keyword = this.labelArr.join(" ");//标签
      this.formValidate.materialtype = this.select;
      if (this.formValidate.title == '') {
        this.ruleValidate.title[0].required = true
      }
//    if (this.videoId > -1) {
        this.$http.put('api/material/'+ this.videoId, this.formValidate).then((response) => {
          if (response.data.status == 1) {
          	this.routeLeave = true;
            this.$Notice.success({title:'保存成功',desc: false});
            this.$router.push('/manage/material')
          }else{
            this.$Notice.error({title:response.data.message,desc: false});
          }
        })
//    }else{
//      this.$http.post('api/material', this.formValidate).then((response) => {
//        if (response.data.status == 1) {
//          this.$Notice.success({title:'保存成功',desc: false});
//          this.$router.push('/manage/material')
//        }else{
//          this.$Notice.error({title:response.data.message,desc: false});
//        }
//        this.videoId = response.data.id;
//      }, (response) => {
//        this.$Notice.error({title:error.data.message,desc: false});
//      })
//    }
    },
    closeLabel: function (index) {
      this.labelArr.splice(index,1);
      let This=this;
      this.temptimer=setTimeout(function(){
        let padleft=This.$refs.keywordContainer.clientWidth;
        This.$refs.keywordInput.style.paddingLeft=padleft+'px';
      },200);
      if (!this.labels && this.labelArr == 0){
        this.placelabel = '通过空格键区分标签最多5个';
      }else{
        this.placelabel = '';
      }
    },
    deleteLabel:function () {
      if (!this.labels) {
        this.labelArr.pop();
      }
    },
    labelBlur: function () {
      if (this.labelArr.length == 0 && this.$refs.keywordInput.value != '' && this.labels.Trim()) {
        this.labelArr.push(this.labels.Trim());
        this.labels='';
        let This=this;
        this.temptimer=setTimeout(function(){
          let padleft=This.$refs.keywordContainer.clientWidth;
          This.$refs.keywordInput.style.paddingLeft=padleft+'px';
        },200);
        this.isHideLabel=true;
      }else {
        this.labels = '';
        if (!this.isRepeat(this.labelArr)) {
          this.isHideLabel=true;
        }
      }
    },
    checkLabelCount: function (ev) {
      if (!this.labels && this.labelArr == 0){
        this.placelabel = '通过空格键区分标签最多5个';
      }else{
        this.placelabel = '';
      }
      let count=Math.ceil(this.gblen(this.labels,10,'labels'))
      let reg=/[^\s]\s+$/;
      if (reg.test(this.labels) && ev.keyCode==32 || (count==5 && ev.keyCode==32 && this.labels.Trim())) {
        if (this.isRepeat(this.labelArr,this.labels.Trim())) {
          if(this.labelArr.length < 5 ) {
            this.isHideLabel = false;
          }
        }else{
          if (this.labelArr.length >=5) {
            return;
          }
          this.labelArr.push(this.labels.Trim());
          this.labels = '';
          let This = this;
          this.temptimer = setTimeout(function () {
            let padleft=This.$refs.keywordContainer.clientWidth;
            This.$refs.keywordInput.style.paddingLeft=padleft+'px';
          },200)
          this.isHideLabel = true;
        }
      }
    },
    isRepeat:function (arr,item) {
      for(let i=0;i<arr.length;i++){
        if(arr[i] == item){
          return true;
        }
      }
      return false;
    },
    getTitleContent:function(){
      //需要转换为字符
      let count=this.gblen(this.formValidate.title,44,'title');
      this.titleContentCount=Math.ceil(count)>22 ? 22:Math.ceil(count);
    },
    getSummaryContent: function () {
      //需要转换为字符
      let count=this.gblen(this.zhaiyao,100,'zhaiyao');
      this.zhaiyaoContentCount=Math.ceil(count)>50 ? 50:Math.ceil(count);
    },
    gblen: function (str,max,name) {
      var len = 0;
      if (name == 'title') {
        this.titleMaxCount=22;
      }else if (name == 'zhaiyao') {
        this.zhaiyaoMaxCount = 50;
      }else{
        this.labelMaxCount = 5;
      }
      for (let i=0; i<str.length; i++) {
        if (str.charCodeAt(i)>127 || str.charCodeAt(i)==94) {
          len ++;
        } else {
          if (name == "title") {
            this.titleMaxCount+=0.5;
            if(this.titleMaxCount > max){
              this.titleMaxCount=max;
            }
          } else if (name == 'zhaiyao') {
            this.zhaiyaoMaxCount+=0.5;
            if(this.zhaiyaoMaxCount > max){
              this.zhaiyaoMaxCount=max;
            }
          }else{
            this.labelMaxCount += 0.5;
            if (this.labelMaxCount > max) {
              this.labelMaxCount = max;
            }
          }
          len += 0.5;
        }
      }
      return len
    },
    onError(error, fileid, ki) {
      this.$Notice.error({
        title: '错误',
        desc: error.message || '图片上传错误！'
      })
    },
    onSuccess(response, fileid, ki) {
      if (response.path) {
        this.formValidate.cover = response.path;
        this.hasImg = false;
      }
    },
    cancaleUpload () {
    	this.stopUploading = false;
			qaVideo.uploader.stopUpload();
			
			
			
      this.cancaleUploadInfo();
    },
    cancaleUploadInfo () {
      this.$Modal.confirm({
        title: '确认取消上传',
        content: '<p>现在上传的视频将被删除，确定取消上传</p>',
        onOk: () => {
        	qaVideo.uploader.deleteFile(this.material.id);
        	this.stopUploading = true;
        	this.material.code = 0;
          this.vievShow = true;	
          var $ = qaVideo.get('$')
					if ($('.material_xx_cons').find('.moxie-shim').length > 0) {
						$('.material_xx_cons')[0].removeChild($('.material_xx_cons').find('.moxie-shim')[0]);
						this.initUpload('pick', 'AKIDiJjz3vMbP1SgknteIk270g9QvMbjpXGo', 1, 1, null, null)
					}else{
						this.initUpload('pick', 'AKIDiJjz3vMbP1SgknteIk270g9QvMbjpXGo', 1, 1, null, null)
					}
        },
        onCancel: () => {
        	qaVideo.uploader.reUpload();
        }
      });
    },
    reUpload () {
//			this.$http.put('api/video/upload/' + this.videoId).then((response) => {
//				if (response.data.status == 1) {
//					this.videoId = response.data.id;
//				}else{
//					this.$Notice.error({title:response.data.message,desc: false});
//				}
//			}, (response) => {
//				this.$Notice.error({title:response.data.message,desc: false});
//			})
    },
    initUpload (upBtnId, secretId, isTranscode, isWatermark, transcodeNotifyUrl, classId) {
      var $ = qaVideo.get('$');
      var Version = qaVideo.get('Version');
      if (!qaVideo.uploader.supportBrowser()) {
          if (Version.IS_MOBILE) {
              alert('当前浏览器不支持上传，请升级系统版本或者下载最新的chrome浏览器');
          } else {
              alert('当前浏览器不支持上传，请升级浏览器或者下载最新的chrome浏览器');
          }
          return;
      }
      this.accountDone(upBtnId, secretId, isTranscode, isWatermark, transcodeNotifyUrl, classId)
      // this.accountDone('pickfiles111', 'AKIDiJjz3vMbP1SgknteIk270g9QvMbjpXGo', 1, 1,null, null)
    },
    accountDone(upBtnId, secretId, isTranscode, isWatermark, transcodeNotifyUrl, classId) {
//				alert(upBtnId)
          var self = this;
      var $ = qaVideo.get('$'),
          ErrorCode = qaVideo.get('ErrorCode'),
          Log = qaVideo.get('Log'),
          JSON = qaVideo.get('JSON'),
          util = qaVideo.get('util'),
          Code = qaVideo.get('Code'),
          Version = qaVideo.get('Version');

//        console.log($('#picks'))
      //您的secretKey
      var secret_key =  'UmsnV4Sgw65rRE0e6OUTGtK3viKky4yh';
      var secret_id = secretId;
      qaVideo.uploader.init(
          //1: 上传基础条件
          {
              web_upload_url: location.protocol + '//vod2.qcloud.com/v3/index.php',

              /*
                  @desc 从服务端获取签名的函数。该函数包含两个参数：
                  argObj: 待上传文件的信息，关键信息包括：
                      f: 视频文件名(可从getSignature的argObj中获取)，
                      ft: 视频文件的类型(可从getSignature的argObj中获取)，
                      fs: 视频文件的sha1值(必须从getSignature的argObj中获取)
                  callback：客户端从自己的服务端得到签名之后，调用该函数将签名传递给SDK
              */
              getSignature: function (argObj, callback) {
                  argObj['s'] = secret_id
                  argObj['uid'] = '必填'
                  var argStr = []
                  for (var a in argObj)
                      argStr.push(a + '=' + encodeURIComponent(argObj[a]));
                  argStr = argStr.join('&')
                  var sha = CryptoJS.HmacSHA1(argStr, secret_key)
                  sha.concat(CryptoJS.enc.Utf8.parse(argStr))
                  callback(CryptoJS.enc.Base64.stringify(sha));
              },

              upBtnId: upBtnId, //上传按钮ID（任意页面元素ID）
              isTranscode: isTranscode, //是否转码
              isWatermark: isWatermark, //是否设置水印
              after_sha_start_upload: false,//sha计算完成后，开始上传 (默认关闭立即上传)
              sha1js_path: '/static/upload/calculator_worker_sha1.js', //计算sha1的位置
              // sha1js_path: "./calculator_worker_sha1.js",
              disable_multi_selection: false, //禁用多选 ，默认为false

              transcodeNotifyUrl: transcodeNotifyUrl, //(转码成功后的回调地址)isTranscode==true,时开启； 回调url的返回数据格式参考  https://www.qcloud.com/document/product/266/1407
              classId: classId,
              // mime_types, 默认是常用的视频和音频文件扩展名，如MP4, MKV, MP3等, video_only 默认为false，可允许音频文件上传
              filters: {
                  max_file_size: '8gb',
                  mime_types: [],
                  video_only: true
              },
              forceH5Worker: true // 使用HTML5 webworker计算
          }
          //2: 回调
          , {

              /**
               * 更新文件状态和进度
               * @param args { id: 文件ID, size: 文件大小, name: 文件名称, status: 状态, percent: 进度 speed: 速度, errorCode: 错误码,serverFileId: 后端文件ID }
               */
              onFileUpdate: function (args) {
                  if (args.code == Code.SHA_FAILED)
                      return alert('该浏览器无法计算SHA')
                  self.$store.dispatch('setMaterial',args);
              },

              /**
               * 文件状态发生变化
               * @param info  { done: 完成数量 , fail: 失败数量 , sha: 计算SHA或者等待计算SHA中的数量 , wait: 等待上传数量 , uploading: 上传中的数量 }
               */
              onFileStatus: function (info) {
                  // $('#count').text('各状态总数-->' + JSON.stringify(info));

              },

              /**
               *  上传时错误文件过滤提示
               * @param args {code:{-1: 文件类型异常,-2: 文件名异常} , message: 错误原因 ， solution: 解决方法}
               */
              onFilterError: function (args) {
              	
                  // var msg = 'message:' + args.message + (args.solution ? (';solution==' + args.solution) :
                  //     '');
                  // $('#error').html(msg);
//                console.log(args)
								self.fileError += 1;
								if (self.fileError%2 == 0) {
									self.$Notice.error({
						        title: args.message,
						        desc: false
						      }) 
								}
              }
          }
      );
    },
    errorProcess(resData) {
      let status = resData.status
      switch (status) {
        case 100:
          this.$router.push('/login')
          break;
        case 300:
          this.$Notice.error({
            title: '错误',
            desc: '参数错误'
          })
          break;
        case 400:
          this.$Notice.error({
            title: '错误',
            desc: '远程链接错误'
          })
          break;
        case 500:
          this.$Notice.error({
            title: '错误',
            desc: '数据库执行错误'
          })
          break;
        case 600:
          this.$Notice.error({
            title: '错误',
            desc: '操作正在执行'
          })
          break;
        default:
          this.$Notice.error({
            title: '错误',
            desc: resData.message
          })
      }
    }
  },
  beforeRouteLeave (to, from, next) {
  	if (!this.routeLeave) {
  		this.formValidate.summary = this.zhaiyao;//摘要
      this.formValidate.keyword = this.labelArr.join(" ");//标签
      this.formValidate.materialtype = this.select;
      if (this.formValidate.title == '') {
        this.ruleValidate.title[0].required = true
      }
			this.$Modal.confirm({
		    title: '确认保存',
		    content: '保存此视频到素材管理？',
		    onOk: () => {
		    	if (this.material.code > 5) {
		    		next(true)
			    	this.$http.put('api/material/'+ this.videoId, this.formValidate).then((response) => {
			    		
		          if (response.data.status == 1) {
		          	
		            this.$Notice.success({title:'保存成功',desc: false});
		            this.$router.push('/manage/material')
		          }else{
		          	next(false);
		            this.$Notice.error({title:response.data.message,desc: false});
		          }
		        })
		    	}else{
		    		this.routeLeave = false;
		    		this.$Notice.error({
		    			title:'视频上传完成才能保存！',
		    			desc: false
		    		});
		    		next(false)
		    	}
		    },
		    onCancel : () =>  {
					next(true);
		    }
		  })
  	}else{
  		next(true)
//		this.$Notice.error({
//				title:'请填写对应的视频信息！',
//				desc: false
//			});
  	}
	}
}


String.prototype.Trim = function()
{
  return this.replace(/(^\s*)|(\s*$)/g, "");
}
