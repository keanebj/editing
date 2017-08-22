import ScrollBar from '@/view/scroll/index.vue'
export default {
  name: 'ComponentsUploadVideo',
  data(){
     return {
        videotimer:null,
        videoLink:'',
        uploadVideo:false,
        tabName:'link',
        isHideLocal:true,
        isHideLink:false,
        isHideResource:true,
        id:'',
        ishidelinkvideo:true,
        idHideStepOne:false,
        idHideStepTwo:true,
        idHideStepThree:true,
        idHideStepFour:true,
        video:{
            name:'',
            uploadedSize:'',
            allSize:'',
            percent:0,
            speed:'...',
            leftTime:'...',
            loadingMsg:'',
            videoId:''
        },
        //给一个默认id
        selVideoid:'111',
        materialVideos:[],
        isHideSourceBtn:false,
        playInfo:'',
        enableAddLocalVideo:true,
        onceTimer:null   
    }
  },
  components:{
    ScrollBar
  },
  props:{
   
  },
  watch:{
    videoLink(val){
        if(this.trim(val)){
            this.ishidelinkvideo=false;
        }else{
            this.ishidelinkvideo=true;
        }
    },
    uploadVideo(bool){
        if(!bool){
            this.reset();

        }
    }
  },
  methods: {
      changeSelVideo(val){
        this.selVideoid=val;
      },
      showModal(){
        this.uploadVideo=true;   
      },
      changeTab(name){
        if(name == 'link'){
            this.isHideLink=false;
            this.isHideLocal=true;
            this.isHideResource=true;
        }else if(name == 'local'){
            this.isHideLocal=false;
            this.isHideLink=true;
            this.isHideResource=true;
        }else{
            this.isHideLocal=true;
            this.isHideLink=true;
            this.isHideResource=false;
        }
       this.tabName=name;
      },
      trim(str){
            return str.replace(/(^\s*)|(\s*$)/g, "");
      },
      addLinkVideo(){
        if(!this.trim(this.videoLink)){
             this.$Notice.warning({
                title:'请填写正确的外链地址',
                desc:false
             });
            return;
        }

         //调用父组件中的
        let linkvideoHtml=this.$refs.linkVideoHtml.innerHTML;
        this.$emit("insertVideoEditor",linkvideoHtml);
        this.uploadVideo=false;
      },
      addLocalVideo(){
        let $ = qdVideo.get('$'); 
        $("#videoPreview").find('embed').prop('width','640px');
        $("#videoPreview").find('embed').prop('height','360px');
        let videoHtml='<p style="text-align:center" class="video_container" serverfileid="'+this.video.videoId+'" id="id_video_container_'+this.video.videoId+'">'+this.$refs.videoPreview.innerHTML+'</p>';
        this.$emit("insertVideoEditor",videoHtml,this.video.videoId,this.video.name);
        this.uploadVideo=false;     
      },
      reset(){
        this.videoLink='';
        $("#videoPreview").html("");
        this.reUpload();
        this.changeTab('link');
        this.selVideoid= '111';
        this.uploadVideo=false;
      },
      addSourceVideo(){
          if(this.selVideoid!= '111'){
              //已经选择了某个素材
            var option = {
                "auto_play": "0",
                "file_id": this.selVideoid,
                "app_id": "1252018592",
                "width": 400,
                "height": 225,
            }; 
            new qcVideo.Player("videoPreview1", option); 
            let $ = qdVideo.get('$');
            
            $("#videoPreview1").find('embed').prop('width','640px');
            $("#videoPreview1").find('embed').prop('height','360px');
            let videoHtml='<p style="text-align:center;width:100%;margin-bottom:10px;" class="video_container" serverfileid="'+this.selVideoid+'" id="id_video_container_'+this.selVideoid+'">'+this.$refs.videoPreview1.innerHTML+'</p>';
            this.$emit("insertVideoEditor",videoHtml,this.selVideoid);
            
            this.uploadVideo=false;
         }else{
             //没有选择素材
             this.$Notice.warning({
                     title:'请先选择素材',
                     desc:false
             });
         }
      },
      backOrigin(){
        //回复原始状态      
        this.video.name='';
        this.video.uploadedSize='';
        this.video.allSize='';
        this.video.percent=0;
        this.video.speed='';
        this.video.leftTime='...';
        this.video.loadingMsg='';
        this.video.videoId='';
      },
      reUpload(){
        this.backOrigin();
        //取消上传，跳转到上传界面
        this.idHideStepOne=false;
        this.idHideStepTwo=true;
        this.idHideStepThree=true;
        this.idHideStepFour=true; 
        this.enableAddLocalVideo=true;
        clearInterval(this.videotimer);
        clearTimeout(this.onceTimer);
        this.$refs.videoPreview.innerHTML="视频正在转码中，请稍候...";  
      },
      previewVideo(){
        var option = {
                "auto_play": "0",
                "file_id": this.video.videoId,
                "app_id": "1252018592",
                "width": 400,
                "height": 225, 
            };  
            new qcVideo.Player("videoPreview", option);
      },
     //初始化直播上传
      initUpload(){
          //检测浏览器是否支持
          var $ = qdVideo.get('$');
          var Version = qdVideo.get('Version');
          if( !qdVideo.uploader.supportBrowser() )
          {
              if(Version.IS_MOBILE)
              {
                  alert('当前浏览器不支持上传，请升级系统版本或者下载最新的chrome浏览器');
              }
              else
              {
                  alert('当前浏览器不支持上传，请升级浏览器或者下载最新的chrome浏览器');
              }
              return;
          }
          //绑定按钮及回调处理
          this.accountDone('pickfile','AKIDiJjz3vMbP1SgknteIk270g9QvMbjpXGo',1,1,null,null);
      },
      accountDone(upBtnId, secretId, isTranscode, isWatermark, transcodeNotifyUrl, classId) { 
            var This=this;
              var $ = qdVideo.get('$'),
                  ErrorCode = qdVideo.get('ErrorCode'),
                  Log = qdVideo.get('Log'),
                  JSON = qdVideo.get('JSON'),
                  util = qdVideo.get('util'),
                  Code = qdVideo.get('Code'),
                  Version = qdVideo.get('Version');

              //您的secretKey
              var secret_key = 'UmsnV4Sgw65rRE0e6OUTGtK3viKky4yh';
              qdVideo.uploader.init(
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
                          argObj['s'] = secretId
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
                      after_sha_start_upload: true,//sha计算完成后，开始上传 (默认关闭立即上传)
                      //,sha1js_path: 'http://您的域名/您的设置目录/calculator_worker_sha1.js' //计算sha1的位置
                      sha1js_path: "static/upload/calculator_worker_sha1.js",
                      disable_multi_selection: false, //禁用多选 ，默认为false

                      transcodeNotifyUrl: transcodeNotifyUrl, //(转码成功后的回调地址)isTranscode==true,时开启； 回调url的返回数据格式参考  https://www.qcloud.com/document/product/266/1407
                      classId: classId,
                      // mime_types, 默认是常用的视频和音频文件扩展名，如MP4, MKV, MP3等, video_only 默认为false，可允许音频文件上传
                      filters: {
                          max_file_size: '2gb',
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
                          if (args.code == Code.SHA_FAILED){
                              This.$Notice.error({
                                title: '该浏览器无法计算SHA',
                                desc: false
                               })
                            return;
                          }
                            
                          var $line = $('#' + args.id);
                          if (!$line.get(0)) {
                              $('#result').append('<div class="line" id="' + args.id + '"></div>');
                              $line = $('#' + args.id);
                          }

                          var finalFileId = '';

                          if (args.code == Code.UPLOAD_DONE) {
                              finalFileId = '文件ID>>' + args.serverFileId
                          }

                          $line.html('' +
                              '文件名：' + args.name +
                              ' >> 大小：' + util.getHStorage(args.size) +
                              ' >> 状态：' + util.getFileStatusName(args.status) + '' +
                              (args.percent ? ' >> 进度：' + args.percent + '%' : '') +
                              (args.speed ? ' >> 速度：' + args.speed + '' : '') +
                              '<span data-act="del" class="delete">删除</span>' +
                              finalFileId
                          );
                         if(args.code == 1 || args.code == 3)//计算SHA中
                            {
                                //你的逻辑，比如显示文件名等信息
                                This.video.name=args.name;
                                This.video.allSize=util.getHStorage(args.size);
                                This.video.loadingMsg="正在解析"+args.name+"视频文件，稍等一下...";
                            }
                            else if(args.code == 2) //计算完SHA
                            {
                                This.video.loadingMsg='';
                                //计算完SHA值，准备开始上传，这步执行完之后才能执行qdVideo.uploader.startUpload()即上传操作                                
                                //跳转到另外一个界面，然后显示
                              
                            } else if(args.code == 4){
                                This.idHideStepTwo=false;
                                This.idHideStepOne=true;
                                This.idHideStepThree=true;
                                This.idHideStepFour=true;
                            }
                            else if(args.code == 5 )//上传中 
                            {
                                //获取实时进度    
                                This.video.uploadedSize=util.getHStorage(args.size*Number(args.percent)/100);
                                This.video.percent=Number(args.percent); 
                                This.video.speed= (args.speed ? args.speed : '');
                                This.video.videoId=args.id;

                                //剩余时间计算
                                if(args.speed){
                                    let speed=0;
                                    if(args.speed && args.speed.indexOf('MB/s') > -1){
                                        //MB
                                        speed=parseFloat(args.speed)*1024*1024;
                                    }else if(args.speed && args.speed.indexOf('KB/s') > -1){
                                        //KB
                                        speed=parseFloat(args.speed)*1024;
                                    }else{
                                        //B 
                                        speed=args.speed;    
                                    }
                                    let sec=parseInt((args.size-args.size*args.percent/100)/speed);
                                    let text=sec >= 60 ? parseInt(sec/60)+"分"+ sec%60 + "秒":sec + "秒";
                                    This.video.leftTime=text;
                                }else{
                                    This.video.speed="计算中...";
                                    This.video.leftTime='计算中...';
                                }    
                            } 
                            else if(args.code == 6 )//上传完成 
                            { 
                                //取得回调的视频serverFileId，用于后面更新字段用 
                                This.video.videoId=args.serverFileId; 
                                //跳转界面
                                This.idHideStepTwo=true;
                                This.idHideStepOne=true;
                                This.idHideStepThree=false;
                                This.idHideStepFour=true;
                                
                                
                                //需要估算一个时间 (目前先这样定时处理)
                                let startduration=Math.round(args.size/1000000)*5 >0 ? Math.round(args.size/1000000)*5000 :10000;
                            
                                //设置定时器，调用后台接口看转码是否完
                                clearInterval(This.videotimer);
                                clearTimeout(This.onceTimer);
                                This.onceTimer=setTimeout(function(){
                                    This.videotimer=setInterval(function(){
                                        This.$http.get('/api/video/upload?videoid='+This.video.videoId).then((res)=>{
                                            console.log(res);
                                            if(res.data.status == 1){
                                                if(res.data.fileset.status== 2){
                                                    //转码完成
                                                    This.previewVideo();
                                                    This.enableAddLocalVideo=false;
                                                    //清除定时器
                                                    clearInterval(This.videotimer);
                                                    clearTimeout(This.onceTimer);
                                                }else if(res.data.fileset.status== 4){
                                                    //转码中 ，不进行任何操作
                                                    This.$refs.videoPreview.innerHTML="视频正在转码中，请稍候..."; 
                                                }else{
                                                    //转码失败
                                                    This.$refs.videoPreview.innerHTML="很抱歉，转码失败！"; 
                                                    //清除定时器
                                                    clearInterval(This.videotimer);
                                                    clearTimeout(This.onceTimer);
                                                }
                                            }else{
                                                This.$refs.videoPreview.innerHTML=res.data.message;
                                                clearInterval(This.videotimer);
                                                clearTimeout(This.onceTimer);
                                            }
                                        
                                        })
                                },2000) 
                                },startduration)
                                  
                            }
                            else{
                                This.video.videoId=''; 
                                //跳转界面
                                This.idHideStepTwo=true;
                                This.idHideStepOne=true;
                                This.idHideStepThree=true;
                                This.idHideStepFour=false;
                            }
                          
                      },

                      /**
                       * 文件状态发生变化
                       * @param info  { done: 完成数量 , fail: 失败数量 , sha: 计算SHA或者等待计算SHA中的数量 , wait: 等待上传数量 , uploading: 上传中的数量 }
                       */
                      onFileStatus: function (info) {                    
                          $('#count').text('各状态总数-->' + JSON.stringify(info));

                      },

                      /**
                       *  上传时错误文件过滤提示
                       * @param args {code:{-1: 文件类型异常,-2: 文件名异常} , message: 错误原因 ， solution: 解决方法}
                       */
                      onFilterError: function (args) {
                          This.$Notice.error({
                                title: args.message+(args.solution ? (';solution==' + args.solution) :''),
                                desc: false
                           })                       
                      }

                  }
              );

            
              //事件绑定
              $('#start_upload').on('click', function () {
                  //@api 上传
                  qdVideo.uploader.startUpload();
              });

              $('#stop_upload').on('click', function () {
                  //@api 暂停上传
                  qdVideo.uploader.stopUpload();
                  //取消上传，跳转到上传界面
                  This.idHideStepOne=false;
                  This.idHideStepTwo=true;
                  This.idHideStepThree=true;
                  This.idHideStepFour=true;

                  //移除这个文件
                  //$('#result').html('');
                  qdVideo.uploader.deleteFile(This.video.videoId);
                 // This.backOrigin();

              });

              $('#re_upload').on('click', function () {
                  //@api 恢复上传（错误文件重新）
                  qdVideo.uploader.reUpload();
              });

              $('#result').on('click', '[data-act="del"]', function (e) {
                  var $line = $(this).parent();
                  var fileId = $line.get(0).id;

                  Log.debug('delete', fileId);

                  $line.remove();
                  //@api 删除文件
                  qdVideo.uploader.deleteFile(fileId);
              });
            }
          },

  created() {
         //获得素材列表
       this.$http.get('api/material',{params:{pageindex:1,pagesize:10}}).then((response) => {
           console.log(response.data); 
           if(response.data.status != 1){
               alert(response.data.message);
                return;
           }  
          let data = response.data.materials;
          //判断是否有素材
          if(data && data.length == 0){
            this.isHideSourceBtn=true;
          }
          //给数据值
         this.materialVideos=data;
        }, (error) => {
          this.$Notice.error({
            title: '错误',
            desc: error.message || '数据列表请求错误'
          })
        });
  },
  mounted() {
      this.initUpload();
    
  },
  destroy(){
      //清除定时器
      clearInterval(this.videotimer);
      clearTimeout(this.onceTimer);
  }

}