import QRCode from 'qrcode'
import ScrollBar from '@/view/scroll/index.vue'
import cropperUpload from '@/components/cropperUpload/index.vue'
import Vue from 'vue'
import Cookies from 'js-cookie'
import {
  mapState
} from 'vuex'
Vue.use(QRCode)
export default {
  name: 'ViewPublish',
  components: {
    ScrollBar,
    QRCode,
    cropperUpload
  },
  data () {
    return {
      //二维码
      codes:'',
      roleType: 'Edit',
      articleID: -1,
      downloadButton: false,
      hideTip: true,
      qCode: false,
      titleContentCount: 0,
      subtitleContentCount:0,
      tabView: 'pc',
      previewContent: false,
      localModal: false,
      contentModal: false,
      contentCoverSrc: '',
      publishChannels: ['人民日报中央厨房'],
      publishLabels: {
        Notice: '公告',
        College: '中央厨房融媒体学院'
      },
      titleMaxCount:22,
      subtitleMaxCount:60,
      summaryMaxCount:60,
      authorMaxCount:5,
      keyMaxCount:5,
      author: '',
      keyword: '',
      formTop: {
        contenttype:"Video",
        channel: '人民日报中央厨房',
        author: '',
        authorArr:[],
        keywordArr:[],
        keyword: '',
        cover:'',
        summary:'',
        currentAbstractCount:0,
        title:'',
        subtitle:'',
        content:'',
        label:''
      },
      ruleValidate: {
        authorArr: [
          { required: true, message: ' '}
        ],
        cover: [
          { required: true, message: '封面不能为空', trigger: 'change' }
        ],
        title:[
          { required: true, message: '标题不能为空', trigger: 'blur' }
        ],
        label: [
          { required: true, message: '标签不能为空', trigger: 'blur' }
        ],
      },
      localDefaultSrc:'',
      elements: [],
      previewCon: [
        {
          title: '',
          content: '',
          studioname: '',
          time: ''
        },
        []
      ],
      iIndex: [-1],
      i: -1,
      tempi: -1,
      timer:null,
      headers:{
        token:this.$store.state.token
      },
      token:this.$store.state.token,
      studioName: '',
      hidesave:true,
      hideshare:true,
      hidepreview:true,
      isHideAuthor:true,
      isHideClose:false,
      isHideKeyClose:false,
      isHideKeyword:true,
      temptimer:null,
      placeauthor:'每个作者最多5个字',
      placekeyword:'每个关键词最多5个字',
      isSkip:true,
      baseimg:'',
      noSel:true,
      uploadVideo:false,
      isHideSubtitle:true,
      ishideone:false,
      videoid:'',
      videoname:''
  }
},
  created(){
    this.roleType=this.$store.state.userinfo.roleType;
    if(this.$store.state.userinfo.roleType == 'Manage'){
        this.formTop.label='Notice';
    }

    this.$http.get("/api/studio/"+this.$store.state.userinfo.id).then((response) => {
      this.studioName = response.data.studio.studioname;
    }, (error) => {
      this.$Notice.error({
        title: error.data.message,
        desc: false
      })
    })
  },
  computed: {
    ...mapState(['menu', 'userinfo'])
},
  mounted(){  
    let This=this;
    //判断一下是编辑还是草稿通过文章的id
    if(this.$route.query.articleID){
      this.articleID=this.$route.query.articleID;
    }
    //编辑：发出ajax请求
     if(this.articleID > 0) {
      this.$http.get("/api/content/"+this.articleID).then((response) => {
        if(response.data.content.contenttype == 'Video'){
          let data = response.data.content;
          //给数据值
          this.formTop.title = data.title;
          
          this.formTop.publishchannel = data.channel;
          this.formTop.authorArr=data.author.split(/\s+/g);
          if (data.keyword != null) {
            this.formTop.keywordArr=data.keyword.split(/\s+/g);
          }

          this.formTop.cover = data.cover;
          this.formTop.summary = data.summary;
          this.formTop.content = data.content;
          this.ishideone=true;
          this.formTop.label = data.label;
          if(data.summary){
            this.formTop.currentAbstractCount = Math.ceil(this.gblen(data.summary,120,'summary')) >60?60:Math.ceil(this.gblen(data.summary,120,'summary'));
          }

          this.titleContentCount = Math.ceil(this.gblen(data.title,44,'title')) > 22 ? 22:Math.ceil(this.gblen(data.title,44,'title'));
          if(data.subtitle){
            this.formTop.subtitle = data.subtitle;
            this.subtitleContentCount = Math.ceil(this.gblen(data.subtitle,120,'subtitle')) > 60 ? 60:Math.ceil(this.gblen(data.subtitle,120,'subtitle'));
            this.isHideSubtitle=false;
          }
        }else{
          this.articleID=-1;
          //禁用video
          this.$emit('disabledTab','video');
        }      
      }, (error) => {
        this.$Notice.error({
          title: error.data.message,
          desc: false
        })
      });
    }
    //自动保存:一分钟自动保存一次
    this.timer=setInterval(function(){
      //存到数据库
      This.save('formTop',true);
    },60000);
  },
  updated(){
    let padleft=this.$refs.authorContainer.clientWidth;
    this.$refs.authorInput.style.paddingLeft=padleft+'px';
    this.placeauthor=padleft>10?'':'每个作者最多5个字';
    if(this.roleType == 'Edit'){
      let keypadleft=this.$refs.keywordContainer.clientWidth;
      this.$refs.keywordInput.style.paddingLeft=keypadleft+'px';
      this.placekeyword=keypadleft>10?'':'每个关键字最多5个字';
    }
  },
  destroyed() {
    //清除定时器
    clearInterval(this.timer);
    clearInterval(this.temptimer);
  },
  methods: {
    useqrcode(url){
      var canvas = document.getElementById('canvasvideo');
      QRCode.toCanvas(canvas, url, function (error) {
        if (error) console.error(error)
        console.log('success!');
      })
    },
    deleteSubTitle(){
      this.formTop.subtitle='';
      this.subtitleContentCount=0;
      this.isHideSubtitle=true;
    },
    showUploadPop(){
      this.$emit('showUploadPop');
    },
    goBack(){
      this.$router.go(-1);
    },
    insertVideoEditor(html,id,name){
      if(id){
         this.$refs.videoTabPreview.innerHTML='';
        //腾讯云里面的视频
          var option = {
              "auto_play": "0",
              "file_id": id,
              "app_id": "1252018592",
              "width": 400,
              "height": 225,
          };     
          new qcVideo.Player("videoTabPreview", option);
          this.videoid=id;
          this.videoname=name;
      }else{
        //外链的视频
        this.$refs.videoTabPreview.innerHTML=html;
        this.videoid='';
      }
      this.ishideone=true;
    },
    reuploadvideo(){
      //展示弹框
       this.$emit('showUploadPop');  
    },
    showPreviewContent:function(){
      //获得编辑器中的内容:这里的预览需要写一个界面（待完善。。。）
      if (this.articleID > -1) {
//    	保存显示预览(后台返回数据问题)
        this.$http.get("/api/content/"+this.articleID).then((response) => {
          let data = response.data.content;
          //给数据值
          this.previewCon[0].title = data.title;
          this.previewCon[0].subtitle = data.subtitle;
	          this.previewCon[0].content = data.content;          
	          this.previewCon[0].time = data.addtime;
	          this.previewCon[0].studioname = this.studioName;
	          this.$refs.yulan.previewConauthor(data.author);
	          this.previewCon[0].channel = data.channel;
          if (response.data.operatortype == "Edit") {      
	          this.previewCon[0].author = data.author;
          }
          
//        let $=qbVideo.get("$");
//        let _this = this;
//        setTimeout(function () {
//        	console.log($(".previewContent .video_container").size())
//        	let count = $(".previewContent .video_container").size();
//        	for (let i = 0; i < count; i++){
//        		if ($(".previewContent .video_container").eq(i).html() != '') {
//        			let serverfileid = 
//              $(".previewContent .video_container").eq(i).html('').attr('serverfileid');
//              $(".previewContent .video_container").eq(i).attr('id', 'video_container'+ serverfileid);
//              let id_con = $(".previewContent .video_container").eq(i).attr('id');
//              console.log(serverfileid)
//        			let options = {
//                  "auto_play": "0",
//                  "file_id": serverfileid,
//                  "app_id": "1252018592",
//                  "width": 640,
//                  "height": 480
//             };
//              new qcVideo.Player(id_con,options);
//        		}
//        	}
//        	 
//        },500)
        }, (error) => {
          this.$Notice.error({
            title: error.data.message,
            desc: false
          })
        });
        this.previewContent=true;
        var ele = this.elements;
        clearTimeout(time);
        var time =  setTimeout(function () {
          if (ele[3].clientHeight >= ele[0].clientHeight) {
            ele[1].style.display = 'none';
            ele[2].style.display = 'none';
          }else{
            ele[1].style.display = 'block';
            ele[2].style.display = 'block';
            var scale = ele[3].clientHeight / ele[0].clientHeight;
            ele[1].style.height = ele[2].clientHeight*scale + 'px'
          }
        },200)
      }else{
//    	不显示预览
        this.$Notice.warning({
          title: '保存后才能预览',
          desc: false
        })
      }
    },
   
    fromLocal:function(){
      this.localModal=true;
    },
    onError(error, fileid, ki) {
      this.$Notice.error({
        title: '错误',
        desc: error.message || '图片上传错误！'
      })
    },
    onSuccess(response, fileid, ki) {
      if (response.path) {
        this.formTop.cover = response.path;
      }
    },
    deleteAuthor:function(){
      if(!this.author){
        this.formTop.authorArr.pop();
      }
    },
    deleteKeyword:function(){
      if(!this.keyword){
        this.formTop.keywordArr.pop();
      }
    },
    closeAuthor:function(index){
      this.formTop.authorArr.splice(index,1);
      let This=this;
      this.temptimer=setTimeout(function(){
        let padleft=This.$refs.authorContainer.clientWidth;
        This.$refs.authorInput.style.paddingLeft=padleft+'px';
      },200);
      if(!this.author && this.formTop.authorArr.length == 0){
        this.placeauthor='每个作者最多5个字';
      }else{
        this.placeauthor='';
      }
    },
    checkAuthorCount:function(ev){
      if(!this.author && this.formTop.authorArr.length == 0){
        this.placeauthor='每个作者最多5个字';
      }else{
        this.placeauthor='';
      }

      let count=Math.ceil(this.gblen(this.author,10,'author'));
      //判断作者是否输入了空格
      let reg=/[^\s]\s+$/;
      if((reg.test(this.author) && ev.keyCode==32) || (count==5 && ev.keyCode==32 && this.author.Trim())){
        //输入了空格:是否重复：放到数组中去
        if(this.isRepeat(this.formTop.authorArr,this.author.Trim())){
          //有重复
          if(this.formTop.authorArr.length <3){
            //隐藏掉不为空
            this.$refs.authorTip.innerHTML="作者不能重复";
            this.isHideAuthor=false;
          }
        }else{
          //没重复
          if(this.formTop.authorArr.length >= 3){
            return;
          }
          this.formTop.authorArr.push(this.author.Trim());
          this.author='';
          let This=this;
          this.temptimer=setTimeout(function(){
            let padleft=This.$refs.authorContainer.clientWidth;
            This.$refs.authorInput.style.paddingLeft=padleft+'px';
          },200);

          this.isHideAuthor=true;
        }
      }
    },
    authorBlur:function(){
			if (this.formTop.authorArr.length == 0 && this.$refs.authorInput.value != '' && this.author.Trim()) {
				this.formTop.authorArr.push(this.author.Trim());
	      this.author='';
	      let This=this;
	      this.temptimer=setTimeout(function(){
	        let padleft=This.$refs.authorContainer.clientWidth;
	        This.$refs.authorInput.style.paddingLeft=padleft+'px';
	      },200);

	      this.isHideAuthor=true;
			}else{
				this.author='';
	      if(!this.isRepeat(this.formTop.authorArr)){
	        this.isHideAuthor=true;
	      }
			}
    },
    keywordBlur:function(){
      if (this.formTop.keywordArr.length == 0 && this.$refs.keywordInput.value != '' && this.keyword.Trim()) {
        this.formTop.keywordArr.push(this.keyword.Trim());
        this.keyword='';
        let This=this;
        this.temptimer=setTimeout(function(){
          let padleft=This.$refs.keywordContainer.clientWidth;
          This.$refs.keywordInput.style.paddingLeft=padleft+'px';
        },200);
        this.isHideKeyword=true;
      }else {
        this.keyword = '';
        if (!this.isRepeat(this.formTop.keywordArr)) {
          this.isHideKeyword = true;
        }
      }
    },
    closeKeyword:function(index){
      this.formTop.keywordArr.splice(index,1);
      let This=this;
      this.temptimer=setTimeout(function(){
        let padleft=This.$refs.keywordContainer.clientWidth;
        This.$refs.keywordInput.style.paddingLeft=padleft+'px';
      },200);
      if(!this.keyword && this.formTop.keywordArr.length == 0){
        this.placekeyword='每个作者最多5个字';
      }else{
        this.placekeyword='';
      }
    },
    checkKeywordCount:function(ev){
      if(!this.keyword && this.formTop.keywordArr.length == 0){
        this.placekeyword='每个作者最多5个字';
      }else{
        this.placekeyword='';
      }
      let count=Math.ceil(this.gblen(this.keyword,10,'keyword'))
      //判断作者是否输入了空格
      let reg=/[^\s]\s+$/;
      if(reg.test(this.keyword) && ev.keyCode==32 || (count==5 && ev.keyCode==32 && this.keyword.Trim())){
        //输入了空格:是否重复：放到数组中去
        if(this.isRepeat(this.formTop.keywordArr,this.keyword.Trim())){
          //有重复
          if(this.formTop.keywordArr.length < 5){
            this.isHideKeyword=false;
          }
        }else{
          //没重复
          if(this.formTop.keywordArr.length >= 5){
            return;
          }
          this.formTop.keywordArr.push(this.keyword.Trim());
          this.keyword='';
          let This=this;
          this.temptimer=setTimeout(function(){
            let padleft=This.$refs.keywordContainer.clientWidth;
            This.$refs.keywordInput.style.paddingLeft=padleft+'px';
          },200);

          this.isHideKeyword=true;
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
abstractWordCount:function(event){
      var length=Math.ceil(this.gblen(event.target.value,120,'summary'));
      if(length > 60){
        length=60;
      }
      this.formTop.currentAbstractCount=length;
    },
    handleError:function(error, file, fileList){
      this.$Notice.error({
        title: '上传失败',
        desc: false
      })
    },
    handleSuccess (res, file){
      this.localDefaultSrc=this.$conf.host+file.response.path;
    },
    handleFormatError (file) {
      this.$Notice.warning({
        title: '文件格式不正确',
        desc: '文件 ' + file.name + ' 格式不正确，请上传 jpg 或 png 格式的图片。'
      });
    },
    handleMaxSize (file) {
      this.$Notice.warning({
        title: '超出文件大小限制',
        desc: '文件 ' + file.name + ' 太大，不能超过 2M。'
      });
    },
     change (element) {
      this.elements = element;
    },
    clickLocalCoverOk:function(){
      this.formTop.cover=this.localDefaultSrc;
      this.localModal=false;
    },
    publish:function(){
      // 发布
      if(this.articleID > -1){
        //已经保存了，可以发布
        this.$http.put("/api/content/publish/"+this.articleID
        ).then((response) => {
        		if (response.data.status == 1) {
        			this.$Notice.success({title:response.data.message,desc: false});
//	            if (this.formTop.label == "Notice") {
//	            	let cookieGet = Cookies.get('clickedNo');
//	            	Cookies.set('clickedNo', cookieGet+','+this.articleID);
//	            }else if (this.formTop.label == "College"){
//	            	let cookieGet = Cookies.get('clickedCo');
//	            	Cookies.set('clickedCo', cookieGet+','+this.articleID);
//	            }
	            //发布成功：跳转到内容管理
	            this.$router.push("/manage/content");
        		}else{
        			this.$Notice.error({title:error.data.message,desc: false});
        		}
          }, (error) => {
            this.$Notice.error({title:error.data.message,desc: false});
          });
      }else{
        this.$Notice.warning({title:'请先保存，保存后才能发布!',desc: false});
      }
    },
    save:function(name,hideTip){
      let videohtml=this.$refs.videoTabPreview.innerHTML;
      if(this.videoid){
        videohtml='<p style="text-align:center" class="video_container" serverfileid="'+this.videoid+'" id="id_video_container_'+this.videoid+'">'+this.$refs.videoTabPreview.innerHTML+'</p>';
      }
      this.formTop.content=videohtml;
      this.formTop.author=this.formTop.authorArr.join(" ");
      this.formTop.keyword=this.formTop.keywordArr.join(" ");
      if(!this.formTop.author){
        //提示不能为空
        this.$refs.authorTip.innerHTML="作者不能为空";
        this.isHideAuthor=false;
      }
        this.$refs[name].validate((valid) => {
          //单独处理video标签
          if(!this.formTop.content){
            if(!hideTip){
              this.$Notice.error({title:'保存失败，请将内容填写完整',desc: false});
            }
            this.hideTip=false;
          }else if(!this.isHideKeyword){
            if(!hideTip){
              this.$Notice.error({title:'保存失败，请将内容填写完整',desc: false});
            }
          }else if(!this.isHideAuthor){
            if(!hideTip){
              this.$Notice.error({title:'保存失败，请将内容填写完整',desc: false});
            }
          }
          else if (valid) {
              if(this.articleID > -1){
                //更新
                this.$http.put("/api/content/"+this.articleID,this.formTop
               ).then((response) => {
               
               		if (response.data.status == 1) {
               			this.$Notice.success({title:response.data.message,desc: false});
               		}else{
               			this.$Notice.error({title:response.data.message,desc: false});
               		}
                    //this.articleID=response.data.id;
                }, (error) => {
                    this.$Notice.error({title:error.data.message,desc: false});
                });
              }else{
                //新建
                console.log(this.formTop);
                this.$http.post('/api/content',this.formTop)
                .then((response) => {
                    if (response.data.status == 1) {
                    	this.$Notice.success({title:'保存成功',desc: false});
                    }else{
                    	this.$Notice.error({title:response.data.message,desc: false});
                    }
                    this.articleID=response.data.id;
                }, (response) => {
                    this.$Notice.error({title:error.data.message,desc: false});
                });
              }
          } else {
            if(!hideTip) {
              this.$Notice.error({title:'保存失败，请将内容填写完整',desc: false});
            }
          }
        })
    },
    CopyUrl (ev){
      this.$refs.copyInput.select();
      document.execCommand("Copy");
    },
    share: function () {
        //需要访问后台
        this.$http.put("/api/content/share/"+this.articleID).then((response) => {
          if(response.data.status == 1){
              //分享成功
              var scrollTop=0;
              if(document.documentElement&&document.documentElement.scrollTop)
              {
                scrollTop=document.documentElement.scrollTop;
              }
              else if(document.body)
              {
                scrollTop=document.body.scrollTop;
              }
              this.$refs.shareHide.$el.children[1].children[0].style.top = (195 - scrollTop) + 'px';

              this.useqrcode(this.$conf.host+this.$conf.root+"share?id="+response.data.token);
              this.codes=this.$conf.host+this.$conf.root+"share?id="+response.data.token;

              this.qCode = true;
            }else{
               this.$Notice.warning({
                title: '保存后才能分享！',
                desc: false
               })
            }
        }, (error) => {
            this.$Notice.warning({
                title: error.data.message,
                desc: false
            })
       });
    },
    //滚动条
    changeView: function (view) {
      this.tabView = view;
      this.elements[0].style.top = '0px';//内容高度
      this.elements[1].style.top = '0px';//条的高度
      var ele = this.elements;
      clearTimeout(time)
      var time=setTimeout(function () {
      	if (ele[3].clientHeight < ele[0].clientHeight) {
	      	ele[1].style.display = 'block';
	      	ele[2].style.display = 'block';

	      	var scale = ele[3].clientHeight / ele[0].clientHeight;
	      	ele[1].style.height = ele[2].clientHeight*scale + 'px'
	      }else{
	      	console.log(ele[0])
	      	ele[1].style.display = 'none';
	      	ele[2].style.display = 'none';
	      }
      },10)

    },
    htmlspecialchars_decode:function(str){
      str = str.replace(/&amp;/g, '&');
      str = str.replace(/&lt;/g, '<');
      str = str.replace(/&gt;/g, '>');
      str = str.replace(/&quot;/g, '"');
      str = str.replace(/&#039;/g, "'");
      str = str.replace(/&#32;/g, " ");
      return str;
    },
    getTitleContent:function(){
      //需要转换为字符
      let count=this.gblen(this.formTop.title,44,'title');
      this.titleContentCount=Math.ceil(count)>22 ? 22:Math.ceil(count);
    },
     getSubTitleContent:function(){
      //需要转换为字符
      let count=this.gblen(this.formTop.subtitle,120,'subtitle');
      this.subtitleContentCount=Math.ceil(count) > 60 ? 60:Math.ceil(count);
    },
    removetrim:function(){
      if(!this.formTop.title.Trim()){
        this.formTop.title='';
      }
    },
    //转为字符：中文1个 英文0.5个
    gblen:function(str,max,name){
      var len = 0;
      if(name == 'title'){
        this.titleMaxCount=22;
      }else if(name == 'subtitle'){
        this.subtitleMaxCount=60;
      }else if(name == 'summary'){
        this.summaryMaxCount=60;
      }else if(name == 'author'){
        this.authorMaxCount=5;
      }else if(name == 'keyword'){
        this.keyMaxCount=5;
      }
      for (var i=0; i<str.length; i++) {
        if (str.charCodeAt(i)>127 || str.charCodeAt(i)==94) {
          len ++;
        } else {
          switch(name){
            case 'title':
              this.titleMaxCount+=0.5;
              if(this.titleMaxCount > max){
                this.titleMaxCount=max;
              }
              break;
            case 'subtitle':
              this.subtitleMaxCount+=0.5;
              if(this.subtitleMaxCount > max){
                this.subtitleMaxCount=max;
              }
              break;
            case 'summary':
              this.summaryMaxCount+=0.5;
              if(this.summaryMaxCount > max){
                this.summaryMaxCount=max;
              }
              break;
            case 'author':
              this.authorMaxCount+=0.5;
              if(this.authorMaxCount > max){
                this.authorMaxCount=max;
              }
              break;
            case 'keyword':
              this.keyMaxCount+=0.5;
              if(this.keyMaxCount > max){
                this.keyMaxCount=max;
              }
              break;
          }
          len +=0.5;
        }
      }
      return len;
    }
  },
}

String.prototype.Trim = function()
{
  return this.replace(/(^\s*)|(\s*$)/g, "");
}
