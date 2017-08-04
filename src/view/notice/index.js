import { mapState } from 'vuex'
export default {
  name: 'Notice',
  created () {
  },
  mounted(){

    var span5 =  document.querySelector(".ivu-col-span-5")
    var span19 =  document.querySelector(".ivu-col-span-19")
    span5.style.display = 'none';
    span19.className = "layout-content-warp ivu-col ivu-col-span-24";

        this.noticeID=this.$route.query.id;
        //ajax获得后台公告的内容
        this.$http.get("api/content/notice/" + this.noticeID).then(({ data }) => {
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
  },
  data () {
    return {
      type:'notice',
      noticeID:-1,
      title:'',
      content:'',
      switchTab: 0      
    }
  },
  computed: {

  },
  methods: {
    goBack(){
    	this.$router.go(-1)
    }
  }
}
