import {
  mapState
} from 'vuex'

export default {
  name: 'share',
  data() {
    return {
      shareId: -1,
      title: '',
      content: '',
      conInfo: {
      	channel: '',
      	time: '',
      	author: ''
      },
      noData:true,
      notShared: false
    }
  },
  created() {
    this.shareId = this.$route.query.id;
    //ajax获得分享的内容
    this.$http.get("/api/content/share/" + this.shareId)
      .then((response) => {
        if(response.data.status == 1){
          this.noData=true;
            this.title = response.data.content.title;
            this.conInfo.channel = response.data.content.channel;
            this.content = response.data.content.content;
            this.conInfo.time = response.data.content.addtime;
	          this.conInfo.author = response.data.content.author;
        }else{
          this.noData=false;
           this.$Notice.warning({
                title: response.data.message,
                desc: false
            })
        }
      }, (error) => {
        this.noData=false;
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
  }
}
