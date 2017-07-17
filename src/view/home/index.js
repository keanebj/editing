export default {
  name: 'Home',
  created() {
    this.getTestAPI();    
    this.roleFlag = this.$store.state.roleType;
  },
  data() {
    return {
      roleFlag:0,
      switchTab:0,
      value2:0,
      pageTotalX:2,//公告所有页
      pageTotalG:40,//学院所有页
      pageIndexX: 1,//公告当前页
      pageIndexG: 1,//学院当前页
      pageSize: 10,//每页的个数
      noticeTotal: 0,
      articleTotal:8869,
      studioTotal:35,
      accountIndex:100,
      noticeList:[],
      collegeList:[],
      adList:[]
    }
  },
  methods: {
    getNotice () {
//    this.$http.get('http://mp.dev.hubpd.com/api/content').then((res) => {
//    	console.log(res)
////      this.noticeList = res.data.data;
////      this.pageTotalG =Math.ceil(this.noticeList.length / 10);
//    });
      
      this.$http({
	      method: 'GET',
	      url: "/api/content",
	      params: {
	      	pagesize: this.pageSize,
	      	pageindex: (this.pageIndexX-1),
	      	classification: "Notice"
	      },
	      headers:{
          token:"554a7b390e4a09363ce8e35b823d7459b95a23764e59c528"
        }
	    }).then((response) => {
	      //给公告的内容赋值
				console.log(response.data)
				this.noticeList = response.data.contents;
				this.noticeTotal = response.data.total;
				this.pageTotalX = Math.ceil(this.noticeTotal / this.pageSize);
				console.log(this.pageTotalX)
	    })
    },
    getCollege () {
      this.$http({
	      method: 'GET',
	      url: "/api/content",
	      params: {
	      	pagesize: this.pageSize,
	      	pageindex: (this.pageIndexG-1),
	      	classification: "College"
	      },
	      headers:{
          token:"554a7b390e4a09363ce8e35b823d7459b95a23764e59c528"
        }
	    }).then((response) => {
	      //给公告的内容赋值
				console.log(response.data)
				this.collegeList = response.data.contents;
				this.articleTotal = response.data.total;
				this.pageTotalG = Math.ceil(this.articleTotal / this.pageSize);
	    })
    },
    getNoticeURL (id){
      this.$router.push({path:'/notice?'+id})
    },
    getTestAPI () {
      this.$http.get('http://mp.dev.hubpd.com/api/advertise').then((res) => {
      	console.log(res)
        if(this.$store.state.advertiselist == undefined){
          this.$store.state.advertiselist = res.data.advertiselist;          
        } 
        this.adList = this.$store.state.advertiselist;       
        console.log('advertiseList:'+this.$store.state.advertiselist);
      },(err) => {
        console.log('出错啦！'+err)
      });
    },
    changePageNotice (page){
      console.log(page)
      this.pageIndexX = page;
      this.getNotice();
    },
    changePageCollege (page){
        console.log(page)
        this.pageIndexG = page;
      	this.getCollege();
    }
  },
  mounted () {
       this.getNotice();
       this.getCollege();       
  }
}
