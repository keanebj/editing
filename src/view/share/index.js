import {
  mapState
} from 'vuex'
export default {
  name: 'Article',
  created() {},
  data() {
    return {
      type: 'notice',
      noticeID: -1,
      title: '',
      content: ''
    }
  },
  methods: {
    goBack() {
      this.$router.push('/manage/content')
    }
  },
  mounted() {
    var span5 = document.querySelector(".ivu-col-span-5")
    var span19 = document.querySelector(".ivu-col-span-19")
    span5.style.display = 'none';
    span19.className = "layout-content-warp ivu-col ivu-col-span-24";
    this.noticeID = this.$route.query.id;
    //ajax获得分享的内容
    this.$http.get("http://mp.dev.hubpd.com/api/content/" + this.noticeID)
      .then((response) => {
        this.title = response.data.content.title;
        this.content = response.data.content.content;
      })
  }
}
