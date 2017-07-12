export default {
  name: 'Home',
  created() {
  },
  data() {
    return {
      switchTab:0,
      value2:0,
      pageTotalX:2,
      pageTotalG:10,
      articleTotal:8869,
      studioTotal:35,
      noticeList:[{id:1,title:"的开发后端开发的疯狂的书法家",dateTime:"2017-09-09"}],
      collegeList:[]
    }
  },
  methods: {
    readed (ev) {
      var ele = ev.target.parentNode.parentNode.nodeName == "LI" ? ev.target.parentNode.parentNode : ev.target;
      ele.className = "readed";
    },
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
