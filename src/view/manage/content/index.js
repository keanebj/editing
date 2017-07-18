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
      catalogId: {catalogId: 12},
      uploadModal: false,//上传对话框
      beforeUpload: false,//上传之前参数
      roleType:'Edit'
    }
  },
  created () {
    this.roleType=this.$store.state.roleType;
  },
  mounted () {
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
    getOperateContentID:function(id){
      this.contentId=id;
    },
    operateContent:function(type){
      let contentid=this.contentId;
      switch (type){
        case 'top':
          this.$http.put("/api/content/top/"+contentid,{contentid:contentid,method:'top'},
            {
              headers:{
                token:this.token
              }
            }
          ).then((response)=>{
            this.$Message.success(response.data.message);
              //重新加载列表
              this.getContentList();
          },(error)=>{
            this.$Message.success(error.data.message);
          })
          break;
        case 'drop':
          this.$http.put("/api/content/offline/"+contentid,{contentid:contentid},
            {
              headers:{
                token:this.token
              }
            }).then((response)=>{
            this.$Message.success(response.data.message);
              //重新加载列表
              this.getContentList();
          },(error)=>{
            this.$Message.success(error.data.message);
          })
          break;
        case 'delete':
          this.$http.delete("/api/content/"+contentid,
            {
              headers:{
                token:this.token
              }
            }).then((response)=>{
            this.$Message.success(response.data.message);
              //重新加载列表
              this.getContentList();
          },(error)=>{
            this.$Message.success(error.data.message);
          })
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
    getContentList:function(){
      this.$http({
        method: 'GET',
        url:"/api/content",
        params:{status:this.status,value:this.searchValue,pagesize:this.pageSize,pageindex:this.pageIndex-1},
        headers:{
          token:this.token
        }
      }).then((response) => {
        console.log(response.data);
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
            if(response.data.contents[i].addtime){
              response.data.contents[i].addtime=response.data.contents[i].addtime.substring(0,10);
            }
          }
        }else{
          //没有查询到数据
          this.isActiveHide=true;
        }
        this.contentList=response.data.contents;
        console.log(this.contentList)
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
      console.log( this.$refs.upload.fileList)
      this.fileSize = (file.size/1024).toFixed(2) + 'K';

//			return this.beforeLoaded;
    },
//		上传中
    onLoading (event, file, fileList) {
      this.percentProgress = event.percent;
      if (this.percentProgress==100) {
        this.uploadModal = false;
      }
    },
    handleFormatError (file) {
//			this.$Notice.warning({
//      title: '文件格式不正确',
//      desc: '文件 ' + file.name + ' 格式不正确，请上传 jpg 或 png 格式的图片。'
//  	});
      this.$Message.error('请上传正确格式的文件！');
    },
//		上传成功
    handleSuccess (res, file) {
//			console.log(res)
//			console.log(file)
//			alert(111)
    }
  },



}
