export default {
  name: 'ViewManageContent',
  data () {
    return {
      status:'',
      total:6,
      pageSize:2,//每页显示显示条数
      pageIndex:1,//当前页码
      contentList:[{id:1,AddTime:"2017-09-01 22:22:22"}],
      uploadModal: false,//上传对话框
      beforeUpload: false,//上传之前参数
      fileName: '',//上传文件名称
      fileSize: '',//上传文件大小
      file: '',//上传的文件
      percentProgress: 0,//上传进度条
      headToken: {token:'814238e9e374a6066aa49f87a0be91c3c51a35587554ad2d'},//携带头部
      catalogId: {catalogId: 12}
    }
  },
  created () {},
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
    operateContent:function(type){
      let contentid=this.$refs.type[0].$el.attributes['data-id'].nodeValue;
      switch (type){
        case 'top':
          this.$http.put("http://mp.dev.hubpd.com/api/content/top/"+contentid,{contentid:contentid},
            {
              headers:{

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
          this.$http.put("http://mp.dev.hubpd.com/api/content/offline/"+contentid,{contentid:contentid}).then((response)=>{
            this.$Message.success(response.data.message);
          },(error)=>{
            this.$Message.success(error.data.message);
          })
          break;
        case 'delete':
          this.$http.delete("http://mp.dev.hubpd.com/api/content/"+contentid,{contentid:contentid}).then((response)=>{
            this.$Message.success(response.data.message);
          },(error)=>{
            this.$Message.success(error.data.message);
          })
          break;
        default :
          break;
      }

    },
    contentTypeList:function(status){
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
        url: "http://mp.dev.hubpd.com/api/content",
        params:{status:this.status,pagesize:this.pageSize,pageindex:this.pageIndex-1}
      }).then((response) => {
        console.log(response);
        this.total=response.data.count;
        //格式化time
        if(response.data.content_list && response.data.content_list.length){
          for(let i=0;i<response.data.content_list.length;i++){
            if(response.data.content_list[i].AddTime){
              response.data.content_list[i].AddTime=response.data.content_list[i].AddTime.substring(0,10);
            }
          }
        }
        this.contentList=response.data.content_list;
      },(error)=>{

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
			this.$Notice.warning({
        title: '文件格式不正确',
        desc: '文件 ' + file.name + ' 格式不正确，请上传 jpg 或 png 格式的图片。'
    	});
		},
//		上传成功
		handleSuccess (res, file) {
//			console.log(res)
//			console.log(file)
//			alert(111)
		}
  },

}
