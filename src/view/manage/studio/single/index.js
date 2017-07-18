import UploadImage from '@/components/uploadImage/index.vue'
import {mapState} from 'vuex'
export default {
  name: 'ViewManageStudioId',
  components: { UploadImage },
  data() {
    return {
      id: 0,
      loading: false,
      uploadImageUrl: 'http://mp.dev.hubpd.com/api/image/upload',
      formValidate: {
        "id": 0,
        "username": "",
        "password": "",
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
        username: [
          { required: true, type: '', message: '账号不能为空', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '密码不能为空', trigger: 'blur' }
        ],
        logofile: [
          { required: true, message: 'LOGO不能为空', trigger: 'blur' }
        ],
        studioname: [
          { required: true, message: '工作室不能为空', trigger: 'blur' }
        ],
        url: [
          { required: true,  message: 'URL不能为空', trigger: 'blur' },
          { type: 'url', message: 'URl不正确', trigger: 'blur' }
        ],
        catalogid: [
          { required: true, type: 'number', message: '请选择【栏目绑定】', trigger: 'blur' }
        ],
        accountindex: [
          { required: true, type: 'number', message: '请输入数字', trigger: 'blur' }
        ],
      }
    }
  },
  computed: {
    ...mapState(['catelog'])
  },
  methods: {
    request() {
      this.$http.get('/api/studio/' + this.id).then(({ data }) => {
        if (data.status) {
          this.formValidate = data.studio
        } else {
          this.$Notice.error({
            title: '错误',
            desc: data.message || '获取错误'
          })
        }
      }, () => {
        this.$Notice.error({
          title: '错误',
          desc: '获取错误'
        })
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
      this.loading = true
      this.$http.post('/api/studio', this.formValidate).then(({ data }) => {
        this.loading = false
        if (data.status) {
          this.$router.push({ path: '/manage/studio' })
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
        this.loading = false
        this.$Notice.error({
          title: '错误',
          desc: '保存错误'
        })
      })
    },
    update() {
      this.loading = true
      this.$http.put('/api/studio/' + this.id, this.formValidate).then(({ data }) => {
        this.loading = false
        if (data.status) {
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
        this.loading = false
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
    }
  },
  created() {
    this.id = this.$route.params.id
    if (this.id !== '0') this.request()
  }
}
