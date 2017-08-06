import CropperUpload from '@/components/cropperUpload/index.vue'
import imageCropUpload from '@/components/imageCropUpload/index.vue'
export default {
  name: 'ViewManageStudioId',
  components: {
    'cropper-upload': CropperUpload,
    'image-crop-upload': imageCropUpload
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
    return {
      id: 0,
      resetPWD:false,
      resetWord:'重置',
      isSubmit: false,
      isLoading: false,
      catalogs: {},
      disabledS: true,
      firstLoad :true,
      formValidate: {
        "id": 0,
        "username": "",
        "password": "",
        "passwordConfirm": "",
        "studioname": "",
        "url": "",
        "logofile": "",
        "catalogname":'',
        "accountindex": ''
      },
      ruleValidate: {
        username: [{
          required: true,
          type: '',
          message: '账号不能为空',
          trigger: 'blur'
        }],
        password: [
          {
            required: true,
            message: '密码不能为空',
            trigger: 'blur'
          },
          {
            type: 'string',
            min: 6,
            message: '密码至少6位',
            trigger: 'blur'
          }
        ],
        passwordConfirm: [
          {
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
          required: true,
          type: 'number',
          message: '请选择【栏目绑定】',
          trigger: 'blur'
        }],
        accountindex: [{
          type: 'number',
          min: 0,
          message: '请输入数字',
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
      }
      else{
        this.firstLoad = false
      }
    },
    resetPassword(){
      if(!this.resetPWD){
        this.resetWord = '取消重置'
      }
      else{
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
      this.formValidate.catalogname = this.catalogs[this.formValidate.catalogid].name
      var data = Object.assign({}, this.formValidate)
      delete data.id
      if (!data.password) {
        delete data.password
        delete data.passwordConfirm
      }
      this.isSubmit = true
      this.$http.post('/api/studio', data).then(({
        data
      }) => {
        this.isSubmit = false
        if (data.status === 1) {
          this.$router.push({ path: '/manage/studio' })
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
      this.formValidate.catalogname = this.catalogs[this.formValidate.catalogid].name
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
    cropUploadFail(e, resData, field, ki) {
    },
    fetchCatalogs() {
      this.$http.get('/api/catalog').then(({ data }) => {
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
    }
    else{
      this.firstLoad = false
      this.resetPWD = true
    }
  }
}
