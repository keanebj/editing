import { mapState } from 'vuex'
import MainHeader from '@/components/mainHeader/index.vue'
import MainFooter from '@/components/mainFooter/index.vue'
export default {
  name: 'Notice',
  components: {
    MainHeader,
    MainFooter
  },
  mounted(){
    this.noticeID=this.$route.query.id;
        //ajax获得后台公告的内容
        if (sessionStorage.getItem('articleDetail') == 'home') {
		    	this.getUrl = 'api/content/notice/'
		    	this.articleBack = false;
		    }else {
		    	this.getUrl = 'api/content/'
		    	this.articleBack = true;
		    }
        this.$http.get(this.getUrl + this.noticeID).then(({ data }) => {
          //给公告的内容赋值
          if (data.status == 1) {
						this.title=data.content.title;
						this.subtitle=data.content.subtitle;
	          this.content=data.content.content;
            this.conInfo.channel = data.content.channel;
            if (data.content.publishdate == null) {
              this.conInfo.time = data.content.addtime;
            }else{
              this.conInfo.time = data.content.publishdate;
            }
	          this.conInfo.author = "";
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
  data () {
    return {
      type:'notice',
      noticeID:-1,
      title:'',
      subtitle: '',
      content:'',
      switchTab: 0,
      conInfo: {
      	channel: '',
      	time: '',
      	author: ''
      },
      articleBack: false,
      getUrl: '',
      txvideocurrentcount:0,
      txvideocount:0,
      timer:null
    }
  },
  computed: {

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
	                    "app_id": "1253974404",
	                    "width": 640,
	                    "height": 360,
                      "hide_h5_error":true
	                };
                  var aa=new qcVideo.Player("id_video_container_"+serverfileid+"_"+i,option,function(status){
                      if(status == 'ready'){
                          This.txvideocurrentcount++;
                      }
                  });
                  console.log(aa);
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
  }
}
