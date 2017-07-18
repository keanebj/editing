
import { mapState } from 'vuex'
export default {
  name: 'Notice',
  created () {
//	var id = this.$route.query.ID;
  },
  mounted(){
     //判断是公告还是文章
//      //公告
				console.log(this.$route.query.id)
        this.noticeID=this.$route.query.id;
        
        //ajax获得后台公告的内容
        this.$http({
          method: 'GET',
          url: "http://mp.dev.hubpd.com/api/content/" + this.noticeID,
          headers:{
	          token:"554a7b390e4a09363ce8e35b823d7459b95a23764e59c528"
	        }
        }).then((response) => {
        	console.log(response)
          //给公告的内容赋值
					this.title=response.data.content_info[0].Title;
          this.content=response.data.content_info[0].Content;
        })

    var span5 =  document.querySelector(".ivu-col-span-5")
    var span19 =  document.querySelector(".ivu-col-span-19")
//		alert(aa)
    span5.style.display = 'none';
    span19.className = "layout-content-warp ivu-col ivu-col-span-24"
  },
  data () {
    return {
      type:'notice',
      noticeID:-1,     
      title:'',
      content:''
    }
  },
  computed: {

  },
  methods: {

  }
}
