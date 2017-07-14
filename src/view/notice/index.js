import { mapState } from 'vuex'
export default {
  name: 'Notice',
  created () {
  },
  mounted(){
     //判断是公告还是文章
//      //公告
        this.noticeID=this.$route.query.id;
        console.log(this.noticeID)
        //ajax获得后台公告的内容
        this.$http({
          method: 'GET',
          url: "http://mp.dev.hubpd.com/api/content/" + this.noticeID
        }).then((response) => {
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
