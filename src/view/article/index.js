import { mapState } from 'vuex'
export default {
  name: 'Article',
  created() {
  },
  data() {
    return {
      type:'notice',
      noticeID:-1,
      title:'',
      content:''
    }
  },
  methods: {

  },
  mounted () {
  	console.log(this.$route.query.id)
	    this.noticeID=this.$route.query.id;

	    //ajax获得后台公告的内容
	    this.$http({
	      method: 'GET',
	      url: "http://mp.dev.hubpd.com/api/content/" + this.noticeID,
	      headers:{
	          token:"e3ad42c53a7f513682900121a5d768d41c9ee7a584d49865"
	        }
	    }).then((response) => {
	    	console.log(response.data)
	      //给公告的内容赋值
					this.title=response.data.content.title;
	      this.content=response.data.content.content;
	    })
	  }
}
