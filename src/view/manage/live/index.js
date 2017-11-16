import QRCode from 'qrcode'
import CropperUpload from '@/components/cropperUpload/index.vue'
import EditDiv from '@/components/editDiv.vue'
import Vue from 'vue'
Vue.use(QRCode)
export default {
    data() {
      return {
        isLivePlayer: false,
        isMudu:false,
        qCode: false,
        videourl: '',
        tabViews: false,
        modalMessage :false,
        modalPreview :false,

        searchTitle:'',
        searchContenttypeid:'',
        // 统计
        searchRoomId:'',
        searchDomain:'',
        
        liveList: [],//直播列表
        catalogContentList:[],//图文直播

        pageSize: 16, //每页的个数
        pageIndexByLive: 1, //列表当前页
        dataTotalByLive: 0, //列表数据总数total
        nodataOfDataByLive: true,
        nodataOfSearchDataByLive: true,

        curLiveData:{
          id:null,
          title:'',
          introduction:'',
          pullurlflv:null,
          pullurlhls:null,
          pullurlrtm:null,
          pushurl:null
        },
        // curImageTextLives:[],
        pageSizeByimgtxt:200,

        // 图文直播
        formLiveContent:'',//文本,
        formSend: {
          picturepath: '',
          textcon: ''
        },
        liveMaxCount: 600,
        liveContentCount: 0,

        // 倒计时
        showLeftTimer:[]
      }
    },
  components: {
    'cropper-upload': CropperUpload,
    'edit-div': EditDiv
  },
  created () {
    this.getDataArrayLive()
    this.getDataListTotal()
  },
    mounted () {
    var _this = this
      $('.modalMessage .ivu-modal-close').click(function(){
      _this.modalLiveClose()
    })
  },
  computed:{
    pageCountByLive:{
      get: function(){
        let remainder=this.dataTotalByLive%this.pageSize;
        if(remainder){
          return Math.ceil(this.dataTotalByLive/this.pageSize);
        }else{
          return Math.floor(this.dataTotalByLive/this.pageSize);
        }
      },
      set: function (){}
    },
    
    swiper() {
      return this.$refs.mySwiper.swiper;
    }
  },
  destroyed () {
    for (let i = 0; i < this.showLeftTimer.length; i++) {
      var _this = this.showLeftTimer[i];
      if (_this) {
        clearTimeout(_this)
      }
    }
    if (typeof this.QCLIVEPLAY != undefined) {
      this.QCLIVEPLAY=null;
      $("#id_live_container").html('');
    }
    
    // $(".m-content1").mCustomScrollbar("destroy");
  },
  methods: {
    getDataArrayLive(){
      // 获取视频直播列表接口（api/videoLive/）
      // http://domain/webapp/api/videoLive

      var _parm = "pagesize="+this.pageSize+
            "&pageindex="+(this.pageIndexByLive - 1)+
            "&title="+this.searchTitle+
            "&contenttypeid="+this.searchContenttypeid
      
      this.$http.get("/api/videoLive?"+_parm,{
        
      }).then((response) => {
        // console.log(response);
        this.isLoading = false
        if (response.data.status == 1) {
          if (response.data.total == 0) {
            this.nodataOfDataByLive = false;
            return;
          } else {
            this.nodataOfDataByLive = true;
          }
          this.dataTotalByLive = response.data.total;
          if (this.dataTotalByLive == undefined) {
            this.dataTotalByLive = 1;
          }
        //   if (response.data.Lives && response.data.total) {
          
        //   }
          this.liveList = response.data.zpVideoLives;
          this.pageCountByLive = Math.ceil(this.dataTotalByLive / this.pageSize);

          let now = new Date()
          for (let i = 0; i < this.liveList.length; i++) {
            let _this = this.liveList[i]
            let _ING1 = ( new Date(Date.parse(_this.begin.replace(/-/g, "/"))) ) - now;
            let _ING2 = now - ( new Date(Date.parse(_this.end.replace(/-/g, "/"))) );
            // console.log(_ING1+" : "+_ING2)
            if(_ING1 > 0){
              _this.stateLive = 2
              this.showLeftTimer[i] = this.showLeftTimer[i]? this.showLeftTimer[i]:null
              clearTimeout(this.showLeftTimer[i])
              this.leftTimerFn(i,_this.begin)
            }else if(_ING1 < 0 && _ING2 < 0){
              _this.stateLive = 1
            }else{
              _this.stateLive = 0
            }
          }

        } else {
          this.$Notice.error({
          title: '错误',
          desc: response.data.message || '数据列表请求错误'
          })
          this.nodataOfDataByLive = false;
          if (response.data.status == 100) {
          this.$router.push('/login')
          }
          // this.errorProcess(response.data)
        }

      },(err)=>{
        this.isLoading = false
        this.$Notice.error({
          title: '错误',
          desc: err.message || '数据列表请求错误'
        })
      })


    },
    changePage (newpage) {
      this.pageIndexByLive = newpage
      this.getDataArrayLive()
    },

    // 视频直播操作-统计接口（api/videoLive/operate/list）
    getDataListTotal(){
      // 视频直播操作-统计接口（api/videoLive/operate/list）
      // http://domain/webapp/api/videoLive/operate

      var _parm = "pageSize="+this.pageSize+
            "&pageIndex="+(this.pageIndexByLive - 1)+
            "&roomId="+this.searchRoomId+
            "&domain="+this.searchDomain
      
      this.$http.get("/api/videoLive/operate?"+_parm,{
      }).then((response) => {
        // console.log(response);
        if (response.data.status == 1) {
          // this.$Message.success('提交成功!');
          let _response = response.data
          if(_response.output){
            _response.output.stream_count //所有在线的直播流数量
            _response.output.stream_info.stream_name //直播码
            _response.output.stream_info.bandwidth //该直播流的瞬时带宽占用
            _response.output.stream_info.online //该直播流的瞬时在线人数
            _response.output.total_bandwidth //当前账号在查询时间点的总带宽
            _response.output.total_online //当前账号在查询时间点的总在线人数
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

    },

    getDatalistContent(id){
      var _parm = "pageSize="+this.pageSizeByimgtxt+
            "&pageIndex="+(this.pageIndexByLive - 1)+
            "&videoLiveId="+id
      
      this.$http.get("/api/imageTextLive?"+_parm,{
      }).then((response) => {
        // console.log(response);
        if (response.data.status == 1) {
          this.catalogContentList = response.data.zpImageTextLives

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

    deleteLive(id){
      console.log('deleteLive')
      // 删除视频直播接口（api/ videoLive /delete）
      // http://domain/webapp/api/videoLive/{id}

      this.$http.delete("/api/videoLive/"+id,{
        
      }).then((response) => {
        // console.log(response);
        if (response.data.status == 1) {
          // this.$Message.success('提交成功!');
          this.getDataArrayLive()

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

    togglePlayer(urlId){
      // this.isLivePlayer = !this.isLivePlayer
      // if(this.isLivePlayer){
        var vw= 404;
        $('.g_video_container').width(vw);
        $('.g_video_container').height(vw*9/16);

        this.createLivePlayer(this.rtmpRegExp(urlId))
      // }else{
      //  if (typeof this.QCLIVEPLAY != undefined) {
      //    this.QCLIVEPLAY=null;
      //    $("#id_live_container").html('');
      //  }
      // }
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
        // rtmp: 'rtmp://'+_date,
        // rtmp_sd: 'rtmp://'+_date+'_550',
        // rtmp_hd: 'rtmp://'+_date+'_900',
        
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
    rtmpRegExp(str){
      // console.log('rtmpRegExp: '+str)
      return str.replace(new RegExp(/rtmp:\/\//, 'g'), '');
    },
    modalLiveClose(){
      console.log('modalLiveClose')
      this.modalPreview = false;
      // $("#catalogContent").mCustomScrollbar("destroy");
      // $("#videoContent").mCustomScrollbar("destroy");
    },
    //直播消息弹出框
    liveMessage (data) {
      this.modalMessage=true;    
      console.log(111)
      // $("#catalogContent").mCustomScrollbar("destroy");
      // $("#videoContent").mCustomScrollbar("destroy");
      // setTimeout(function() {
      //  $("#videoContent").mCustomScrollbar();
      //  $("#catalogContent").mCustomScrollbar();
      // }, 200);
      this.curLiveData={}

      this.curLiveData.id = data.id
      this.curLiveData.title = data.title
      this.curLiveData.introduction = data.introduction
      this.curLiveData.pullurlflv = data.pullurlflv
      this.curLiveData.pullurlhls = data.pullurlhls
      this.curLiveData.pullurlrtm = data.pullurlrtm
      this.curLiveData.pushurl = data.pushurl
      this.curLiveData.addtime = data.addtime
      

      this.getDatalistContent(this.curLiveData.id)
      // this.isLivePlayer = true
      this.togglePlayer(this.curLiveData.pullurlrtm)
     
    },
    onSuccessSend (response, fileid, ki) {
      // this.formLiveContent += response.path
    },
    // 头像上传失败
    onError (error, fileid, ki) {
      this.$Notice.error({
        title: '错误',
        desc: error.message || '图片上传错误！'
      })
    },
    getLiveContent (data) {
      //需要转换为字符
      // let count=this.gblen(this.formLiveContent,600,'live');
      // this.liveContentCount=Math.ceil(count)>600 ? 600:Math.ceil(count);
      // $("#catalogContent").mCustomScrollbar("destroy");
      // $("#videoContent").mCustomScrollbar("destroy");
      // $("#videoContent").mCustomScrollbar();
      // $("#catalogContent").mCustomScrollbar();
      this.formSend.textcon = data
    },
    getLiveIamge (data) {
      // console.log('getLiveIamge: '+data)
      this.formSend.picturepath = data
    },

      //编辑直播
    editVideo (id) {
      this.$router.push({path: '/manage/live/enter', query: {id: id}});
    },
    //分享直播
    shareUrl (url) {
      this.qCode = true;
      this.videourl = url;
      //二维码
      var canvas = document.getElementById('videoItem');
      QRCode.toCanvas(canvas, url, function (error) {
        if (error) console.error(error)
        console.log('success!');
      })
    },
      //拷贝地址
    CopyUrl (ev){
      this.$refs.thisInput.select();
      document.execCommand("Copy");
    },
    gblen: function (str,max,name) {
      var len = 0;
      if (name == 'live') {
        this.liveMaxCount=600;
      }else{
        this.labelMaxCount = 500;
      }
          
      for (let i=0; i<str.length; i++) {
        if (str.charCodeAt(i)>127 || str.charCodeAt(i)==94) {
          len ++;
        } else {
          if (name == "live") {
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

    // 输入提交
    okEdit(){
      console.log('okEdit')
      this.handleSubmitLive()
    },
    // handleSubmitLive(){
    //  console.log('handleSubmitLive: '+JSON.stringify(this.formLiveContent))
    //  this.formLiveContent = ''
    //  this.getDatalistContent()
    // },
    handleSubmitLive(){
      // 添加图文直播接口（api/imageTextLive/create）
      // http://domain/webapp/api/imageTextLive

      console.log('handleSubmitLive: '+JSON.stringify(this.formSend))
      if(this.formSend.textcon){

        this.$http.post("/api/imageTextLive",{
          videoLiveId: this.curLiveData.id,
          filePath: this.formSend.picturepath,
          content: this.formSend.textcon
        }).then((response) => {
          // console.log(response);
          if (response.data.status == 1) {
            // this.$Message.success('提交成功!');
            this.formSend.picturepath = ''
            this.formSend.textcon = ''
            this.getDatalistContent(this.curLiveData.id)

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

    // 倒计时
    leftTimerFn(index,datetime){ 
      var now = new Date();
      // console.log('leftTimerFn: index: '+index+' ;datetime: '+datetime)

      // var leftTime = (new Date(year,month-1,day,hour,minute,second)) - (new Date()); //计算剩余的毫秒数
      var leftTime = ( new Date(Date.parse(datetime.replace(/-/g, "/"))) ) - now; //计算剩余的毫秒数 
      var days = parseInt(leftTime / 1000 / 60 / 60 / 24 , 10); //计算剩余的天数 
      var hours = parseInt(leftTime / 1000 / 60 / 60 % 24 , 10); //计算剩余的小时 
      var minutes = parseInt(leftTime / 1000 / 60 % 60, 10);//计算剩余的分钟 
      var seconds = parseInt(leftTime / 1000 % 60, 10);//计算剩余的秒数 
      days = this.checkTime(days); 
      hours = this.checkTime(hours); 
      minutes = this.checkTime(minutes); 
      seconds = this.checkTime(seconds);
      
      $(".timeCountdown"+index).html(days+"天" + hours+"小时" + minutes+"分"+seconds+"秒")

      clearTimeout(this.showLeftTimer[index])

      var _this = this
      this.showLeftTimer[index] = setTimeout(() => {
        _this.leftTimerFn(index,datetime) 
      }, 1000);
    },
    checkTime(i){ //将0-9的数字前面加上0，例1变为01
      if(i<10) {
        i = "0" + i;
      }
      return i;
    },






    //点击浏览的效果
    liveprev() {
      
      // setTimeout(function() {
      //   // $(".contentScroll").mCustomScrollbar({
      //   //  horizontalScroll: true,
      //   // });
      //   // $(".m-content1").mCustomScrollbar("destroy");
      //   // $(".m-content1").mCustomScrollbar({
      //     // theme: "light-thin"
      //   });
      // }, 100);
      
      this.modalPreview = true;
      //点击弹出框关闭按钮
      this.clickClose();
    },
    //关闭按钮
    clickClose () {
      $('.modal1 .ivu-modal-close').click(function(){
        this.modalPreview = false;
        // $(".contentScroll").mCustomScrollbar("destroy");
        // $(".m-content1").mCustomScrollbar("destroy");
      })
    }

  }
}