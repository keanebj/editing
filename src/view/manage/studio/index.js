
export default {
  name: 'ViewManageStudio',
  data() {
    return {
      data: [],
      pageindex: 0,
      pagesize: 10,
      total: 0,
      isLoading: true,
    }
  },
  computed: {
  },
  methods: {
    /**
     * 请求广告列表
     */
    fetchCollection() {
      this.isLoading = true
      this.$http.get('/api/studio', {
        params: {
          pageindex: this.pageindex,
          pagesize: this.pagesize
        }
      }).then(({ data }) => {
        if (data.status) {
          this.total = data.total
          this.data = data.studios
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
      this.$Modal.confirm({
        title: '确认删除',
        content: '是否删除该条数据？',
        onOk: () => {
          this.requestRemove(index)
        }
      })
    },
    requestRemove(index) {
      var item = this.data[index]
      if (!item) return
      this.$http.delete('/api/studio/' + item.id).then(({ data }) => {
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
    onChangePage(page) {
      this.pageindex = page - 1
      this.fetchCollection()
    }
  },
  created() {
    this.fetchCollection()
  }
}
