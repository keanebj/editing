import Cookies from 'js-cookie'
import { swiper, swiperSlide } from 'vue-awesome-swiper'
export default {
  name: 'Home',
  components: {
    swiper,
    swiperSlide
	},
  created() {
//    判断进入公告还是学院
		if (this.$route.query.switchTab == undefined) {
			this.switchTab = 0
		}else{
			this.switchTab = this.$route.query.switchTab;
		}

		this.$http({
      method: 'GET',
      url: "/api/content/count"
    }).then((response) => {
    	this.articleTot = response.data.total;
    })


//		请求工作室总数
		this.$http.get('/api/studio').then(({ data }) => {
	    if (data.status) {
	      this.studioTotal = data.total
	    } else {
	      this.$Notice.error({
	        title: '错误',
	        desc: data.message || '工作室数请求错误'
	      })
	    }
	    this.isLoading = false
	  }, () => {
	    this.$Notice.error({
	      title: '错误',
	      desc: '工作室数请求错误'
	    })
	    this.isLoading = false
	  })
//  this.roleFlag = this.$store.state.roleType;
//		console.log(this.$store.state.roleType)
  },
  computed: {
  	swiper() {
  		return this.$refs.mySwiper.swiper;
		}
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
      articleTotal:0,//学院总数
      studioTotal:35,//工作室总数
      accountIndex:100,//中央厨房号指数
      noticeList:[],//公告列表
      collegeList:[],//学院列表
      adList:[],//广告列表
      cookieId: [],
      swiperOption: {  //轮播组件
					autoplay: 2000,
          initialSlide: 1,
          loop: true,
					nextButton: '.swiper-button-next',
    			prevButton: '.swiper-button-prev',
          pagination: '.swiper-pagination',
          paginationClickable :true,
          autoplayDisableOnInteraction : false,
          simulateTouch : false
      },
      clickedNo: [],//存储当前被点击后的notice
      clickedCo: [],//存储当前被点击后的学院
     	articleTot: 0//总发文数
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
					this.noticeTotal = 1;
				}

				//判断身份
				if (response.data.operatortype == "Edit") {
					this.roleFlag = 1;
				}else{
					this.roleFlag = 0;
				}

				if (response.data.contents&&response.data.total) {
					for (let i = 0; i < response.data.contents.length; i++) {
						if (response.data.contents[i].addtime != null) {
							response.data.contents[i].addtime = response.data.contents[i].addtime.substring(0,16)
						}
					}
				}
				//				改变颜色
				if (Cookies.get('clickedNo') != undefined) {

					var cookieGet = Cookies.get('clickedNo').split(",");
					for (let i = 0; i < cookieGet.length; i++) {
						this.clickedNo.push(parseInt(cookieGet[i]))
			     	if ( (this.pageIndexX-1)*8<= cookieGet[i] <this.pageIndexX*8) {
			     		this.noticeList[cookieGet[i]].isReaded = true;
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
				this.collegeList = response.data.contents;
				this.articleTotal = response.data.total;
				if (this.articleTotal == undefined) {
					this.articleTotal = 1;
				}

				if (response.data.contents&&response.data.total) {
					for (let i = 0; i < response.data.contents.length; i++) {
						if (response.data.contents[i].addtime != null) {
							response.data.contents[i].addtime = response.data.contents[i].addtime.substring(0,16);
						}
					}
				}
				//				改变颜色
				if (Cookies.get('clickedCo') != undefined) {

					var cookieGet = Cookies.get('clickedCo').split(",");
					for (let i = 0; i < cookieGet.length; i++) {
						this.clickedCo.push(parseInt(cookieGet[i]))
			     	if ( (this.pageIndexG-1)*8<= cookieGet[i] <this.pageIndexG*8) {
			     		this.collegeList[cookieGet[i]].isReaded = true;
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
    readed (ev, cooid, index) {
    	var ele = ev.target.parentNode.parentNode.nodeName == "LI" ? ev.target.parentNode.parentNode : ev.target;
		  ele.className = "readed";
    	if (this.switchTab == 0) {
      	var inde1 = index + (this.pageIndexX-1)*8;
      	this.noticeList[inde1].isReaded = true;

		  	if (this.clickedNo.length == 0) {
		  		this.clickedNo.push(inde1);
		  	}else{
		  		var hasIn = true;
		  		for (var i=0;i<this.clickedNo.length;i++) {
			  		if (inde1 == this.clickedNo[i]) {

			  			hasIn = false;
			  		}
			  	}
		  		if (hasIn) {
		  			this.clickedNo.push(inde1);
		  		}
		  	}
		  	Cookies.set('clickedNo',this.clickedNo.join(','))
//		  	console.log(Cookies.get('clickedNo'))
      }else{
      	var inde2 = index + (this.pageIndexG-1)*8;
      	this.collegeList[inde2].isReaded = true;

      	if (this.clickedCo.length == 0) {
		  		this.clickedCo.push(inde2);
		  	}else{
		  		var hasIn = true;
		  		for (var i=0;i<this.clickedCo.length;i++) {
			  		if (inde2 == this.clickedCo[i]) {

			  			hasIn = false;
			  		}
			  	}
		  		if (hasIn) {
		  			this.clickedCo.push(inde2);
		  		}
		  	}
		  	Cookies.set('clickedCo',this.clickedCo.join(','))
//		  	console.log(Cookies.get('clickedCo'))
      }
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
