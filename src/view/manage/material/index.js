import QRCode from 'qrcode'
import Vue from 'vue'
Vue.use(QRCode)
export default {
  name: 'SourceMaterial',
  data() {
    return {
      videoList: [],
      videoTotal: 36,
      pageSize: 12,
      materialInfo: {},
      videoId: -1,
      pageIndexX: 1,
      videoTotal: 0,
      pageAll: 0,
      shows: true,
      qCode: false,
      videourl: '',
      searchValue: '',
      playVideoModel: false,
      playVideoTitle: '',
      hideFoot: false,
      playVideoUrl: ''
    }
  },
  watch: {

  },
  computed: {

  },
  mounted () {
    this.getVideoList();
  },
  methods: {
    playVideo (title, videoid, videourl) {
      this.playVideoModel = true;
      this.playVideoTitle = title;
      this.playVideoUrl = videourl;
      var option = {
          "auto_play": "0",
          "file_id": videoid,
          "app_id": "1252018592",
          "width": 1010,
          "height": 480,
          "https": 1
      }; /*调用播放器进行播放*/
      new qcVideo.Player("videoPlayer", option);
    },
    cancel () {

    },
    CopyUrl (ev){
      console.log(this.$refs.thisInput)
      this.$refs.thisInput.select();
      document.execCommand("Copy");
    },
    share (url) {
      // debugger
      this.videourl = url;
      this.qCode = true;
      var canvas = document.getElementById('videoItem');
      QRCode.toCanvas(canvas, url, function (error) {
        if (error) console.error(error)
        console.log('success!');
      })
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
    },
    changePage (page) {
      this.pageIndexX = page;
      this.getVideoList();
    },
    getVideoList () {
      this.$http.get("api/material", {
        params: {
          value: this.searchValue,
          page: true,
          pageindex: (this.pageIndexX - 1),
          pagesize: this.pageSize
        }
      }).then(({ data }) => {
        if (data.status == 1) {
          this.videoTotal = data.total;
          console.log(this.pageSize)
          this.pageAll = Math.ceil(this.videoTotal/this.pageSize)
          this.videoList = data.materials;
          for (let i = 0; i<this.videoList.length; i++) {
            this.videoList[i].addtime = this.videoList[i].addtime.substring(0,10)
          }
          if (this.videoList.length == 0) {
            this.initUpload('pickfiles11', 'AKIDiJjz3vMbP1SgknteIk270g9QvMbjpXGo', 1, 1,null, null);
          }else{
            this.initUpload('pickfiles111', 'AKIDiJjz3vMbP1SgknteIk270g9QvMbjpXGo', 1, 1,null, null);
          }
        }else{
          this.errorProcess(data)
        }
        console.log(data)
      }, (err) => {
        this.$Notice.error({
          title: '错误',
          desc: err.message || '数据列表请求错误'
        })
      })
    },
    editVideo (id) {
      console.log(id)
      this.$store.videoId = id;
      this.$router.push({path: '/manage/material/enter', query: {id: id}});
    },
    deleteVideo (id) {
       this.videoId = id;
       this.$Modal.confirm({
         title: '确认提示',
         content: '<p>你确定要删除吗？</p>',
         onOk: ()=> {
          this.$http.delete('api/material/' + this.videoId).then((response) => {
            if (response.data.status == 1) {
              this.$Notice.success({title:'删除成功',desc: false});
              this.getVideoList();
            }else{
              this.errorProcess(response.data)
            }
          }, (response) => {
            this.$Notice.error({title:error.data.message,desc: false});
          })
        },
        onCancel: () => {

        }
       })

    },
    initUpload (upBtnId, secretId, isTranscode, isWatermark, transcodeNotifyUrl, classId) {
      var $ = qbVideo.get('$');
      var Version = qbVideo.get('Version');
      if (!qbVideo.uploader.supportBrowser()) {
          if (Version.IS_MOBILE) {
              alert('当前浏览器不支持上传，请升级系统版本或者下载最新的chrome浏览器');
          } else {
              alert('当前浏览器不支持上传，请升级浏览器或者下载最新的chrome浏览器');
          }
          return;
      }
      this.accountDone(upBtnId, secretId, isTranscode, isWatermark, transcodeNotifyUrl, classId)
    },
    accountDone(upBtnId, secretId, isTranscode, isWatermark, transcodeNotifyUrl, classId) {
          var self = this;
      var $ = qbVideo.get('$'),
          ErrorCode = qbVideo.get('ErrorCode'),
          Log = qbVideo.get('Log'),
          JSON = qbVideo.get('JSON'),
          util = qbVideo.get('util'),
          Code = qbVideo.get('Code'),
          Version = qbVideo.get('Version');
          console.log($("#pickfiles111"))
      //您的secretKey
      var secret_key =  'UmsnV4Sgw65rRE0e6OUTGtK3viKky4yh';
      var secret_id = secretId;
      qbVideo.uploader.init(
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
                  console.log(args)
                  if (args.code == 2) {
                    self.$router.push({path: '/manage/material/enter'})
                  }
              },

              /**
               * 文件状态发生变化
               * @param info  { done: 完成数量 , fail: 失败数量 , sha: 计算SHA或者等待计算SHA中的数量 , wait: 等待上传数量 , uploading: 上传中的数量 }
               */
              onFileStatus: function (info) {
                console.log(info)
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
                  console.log(args)
              }

          }
      );
    }
  },
  created() {

  }
}
