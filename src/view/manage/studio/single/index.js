import {
  mapState
} from 'vuex'
import imageCropUpload from '@/components/imageCropUpload/index.vue'
export default {
  name: 'ViewManageStudioId',
  components: {
    'image-crop-upload': imageCropUpload
  },
  data() {
    const validatePassCheck = (rule, value, callback) => {
      console.log(value, this.formValidate.passwordConfirm)
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.formValidate.password) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    };
    return {
      id: 0,
      isSubmit: false,
      isLoading: false,
      formValidate: {
        "id": 0,
        "username": "",
        "password": "",
        "passwordConfirm": "",
        "studioname": "",
        "usertype": "",
        "tel": "",
        "email": null,
        "url": "",
        "logofile": "",
        "catalogid": '',
        "catalogname": null,
        "accountindex": '',
        "addtime": ""
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
            min: 6,
            message: '密码至少6位',
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
          required: true,
          type: 'number',
          message: '请选择【栏目绑定】',
          trigger: 'blur'
        }],
        accountindex: [{
          type: 'number',
          min: 1,
          message: '请输入数字',
          trigger: 'blur'
        }],
      }
    }
  },
  computed: {
    ...mapState(['catelog'])
  },
  methods: {
    getCatalog() {
      this.$http.get('/api/catalog').then(res => {
        console.log("获取栏目列表：" + JSON.stringify(res.data))
      }, err => {
        this.$Notice.error({
          title: '错误',
          desc: err.message || '获取错误'
        })
      })
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
      this.$refs['formValidate'].resetFields()
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
      delete this.formValidate.id
      this.isSubmit = true
      this.$http.post('/api/studio', this.formValidate).then(({
        data
      }) => {
        this.isSubmit = false
        if (data.status == 1) {
          this.$router.push({
            path: '/manage/studio'
          })
          this.$Notice.success({
            title: '成功',
            desc: data.message || '保存成功'
          })
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
        if (data.status == 1) {
          this.$Notice.success({
            title: '成功',
            desc: data.message || '保存成功'
          })
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
    onSuccess(e, response, file, fileList) {
      if (response.path) {
        this.formValidate.logofile = response.path
        this.$refs['formValidate'].validateField('logofile')
      }
    },
    onError(e, error, file, fileList) {
      this.$Notice.error({
        title: '错误',
        desc: error.message || '图片上传错误！'
      })
    },
    cropUploadSuccess(e, response, field, ki) {
      console.log(e, response)
      if (response.path) {
        this.formValidate.logofile = response.path
        this.$refs['formValidate'].validateField('logofile')
      }
    },
    cropUploadFail(e, resData, field, ki) {}
  },
  created() {
    //this.getCatalog()
    this.id = this.$route.params.id
    if (this.id !== '0') {
      this.request()

    }

  }
}
