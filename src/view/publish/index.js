import VueQArt from 'vue-qart'
import ScrollBar from '@/view/scroll/index.vue'
import cropperUpload from '@/components/cropperUpload/index.vue'
import '../../../static/ueditor1_4_3_3-utf8-jsp/ueditor.config.js'
import '../../../static/ueditor1_4_3_3-utf8-jsp/ueditor.all.js'
import '../../../static/ueditor1_4_3_3-utf8-jsp/lang/zh-cn/zh-cn.js'
import '../../../static/ueditor1_4_3_3-utf8-jsp/ueditor.parse.min.js'
export default {
  name: 'ViewPublish',
  components:{
    ScrollBar,
    VueQArt,
    cropperUpload
  },
  data () {
    return {
      //二维码
      config: {
        value: 'http://www.baidu.com',
        imagePath: require('../../assets/erweima.png'),
        filter: 'color',
      },
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
        College: '人民日报中央厨房'
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
          { required: true, message: '标题不能为空', trigger: 'change' }
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
        this.formTop.authorArr=data.author.split(" ");
        this.formTop.keywordArr=data.keyword.split(" ");
        this.formTop.cover = data.cover;
        this.formTop.summary = data.summary;
        this.formTop.content = data.content;
        this.formTop.label = data.label;
        if(data.summary){
          this.formTop.currentAbstractCount = Math.ceil(this.gblen(data.summary,120,'summary')) >60?60:Math.ceil(this.gblen(data.summary,120,'summary'));
        }

        this.titleContentCount = Math.ceil(this.gblen(data.title,44,'title')) > 22 ? 22:Math.ceil(this.gblen(data.title,44,'title'));
        this.editor.ready(function(){
          This.editor.execCommand('inserthtml',This.formTop.content);
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
    goBack(){
      this.$router.push('/home')
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
      //let content='<p>wijifdf</p><img src="http://www.w3school.com.cn/i/ct_css_selector.gif"/><i class="dfdf"></i><img src="http://pagead2.googlesyndication.com/sadbundle/$dns%3Doff$/2192791104758210524/1-3.png"/><div>fdfdf</div>';
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
        //this.baseimg="data:image/jpg;base64,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";
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
      this.author='';
      if(!this.isRepeat(this.formTop.authorArr)){
        this.isHideAuthor=true;
      }
    },
    keywordBlur:function(){
      this.keyword='';
      if(!this.isRepeat(this.formTop.keywordArr)){
        this.isHideKeyword=true;
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
                    this.$Notice.success({title:'保存成功',desc: false});
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
        if(this.articleID > 0){
          //可以分享
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

          this.config.value="http://mp.dev.hubpd.com/notice?id="+this.articleID;
          this.qCode = true;
        }else{
          this.$Notice.warning({
            title: '此文章暂时不能分享',
            desc: false
          })
        }
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
