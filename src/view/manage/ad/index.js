var data = [{
  "ID": 1,
  "Path": "/static/demo.jpg",
  "Url": "http://www.baidu.com",
  "ShowTime": "2017-09-10 00:00:00"
},
{
  "ID": 3,
  "Path": "/static/demo.jpg",
  "Url": "http://www.baidu.com",
  "ShowTime": "2017-09-10 00:00:00"
},
{
  "ID": 2,
  "Path": "/static/demo.jpg",
  "Url": "http://www.baidu.com",
  "ShowTime": "2017-07-12 00:00:00"
}]
var itemTemplate = {
  ID: null,
  Path: '',
  Url: '',
  ShowTime: null
}
export default {
  name: 'ViewManageAd',
  data() {
    return {
      data: []
    }
  },
  computed: {
    isModify() {
      var m = this.data
      for (var k in m) {
        if (m[k].Path !== m[k].PathOld || m[k].Url !== m[k].UrlOld) {
          if (m[k].id) return true
          else if (m[k].Url && m[k].Path) return true
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
      this.$http.get('/api/advertise/', {
        params: {
          pageindex: 1,
          pagesize: 1000
        }
      }).then(res => {
        if (res.status) {
          this.setData(res.advertiselist)
        } else {
          this.$Notice.error({
            title: '错误',
            desc: res.message || '数据列表请求错误'
          })
        }
      }, () => {
        this.$Notice.error({
          title: '错误',
          desc: '数据列表请求错误'
        })
      })
    },
    onRemove(index) {
      var item = this.data[index]
      if (!item.ShowTime) {
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
      this.$http.delete('/api/advertise/' + item.ID).then(res => {
        if (res.status) {
          this.$Notice.success({
            title: '成功',
            desc: res.message || '删除成功'
          })
          this.data.splice(index, 1)
        } else {
          this.$Notice.error({
            title: '错误',
            desc: res.message || '删除错误'
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
        PathOld: '',
        UrlOld: ''
      }, itemTemplate))
    },
    setData(data) {
      this.data = data.map((n) => {
        n.isEdit = n.isEdit || false
        n.PathOld = n.Path
        n.UrlOld = n.Url
        return n
      })
    },
    onBlur(index) {
      var item = this.data[index]
      if (item.ShowTime) {
        item.isEdit = false
      }
    },
    onSubmit() {
      var m = this.data
      for (var k in m) {
        var item = m[k]
        if (!item.Url) {
          this.$Message.warning('请输入Url')
          continue
        } else if (!item.Path) {
          this.$Message.warning('请输入Path')
          continue
        }

        if (item.Path !== item.PathOld || item.Url !== item.UrlOld) {
          if (item.ID) this.requestUpdate(k, item)
          else this.requestSave(k, item)
        }
      }
    },
    requestSave(index, item) {
      this.$http.post('/api/advertise/', {
        path: item.Path,
        url: item.Url
      }).then(res => {
        if (res.status) {
          item.ID = res.id
          item.ShowTime = new Date()
          item.PathOld = item.Path
          item.UrlOld = item.Url
        } else {
          this.$Notice.error({
            title: '错误',
            desc: res.message || '添加错误'
          })
        }
      }, () => {
        this.$Notice.error({
          title: '错误',
          desc: '添加错误'
        })
      })
    },
    requestUpdate(index, item) {
      this.$http.put('/api/advertise/' + item.ID, {
        path: item.Path,
        url: item.Url
      }).then(res => {
        if (res.status) {
          item.PathOld = item.Path
          item.UrlOld = item.Url
        } else {
          this.$Notice.error({
            title: '错误',
            desc: res.message || '更新错误'
          })
        }
      }, () => {
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
        if (item.ID) {
          item.Path = item.PathOld
          item.Url = item.UrlOld
          item.isEdit = false
        } else {
          this.data.splice(k, m.length - k)
          return
        }
      }
    }
  },
  created() {
    this.setData(data)
    this.fetchCollection()
  }
}
