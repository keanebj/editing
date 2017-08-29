import Cookies from 'js-cookie'
export default {
  name: 'ViewManageContent',
  data () {
    return {
      contentId:0,
      status:'',
      total:0,
      pageSize:10,//每页显示显示条数
      pageIndex:1,//当前页码
      contentList:[],
      searchValue:'',
      isActiveHide:false,
      token:'64fb2b381e2727d69f720439e0553353fe38647f0835233c',
      fileName: '',//上传文件名称
      fileSize: '',//上传文件大小
      file: '',//上传的文件
      percentProgress: 0,//上传进度条
      headToken: {token:'64fb2b381e2727d69f720439e0553353fe38647f0835233c'},//携带头部
      uploadModal: false,//上传对话框
      beforeUpload: false,//上传之前参数
      roleType:'Edit',
      hidenodata:true,
      hidenofound:true
    }
  },
  created () {
  	sessionStorage.setItem('articleDetail', 'article');
    this.roleType=this.$store.state.userinfo.roleType;
    this.token=this.$store.state.token;
    this.headToken.token=this.$store.state.token;
  },
  mounted () {
    var span5 =  document.querySelector(".ivu-col-span-5")
    var span19 =  document.querySelector(".ivu-col-span-19")
    if(!span19){
      span19 =  document.querySelector(".ivu-col-span-24")
    }
    span5.style.display = 'block';
    span19.className = "layout-content-warp ivu-col ivu-col-span-19";
    this.getContentList();
  },
  computed:{
    pageCount:function(){
      let remainder=this.total%this.pageSize;
      if(remainder){
        return Math.ceil(this.total/this.pageSize);
      }else{
        return Math.floor(this.total/this.pageSize);
      }
    }
  },
  methods: {
    confirm (contentid) {
      this.$Modal.confirm({
        title: '确认提示',
        content: '<p>你确定要删除吗？</p>',
        onOk: () => {
          this.$http.delete("/api/content/"+contentid,
            {
              headers:{
                token:this.token
              }
            }).then((response)=>{
              this.$Notice.success({
                title: response.data.message,
                desc: false
              })
              //重新加载列表
              this.getContentList();
            },(error)=>{
              this.$Notice.error({
                title: error.data.message,
                desc: false
              })
            })
        },
        onCancel: () => {
        }
      });
    },
    getOperateContentID:function(id){
      this.contentId=id;
    },
    cancleTop(tip) {
      let contentid=this.contentId;
      this.$http.put("/api/content/top/"+contentid,{contentid:contentid,method:''},
        {
          headers:{
            token:this.token
          }
        }
      ).then((response)=>{
        if(!tip){
            this.$Notice.success({
            title: '取消置顶成功！',
            desc: false
          })
        }
          //重新加载列表
          this.getContentList();
        },(error)=>{
          this.$Notice.error({
            title: error.data.message,
            desc: false
          })
        })
    },
    operateContent:function(type){
      let contentid=this.contentId;
      switch (type){
        case 'canceltop':
          //需要取消置顶的接口
        this.$Modal.confirm({
	        title: '确认取消置顶',
	        content: '是否取消置顶？',
	        onOk: () => {
	          this.cancleTop()
	        }
	      })
              break;
        case 'top':
          this.$http.put("/api/content/top/"+contentid,{contentid:contentid,method:'top'},
            {
              headers:{
                token:this.token
              }
            }
          ).then((response)=>{
              this.$Notice.success({
                title: response.data.message,
                desc: false
              })
              //重新加载列表
              this.getContentList();
          },(error)=>{
              this.$Notice.error({
                title: error.data.message,
                desc: false
              })
          })
          break;
        case 'drop':
          //出现确认弹框
          this.$Modal.confirm({
            title: '确认撤回',
            content: '您确定要撤回？',
            onOk: () => {
              this.$http.put("/api/content/offline/"+contentid,{contentid:contentid},
                {
                  headers:{
                    token:this.token
                  }
                }).then((response)=>{
                  this.$Notice.success({
                    title: response.data.message,
                    desc: false
                  })
                  //撤回取消置顶
                  this.cancleTop('notip');
                  //重新加载列表
                  this.getContentList();
                },(error)=>{
                  this.$Notice.error({
                    title: error.data.message,
                    desc: false
                  })
                })
            }
          })
          break;
        case 'delete':
          //给一个提示框
          this.confirm(contentid);
          break;
        default :
          break;
      }

    },
    contentTypeList:function(status){
      //切换状态，设为第一页
      this.pageIndex=1;
      if(status !== ''){
        // 类别
        this.status=status;
      }else{
        // 全部
        this.status='';
      }
      this.getContentList();
    },
    createArticle:function(){
      this.$router.push({path:'/publish'})
    },
    changePage:function(page){
      //page是当前的页码
      this.pageIndex=page;
      this.getContentList();

    },
    getContentList:function(type){
      this.hidenofound=true;
      this.hidenodata=true;
      this.$http.get("/api/content",{
        params:{status:this.status,value:this.searchValue,pagesize:this.pageSize,pageindex:this.pageIndex-1},
        headers:{
          token:this.token
        }
      }).then((response) => {
        console.log(response);
        //如果没数据
        if(type =='search' && response.data.total == 0){
          this.hidenofound=false;
           this.hidenodata=true;
           //没有查询到数据
          this.isActiveHide=true;
          this.contentList=response.data.contents;
          return;
        }else if(response.data.total == 0){
          this.hidenofound=true;
           this.hidenodata=false;
           //没有查询到数据
          this.isActiveHide=true;
          this.contentList=response.data.contents;
          return;
        }
        //如果pageindex比总页数还多
        if((response.data.total%this.pageSize == 0) && this.pageIndex == response.data.total/this.pageSize +1){
          this.pageIndex--;
          this.getContentList();
        }

        this.total=response.data.total;
        //格式化time
        if(response.data.contents && response.data.contents.length){
          //查询到数据
          if(response.data.total <= this.pageSize){
            this.isActiveHide=true;
          }else{
            this.isActiveHide=false;
          }
          for(let i=0;i<response.data.contents.length;i++){
          	if (response.data.contents[i].publishdate != null ) {
          		response.data.contents[i].addtime = response.data.contents[i].publishdate.substring(0,10);
          	}else if (response.data.contents[i].publishdate == null && response.data.contents[i].modifytime != null){
          		response.data.contents[i].addtime=response.data.contents[i].modifytime.substring(0,10);
          	}else{
          		response.data.contents[i].addtime = response.data.contents[i].addtime.substring(0,10);
          	}
          }
        }else{
          //没有查询到数据
          this.isActiveHide=true;
        }
        this.contentList=response.data.contents;
      },(error)=>{
        console.log(error);
      })
    },
    //  文件上传
//上传前
    beforeLoad (file) {
      this.file = file;
      this.$refs.upload.fileList = [];
      this.beforeUpload = true;
      this.fileName = file.name;
      this.fileSize = (file.size/1024).toFixed(2) + 'K';
    },
//		上传中
    onLoading (event, file, fileList) {
      this.percentProgress = event.percent;
      if (this.percentProgress==100) {
        this.uploadModal = false;
      }
    },
    handleFormatError (file) {
      this.$Notice.error({
        title: '请上传正确格式的文件！',
        desc: false
      })
    },
//		上传成功
    handleSuccess (res, file) {
      if(res.status == 1){
        this.$Notice.success({
          title: res.message,
          desc: false
        })
 
        Cookies.set('title',res.content.title);
        localStorage.setItem('content',res.content.content);
        Cookies.set('channel',res.content.channel);
        Cookies.set('summary',res.content.summary == null?'':res.content.summary);
        Cookies.set('keyword',res.content.keyword);

        this.$router.push({ path: '../publish',query:{type:'import'}})
      }else{
        this.$Notice.error({
          title: res.message,
          desc: false
        })
      }

    },
    handleError(res, file){
      this.$Notice.error({
        title: '上传失败！',
        desc: false
      })
    }
  },



}
