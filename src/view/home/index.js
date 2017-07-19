import Cookies from 'js-cookie'
export default {
  name: 'Home',
  created() {

//  this.roleFlag = this.$store.state.roleType;
//		console.log(this.$store.state.roleType)
  },
  data() {
    return {
      roleFlag:1,//切换显示工作室集合厨房指数
      switchTab:0,//tab切换
      value2:0,//跑马灯显示下标
      pageTotalX:2,//公告所有页
      pageTotalG:40,//学院所有页
      pageIndexX: 1,//公告当前页
      pageIndexG: 1,//学院当前页
      pageSize: 8,//每页的个数
      noticeTotal: 0,//公告总数
      articleTotal:8869,//学院总数
      studioTotal:35,//工作室总数
      accountIndex:100,//中央厨房号指数
      noticeList:[],//公告列表
      collegeList:[],//学院列表
      adList:[],//广告列表
      cookieId: []
    }
  },
  methods: {
    getNotice () {
      this.$http({
	      method: 'GET',
	      url: "/api/content/notice",
	      params: {
	      	pagesize: this.pageSize,
	      	pageindex: (this.pageIndexX-1),
          label: "Notice"
        }
	    }).then((response) => {
	      //给公告的内容赋值
				this.noticeList = response.data.contents;
				this.noticeTotal = response.data.total;
				if (this.noticeTotal == undefined) {
					this.noticeTotal = 0;
				}

				//判断身份
				if (response.data.operatortype == "Edit") {
					this.roleFlag = 0;
				}else{
					this.roleFlag = 1;
				}

				if (response.data.contents&&response.data.total) {
					for (let i = 0; i < response.data.contents.length; i++) {
						if (response.data.contents[i].addtime != null) {
							response.data.contents[i].addtime = response.data.contents[i].addtime.substring(0,16)
						}
					}
				}
				this.pageTotalX = Math.ceil(this.noticeTotal / this.pageSize);
	    },(err) => {
        console.log('出错啦！'+err)
      })
    },
    getCollege () {
      this.$http({
	      method: 'GET',
	      url: "/api/content/notice",
	      params: {
	      	pagesize: this.pageSize,
	      	pageindex: (this.pageIndexG-1),
	      	label:"College"
        }
	    }).then((response) => {
	      //给学院的内容赋值
	      console.log(response.data)
				this.collegeList = response.data.contents;
				this.articleTotal = response.data.total;
				if (this.articleTotal == undefined) {
					this.articleTotal = 0;
				}

				if (response.data.contents&&response.data.total) {
					for (let i = 0; i < response.data.contents.length; i++) {
						if (response.data.contents[i].addtime != null) {
							response.data.contents[i].addtime = response.data.contents[i].addtime.substring(0,16);
						}
					}
				}
				this.pageTotalG = Math.ceil(this.articleTotal / this.pageSize);
	    },(err) => {
        console.log('出错啦！'+err)
      })
    },
    getNoticeURL (id){
      this.$router.push({path:'/notice?'+id})
    },
    getAdlist () {
      this.$http.get('http://mp.dev.hubpd.com/api/advertise').then((res) => {
        this.adList = res.data.advertises;
      },(err) => {
        console.log('出错啦！'+err)
      });
    },
    changePageNotice (page){
      this.pageIndexX = page;
      this.getNotice();
    },
    changePageCollege (page){
        this.pageIndexG = page;
      	this.getCollege();
    },
    readed (ev, cooid) {
		  var ele = ev.target.parentNode.parentNode.nodeName == "LI" ? ev.target.parentNode.parentNode : ev.target;
		  ele.className = "readed";
  	}
  },
  mounted () {
    //用于显示左侧
    var span5 =  document.querySelector(".ivu-col-span-5");
    var span19 =  document.querySelector(".ivu-col-span-19");
    if(!span19){
      span19 =  document.querySelector(".ivu-col-span-24");
    }
    span5.style.display = 'block';
    span19.className = "layout-content-warp ivu-col ivu-col-span-19";

     this.getNotice();
     this.getCollege();
     this.getAdlist();
  }
}
