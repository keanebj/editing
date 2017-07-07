export default {
  name: 'Home',
  created () {
  },
  data () {
    return {
      switchTab:0,
      value2:0,
      pageTotalX:2,
      pageTotalG:10,
      articleTotal:8869,
      studioTotal:35,
      noticeList:[],
      collegeList:[]
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
    }

  },
  mounted () {
       this.getNotice();
       this.getCollege();
  }
}
