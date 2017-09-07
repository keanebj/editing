import {
  mapState
} from 'vuex'

export default {
  name: 'share',
  data() {
    return {
      shareId: -1,
      title: '',
      subtitle: '',
      content: '',
      cover: '',
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
            this.cover = response.data.content.cover;
            this.subtitle = response.data.content.subtitle;
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
       //找到编辑器里面的视频内容 ，进行 替换
       let $=qaVideo.get("$");
       setTimeout(function(){
          let count=$(".video_container").size();
          if(count > 0){
          		for(var i=0;i<count;i++){
                if ($(".video_container").eq(i).find('embed').length > 0) {
	                let serverfileid=$(".video_container").eq(i).html('').attr('serverfileid');
	                var option = {
	                    "auto_play": "0",
	                    "file_id": serverfileid,
	                    "app_id": "1252018592",
	                    "width": 640,
	                    "height": 360
	                };
	               new qcVideo.Player("id_video_container_"+option.file_id,option);
	            }
          	}
          }
          // alert(window.screen.width < 640)
          if (window.screen.width < 640) {
            for (var i = 0; i<$('.download').size(); i++) {
                $('.download').eq(i).css('display', 'none');
            }
          }else{
            for (var i = 0; i<$('.download').size(); i++) {
              $('.download').eq(i).attr('href', $('.audioWrap.myDirectiveAudio').eq(i).attr('audio-url'))
              if (navigator.userAgent.indexOf('Firefox') > -1 && $('.download').eq(i).attr('href')[0].indexOf(window.location.host) == -1) {
                $('.download').eq(i).html('右键点击另存为下载文件！');
              }
            }
          }

        },500)
  }
}
