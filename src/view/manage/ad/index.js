import CropperUpload from '@/components/cropperUpload/index.vue'
var itemTemplate = {
  id: null,
  path: '',
  url: '',
  showtime: null
}
var match = /^((ht|f)tps?):\/\/([\w\-]+(\.[\w\-]+)*\/)*[\w\-]+(\.[\w\-]+)*\/?(\?([\w\-\.,@?^=%&:\/~\+#]*)+)?/
export default {
  name: 'ViewManageAd',
  data() {
    return {
      data: [],
      isLoading: true,
      isSubmit: false,
      requestCount: 0
    }
  },
  components: {
    'cropper-upload': CropperUpload
  },
  computed: {
    isModify() {
      var m = this.data
      for (var k in m) {
        if (m[k].path !== m[k].pathOld || m[k].url !== m[k].urlOld) {
          if (m[k].id) return true
          else if (m[k].url && m[k].path) return true
        }
      }
      return false
    }
  },
  methods: {
    /**
     * 请求广告列表
     */
    fetchCollection() {
      this.isLoading = true
      this.$http.get('/api/advertise', {
        params: {
          pageindex: 0,
          pagesize: 1000
        }
      }).then(({ data }) => {
        if (data.status) {
          this.setData(data.advertises)
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
    onRemove(index) {
      var item = this.data[index]
      if (!item.id) {
        this.data.splice(index, 1)
        return
      }
      this.$Modal.confirm({
        title: '确认删除',
        content: '是否删除该条广告？',
        onOk: () => {
          this.requestRemove(item, index)
        }
      })
    },
    requestRemove(item, index) {
      this.$http.delete('/api/advertise/' + item.id).then(({ data }) => {
        if (data.status) {
          this.$Notice.success({
            title: '成功',
            desc: data.message || '删除成功'
          })
          this.data.splice(index, 1)
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
    onAdd() {
      this.data.push(Object.assign({
        isEdit: true,
        pathOld: '',
        urlOld: ''
      }, itemTemplate))
    },
    setData(data) {
      if (!data) return
      this.data = data.map((n) => {
        n.isEdit = n.isEdit || false
        n.pathOld = n.path
        n.urlOld = n.url
        return n
      })
    },
    onBlur(index) {
      var item = this.data[index]
      if (item.id) {
        item.isEdit = false
      }
    },
    onSubmit() {
      var m = this.data
      this.requestCount = 0
      for (var k in m) {
        var item = m[k]
        if (!item.url) {
          this.$Notice.error({
            title: '错误',
            desc: '请输入url'
          })
          continue
        } if (!match.test(item.url)) {
          this.$Notice.error({
            title: '错误',
            desc: '请输入有效的url'
          })
          continue
        } else if (!item.path) {
          this.$Notice.error({
            title: '错误',
            desc: '请输入path'
          })
          continue
        }

        if (item.path !== item.pathOld || item.url !== item.urlOld) {
          if (item.id) this.requestUpdate(k, item)
          else this.requestSave(k, item)
          this.requestCount++
        }
      }
      if (this.requestCount) {
        this.isSubmit = true
      }
    },
    requestSave(index, item) {
      this.$http.post('/api/advertise', {
        path: item.path,
        url: item.url
      }).then(({ data }) => {
        this.requestCount--
        if (this.requestCount <= 0) this.isSubmit = false
        if (data.status) {
          item.id = data.id
          // item.showtime = new Date()
          item.pathOld = item.path
          item.urlOld = item.url
          item.isEdit = false
        } else {
          this.$Notice.error({
            title: '错误',
            desc: data.message || '添加错误'
          })
        }
      }, () => {
        this.requestCount--
        if (this.requestCount <= 0) this.isSubmit = false
        this.$Notice.error({
          title: '错误',
          desc: '添加错误'
        })
      })
    },
    requestUpdate(index, item) {
      this.$http.put('/api/advertise/' + item.id, {
        path: item.path,
        url: item.url
      }).then(({ data }) => {
        this.requestCount--
        if (this.requestCount <= 0) this.isSubmit = false
        if (data.status) {
          item.pathOld = item.path
          item.urlOld = item.url
          item.isEdit = false
        } else {
          this.$Notice.error({
            title: '错误',
            desc: data.message || '更新错误'
          })
        }
      }, () => {
        this.requestCount--
        if (this.requestCount <= 0) this.isSubmit = false
        this.$Notice.error({
          title: '错误',
          desc: '更新错误'
        })
      })
    },
    onCancel() {
      var m = this.data
      for (var k in m) {
        var item = m[k]
        if (item.id) {
          item.path = item.pathOld
          item.url = item.urlOld
          item.isEdit = false
        } else {
          this.data.splice(k, m.length - k)
          return
        }
      }
    },
    onSuccess(response, field, ki) {
      if (response.path) {
        this.data.forEach((n) => {
          if (n.id === ki) {
            n.path = response.path
          }
        })
      }
    },
    onError(error, field, ki) {
      this.$Notice.error({
        title: '错误',
        desc: error.message || '图片上传错误！'
      })
    }
  },
  created() {
    this.fetchCollection()
  }
}
