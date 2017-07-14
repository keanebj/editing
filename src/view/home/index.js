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
      pageTotalX:2,
      pageTotalG:40,
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
      this.$http.get('/api/notices').then((res) => {
        this.noticeList = res.data.data;
        this.pageTotalG =Math.ceil(this.noticeList.length / 10);
      });
    },
    getCollege () {
      this.$http.get('/api/colleges').then((res) => {        
        this.collegeList = res.data.data;
        this.pageTotalX = Math.ceil(this.collegeList.length / 10);
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
        console.log(page)
    },
    changePageCollege (page){
        console.log(page)
    }
  },
  mounted () {
       this.getNotice();
       this.getCollege();       
  }
}
