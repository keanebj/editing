import Cookies from 'js-cookie'
import {
  swiper,
  swiperSlide
} from 'vue-awesome-swiper'
export default {
  name: 'Home',
  components: {
    swiper,
    swiperSlide
  },
  created() {
  	sessionStorage.setItem('articleDetail', 'home');
    if (!this.$store.state.token) {
      this.$router.push('/login')
      return;
    }
    if (this.$store.state.userinfo.username == undefined || this.$store.state.userinfo.username == null) {
      this.$router.push('/login')
      return;
    }
    this.getNotice();
    this.getCollege();
    this.getAdlist();

    //		判断身份
    this.roleType = this.$store.state.userinfo.roleType;
    if (this.roleType == 'Edit') {
      //			请求中央厨房号指数
      this.roleFlag = 1;
      this.$http.get('/api/studio/' + this.$store.state.userinfo.id).then(({
        data
      }) => {
        if (data.status == 1) {
          if (data.studio.accountindex == null) {
            this.accountIndex = 0;
          } else {
            this.accountIndex = data.studio.accountindex;
          }
        } else {
          // this.$Notice.error({
          //   title: '错误',
          //   desc: data.message || '工作室数请求错误'
          // })
          this.errorProcess(response.data)
        }
        this.isLoading = false
      }, () => {
        this.$Notice.error({
          title: '错误',
          desc: '融合号数请求错误'
        })
        this.isLoading = false
      })
    } else {
      //		请求工作室总数
      this.roleFlag = 0;
      this.$http.get('/api/studio').then(({
        data
      }) => {
        if (data.status) {
          if (data.status == 1)
            this.studioTotal = data.total
          else
            this.errorProcess(data)

        } else {
          this.$Notice.error({
            title: '错误',
            desc: data.message || '融合号总数请求错误'
          })
        }
        this.isLoading = false
      }, () => {
        this.$Notice.error({
          title: '错误',
          desc: '融合号总数请求错误'
        })
        this.isLoading = false
      })
    }
    //		文章总数
    this.$http.get("/api/content/count").then(({
      data
    }) => {
      if (data.status) {
        if (data.status == 1)
          this.articleTot = data.total;
        else
          this.errorProcess(data)
      } else {
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
      roleFlag: 1, //切换显示工作室集合厨房指数
      switchTab: 0, //tab切换
      value2: 0, //跑马灯显示下标
      pageTotalX: 2, //公告所有页
      pageTotalG: 40, //学院所有页
      pageIndexX: 1, //公告当前页
      pageIndexG: 1, //学院当前页
      pageSize: 8, //每页的个数
      noticeTotal: 0, //公告总数
      articleTotal: 0, //学院总数
      studioTotal: 0, //工作室总数
      accountIndex: 0, //中央厨房号指数
      noticeList: [], //公告列表
      collegeList: [], //学院列表
      adList: [], //广告列表
      cookieId: [],
      swiperOption: { //轮播组件
        autoplay: 2000,
        initialSlide: 1,
        loop: true,
        nextButton: '.swiper-button-next',
        prevButton: '.swiper-button-prev',
        pagination: '.swiper-pagination',
        paginationClickable: true,
        autoplayDisableOnInteraction: false,
        simulateTouch: false
      },
      clickedNo: [], //存储当前被点击后的notice
      clickedCo: [], //存储当前被点击后的学院
      articleTot: 0, //总发文数
      nodataNotice: true,
      nodataCollege: true,
      roleType: 'Edit'
    }
  },
  methods: {
    errorProcess(resData) {
      let status = resData.status
      switch (status) {
        case 100:
          this.$router.push('/login')
          break;
        case 300:
          this.$Notice.error({
            title: '错误',
            desc: '参数错误'
          })
          break;
        case 400:
          this.$Notice.error({
            title: '错误',
            desc: '远程链接错误'
          })
          break;
        case 500:
          this.$Notice.error({
            title: '错误',
            desc: '数据库执行错误'
          })
          break;
        case 600:
          this.$Notice.error({
            title: '错误',
            desc: '操作正在执行'
          })
          break;
        default:
          this.$Notice.error({
            title: '错误',
            desc: resData.message
          })
      }
    },
    getNotice() {
      this.$http.get("/api/content/notice", {
        params: {
          pagesize: this.pageSize,
          pageindex: (this.pageIndexX - 1),
          label: "Notice"
        }
      }).then((response) => {
        //给公告的内容赋值
        if (response.data.status == 1) {
          if (response.data.total == 0) {
            this.nodataNotice = false;
            return;
          } else {
            this.nodataNotice = true;
          }
          this.noticeTotal = response.data.total;
          if (this.noticeTotal == undefined) {
            this.noticeTotal = 1;
          }
          if (response.data.contents && response.data.total) {
            for (let i = 0; i < response.data.contents.length; i++) {
              if (response.data.contents[i].addtime != null) {
                response.data.contents[i].addtime = response.data.contents[i].addtime.substring(0, 16)
              }
            }
          }
          //				改变颜色
          if (Cookies.get('clickedNo') != undefined) {
            var cookieGet = Cookies.get('clickedNo').split(",");
            this.clickedNo = cookieGet;
            for (let i = 0; i < this.clickedNo.length; i++) {
              for (let j = 0; j < response.data.contents.length; j++) {
                console.log(response.data.contents[j].id)
                if (this.clickedNo[i] == response.data.contents[j].id) {
                  response.data.contents[j].isReaded = true;
                }
              }
            }
          }
          this.noticeList = response.data.contents;
          this.pageTotalX = Math.ceil(this.noticeTotal / this.pageSize);
        } else {
          // this.$Notice.error({
          //   title: '错误',
          //   desc: response.data.message || '数据列表请求错误'
          // })
          this.errorProcess(response.data)
        }
      }, (err) => {
        this.$Notice.error({
          title: '错误',
          desc: err.message || '数据列表请求错误'
        })
      })
    },
    getCollege() {
      this.$http({
        method: 'GET',
        url: "/api/content/notice",
        params: {
          pagesize: this.pageSize,
          pageindex: (this.pageIndexG - 1),
          label: "College"
        }
      }).then((response) => {
        //给学院的内容赋值
        if (response.data.status == 1) {
          if (response.data.total == 0) {
            this.nodataCollege = false;
            return;
          } else {
            this.nodataCollege = true;
          }
          //					this.collegeList = response.data.contents;
          this.articleTotal = response.data.total;
          if (this.articleTotal == undefined) {
            this.articleTotal = 1;
          }
          if (response.data.contents && response.data.total) {
            for (let i = 0; i < response.data.contents.length; i++) {
              if (response.data.contents[i].addtime != null) {
                response.data.contents[i].addtime = response.data.contents[i].addtime.substring(0, 16);
              }
            }
          }
          //				改变颜色
          if (Cookies.get('clickedCo') != undefined) {
            var cookieGet = Cookies.get('clickedCo').split(",");

            this.clickedCo = cookieGet;
            for (let i = 0; i < cookieGet.length; i++) {
              for (let j = 0; j < response.data.contents.length; j++) {
                if (cookieGet[i] == response.data.contents[j].id) {
                  response.data.contents[j].isReaded = true;
                }
              }
            }
          }
          this.collegeList = response.data.contents;
          this.pageTotalG = Math.ceil(this.articleTotal / this.pageSize);
        } else {
          // this.$Notice.error({
          //   title: '错误',
          //   desc: response.data.message || '数据列表请求错误'
          // })
          this.errorProcess(response.data)
        }
      }, (err) => {
        this.$Notice.error({
          title: '错误',
          desc: err.message || '数据列表请求错误'
        })
      })
    },
    getNoticeURL(id) {
      this.$router.push({
        path: '/notice?' + id
      })
    },
    getAdlist() {
      this.$http.get('/api/advertise').then((res) => {
        if (res.data.status) {
          this.adList = res.data.advertises;
        } else {
          this.$Notice.error({
            title: '错误',
            desc: response.data.message || '数据列表请求错误'
          })
        }
      }, (err) => {
        this.$Notice.error({
          title: '错误',
          desc: err.message || '数据列表请求错误'
        })
      });
    },
    changePageNotice(page) {
      this.pageIndexX = page;
      this.getNotice();
    },
    changePageCollege(page) {
      this.pageIndexG = page;
      this.getCollege();
    },
    changeTab(index) {
      if (index == 0) {
        this.getNotice();
      } else {
        this.getCollege();
      }
      this.switchTab = index;

    },
    readed(ev, cooid, index) {
      var ele = ev.target.parentNode.nodeName == "LI" ? ev.target.parentNode : ev.target.parentNode.parentNode;
      ele.className = "readed";
      if (this.switchTab == 0) {
        if (this.clickedNo.length == 0) {
          this.clickedNo.push(this.noticeList[index].id);
        } else {
          var hasIn = true;
          for (var i = 0; i < this.clickedNo.length; i++) {
            if (this.noticeList[index].id == this.clickedNo[i]) {
              hasIn = false;
            }
          }
          if (hasIn) {
            this.clickedNo.push(this.noticeList[index].id);
          }
        }
        Cookies.set('clickedNo', this.clickedNo.join(','))
        //		  	console.log(Cookies.get('clickedNo'))
      } else {
        this.getCollege();
        if (this.clickedCo.length == 0) {
          this.clickedCo.push(this.collegeList[index].id);
        } else {
          var hasIn = true;
          for (var i = 0; i < this.clickedCo.length; i++) {
            if (this.collegeList[index].id == this.clickedCo[i]) {
              hasIn = false;
            }
          }
          if (hasIn) {
            this.clickedCo.push(this.collegeList[index].id);
          }
        }
        Cookies.set('clickedCo', this.clickedCo.join(','))
      }
    }
  },
  mounted() {
    if (this.$store.state.token) {
      //用于显示左侧
      var span5 = document.querySelector(".ivu-col-span-5");
      var span19 = document.querySelector(".ivu-col-span-19");

      if (!span19) {
        span19 = document.querySelector(".ivu-col-span-24");
      }
      span5.style.display = 'block';
      span19.className = "layout-content-warp ivu-col ivu-col-span-19";

      setTimeout(function () {
        var span5 = document.querySelector(".ivu-col-span-5");
        var span19 = document.querySelector(".ivu-col-span-19");
        if (!span19) {
          span19 = document.querySelector(".ivu-col-span-24");
        }
        span5.style.display = 'block';
        span19.className = "layout-content-warp ivu-col ivu-col-span-19";
      }, 1000)
    }
  }
}
