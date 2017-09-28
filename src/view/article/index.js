import {
  mapState
} from 'vuex'
export default {
  name: 'Article',
  created() {

  },
  data() {
    return {
      type: 'notice',
      noticeID: -1,
      title: '',
      subtitle: '',
      content: '',
      conInfo: {
      	channel: '',
      	time: '',
      	author: ''
      },
      switchTab: 1,
      articleBack: false,
      getUrl: '',
      txvideocurrentcount:0,
      txvideocount:0,
    }
  },
   watch:{
    txvideocurrentcount(val){
        if(val == this.txvideocount){
            // show
            $("#loading-div").css({"display":'none'});
            $("#content-div").css({"opacity":1});
        }
    }
  },
    mounted() {
    var span5 = document.querySelector(".ivu-col-span-5")
    var span19 = document.querySelector(".ivu-col-span-19")
    span5.style.display = 'none';
    span19.className = "layout-content-warp ivu-col ivu-col-span-24";
    this.noticeID=this.$route.query.id;
	    //ajax获得后台公告的内容
	    if (sessionStorage.getItem('articleDetail') == 'home') {
	    	this.getUrl = 'api/content/notice/'
	    	this.articleBack = false;
	    }else if (sessionStorage.getItem('articleDetail') == 'article'){
	    	this.getUrl = 'api/content/'
	    	this.articleBack = true;
	    }else{
	    	this.getUrl = 'api/content/'
	    	this.articleBack = false;
	    }
	    this.$http.get(this.getUrl + this.noticeID).then(({ data }) => {
	      //给公告的内容赋值
	      if (data.status == 1) {
	      	this.title=data.content.title;
	      	this.content=data.content.content;
	      	this.conInfo.channel = data.content.channel;
          if (data.content.publishdate == null) {
            this.conInfo.time = data.content.addtime;
          }else{
            this.conInfo.time = data.content.publishdate;
          }
          this.subtitle = data.content.subtitle;
          this.conInfo.author = data.content.author;
          this.$nextTick(function(){
            this.renderPlayer();
          })

	      }else{
	      	this.$Notice.error({
            title: '错误',
            desc: data.message || '数据请求错误'
          })
	      }

	    }, () => {
	    	this.$Notice.error({
	        title: '错误',
	        desc: data.message || '数据请求错误'
	      })
      })
	  },
  methods: {
    goBack(){
    	this.$router.go(-1)
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
	                    "height": 360
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
          }else{
            for (var i = 0; i<$('.download').size(); i++) {
              $('.download').eq(i).attr('href', $('.audioWrap.myDirectiveAudio').eq(i).attr('audio-url'))
              if (navigator.userAgent.indexOf('Firefox') > -1 && $('.download').eq(i).attr('href').indexOf(window.location.host) == -1) {
                $('.download').eq(i).html('右键点击另存为下载文件！');
              }else{
                $('.download').eq(i).html('下载音频');
              }
            }
            for (var i = 0; i<$('.download_video').size(); i++) {
              if (navigator.userAgent.indexOf('Firefox') > -1 && $('.download_video').eq(i).attr('href').indexOf(window.location.host) == -1) {
                $('.download_video').eq(i).html('右键点击另存为下载视频！');
              }else{
                $('.download_video').eq(i).html('下载视频');
              }
            }
          }
    }
  },
}
