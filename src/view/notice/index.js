import { mapState } from 'vuex'
export default {
  name: 'Notice',
  created () {
    console.log(this.$route.query.noticeID);
  },
  mounted(){
    //ajax获得后台公告的内容
    this.$http({
      method: 'POST',
      url: "",
      params: { noticeID: this.noticeID }
    }).then((response) => {

      //给公告的内容赋值
      //this.title=response.data.title;
      //this.content=response.data.content;
    })

  },
  data () {
    return {
      noticeID:this.$route.query.noticeID,
      title:'人民日报中央厨房号直播间上线了',
      content:'<p>fdfsfdsf人民日报中央厨房号直播间上线了人民日报中央厨房号直播间上线了人民日报中央厨房号直播间上线了人民日报中央厨房号直播间上线了' +
      '人民日报中央厨房号直播间上线了人民日报中央厨房号直播间上线了人民日报中央厨房号直播间上线了人民日报中央厨房号直播间上线了' +
      '人民日报中央厨房号直播间上线了人民日报中央厨房号直播间上线了人民日报中央厨房号直播间上线了人民日报中央厨房号直播间上线了' +
      '人民日报中央厨房号直播间上线了人民日报中央厨房号直播间上线了人民日报中央厨房号直播间上线了人民日报中央厨房号直播间上线了' +
      '人民日报中央厨房号直播间上线了人民日报中央厨房号直播间上线了人民日报中央厨房号直播间上线了' +
      '人民日报中央厨房号直播间上线了人民日报中央厨房号直播间上线了人民日报中央厨房号直播间上线了ffdfdfdfsdffdsfdsfdsf</p><img src="'
      +require("../../assets/notice1.png")+'"/><p>fdfdfdfdfdf</p>'
    }
  },
  mounted () {
//	alert(this.$refs.col5)
		var span5 =  document.querySelector(".ivu-col-span-5")
		var span19 =  document.querySelector(".ivu-col-span-19")
//		alert(aa)
		span5.style.display = 'none';
		span19.className = "layout-content-warp ivu-col ivu-col-span-24"
  },
  computed: {

  },
  methods: {

  }
}
