
export default {
  name: 'ViewManageStudio',
  data() {
    return {
      data: [],
      pageindex: 0,
      pagesize: 10,
      total: 0,
      isLoading: true,
      catalogs: {},
      nodata: true
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
          this.isLoading = false
        	if(data.total ==0){
	      		this.nodata=false;
	      	}else{
	      		this.nodata=true;
	      	}
          this.total = data.total
          this.data = data.studios
          this.data[0].catalogid = 15725
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
          if (this.total > 0) {
            this.total--
          }
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
    },
    fetchCatalogs () {
      this.$http.get('/api/catalog').then(({ data }) => {
        if (data.status) {
          if (data.catalogs) {
            var catalogs = {}
            data.catalogs.forEach(n => {
              catalogs[n.id] = Object.assign(n, {
                cname: n.alias.split('_')[1]
              })
            })
          }
          this.catalogs = catalogs
          console.log(this.catalogs)
        }
      })
    }
  },
  created() {
    this.fetchCollection()
    this.fetchCatalogs()
  }
}
