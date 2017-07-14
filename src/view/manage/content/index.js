export default {
  name: 'ViewManageContent',
  data () {
    return {
      status:'',
      total:6,
      pageSize:2,//每页显示显示条数
      pageIndex:1,//当前页码
      contentList:[{id:1}]
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
        return this.total/this.pageSize+1;
      }else{
        return this.total/this.pageSize
      }
    }
  },
  methods: {
    operateContent:function(type){
      let contentid=this.$refs.type[0].$el.attributes['data-id'].nodeValue;
      switch (type){
        case 'top':
          this.$http.put("http://mp.dev.hubpd.com/api/content/top/"+contentid,{contentid:contentid}).then((response)=>{
            this.$Message.success(response.data.message);
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
      //重新加载列表
      this.getContentList();
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
        params:{status:this.status,pagesize:this.pageSize,pageindex:this.pageIndex}
      }).then((response) => {
        console.log(response);
        //this.total=response.data.content_list.length;
        this.contentList=response.data.content_list;
      },(error)=>{

      })
    }
  },

}
