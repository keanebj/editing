import ScrollBar from '@/view/scroll/index.vue'
var statusMaps = {
  'PendingAudit': '待审核',
  'Publish': '已发表',
  'NotPass': '未通过',
  'Offline': '已撤回'
}
var confirmMaps = {
  'Publish': {
    single: {
      title: '确认',
      content: '是否通过该条内容？'
    },
    multi: {
      title: '确认',
      content: '是否通过所选内容？'
    }
  },
  'NotPass': {
    single: {
      title: '不通过',
      content: '是否不通过该条内容？'
    },
    multi: {
      title: '不通过',
      content: '是否不通过所选内容？'
    }
  },
  'Offline': {
    single: {
      title: '撤回',
      content: '是否撤回该条内容？'
    },
    multi: {
      title: '撤回',
      content: '是否撤回所选内容？'
    }
  },
  'Remove': {
    single: {
      title: '删除',
      content: '是否删除该条内容？'
    },
    multi: {
      title: '删除',
      content: '是否删除所选内容？'
    }
  }
}
import {
  isArray
} from 'lodash'
export default {
  name: 'ViewManageContentAudit',
  components: {
    ScrollBar
  },
  data() {
    return {
      data: [],
      total: 10,
      pageSize: 10, //每页显示显示条数
      pageIndex: 1, //当前页码
      isLoading: true,
      studio: 0,
      status: 'PendingAudit',
      searchValue: '',
      checkIds: [],
      statusMaps: statusMaps,
      studios: [],
      elements: [],
      articleID: -1,
      previewContent: false,
      previewCon: [{
          title: '',
          subtitle: '',
          content: '',
          studioname: '',
          time: ''
        },
        []
      ],
      tabView: 'pc'
    }
  },
  computed: {
    checkAll() {
      return this.data.length <= this.checkIds.length
    },
    checkAllIndeterminate() {
      return (this.data.length > this.checkIds.length && this.checkIds.length > 0) ? true : false
    },
    pageCount: function () {
      let remainder = this.total % this.pageSize;
      if (remainder) {
        return Math.ceil(this.total / this.pageSize);
      } else {
        return Math.floor(this.total / this.pageSize);
      }
    }
  },
  methods: {
    //滚动条
    changeView: function (view) {
      this.tabView = view;
      this.elements[0].style.top = '0px'; //内容高度
      this.elements[1].style.top = '0px'; //条的高度
      var ele = this.elements;
      clearTimeout(time)
      var time = setTimeout(function () {
        if (ele[3].clientHeight < ele[0].clientHeight) {
          ele[1].style.display = 'block';
          ele[2].style.display = 'block';

          var scale = ele[3].clientHeight / ele[0].clientHeight;
          ele[1].style.height = ele[2].clientHeight * scale + 'px'
        } else {
          console.log(ele[0])
          ele[1].style.display = 'none';
          ele[2].style.display = 'none';
        }
      }, 10)

    },
    // 预览代码
    showPreviewContent: function (aId) {
      this.articleID = aId
      //获得编辑器中的内容:这里的预览需要写一个界面（待完善。。。）
      if (this.articleID > -1) {
        this.isLoading = true
        //    	保存显示预览(后台返回数据问题)
        this.$http.get("/api/content/" + this.articleID).then((response) => {
          let data = response.data.content;
          //给数据值
          this.previewCon[0].title = data.title;
          this.previewCon[0].subtitle = data.subtitle;
          this.previewCon[0].content = data.content;
          this.previewCon[0].time = data.addtime;
          this.previewCon[0].studioname = this.studioName;
          this.$refs.yulan.previewConauthor(data.author);
          this.previewCon[0].channel = data.channel;
          if (response.data.operatortype == "Edit") {
            this.previewCon[0].author = data.author;
          }
        }, (error) => {
          this.$Notice.error({
            title: error.data.message,
            desc: false
          })
        });
        this.isLoading = false
        this.previewContent = true;
        var ele = this.elements;
        clearTimeout(time);
        var time = setTimeout(function () {
          if (ele[3].clientHeight >= ele[0].clientHeight) {
            ele[1].style.display = 'none';
            ele[2].style.display = 'none';
          } else {
            ele[1].style.display = 'block';
            ele[2].style.display = 'block';
            var scale = ele[3].clientHeight / ele[0].clientHeight;
            ele[1].style.height = ele[2].clientHeight * scale + 'px'
          }
        }, 200)
      } else {
        //    	不显示预览
        this.$Notice.warning({
          title: '保存后才能预览',
          desc: false
        })
      }
    },
    change(element) {
      this.elements = element;
    },
    /**
     * 请求内容审核列表
     */
    fetchCollection() {
      this.isLoading = true
      this.$http.get('/api/studio/audit', {
        params: {
          pageindex: this.pageIndex - 1,
          pagesize: this.pageSize,
          username: this.studio ? this.studio : '',
          status: this.status,
          value: this.searchValue
        }
      }).then(({
        data
      }) => {
        if (data.status) {
          for(let i=0;i<data.contents.length;i++){
          	if (data.contents[i].publishdate != null ) {
          		data.contents[i].addtime = data.contents[i].publishdate.substring(0,10);
          	}else if (data.contents[i].publishdate == null && data.contents[i].modifytime != null){
          		data.contents[i].addtime=data.contents[i].modifytime.substring(0,10);
          	}else{
          		data.contents[i].addtime = data.contents[i].addtime.substring(0,10);
          	}
          }
          this.data = data.contents
          this.total = data.total
          this.checkIds = []
        } else {
          this.$Notice.error({
            title: '错误',
            desc: data.message || '数据列表请求错误'
          })
        }
        this.isLoading = false
      }, () => {
        this.$Notice.error({
          title: '错误',
          desc: '数据列表请求错误'
        })
        this.isLoading = false
      })
    },
    handleSearch() {
      this.pageIndex = 1
      this.fetchCollection()
    },
    handleChangePage(page) {
      this.pageIndex = page
      this.fetchCollection()
    },
    handleChangeStudio() {
      this.pageIndex = 1
      this.fetchCollection()
    },
    handleChangeStatus() {
      this.pageIndex = 1
      this.fetchCollection()
    },
    handleCheckAll() {
      if (this.data.length <= this.checkIds.length) {
        this.checkIds = []
      } else {
        this.data.forEach(item => {
          if (this.checkIds.indexOf(item.id) < 0) {
            this.checkIds.push(item.id)
          }
        })
      }
    },
    handleCheck(id) {
      var i = this.checkIds.indexOf(id)
      if (i >= 0) {
        this.checkIds.splice(i, 1)
      } else {
        this.checkIds.push(id)
      }
    },
    onHandle(status, ids) {
      if (!ids) {
        if (!this.checkIds.length) {
          this.$Notice.error({
            title: '错误',
            desc: '请选择条目'
          })
          return
        }
        ids = this.checkIds
      } else {
        ids = [ids]
      }
      let ops = confirmMaps[status][ids.length > 0 ? 'multi' : 'single'] || {}
      this.$Modal.confirm({
        ...ops,
        onOk: () => {
          if (status === 'Publish') this.requestPublish(ids)
          else if (status === 'NotPass') this.requestNotPass(ids)
          else if (status === 'Offline') this.requestOffline(ids)
          else if (status === 'Remove') this.requestRemove(ids)
        }
      })
    },
    requestPublish(ids) {
      this.$http.put('/api/studio/audit/' + ids.join(), {
        status: 'Publish'
      }).then(({
        data
      }) => {
        if (data.status) {
          this.$Notice.success({
            title: '成功',
            desc: data.message || '通过成功'
          })
          this.fetchCollection()
        } else {
          this.$Notice.error({
            title: '错误',
            desc: data.message || '通过错误'
          })
        }
      }, () => {
        this.$Notice.error({
          title: '错误',
          desc: '接口访问错误'
        })
      })
    },
    requestNotPass(ids) {
      this.$http.put('/api/studio/audit/' + ids.join(), {
        status: 'NotPass'
      }).then(({
        data
      }) => {
        if (data.status) {
          this.$Notice.success({
            title: '成功',
            desc: data.message || '不通过成功'
          })
          this.fetchCollection()
        } else {
          this.$Notice.error({
            title: '错误',
            desc: data.message || '不通过错误'
          })
        }
      }, () => {
        this.$Notice.error({
          title: '错误',
          desc: '接口访问错误'
        })
      })
    },
    requestOffline(ids) {
      this.$http.put('/api/content/offline/' + ids.join()).then(({
        data
      }) => {
        if (data.status) {
          this.$Notice.success({
            title: '成功',
            desc: data.message || '撤回成功'
          })
          this.fetchCollection()
        } else {
          this.$Notice.error({
            title: '错误',
            desc: data.message || '撤回错误'
          })
        }
      }, () => {
        this.$Notice.error({
          title: '错误',
          desc: '接口访问错误'
        })
      })
    },
    requestRemove(ids) {
      this.$http.delete('/api/content/' + ids.join()).then(({
        data
      }) => {
        if (data.status) {
          this.$Notice.success({
            title: '成功',
            desc: data.message || '删除成功'
          })
          this.fetchCollection()
        } else {
          this.$Notice.error({
            title: '错误',
            desc: data.message || '删除错误'
          })
        }
      }, () => {
        this.$Notice.error({
          title: '错误',
          desc: '删除错误'
        })
      })
    },
    requestStudio() {
      this.$http.get('/api/studio', {
        params: {
          page: false
        }
      }).then(({
        data
      }) => {
        if (data.status) {
          this.studios = data.studios
        } else {}
      }, () => {})
    }
  },
  created() {
    this.requestStudio()
    this.fetchCollection()
    sessionStorage.setItem('articleDetail', 'audit');
  }
}
