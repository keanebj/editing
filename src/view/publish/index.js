import QRCode from 'qrcode'
import ScrollBar from '@/view/scroll/index.vue'
import cropperUpload from '@/components/cropperUpload/index.vue'
import '../../../static/ueditor1_4_3_3-utf8-jsp/ueditor.config.js'
import '../../../static/ueditor1_4_3_3-utf8-jsp/ueditor.all.js'
import '../../../static/ueditor1_4_3_3-utf8-jsp/lang/zh-cn/zh-cn.js'
import '../../../static/ueditor1_4_3_3-utf8-jsp/ueditor.parse.min.js'
import Vue from 'vue'
Vue.use(QRCode)
export default {
  name: 'ViewPublish',
  components:{
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
      editor: null,
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
      summaryMaxCount:60,
      authorMaxCount:5,
      keyMaxCount:5,
      author: '',
      keyword: '',
      formTop: {
        contenttype:"Article",
        channel: '人民日报中央厨房',
        author: '',
        authorArr:[],
        keywordArr:[],
        keyword: '',
        cover:'',
        summary:'',
        currentAbstractCount:0,
        title:'',
        content:'',
        label:'Notice'
      },
      ruleValidate: {
        authorArr: [
          { required: true, message: ' '}
        ],
        cover: [
          { required: true, message: '封面不能为空', trigger: 'blur' }
        ],
        title:[
          { required: true, message: '标题不能为空', trigger: 'blur' }
        ],
        label: [
          { required: true, message: '标签不能为空', trigger: 'blur' }
        ],
      },
      localDefaultSrc:'http://mp.dev.hubpd.com/product/images/logo_login.png',
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
      noSel:false
  }
  },
  created(){
    this.roleType=this.$store.state.userinfo.roleType;
    this.$http.get("/api/studio/"+this.$store.state.userinfo.id).then((response) => {
      this.studioName = response.data.studio.studioname;
    }, (response) => {
      this.$Notice.error({
        title: error.data.message,
        desc: false
      })
    })
  },
  mounted(){
    //用于隐藏左侧
    var span5 =  document.querySelector(".ivu-col-span-5")
    var span19 =  document.querySelector(".ivu-col-span-19")
    span5.style.display = 'none';
    span19.className = "layout-content-warp ivu-col ivu-col-span-24";

    this.editor=UE.getEditor("editor",{
      //此处可以定制工具栏的功能，若不设置，则默认是全部的功能
      UEDITOR_HOME_URL: `${this.$conf.root}/static/ueditor1_4_3_3-utf8-jsp/`,
      emotionLocalization: true,
      scaleEnabled: true,
    })
    let This=this;
    this.editor.addListener("contentChange", function () {
        if(!This.editor.getContent()){
            This.hideTip=false;
        }else{
          This.hideTip=true;
        }
    })

    //判断一下是编辑还是草稿通过文章的id
    if(this.$route.query.articleID){
      this.articleID=this.$route.query.articleID;
    }

    //编辑：发出ajax请求
    if(this.articleID > 0) {
      this.$http.get("/api/content/"+this.articleID).then((response) => {
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
        this.formTop.label = data.label;
        if(data.summary){
          this.formTop.currentAbstractCount = Math.ceil(this.gblen(data.summary,120,'summary')) >60?60:Math.ceil(this.gblen(data.summary,120,'summary'));
        }

        this.titleContentCount = Math.ceil(this.gblen(data.title,44,'title')) > 22 ? 22:Math.ceil(this.gblen(data.title,44,'title'));
        this.editor.ready(function(){
          This.editor.execCommand('inserthtml',This.formTop.content,true);
        })
      }, (error) => {
        this.$Notice.error({
          title: error.data.message,
          desc: false
        })
      });
    }else{
      this.editor.ready(function(){
        This.editor.execCommand('inserthtml',This.formTop.content);
      })
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
    let This=this;
    setTimeout(function(){This.editor.destroy();},1000)

  },
  methods: {
    useqrcode(url){
      var canvas = document.getElementById('canvas');
      QRCode.toCanvas(canvas, url, function (error) {
        if (error) console.error(error)
        console.log('success!');
      })
    },
    goBack(){
      this.$router.go(-1);
      /*if(this.$route.query.type == 'edit'){
        this.$router.push('/manage/content')
      }else{
        this.$router.push('/')
      }*/
    },
    showPreviewContent:function(){
      //获得编辑器中的内容:这里的预览需要写一个界面（待完善。。。）
      if (this.articleID > -1) {
//    	保存显示预览(后台返回数据问题)
        this.$http.get("/api/content/"+this.articleID).then((response) => {
          let data = response.data.content;
          //给数据值
          this.previewCon[0].title = data.title;
          this.previewCon[0].content = data.content;
          this.previewCon[0].time = data.addtime;
          this.previewCon[0].studioname = this.studioName;
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
    fromContent:function(){
      //从正文选择图片
      //判断是否有图片？正则匹配到数组
      let reg=/<img\b[^>]*src\s*=\s*"[^>"]*\.(?:png|jpg|jpeg|gif)"[^>]*>/gi;
      let content=this.editor.getContent();
      let imgArr=content.match(reg);
      var srcReg = /src=[\'\"]?([^\'\"]*)[\'\"]?/i;
      //未匹配到图片
      if(!imgArr){
        this.$Notice.warning({
          title: '正文还没有图片',
          desc: false
        })
      }else{
        this.previewCon[1]=[];
        //匹配到了图片,把图片路径放到数组中
        for(let k=0;k<imgArr.length;k++){
            let src=imgArr[k].match(srcReg);
            src=src[0].substring(4).replace(/\"/g,"");
            this.previewCon[1].push({src:src});
        }
        this.contentModal=true;
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
        this.formTop.cover = 'http://mp.dev.hubpd.com/' + response.path;
      }
    },
    getBase64Image(img) {
        var canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        var ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, img.width, img.height);
        var ext = img.src.substring(img.src.lastIndexOf(".")+1).toLowerCase();
        var dataURL = canvas.toDataURL("image/"+ext);
        return dataURL;
    },
    clickCoverOk:function(){
      //选择的封面显示在文本域中
      if(this.iIndex[0]>=0){
        //this.formTop.cover=this.iIndex[1];
        //转为base64
        var image = new Image();
        image.src = this.iIndex[1];
        this.baseimg = this.getBase64Image(image);
        this.noSel=false;
        this.tempi=this.iIndex[0];
        this.i=this.iIndex[0];
        this.contentModal=false;
      }else{
        this.noSel=true;
        //未选择封面，提示选择
        this.$Notice.warning({
          title: '请选择封面',
          desc: false
        })
      }
    },
    closeContentPop:function(){
      //关闭选择正文封面的弹框
      this.iIndex[0] = this.tempi;
      this.contentModal=false;
    },
    change (element) {
      this.elements = element;

    },
    index (iIndex) {
      this.iIndex = iIndex;
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
      this.localDefaultSrc="http://mp.dev.hubpd.com/"+file.response.path;
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
    clickLocalCoverOk:function(){
      this.formTop.cover=this.localDefaultSrc;
      this.localModal=false;
    },
    renderAbstract:function(){
      let content=this.editor.getContent();
      let title=this.formTop.title;
      if(!content && !title){
        this.$Notice.warning({
          title:"标题和正文为空,无法生成摘要",
          desc: false
        });
      }else{
        //interface://获得正文的摘要:需要发送请求给后台，参数：正文内容  返回：摘要内容
          this.$http.post("/api/content/summary",{content: content,title:title}
          // ,{
            // headers:{
            //   token:this.token
            // }
        // }
        ).then((response) => {
          this.formTop.summary=response.data.summary.toString();
          this.formTop.currentAbstractCount=Math.ceil(this.gblen(response.data.summary,120,'summary'))>60?60:Math.ceil(this.gblen(response.data.summary,120,'summary'));
        },(error) => {
            this.$Notice.error({
              title:error.data.message,
              desc: false
            });
        });
      }
    },
    publish:function(){
      // 发布
      if(this.articleID > -1){
        //已经保存了，可以发布
        this.$http.put("/api/content/publish/"+this.articleID
        ).then((response) => {
            this.$Notice.success({title:response.data.message,desc: false});
            //发布成功：跳转到内容管理
            this.$router.push("manage/content");
          }, (error) => {
            this.$Notice.error({title:error.data.message,desc: false});
          });
      }else{
        this.$Notice.warning({title:'请先保存，保存后才能发布!',desc: false});
      }
    },
    save:function(name,hideTip){
      this.formTop.content=this.editor.getContent();
      this.formTop.author=this.formTop.authorArr.join(" ");
      this.formTop.keyword=this.formTop.keywordArr.join(" ");
      if(!this.formTop.author){
        //提示不能为空
        this.$refs.authorTip.innerHTML="作者不能为空";
        this.isHideAuthor=false;
      }
        this.$refs[name].validate((valid) => {
          if(!this.formTop.content){
            if(!hideTip){
              this.$Notice.error({title:'保存失败，请检查格式是否正确!',desc: false});
            }
            this.hideTip=false;
          }else if(!this.isHideKeyword){
            if(!hideTip){
              this.$Notice.error({title:'保存失败，请检查格式是否正确!',desc: false});
            }
          }else if(!this.isHideAuthor){
            if(!hideTip){
              this.$Notice.error({title:'保存失败，请检查格式是否正确!',desc: false});
            }
          }
          else if (valid) {
              if(this.articleID > -1){
                //更新
                this.$http.put("/api/content/"+this.articleID,this.formTop
               ).then((response) => {
                    this.$Notice.success({title:response.data.message,desc: false});
                    //this.articleID=response.data.id;
                }, (error) => {
                    this.$Notice.error({title:error.data.message,desc: false});
                });
              }else{
                //新建
                this.$http.post('/api/content',this.formTop)
                .then((response) => {
                    this.$Notice.success({title:response.data.message,desc: false});
                    this.articleID=response.data.id;
                }, (response) => {
                    this.$Notice.error({title:error.data.message,desc: false});
                });
              }
          } else {
            if(!hideTip) {
              this.$Notice.error({title:'保存失败，请检查格式是否正确!',desc: false});
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

              this.useqrcode("http://mp.dev.hubpd.com/newmedia/share?id="+response.data.token);
              this.codes="http://mp.dev.hubpd.com/newmedia/share?id="+response.data.token;
              this.qCode = true;
            }else{
               this.$Notice.warning({
                title: response.data.message,
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
//  mouseScroll: function (ev) {
//  	let cY = ev.clientY;
//  	let onscroll = this.$refs.onscroll;
//  	let setCon = this.$refs.setCon;
//  	let scroll = this.$refs.scroll;
//  	let scrollCon = this.$refs.scrollCon;
//  	document.onmousemove = function (e) {
//				let ch = cY - e.clientY;
//				let Top = ch + onscroll.offsetTop;
//				if (Top>=0) {
//					Top = 0;
//				}
//				if(Top<= (setCon.clientHeight - onscroll.clientHeight)) {
//					Top = setCon.clientHeight - onscroll.clientHeight
//				}
//				let scale = Top/(onscroll.clientHeight - setCon.clientHeight);
//  		let scTop = scale*(scroll.clientHeight - scrollCon.clientHeight)
//				onscroll.style.top = Top + 'px';
//				scrollCon.style.top = -scTop + 'px';
//  	}
//  	document.onmouseup = function () {
//  		document.onmousemove = null;
//  	}
//  },
//  barScroll: function (ev) {
//  	let cY = ev.clientY - this.$refs.scrollCon.offsetTop;
//  	let onscroll = this.$refs.onscroll;
//  	let setCon = this.$refs.setCon;
//  	let scroll = this.$refs.scroll;
//  	let scrollCon = this.$refs.scrollCon;
//  	console.log(scrollCon.offsetTop)//10
//  	document.onmousemove = function (e) {
//				let Top = e.clientY - cY;
////				let Top = ch + scrollCon.offsetTop;
//				if (Top<=0) {
//					Top = 0;
//				}
//				if(Top>= (scroll.clientHeight - scrollCon.clientHeight)) {
//					Top = scroll.clientHeight - scrollCon.clientHeight
//				}
//				let scale = Top/(scroll.clientHeight - scrollCon.clientHeight);
//  		let scTop = scale*(onscroll.clientHeight - setCon.clientHeight)
//				scrollCon.style.top = Top + 'px';
//				onscroll.style.top = -scTop + 'px';
//  	}
//  	document.onmouseup = function () {
//  		document.onmousemove = null;
//  	}
//  }

    //editor
    getTitleContent:function(){
      //需要转换为字符
      let count=this.gblen(this.formTop.title,44,'title');
      this.titleContentCount=Math.ceil(count)>22 ? 22:Math.ceil(count);
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
