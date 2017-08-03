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
	    this.$http({
	      method: 'GET',
	      url: "api/content/" + this.noticeID,
	      headers:{
	          token:"e3ad42c53a7f513682900121a5d768d41c9ee7a584d49865"
	        }
	    }).then((response) => {
	    	console.log(response.data)
	      //给公告的内容赋值
					this.title=response.data.content.title;
	      this.content=response.data.content.content;
	    }, () => {
	    	this.$Notice.error({
          title: '错误',
          desc: '数据列表请求错误'
        })
	    })
	  }
}
