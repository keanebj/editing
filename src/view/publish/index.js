import VueQArt from 'vue-qart'
import ScrollBar from '@/view/scroll/index.vue'
import '../../../static/ueditor1_4_3_3-utf8-jsp/ueditor.config.js'
import '../../../static/ueditor1_4_3_3-utf8-jsp/ueditor.all.min.js'
import '../../../static/ueditor1_4_3_3-utf8-jsp/lang/zh-cn/zh-cn.js'
import '../../../static/ueditor1_4_3_3-utf8-jsp/ueditor.parse.min.js'
export default {
  name: 'ViewPublish',
  components:{
    ScrollBar,
    VueQArt
  },
  data () {
    return {
      //二维码
      config: {
        value: 'http://www.baidu.com',
        imagePath: require('../../assets/erweima.png'),
        filter: 'color',
      },
      downloadButton: false,

      articleID:0,
      hideTip:true,
      qCode: false,
      titleContentCount:0,
      editor:null,
      dialogTitle:'错误提示',
      dialogContent:'还有未正确填写的项',
      tabView:'pc',
      previewContent:false,
      localModal:false,
      contentModal:false,
      contentCoverSrc:'',
     /* contentPics:[{src:require('../../assets/logo.png')},{src:require('../../assets/img.png')},{src:require('../../assets/img.png')}
        ,{src:require('../../assets/img.png')},{src:require('../../assets/img.png')},{src:require('../../assets/img.png')}
        ,{src:require('../../assets/img.png')},{src:require('../../assets/img.png')},{src:require('../../assets/img.png')}],
      */publishChannels:['人民日报中央厨房'],
      formTop: {
        publishChannel: '人民日报中央厨房',
        author: '',
        keyword: '',
        cover:'',
        abstract:'',
        currentAbstractCount:0,
        titleContent:'',
        editorContent:'',
      },
      ruleValidate: {
        author: [
          { required: true, message: '作者不能为空', trigger: 'blur' }
        ],
        cover: [
          { required: true, message: '封面不能为空', trigger: 'blur' }
        ],
        abstract:[
          { type: 'string', max: 140, message: '介绍不能大于140字', trigger: 'change' }
        ],
        titleContent:[
          { required: true, message: '标题不能为空', trigger: 'change' },
          { type: 'string', max: 50, message: '标题不能大于50字', trigger: 'change' }
        ]
      },
      localDefaultSrc:require('../../assets/logo.png'),
      elements: [],
      previewCon: [
        '',
        [{src:require('../../assets/img.png')}]
      ],
      iIndex: [-1],
      i: -1,
      tempi: -1,
      timer:null
    }
  },
  created(){
    //判断一下是编辑还是草稿通过文章的id
    //编辑：发出ajax请求
    if(this.articleID != 0) {
      this.$http({
        method: 'POST',
        url: "/api/post",
        params: {articleID: this.articleID}
      }).then((response) => {
        let data = response.data;
        //给数据值
        this.formTop.titleContent = data.title;
        this.formTop.publishChannel = data.channel;
        this.formTop.author = data.author;
        this.formTop.keyword = data.keyWord;
        this.formTop.cover = data.cover;
        this.formTop.abstract = data.abstract;
        this.formTop.editorContent = data.content;
        this.formTop.currentAbstractCount = data.abstract.toString().length;
        this.titleContentCount = data.title.toString().length;
      }, (response) => {
        alert("error");
      });
    }else{
      //新建
    }
  },
  mounted(){
    this.editor=UE.getEditor("editor",{
      //此处可以定制工具栏的功能，若不设置，则默认是全部的功能
      UEDITOR_HOME_URL: '/static/ueditor1_4_3_3-utf8-jsp/',
      //serverUrl: config.ajaxUrl + '/ueditor/jsp/controller.jsp',
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
    this.editor.ready(function(){
      This.editor.execCommand('inserthtml',This.formTop.editorContent);
    })
    //自动保存:半分钟自动保存一次
    this.timer=setInterval(function(){
      //存到本地草稿

      //存到数据库
      This.save('formTop',true);
    },3000);

  },
  watch:{

  },
  destroyed() {
    //清除定时器
    clearInterval(this.timer);
    this.editor.destroy();
  },
  methods: {
    showPreviewContent:function(){
      //获得编辑器中的内容
      this.previewCon[0]=this.editor.getContent();
      this.previewContent=true;
    },
    fromContent:function(){
      //从正文选择图片
      //判断是否有图片？正则匹配到数组
      let reg=/<img\b[^>]*src\s*=\s*"[^>"]*\.(?:png|jpg|jpeg|gif)"[^>]*>/gi;
     //let content=this.editor.getContent();
      let content='<p>wijifdf</p><img src="http://www.w3school.com.cn/i/ct_css_selector.gif"/><i class="dfdf"></i><img src="http://pagead2.googlesyndication.com/sadbundle/$dns%3Doff$/2192791104758210524/1-3.png"/><div>fdfdf</div>';
      let imgArr=content.match(reg);
      var srcReg = /src=[\'\"]?([^\'\"]*)[\'\"]?/i;
      //未匹配到图片
      if(!imgArr){
        this.$Message.warning('正文还没有图片');
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
 /* selectCover:function(index){
       this.iIndex[0]=index;
      // this.contentCoverSrc=this.previewCon[index].src;
     /!* this.i=index;
      this.contentCoverSrc=this.contentPics[index].src;*!/
    },*/
    clickCoverOk:function(){
      //选择的封面显示在文本域中
      if(this.iIndex[0]>=0){
        this.formTop.cover=this.iIndex[1];
        this.tempi=this.iIndex[0];
        this.i=this.iIndex[0];
        console.log("点击确定按钮temip"+this.tempi +"i="+this.i)
        this.contentModal=false;
      }else{
        //未选择封面，提示选择
        this.$Message.warning('请选择封面');
      }
    },
    closeContentPop:function(){
      //关闭选择正文封面的弹框
      this.iIndex[0] = this.tempi;
      console.log("关闭弹框时：tempi" +this.tempi);
      console.log("关闭弹框时：i" +this.iIndex[0]);
      this.contentModal=false;
    },
    change (element) {
      this.elements = element;

    },
    index (iIndex) {
      this.iIndex = iIndex;

    },
    abstractWordCount:function(event){
      var length=event.target.value.length;
      this.formTop.currentAbstractCount=length;
    },
    handleError:function(error, file, fileList){
      this.$Message.error('上传失败');
    },
    handleSuccess (res, file) {
      // 因为上传过程为实例，这里模拟添加 url
      file.url=require('../../assets/img.png');
      this.localDefaultSrc=file.url;
      //file.url = 'https://o5wwk8baw.qnssl.com/7eb99afb9d5f317c912f08b5212fd69a/avatar';
      //file.name = '7eb99afb9d5f317c912f08b5212fd69a';
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
      this.formTop.cover=require('../../assets/img.png');
      this.localModal=false;
    },
    renderAbstract:function(){
      let content=this.editor.getContent();
      if(!content){
        this.$Message.warning("正文内容为空,无法生成摘要");
      }else{
        //interface://获得正文的摘要:需要发送请求给后台，参数：正文内容  返回：摘要内容
        this.$http({
          method: 'POST',
          url: "/api/post",
          params: { content: content }
        }).then((response) => {
          console.log(response);
          this.formTop.abstract=response.data.abstract.toString();
          this.formTop.currentAbstractCount=response.data.abstract.toString().length;
        },(response) => {
          alert("error");
        });
      }
    },
    publish:function(name){
      // 发布
      this.formTop.editorContent=this.editor.getContent();
      this.$refs[name].validate((valid) => {
        if(!this.formTop.editorContent){
            this.$Message.error('保存失败，请检查格式是否正确!');
            this.hideTip=false;
        }
        else if (valid) {
          //通过验证，访问后台，保存表单数据
          this.$http({
            method: 'POST',
            url: "",
            params: {formData:this.formTop,id:this.articleID}//后台可以判断是都有稿件id判断是插入还是更新
          }).then((response) => {
            if(response.status == 200){
                this.$Message.success('发布成功!');
                //this.articleID=response.data.ID;
            }else{
                this.$Message.error('保存失败，请检查格式是否正确!');
            }
          });
        } else {
            this.$Message.error('保存失败，请检查格式是否正确!');
        }
      })


    },
    save:function(name,hideTip){
      this.formTop.editorContent=this.editor.getContent();
        this.$refs[name].validate((valid) => {
          if(!this.formTop.editorContent){
            if(!hideTip){
              this.$Message.error('保存失败，请检查格式是否正确!');
            }
            this.hideTip=false;
          }
          else if (valid) {
            //通过验证，访问后台，保存表单数据
            this.$http({
              method: 'POST',
              url: "",
              params: {formData:this.formTop,id:this.articleID}//后台可以判断是都有稿件id判断是插入还是更新
            }).then((response) => {
                if(response.status == 200){
                  if(!hideTip) {
                    this.$Message.success('保存成功!');
                    //this.articleID=response.data.ID;
                  }
                }else{
                  if(!hideTip) {
                    this.$Message.error('保存失败，请检查格式是否正确!');
                  }
                }
            });
          } else {
            if(!hideTip) {
              this.$Message.error('保存失败，请检查格式是否正确!');
            }
          }
        })
    },
    CopyUrl (ev){
      this.$refs.copyInput.select();
      document.execCommand("Copy");
    },
    share: function () {
      //点击分享的时候需要后台返回详情页的url
      this.$http({
        method: 'GET',
        url: "",
        params: {id:this.articleID}
      }).then((response) => {
        if(response.status == 200){
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

          //this.config.value=response.data.qcodelink;
          this.qCode = true;
        }else{
          this.$Message.error('此文章暂时不能分享');
        }
      });
    },
    //滚动条
    changeView: function (view) {
      this.tabView = view;
      this.elements[0].style.top = '0px';
      this.elements[1].style.top = '0px';
    },
    scrollBar: function (e) {
      if (e.wheelDelta) {
        if (e.wheelDelta < 0) {
          let t = this.$refs.onscroll.offsetTop;
          t -= 20;
          if ( t <= -(this.$refs.onscroll.clientHeight - this.$refs.setCon.clientHeight)){
            t = this.$refs.setCon.clientHeight - this.$refs.onscroll.clientHeight;
          }
          let scale = t/(this.$refs.onscroll.clientHeight - this.$refs.setCon.clientHeight);
          let scTop = scale*(this.$refs.scroll.clientHeight - this.$refs.scrollCon.clientHeight)
          this.$refs.scrollCon.style.top = -scTop + 'px';
          this.$refs.onscroll.style.top = t + 'px';
        }else if (e.wheelDelta > 0) {
          let t = this.$refs.onscroll.offsetTop;
          t += 20;
          if ( t >= 0) {
            t = 0
          }
          let scale = t/(this.$refs.onscroll.clientHeight - this.$refs.setCon.clientHeight);
          let scTop = scale*(this.$refs.scroll.clientHeight - this.$refs.scrollCon.clientHeight)
          this.$refs.scrollCon.style.top = -scTop + 'px';
          this.$refs.onscroll.style.top = t + 'px';
        }
      }else if (e.detail) {
        if (e.detail > 0) {
          let t = this.$refs.onscroll.offsetTop;
          t -= 20;
          if ( t <= -(this.$refs.onscroll.clientHeight - this.$refs.setCon.clientHeight)){
            t = this.$refs.setCon.clientHeight - this.$refs.onscroll.clientHeight;
          }
          let scale = t/(this.$refs.onscroll.clientHeight - this.$refs.setCon.clientHeight);
          let scTop = scale*(this.$refs.scroll.clientHeight - this.$refs.scrollCon.clientHeight)
          this.$refs.scrollCon.style.top = -scTop + 'px';
          this.$refs.onscroll.style.top = t + 'px';
        }else if (e.detail < 0) {
          let t = this.$refs.onscroll.offsetTop;
          t += 20;
          if ( t <= -(this.$refs.onscroll.clientHeight - this.$refs.setCon.clientHeight)){
            t = this.$refs.setCon.clientHeight - this.$refs.onscroll.clientHeight;
          }
          let scale = t/(this.$refs.onscroll.clientHeight - this.$refs.setCon.clientHeight);
          let scTop = scale*(this.$refs.scroll.clientHeight - this.$refs.scrollCon.clientHeight)
          this.$refs.scrollCon.style.top = -scTop + 'px';
          this.$refs.onscroll.style.top = t + 'px';
        }
      }
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
      this.titleContentCount=this.formTop.titleContent.length;
    },
  }

}
