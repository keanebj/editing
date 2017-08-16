import CropperUpload from '@/components/cropperUpload/index.vue'
export default {
  name: 'ViewManageStudioId',
  components: {
    'cropper-upload': CropperUpload
  },
  data() {
    const validatePassCheck = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('确认密码不能为空'))
      } else if (value !== this.formValidate.password) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    };
    const validateCID = (rule, value, callback) => {
      if (value == '' || value == undefined || typeof (value) == 'undefined') {
        callback(new Error('请选择【栏目绑定】'));
      } else {
        callback();
      }
    };
    return {
      id: 0,
      resetPWD: false,
      resetWord: '重置',
      isSubmit: false,
      isLoading: false,
      catalogs: {},
      disabledS: true,
      firstLoad: true,
      formValidate: {
        "id": 0,
        "username": "",
        "password": "",
        "passwordConfirm": "",
        "studioname": "",
        "url": "",
        "logofile": "",
        "catalogname": '',
        "accountindex": ''
      },
      ruleValidate: {
        username: [{
          required: true,
          type: '',
          message: '账号不能为空',
          trigger: 'blur'
        }],
        password: [{
            required: true,
            message: '密码不能为空',
            trigger: 'blur'
          },
          {
            type: 'string',
            min: 5,
            max: 20,
            message: '密码为5-20位字符',
            trigger: 'blur'
          }
        ],
        passwordConfirm: [{
            required: true,
            message: '确认密码不能为空',
            trigger: 'blur'
          },
          {
            validator: validatePassCheck,
            trigger: 'blur'
          }
        ],
        logofile: [{
          required: true,
          message: 'LOGO不能为空',
          trigger: 'blur'
        }],
        studioname: [{
          required: true,
          message: '工作室不能为空',
          trigger: 'blur'
        }],
        url: [{
            required: true,
            message: 'URL不能为空',
            trigger: 'blur'
          },
          {
            type: 'url',
            message: 'URl不正确',
            trigger: 'blur'
          }
        ],
        catalogid: [{
          validator: validateCID,
          trigger: 'blur'
        }],
        accountindex: [{
          type: 'number',
          min: 0,
          max: 1000,
          message: '请输入0-1000的数字',
          trigger: 'blur'
        }],
      }
    }
  },
  methods: {
    allowSubmit(e) {
      if (this.disabledS && !this.firstLoad) {
        this.disabledS = false
        this.firstLoad = false
      } else {
        this.firstLoad = false
      }
    },
    getCatalogName() {
      let _k = this.formValidate.catalogid.split('_')[0]
      let _m = this.formValidate.catalogid.split('_')[1]
      let _n = this.catalogs[_m]['catalogs']
      for (var i = 0; i < _n.length; i++) {
        if (_n[i].id == _k) {
          this.formValidate.catalogname = _n[i].name
          break
        }
      }
      console.log("name  = " + this.formValidate.catalogname)
    },
    resetPassword() {
      if (!this.resetPWD) {
        this.resetWord = '取消重置'
      } else {
        this.resetWord = '重置'
      }
      this.resetPWD = !this.resetPWD
      this.formValidate.password = ''
      this.formValidate.passwordConfirm = ''
    },
    request() {
      this.isLoading = true
      this.$http.get('/api/studio/' + this.id).then(({
        data
      }) => {
        if (data.status == 1) {
          this.formValidate = data.studio
          this.isLoading = false
        } else {
          this.$Notice.error({
            title: '错误',
            desc: data.message || '获取错误'
          })
          this.isLoading = false
        }
      }, () => {
        this.$Notice.error({
          title: '错误',
          desc: '获取错误'
        })
        this.isLoading = false
      })
    },
    cancel() {
      this.$router.push('/manage/studio')
    },
    submit() {
      this.$refs.formValidate.validate((valid) => {
        if (valid) {
          if (this.id === '0') this.save()
          else this.update()
        }
      })
    },
    save() {
      this.getCatalogName()
      var data = Object.assign({}, this.formValidate)
      delete data.id
      if (!data.password) {
        delete data.password
        delete data.passwordConfirm
      }
      this.isSubmit = true
      data.catalogid = data.catalogid.split('_')[0]
      this.$http.post('/api/studio', data).then(({
        data
      }) => {
        this.isSubmit = false
        if (data.status === 1) {
          this.$router.push({
            path: '/manage/studio'
          })
          this.$Notice.success({
            title: '成功',
            desc: data.message || '保存成功'
          })
          this.$router.push('/manage/studio')
        } else {
          this.$Notice.error({
            title: '错误',
            desc: data.message || '保存错误'
          })
        }
      }, () => {
        this.isSubmit = false
        this.$Notice.error({
          title: '错误',
          desc: '保存错误'
        })
      })
    },
    update() {
      this.isSubmit = true
      this.$http.put('/api/studio/' + this.id, this.formValidate).then(({
        data
      }) => {
        this.isSubmit = false
        if (data.status === 1) {
          this.$Notice.success({
            title: '成功',
            desc: data.message || '保存成功'
          })
          this.$router.push('/manage/studio')
        } else {
          this.$Notice.error({
            title: '错误',
            desc: data.message || '保存错误'
          })
        }
      }, () => {
        this.isSubmit = false
        this.$Notice.error({
          title: '错误',
          desc: '保存错误'
        })
      })
    },
    cropUploadSuccess(response, field, ki) {
      if (response.path) {
        this.disabledS = false
        this.formValidate.logofile = response.path
        this.$refs['formValidate'].validateField('logofile')
      }
    },
    cropUploadFail(e, resData, field, ki) {},
    fetchCatalogs() {
      this.$http.get('/api/catalog').then(({
        data
      }) => {
        if (data.status) {
          if (data.catalogs) {
            var catalogs = {}
            data.catalogs.forEach(n => {
              catalogs[n.id] = n
            })
          }
          this.catalogs = catalogs
        } else {
          this.$Notice.error({
            title: '错误',
            desc: err.message || '获取错误'
          })
        }
      })
    }
  },
  created() {
    this.fetchCatalogs()
    this.id = this.$route.params.id
    if (this.id !== '0') {
      this.resetPWD = false
      this.request()
    } else {
      this.firstLoad = false
      this.resetPWD = true
    }
  }
}
