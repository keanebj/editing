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
      getUrl: ''
    }
  },
  methods: {
    goBack(){
    	this.$router.go(-1)
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
	      	console.log(data)
	      	this.title=data.content.title;
	      	this.content=data.content.content;
	      	this.conInfo.channel = data.content.channel;
          if (data.content.publishdate == null) {
            this.conInfo.time = data.content.addtime;
          }else{
            this.conInfo.time = data.content.publishdate;
          }
          this.subtitle = data.content.subtitle;
          if (data.operatortype == "Manage") {
          	this.conInfo.author = "";
          }else{
          	this.conInfo.author = data.content.author;
          }
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

      let $=qaVideo.get("$");
      setTimeout(function () {
        let count = $('.download').size();
        if (navigator.userAgent.indexOf('Firefox') > -1) {
          for (var i = 0; i<$('.download').size(); i++) {
            var src = $('.audioWrap.myDirectiveAudio').eq(i).attr('audio-url');
            $('.download').eq(i).attr('href', "javascript:window.open('"+ src + "')");
          }
        }else{
          for (var i = 0; i<$('.download').size(); i++) {
            $('.download').eq(i).attr('href', $('.audioWrap.myDirectiveAudio').eq(i).attr('audio-url'));
          }
        }
      },500)
	  }
}
