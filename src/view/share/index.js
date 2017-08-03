import {
  mapState
} from 'vuex'
export default {
  name: 'share',
  data() {
    return {
      type: 'notice',
      shareId: -1,
      title: '',
      content: ''
    }
  },
  created() {
    this.shareId = this.$route.query.id;
    //ajax获得分享的内容
    this.$http.get("/api/content/share/" + this.shareId)
      .then((response) => {
        if(response.data.status == 1){             
             this.title = response.data.content.title;
             this.content = response.data.content.content;
        }else{
           this.$Notice.warning({
                title: response.data.message,
                desc: false
            })
        }
      }, (error) => {        
        this.$Notice.warning({
            title: error.data.message,
            desc: false
        })
    });
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
  }
}
