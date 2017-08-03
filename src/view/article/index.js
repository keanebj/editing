import {
  mapState
} from 'vuex'
export default {
  name: 'Article',
  created() {
  	this.switchTab = this.$route.query.switchTab;
  },
  data() {
    return {
      type: 'notice',
      noticeID: -1,
      title: '',
      content: '',
      switchTab: 1
    }
  },
  methods: {
    goBack(){
    	if (this.$route.query.switchTab == undefined) {
    		this.$router.go(-1)
    	}else{
      		   this.$router.push({path:'/', query: { switchTab:  this.switchTab}})
    	}
    }
  },
  mounted() {
    var span5 = document.querySelector(".ivu-col-span-5")
    var span19 = document.querySelector(".ivu-col-span-19")
    span5.style.display = 'none';
    span19.className = "layout-content-warp ivu-col ivu-col-span-24";
this.noticeID=this.$route.query.id;
	    //ajax获得后台公告的内容
	    this.$http.get("api/content/" + this.noticeID).then(({ data }) => {
	      //给公告的内容赋值
	      if (data.status) {
	      	this.title=data.content.title;
	      	this.content=data.content.content;
	      }else{
	      	this.$Notice.error({
            title: '错误',
            desc: data.message || '数据请求错误'
          })
	      }
					
	    }, () => {
	    	this.$Notice.error({
	        title: '错误',
	        desc: data.message || '数据请求错误'
	      })
	    })
	  }
}
