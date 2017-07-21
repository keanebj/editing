import VueQArt from 'vue-qart'
import ScrollBar from '@/view/scroll/index.vue'
import '../../../static/ueditor1_4_3_3-utf8-jsp/ueditor.config.js'
import '../../../static/ueditor1_4_3_3-utf8-jsp/ueditor.all.js'
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
      formTop: {
        contenttype:"Article",
        channel: '人民日报中央厨房',
        author: '',
        keyword: '',
        cover:'',
        summary:'',
        currentAbstractCount:0,
        title:'',
        content:'',
        label:'Notice'
      },
      ruleValidate: {
        author: [
          { required: true, message: '作者不能为空', trigger: 'blur' }
        ],
        cover: [
          { required: true, message: '封面不能为空', trigger: 'blur' }
        ],
        summary:[
          { type: 'string', max: 140, message: '介绍不能大于140字', trigger: 'change' }
        ],
        title:[
          { required: true, message: '标题不能为空', trigger: 'change' },
          { type: 'string', max: 50, message: '标题不能大于50字', trigger: 'change' }
        ],
        label: [
          { required: true, message: '标签不能为空', trigger: 'blur' }
        ],

      },
      localDefaultSrc:'http://mp.dev.hubpd.com/product/images/logo_login.png',
      elements: [],
      previewCon: [
        '',
        []
      ],
      iIndex: [-1],
      i: -1,
      tempi: -1,
      timer:null,
      headers:{
        token:this.$store.state.token
      },
      token:this.$store.state.token
    }
  },
  created(){
    this.roleType=this.$store.state.userinfo.roleType;
  },
  mounted(){
    //用于隐藏左侧
    var span5 =  document.querySelector(".ivu-col-span-5")
    var span19 =  document.querySelector(".ivu-col-span-19")
    span5.style.display = 'none';
    span19.className = "layout-content-warp ivu-col ivu-col-span-24";

    this.editor=UE.getEditor("editor",{
      //此处可以定制工具栏的功能，若不设置，则默认是全部的功能
      UEDITOR_HOME_URL: '/static/ueditor1_4_3_3-utf8-jsp/',
      // UEDITOR_HOME_URL: `/${this.$conf.root}/static/ueditor1_4_3_3-utf8-jsp/`,
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
        this.formTop.author = data.author;
        this.formTop.keyword = data.keyword;
        this.formTop.cover = data.cover;
        this.formTop.summary = data.summary;
        this.formTop.content = data.content;
        this.formTop.label = data.label;
        if(data.summary){
          this.formTop.currentAbstractCount = data.summary.toString().length;
        }
        this.titleContentCount = data.title.length;
        this.editor.ready(function(){
          This.editor.execCommand('inserthtml',This.formTop.content);
        })

      }, (response) => {
        this.$Message.error(response.data.message);
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
  destroyed() {
    //清除定时器
    clearInterval(this.timer);
    this.editor.destroy();
  },
  methods: {
    goBack(){
      this.$router.push('/home')
    },
    showPreviewContent:function(){
      //获得编辑器中的内容:这里的预览需要写一个界面（待完善。。。）
    this.previewCon[0]=this.editor.getContent();
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
    clickCoverOk:function(){
      //选择的封面显示在文本域中
      if(this.iIndex[0]>=0){
        this.formTop.cover=this.iIndex[1];
        this.tempi=this.iIndex[0];
        this.i=this.iIndex[0];
        this.contentModal=false;
      }else{
        //未选择封面，提示选择
        this.$Message.warning('请选择封面');
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
    abstractWordCount:function(event){
      var length=event.target.value.length;
      this.formTop.currentAbstractCount=length;
    },
    handleError:function(error, file, fileList){
      this.$Message.error('上传失败');
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
        this.$Message.warning("标题和正文为空,无法生成摘要");
      }else{
        //interface://获得正文的摘要:需要发送请求给后台，参数：正文内容  返回：摘要内容
          this.$http.post("/api/content/summary",{content: content,title:title}
          // ,{
            // headers:{
            //   token:this.token
            // }
        // }
        ).then((response) => {
          console.log(response);
          this.formTop.summary=response.data.summary.toString();
          this.formTop.currentAbstractCount=response.data.summary.toString().length;
        },(error) => {
          this.$Message.error(error.data.message);
        });
      }
    },
    publish:function(name){
      // 发布：暂时不做

     /* this.formTop.editorContent=this.editor.getContent();
      this.$refs[name].validate((valid) => {
        if(!this.formTop.editorContent){
            this.$Message.error('保存失败，请检查格式是否正确!');
            this.hideTip=false;
        }
        else if (valid) {
          //通过验证，访问后台，保存表单数据
          this.$http.put("/api/content/publish/"+this.articleID,{contentid:this.articleID}).then((response) => {
             this.$Message.success('发布成功!');
          });
        } else {
            this.$Message.error('发布失败，请检查格式是否正确!');
        }
      })*/


    },
    save:function(name,hideTip){
      this.formTop.content=this.editor.getContent();
        this.$refs[name].validate((valid) => {
          if(!this.formTop.content){
            if(!hideTip){
              this.$Message.error('保存失败，请检查格式是否正确!');
            }
            this.hideTip=false;
          }
          else if (valid) {
              if(this.articleID > -1){
                //更新
                this.$http.put("/api/content/"+this.articleID,this.formTop
                  // {
                  //   headers:{
                  //     token:this.token
                  //   }
                  // }
               ).then((response) => {
                    //console.log(this.formTop.label)
                    this.$Message.success(response.data.message);
                    this.articleID=response.data.content_id;
                }, (error) => {
                      this.$Message.error(error.data.message);
                });
              }else{

                //新建
                this.$http.post('/api/content',this.formTop)
                // this.$http.post({
                //   method: 'POST',
                //   url: "/api/content",
                //   params:this.formTop
                  // headers:{
                  //   token:this.token
                  // }
                // })
                .then((response) => {
                    console.log(response);
                  //console.log(this.formTop.label)
                    this.$Message.success(response.data.message);
                    this.articleID=response.data.content_id;
                }, (response) => {
                    this.$Message.error(response.data.message);
                });
              }
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
          this.$Message.error('此文章暂时不能分享');
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
      this.titleContentCount=this.formTop.title.length;
    },
  }

}
