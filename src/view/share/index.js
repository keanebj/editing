import MainFooter from '@/components/mainFooter/index.vue'
import {
  mapState
} from 'vuex'

export default {
	components: {
    MainFooter
  },
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
      notShared: false,
      hideRight: 'block',
      align: 'left',
      hideHead:'block',
      txvideocurrentcount:0,
      txvideocount:0,
      timer:null
    }
  },
  created() {
    this.shareId = this.$route.query.id;
  },
   watch:{
    txvideocurrentcount(val){
        if(val == this.txvideocount){
            // show
            $("#loading-div").css({"display":'none'});
            $("#content-div").css({"opacity":1});
            clearTimeout(this.timer);
        }
        clearTimeout(this.timer);
        this.timer=setTimeout(function(){
            $("#loading-div").css({"display":'none'});
            $("#content-div").css({"opacity":1});
        },10000)
    }
  },
  methods: {
    goBack() {
      this.$router.push('/manage/content')
    },
    renderPlayer(){
             //生成播放器
          let This=this;
          let count=$(".video_container").size();
          this.txvideocount=count;
          if(count == 0){
            $("#loading-div").css({"display":'none'});
            $("#content-div").css({"opacity":1});
          }
          if(count > 0){
          		for(var i=0;i<count;i++){
	                let serverfileid=$(".video_container").eq(i).html('').attr('serverfileid');
                  //替换容器的id，用于解决id重复的问题
                  $(".video_container").eq(i).attr('id',"id_video_container_"+serverfileid+"_"+i);
	                var option = {
	                    "auto_play": "0",
	                    "file_id": serverfileid,
	                    "app_id": "1252018592",
	                    "width": 640,
	                    "height": 360,
                      "hide_h5_error":true
	                };
                  new qcVideo.Player("id_video_container_"+serverfileid+"_"+i,option,function(status){
                      if(status == 'ready'){
                          This.txvideocurrentcount++;
                      }
                  });
          	}
          }
          if (window.screen.width < 640) {
            for (var i = 0; i<$('.download').size(); i++) {
                $('.download').eq(i).css('display', 'none');
            }
            for (var i = 0; i<$('.download_video').size(); i++) {
                $('.download_video').eq(i).css('display', 'none');
            }
          }
    }
  },
  mounted() {
  	if (this.$store.state.userinfo.roleType == 'Manage') {
  		this.align = 'center';
  		this.hideRight = 'none';
      this.hideHead='none';
  	}else{
  		this.hideRight = 'block';
  		this.align = 'left';
      this.hideHead='block';
  	}

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
            this.$nextTick(function(){
                this.renderPlayer();
            })
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
  }
}
