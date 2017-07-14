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
      pageCurrentLX:1,//公告的当前页数
      pageCurrentlG:1,//学院的当前页数
      pageTotalX:2,//公告的总页数
      pageTotalG:10,//学院的总页数
      articleTotal:8869,
      studioTotal:25,
      noticeList:[{id:15,title:"的开发后端开发的疯狂的书法家",dateTime:"2017-09-09"}],
      collegeList:[],
      adList:[],
      pageSize: 10
    }
  },
  methods: {
    readed (ev) {
      var ele = ev.target.parentNode.parentNode.nodeName == "LI" ? ev.target.parentNode.parentNode : ev.target;
      ele.className = "readed";
    },
    getNotice () {
      this.$http.get('http://mp.dev.hubpd.com/api/content', {params: { classification:"Notice", pagesize:this.pageSize, pageindex:(this.pageCurrentLX-1)  }}).then((res) => {//classification:"Notice"为传递参数
//    	console.log(res.data)
        this.noticeList = res.data.content_list;
        this.articleTotal = res.data.count ;
        this.pageTotalX = Math.ceil( this.articleTotal / this.pageSize)
      });
    },
    getCollege () {
      this.$http.get('http://mp.dev.hubpd.com/api/content', {params: { classification:"College", pagesize:this.pageSize, pageindex:(this.pageCurrentlG-1)  }}).then((res) => {//classification:"College"
      	console.log(res.data)
        this.collegeList = res.data.content_list;
        this.studioTotal = res.data.count ;
        this.pageTotalG = Math.ceil( this.studioTotal / this.pageSize)
//      console.log(this.pageCurrentLX)
//      console.log(this.articleTotal)
      });
   },
		getNoticeURL (id){
      this.$router.push({path:'/notice?'+id})
    },
    getTestAPI () {
      this.$http.get('http://mp.dev.hubpd.com/api/advertise').then((res) => { 
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
        
        this.pageCurrentLX = page;
        console.log(this.pageCurrentLX)
        this.getNotice();
    },
    changePageCollege (page){
    	this.pageCurrentlG = page;
      console.log(this.pageTotalG)
      this.getCollege();
    }
  },
  mounted () {
       this.getNotice();
       this.getCollege();
  }
}
