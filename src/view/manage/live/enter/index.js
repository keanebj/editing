import QRCode from 'qrcode'
import CropperUpload from '@/components/cropperUpload/index.vue'
import EditDiv from '@/components/editDiv.vue'
import Vue from 'vue'
Vue.use(QRCode)
export default {
	name: '',
	data () {
    const validateCoverfiles = (rule, value, callback) => {
      if (value === []) {
        callback(new Error('请添加图片'));
      } else {
        callback();
      }
		};
    const validateLiveTime = (rule, value, callback) => {
			// console.log('value: '+value)
      if (value === []) {
        callback(new Error('请添加直播时间'));
      } else {
        callback();
      }
		};
		
		return {
      		isEdit:false,
			isLivePlayer: false,
			isMudu:false,
			QCLIVEPLAY: null,
			
			titleContentCount: 0,
			titleMaxCount: 22,
			introductionMaxCount: 500,
			introductionContentCount: 0,
			liveMaxCount: 600,
			liveContentCount: 0,

			pageSize: 200, //每页的个数
			pageIndexByLive: 1, //列表当前页

			isHideAddColumn:true,
			cataloginfoList: [],//栏目列表
			datalistByAside: [],//右侧图文直播列表

			formLiveVideo:{
				id: '',
				roomId: '',//create
				pushurl: '',
				palyUrl_rtm: '',
				palyUrl_flv: '',
				palyUrl_hls: '',
				
				pullUrl_rtm: '',
				pullUrl_flv: '',
				pullUrl_hls: '',

				modelLiveFlow:'',
				liveFlowInput:'',
				title:'',//create
				introduction: '',//create
				coverImage:[
					{
						path:'assets/images/live/live.svg'
					}
				],
				catalog:[],//create
				comment:false,//create
				playBack:false,
				daterange:[],
				timerange:[],

				adduser: '',
				addtime: '',
				modifyuser: '',
				modifytime: ''
			},

			ruleLiveVideo:{
				modelLiveFlow: [
					{required: true, type: 'string', message: '直播流类型不能为空', trigger: 'change'}
				],
        // modelLiveFlowInput:[
				// 	{required: false, type: 'string', message: '直播流地址不能为空', trigger: 'blur'}
				// ],
				title:[
					{required: true, type: 'string', message: '标题不能为空', trigger: 'blur'}
				],
				introduction: [
					{required: false, type: 'string', message: '简介不能为空', trigger: 'blur'}
				],
				coverImage: [
					{required: false, type: 'array', message: '封面不能为空', trigger: 'change'},
          { validator: validateCoverfiles }
				],
				// catalog: [
				// 	{required: true, message: '栏目不能为空', trigger: 'change'}
				// ],
				// comment: [
				// 	{required: false, message: '评论不能为空', trigger: 'change'}
				// ],
				// playBack: [
				// 	{required: false, type: 'string', message: '直播回放不能为空', trigger: 'change'}
				// ],
				daterange: [
					{required: true, type: 'array', message: '直播时间不能为空', trigger: 'change'},
          { validator: validateLiveTime }
				],
				timerange: [
					{required: true, type: 'array', message: '直播时间不能为空', trigger: 'change'},
          { validator: validateLiveTime }
				]
			},

			formSend: {
				picturepath: '',
				textcon: ''
			},

			visible1: false,
			visible2: false
			// catalogSeletedArr:[]
			
		}
	},
  components: {
		'cropper-upload': CropperUpload,
		'edit-div': EditDiv
  },
	created () {
		this.getDataArrayCatalog()
		
		this.isEdit = false
    // console.log('queryId: ' + this.$route.query.id);
    if(this.$route.query.id){
      this.isEdit = true
      this.getLiveDataById(this.$route.query.id);
		}else{
			// this.videoLiveInit()
		}
		
	},
	mounted () {
	},
  computed:{

    catalogSeletedArr:{
	    get: function(){
	      let _seleted = this.formLiveVideo.catalog;
				let _arr = [];
				if (_seleted) {
					for (let i=0;i<_seleted.length;i++){
						_arr.push(_seleted[i].name)
					}
				}
	      return _arr.join()
	    },
	    set:function(){}
	},
	catalogSeletedId:{
	    get: function(){
	      let _seleted = this.formLiveVideo.catalog;
	      let _arr = [];
				if (_seleted) {
					for (let i=0;i<_seleted.length;i++){
						_arr.push(parseInt(_seleted[i].id))
					}
				}
	      return _arr
	    },
	    set: function(){}
	}

  },
	destroyed () {
		if (typeof this.QCLIVEPLAY != undefined) {
			this.QCLIVEPLAY=null;
			$("#id_live_container").html('');
		}
		this.videoLiveByoperateState(0)
	},
	methods: {
		togglePlayer(){
			this.isLivePlayer = !this.isLivePlayer
			if(this.isLivePlayer){
				var vw=$('.liveColMain').width();
				$('.g_video_layout').width(vw);
				$('.g_video_container').width(vw);
				$('.g_video_container').height(vw*9/16);

				if (this.isMudu) {
					return
				}
				// console.log('vw: '+vw)
				// console.log('vw*9/16: '+(vw*9/16))

				this.createLivePlayer(this.rtmpRegExp(this.formLiveVideo.liveFlowInput))
			}else{
				if (typeof this.QCLIVEPLAY != undefined) {
					this.QCLIVEPLAY=null;
					$("#id_live_container").html('');
				}
			}
		},
		goBack () {
			this.$router.push('/manage/live');
      // this.$router.go(-1);
		},
		pushpullChange(data){
			if (data === 'push') {
				console.log('pushpullChange: push')
				if(this.$route.query.id){
					return
				}else{
					if (this.formLiveVideo.pushurl==='') {
						this.videoLiveInit()
					}
				}
			} else if(data === 'pull'){
				console.log('pushpullChange: pull')
				// this.videoLiveByoperateState(0)
			}
		},
		liveInputChange(){
			// console.log('liveInputChange: '+ JSON.stringify(data))
			let _str = this.formLiveVideo.liveFlowInput
			if (_str.indexOf('mudu')>-1) {
				this.isMudu=true
			}else{
				this.isMudu=false
			}
				
			this.formLiveVideo.pullUrl_rtm = _str
			this.formLiveVideo.pullUrl_flv = _str + ".flv"
			this.formLiveVideo.pullUrl_hls = _str + ".m3u8"
		},
		checkSelectd(data) {
			// console.log('checkSelectd1: '+data)
			var _list = this.cataloginfoList
			this.formLiveVideo.catalog = []
			for (let i = 0; i < data.length; i++) {
				for (let j = 0; j < _list.length; j++) {
					if (data[i] === _list[j].id) {
						this.formLiveVideo.catalog.push(_list[j]);
					}
				}
			}
			// console.log('checkSelectd2: '+JSON.stringify(this.formLiveVideo.catalog))
		},
		getDataArrayCatalog (){
      // 获取栏目信息接口
      // http://domain/webapp/api/catalog/get/{_id}
      this.$http.get("/api/catalog", {
      }).then((response) => {
        // console.log(response);
        if (response.data.status == 1) {
          this.cataloginfoList = response.data.catalogs

        } else {
          // this.$Notice.error({
          //   title: '错误',
          //   desc: response.data.message || '数据列表请求错误'
          // })
          this.errorProcess(response.data)
        }
      },(error)=>{
        console.log(error);
      })

		},

		// 获取信息ById
		getLiveDataById(id){
			// 获取视频直播接口（api/videoLive/get）
			// http://domain/webapp/api/videoLive/{id}
			
      this.$http.get("/api/videoLive/"+id,{
      }).then((response) => {
        // console.log('getDataArrayList:'+response);
        if (response.data.status == 1) {
					var _response = response.data.zpVideoLive
					// this.formLiveVideo = _response

					this.formLiveVideo.id = _response.id
					this.formLiveVideo.title = _response.title
					this.formLiveVideo.roomId = _response.roomid
					if (this.formLiveVideo.roomId) {
						this.formLiveVideo.modelLiveFlow='push'
					}else{
						this.formLiveVideo.modelLiveFlow='pull'
					}
					this.formLiveVideo.pushurl = _response.pushurl
					this.formLiveVideo.palyUrl_rtm = this.formLiveVideo.liveFlowInput = _response.pullurlrtm
					this.formLiveVideo.palyUrl_flv = _response.pullurlflv
					this.formLiveVideo.palyUrl_hls = _response.pullurlhls

					this.formLiveVideo.introduction = _response.introduction
					this.formLiveVideo.coverImage[0].path = _response.coverimage
					this.formLiveVideo.catalog = JSON.parse(_response.catalog)
					this.formLiveVideo.comment = _response.commentstate=="1"?false:true
					// this.formLiveVideo.playBack = _response.playBack

					let _beginrange = _response.begin.split(" ")
					let _endrange = _response.end.split(" ")
					this.formLiveVideo.daterange = [_beginrange[0],_endrange[0]]
					this.formLiveVideo.timerange = [_beginrange[1],_endrange[1]]

					this.formLiveVideo.adduser = _response.adduser
					this.formLiveVideo.addtime = _response.addtime
					this.formLiveVideo.modifyuser = _response.modifyuser
					this.formLiveVideo.modifytime = _response.modifytime
					
					this.liveFlowInput = _response.pullurlrtm

					this.getTitleContent ()
					this.getintroductionContent ()

					// 允许推流
					this.videoLiveByoperateState(1)

					this.getDatalistByAside()

        } else {
          this.$Notice.error({
            title: '错误',
            desc: response.data.message || '数据列表请求错误'
          })
          // this.errorProcess(response.data)
        }
      },(error)=>{
        console.log(error);
			})
			
		},

		//分享直播
		shareUrl (url) {
			this.qCode = true;
			// this.videourl = url;
			// console.log('shareUrl: '+ url)

			//二维码
			var canvas = document.getElementById('videoShareUrl');
				QRCode.toCanvas(canvas, url, function (error) {
					if (error) console.error(error)
					// console.log('success!');
			})
		},
		createLivePlayer(_date){
			
			if (typeof this.QCLIVEPLAY != undefined) {
				this.QCLIVEPLAY=null;
				$("#id_live_container").html('');
			}
			/**
				* 视频类型播放优先级
				* mobile ：m3u8>mp4
				* PC ：RTMP>flv>m3u8>mp4
				*/
			var options = {
		
				rtmp: 'rtmp://'+_date,
				rtmp_sd: 'rtmp://'+_date+'_550',
				rtmp_hd: 'rtmp://'+_date+'_900',
				
				m3u8: 'https://'+_date+'.m3u8',
				m3u8_sd: 'https://'+_date+'_550.m3u8',
				m3u8_hd: 'https://'+_date+'_900.m3u8',
				
				flv: 'https://'+_date+'.flv',
				flv_sd: 'https://'+_date+'_550.flv',
				flv_hd: 'https://'+_date+'_900.flv',
		
				autoplay : true,//iOS下safari浏览器是不开放这个能力的
				// coverpic : "http://www.test.com/myimage.jpg",
				width :  '100%',//视频的显示宽度，请尽量使用视频分辨率宽度
				height : '100%',//视频的显示高度，请尽量使用视频分辨率高度
				// controls : 'none',
				// x5_type : 'h5',
				wording: {
					4: '直播还未开始，请耐心等待',//移动端
					1002: '直播还未开始，请耐心等待',//pc端
					2032: '请求视频失败，请检查网络',
					2048: '请求m3u8文件失败，可能是网络错误或者跨域问题'
				},
				listener: function (msg) {
					// console.log('listener',msg);
					// if(msg.type == 'error'){
					//   $("#id_live_container").hide();
					//   videoPlayerFn("14651978969511695551");
					// }
				}
		
			};
			this.QCLIVEPLAY = new TcPlayer("id_live_container", options);
			console.log(this.QCLIVEPLAY);

		},
		changeSwitchByComment (status) {
				// this.$Message.info('开关状态1：' + status);
				this.formLiveVideo.comment = status
		},
		changeSwitchByPlayBack (status) {
				// this.$Message.info('开关状态2：' + status);
				this.formLiveVideo.playBack = status
		},
		changeDate(data){
			// console.log('changeDate: '+ data)
			this.formLiveVideo.daterange = data
		},
		changeTime(data){
			// console.log('changeTime: '+ data)
			this.formLiveVideo.timerange = data
		},
		gblen: function (str,max,name) {
	      var len = 0;
	      if (name == 'title') {
	        this.titleMaxCount=22;
	      }else if (name == 'introduction') {
	        this.introductionMaxCount = 500;
	      }else if (name == 'live') {
	        this.liveMaxCount = 600;
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
	          } else if (name == 'introduction') {
	            this.introductionMaxCount+=0.5;
	            if(this.introductionMaxCount > max){
	              this.introductionMaxCount=max;
	            }
	          } else if (name == 'live') {
	            this.liveMaxCount+=0.5;
	            if(this.liveMaxCount > max){
	              this.liveMaxCount=max;
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
				// return str.replace(new RegExp(/rtmp:\/\//, 'g'), '');
	      return len
		},
		rtmpRegExp(str){
			console.log('rtmpRegExp: '+str)
			return str.replace(new RegExp(/rtmp:\/\//, 'g'), '');
		},
		getTitleContent () {
			//需要转换为字符
			let count=this.gblen(this.formLiveVideo.title,100,'title');
			this.titleContentCount=Math.ceil(count)>22 ? 22:Math.ceil(count);
		},
		getintroductionContent () {
			//需要转换为字符
			let count=this.gblen(this.formLiveVideo.introduction,800,'introduction');
			this.introductionContentCount=Math.ceil(count)>500 ? 500:Math.ceil(count);
		},

    getArrAjaxcatalogSeleted:function(){
      let _seleted = this.formLiveVideo.catalog
      var element = []

      for (let i = 0; i < _seleted.length; i++) {
        let _id = _seleted[i].id
				let _name = _seleted[i].name
				
        element.push({
          'id':_id,
          'name':_name
        })
			}
			
      return element
    },
		handleSubmit (name) {
			// 提交
			this.$refs[name].validate((valid) => {
					if (valid) {
							// this.$Message.success('提交成功!');
							if (this.formLiveVideo.daterange[0] == this.formLiveVideo.daterange[1] && this.formLiveVideo.timerange[0] == this.formLiveVideo.timerange[1]) {
								this.$Message.error('起止时间不能相同');
							} else {
								this.commitData();
							}
					} else {
							this.$Message.error('表单验证失败!');
					}
			})
		},
		commitData() {
				// let _host = `${conf.host}${conf.serverRoot}`
				// console.log('_host: '+_host)

				// console.log('commitData1: '+JSON.stringify(this.formLiveVideo))
				let _path0 = this.formLiveVideo.coverImage[0].path
				_path0 = _path0.indexOf("asset")>-1 ? 'http://mp.dev.hubpd.com/media/upload/image/2017/09/28/1506590328630019833.jpg' : _path0
				let _formpath = [{path:_path0}]
				
				var _id = this.$route.query.id
				var _cataloginfo = this.getArrAjaxcatalogSeleted()
				

				let _videoLive = {
					'title':this.formLiveVideo.title,
					'roomId':this.formLiveVideo.modelLiveFlow==='push'?this.formLiveVideo.roomId:'',
					'pushurl': this.formLiveVideo.modelLiveFlow==='push'?this.formLiveVideo.pushurl:'',
					'pullUrlRTM':this.formLiveVideo.modelLiveFlow==='push'?this.formLiveVideo.palyUrl_rtm:this.formLiveVideo.pullUrl_rtm,
					'pullUrlFLV':this.formLiveVideo.modelLiveFlow==='push'?this.formLiveVideo.palyUrl_flv:this.formLiveVideo.pullUrl_flv,
					'pullUrlHLS':this.formLiveVideo.modelLiveFlow==='push'?this.formLiveVideo.palyUrl_hls:this.formLiveVideo.pullUrl_hls,
					'introduction':this.formLiveVideo.introduction,
					'coverImage':_path0,
					'catalog':_cataloginfo,
					'commentState':this.formLiveVideo.comment==true?0:1,
					'begin': this.formLiveVideo.daterange[0]+' '+this.formLiveVideo.timerange[0],
					'end': this.formLiveVideo.daterange[1]+' '+this.formLiveVideo.timerange[1]
				}
				
				// console.log('commitData2: '+JSON.stringify( _videoLive))

				if (this.isEdit) {
					// 修改视频直播接口（api/ videoLive/update）
					// http://domain/webapp/api/videoLive

					_videoLive.id = this.formLiveVideo.id
					
					this.$http.put("/api/videoLive/"+_id,{
						videoLive: _videoLive
					}).then((response) => {
						// console.log(response);
						if (response.data.status == 1) {
							this.$Message.success('提交成功!');
							this.videoLiveByoperateState(0)

						} else {
							this.$Notice.error({
								title: '错误',
								desc: response.data.message || '数据请求错误'
							})
							// this.errorProcess(response.data)
						}
					},(error)=>{
						console.log(error);
					})
					
				}else{
					// 添加视频直播接口（api/videoLive/create）
					// http://domain/webapp/api/videoLive

					this.$http.post("/api/videoLive",{
						videoLive: _videoLive
					}).then((response) => {
						// console.log(response);
						if (response.data.status == 1) {
							this.$Message.success('提交成功!');
							this.formLiveVideo.id = response.data.id
							this.videoLiveByoperateState(0)

						} else {
							this.$Notice.error({
								title: '错误',
								desc: response.data.message || '数据请求错误'
							})
							// this.errorProcess(response.data)
						}
					},(error)=>{
						console.log(error);
					})

				}
			
		},
		transdatetime(date,time){
      // console.log('transdatetime: '+date+' ; '+time)
      if(!date){return ''}
			time = time != '' ? time : '00:00:00'
			
      var s = date +' '+time
      var d = new Date(Date.parse(s.replace(/-/g, "/"))); 
      return d
		},
		

		handleReset (name) {
			// console.log('handleReset: '+name)
			// this.$refs[name].resetFields();
			// this.goBack()
			this.videoLiveByoperateState(0)
		},

		// 头像上传成功
		onSuccess (response, fileid, ki) {
			if (response.path) {
				// 图片上传成功后，添加一个到数组
				// console.log('onSuccess: '+response.path)
				this.formLiveVideo.coverImage[0].path=response.path
			}
		},
		// 头像上传失败
		onError (error, fileid, ki) {
			this.$Notice.error({
				title: '错误',
				desc: error.message || '图片上传错误！'
			})
		},




		// Aside
		getDatalistByAside(){
			// 获取图文直播列表接口（api/imageTextLive/list）
			// http://domain/webapp/api/imageTextLive

			var _parm = "pageSize="+this.pageSize+"&pageIndex="+(this.pageIndexByLive - 1)+"&videoLiveId="+this.formLiveVideo.id
			
			this.$http.get("/api/imageTextLive?"+_parm,{
		      }).then((response) => {
		        // console.log(response);
		        if (response.data.status == 1) {
		          this.datalistByAside = response.data.zpImageTextLives
							this.getLiveContent ()

		        } else {
		          // this.$Notice.error({
		          //   title: '错误',
		          //   desc: response.data.message || '数据列表请求错误'
		          // })
		          this.errorProcess(response.data)
		        }
		    },(error)=>{
		        console.log(error);
		    })

		},
		getLiveIamge (data) {
			// console.log('getLiveIamge: '+data)
			this.formSend.picturepath = data
		},
		getLiveContent (data) {
			//需要转换为字符
			// let count=this.gblen(this.formSend.textcon,600,'live');
			// this.liveContentCount=Math.ceil(count)>600 ? 600:Math.ceil(count);
			this.formSend.textcon = data
		},
		deleteDatalByAside(id){
			// 删除图文直播接口（api/ imageTextLive/delete）
			// http://domain/webapp/api/imageTextLive/{_id}
			
			this.$http.delete("/api/imageTextLive/"+id,{
			}).then((response) => {
				// console.log(response);
				if (response.data.status == 1) {
					// this.$Message.success('提交成功!');
					this.formSend.picturepath = ''
					this.formSend.textcon = ''
					this.getDatalistByAside()

				} else {
					this.$Notice.error({
						title: '错误',
						desc: response.data.message || '数据请求错误'
					})
					// this.errorProcess(response.data)
				}
			},(error)=>{
				console.log(error);
			})

		},
		// 输入提交
		okEdit(){
			// console.log('okEdit')
			this.handleSubmitLive()
		},
		handleSubmitLive(){
			// 添加图文直播接口（api/imageTextLive/create）
			// http://domain/webapp/api/imageTextLive

			// console.log('handleSubmitLive: '+JSON.stringify(this.formSend))
			if(this.formSend.textcon){

				this.$http.post("/api/imageTextLive",{
					videoLiveId: this.formLiveVideo.id,
					filePath: this.formSend.picturepath,
					content: this.formSend.textcon
				}).then((response) => {
					// console.log(response);
					if (response.data.status == 1) {
						// this.$Message.success('提交成功!');
						this.formSend.picturepath = ''
						this.formSend.textcon = ''
						this.getDatalistByAside()

					} else {
						this.$Notice.error({
							title: '错误',
							desc: response.data.message || '数据请求错误'
						})
						// this.errorProcess(response.data)
					}
				},(error)=>{
					console.log(error);
				})
			}

		},
		onSuccessSend (response, fileid, ki) {
			// let _img = '<img src="'+ response.path +'" alt="" />'
			this.formSend.picturepath = response.path
		},
		



		// 视频直播操作-初始化接口
		videoLiveInit(){
			// 视频直播操作-初始化接口（api/videoLive/operate/create）
			// http://domain/webapp/api/videoLive/operate

			this.$http.post("/api/videoLive/operate",{
				
			}).then((response) => {
				// console.log(response);
				if (response.data.status == 1) {
					// this.$Message.success('提交成功!');
					let _response = response.data.pushAndPullPo
					this.formLiveVideo.roomId = _response.roomId
					this.formLiveVideo.pushurl = this.formLiveVideo.liveFlowInput = _response.pushurl
					this.formLiveVideo.palyUrl_rtm = _response.playUrl_rtm
					this.formLiveVideo.palyUrl_flv = _response.playUrl_flv
					this.formLiveVideo.palyUrl_hls = _response.playUrl_hls

					// console.log('videoLiveInit: '+ JSON.stringify(this.formLiveVideo))
					
					// 允许推流
					this.videoLiveByoperateState(1)

				} else {
					this.$Notice.error({
						title: '错误',
						desc: response.data.message || '数据请求错误'
					})
					// this.errorProcess(response.data)
				}
			},(error)=>{
				console.log(error);
			})
		},
		
		
		// 视频直播操作-设置直播流状态接口
		videoLiveByoperateState(type){
			// 视频直播操作-设置直播流状态接口（api/videoLive/operate/update）
			// http://domain/webapp/api/videoLive/operate
			// console.log('videoLiveByoperateState：'+type)

			// 房间号/直播码
			// 开关状态 0表示禁用； 1表示允许推流；2表示断流 3初始化
			if (this.formLiveVideo.modelLiveFlow == 'push') {

				this.$http.put("/api/videoLive/operate/"+this.formLiveVideo.id,{
					roomId: this.formLiveVideo.roomId,
					livePushType: type
				}).then((response) => {
					// console.log(response);
					if (response.data.status == 1) {
						// this.$Message.success('提交成功!');
						if (type == 0) {
							this.goBack ()
						}

					} else {
						this.$Notice.error({
							title: '错误',
							desc: response.data.message || '数据请求错误'
						})
						// this.errorProcess(response.data)
					}
				},(error)=>{
					console.log(error);
				})
				
			}else{
				this.goBack ()
			}

		}


	}
}

