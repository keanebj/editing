import { mapState } from 'vuex'

export default {
  name: 'ViewSettingsAccount',
  data() {
    return {
      roleType: 1,
      account: '运营人员1',
      studioName: '一秒世界',
      URL: 'yimiaoshijie.hubpd.com',
      uploadImg: 'https://vuefe.cn/images/logo.png',
      catalog: '一秒世界',
      hideImg: false,
      defaultList: [{
        'name': '',
        'url': ''
      }],
      uploadHeaders: {
        token: sessionStorage.getItem('token')
      },
      imgName: '',
      visible: false,
      uploadList: [{
        url: '',
        status: ''
      }],
      formValidateM: {
        id: 3,
        name: '',
        tel: ''
      },
      ruleValidateM: {
        name: [{
          required: true,
          message: '姓名不能为空',
          trigger: 'blur'
        }],
        tel: [{
            required: true,
            message: '电话不能为空',
            trigger: 'blur'
          },
          {
            type: 'string',
            min: 7,
            max: 11,
            pattern: /^[0-9]+$/,
            message: '电话格式不正确',
            trigger: 'blur'
          }
        ]
      },
      formValidate: {
        name: '',
        mail: '',
        tel: ''
      },
      ruleValidate: {
        name: [{
          required: true,
          message: '姓名不能为空',
          trigger: 'blur'
        }],
        mail: [{
            required: true,
            message: '邮箱不能为空',
            trigger: 'blur'
          },
          {
            type: 'email',
            message: '邮箱格式不正确',
            trigger: 'blur'
          }
        ],
        tel: [{
            required: true,
            message: '电话不能为空',
            trigger: 'blur'
          },
          {
            type: 'string',
            min: 7,
            max: 11,
            pattern: /^[0-9]+$/,
            message: '电话格式不正确',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  computed: mapState({
    userinfo: state => state.userinfo,
  }),
  beforeCreate() {
    if (sessionStorage.getItem('token') == undefined || sessionStorage.getItem('token') == null) {
      this.$router.push('/login')
    }
  },
  methods: {
    getOperatorInfo() {
      // this.$http({
      //     method: 'get',
      //     url: 'http://mp.dev.hubpd.com/api/studio',
      //     params: {
      //       username: this.userinfo.username
      //     }
      //   })
      this.$http.get('http://mp.dev.hubpd.com/api/studio',{params:{username: this.userinfo.username}})
        .then(res => {
          console.log(JSON.stringify(res.data))
          if (res.data.status == 0) {
            this.$router.push('/login')
            // this.$Message.error(res.data.message)
          } else {
            let operatorInfo = res.data.studios[0]
            this.formValidate.name = operatorInfo.fullname
            this.formValidate.tel = operatorInfo.tel
            this.account = operatorInfo.username
            this.studioName = operatorInfo.studioname
            this.formValidate.mail = operatorInfo.email
          }

        }, err => {
          console.log('出错啦！' + err)
        })
    },
    getStudioInfo() {
      // this.$http({
      //     method: 'get',
      //     url: 'http://mp.dev.hubpd.com/api/studio',
      //     params: {
      //       username: this.userinfo.username
      //     }
      //   })
      this.$http.get('http://mp.dev.hubpd.com/api/studio',{params:{username: this.userinfo.username}})
        .then(res => {
          if (res.data.status == 0) {
            this.$router.push('/login')
            // this.$Message.error(res.data.message)

          } else {
            let studioInfo = res.data.studios[0]
            this.formValidateM.name = studioInfo.fullname
            this.formValidateM.tel = studioInfo.tel
            this.studioName = studioInfo.studioname
            this.account = studioInfo.username
            this.URL = studioInfo.url
            this.catalog = studioInfo.catalogname
            let _preImg = {
              status: 'finished',
              url: studioInfo.logofile
            }
            this.uploadList.push(_preImg)
          }
        }, err => {
          console.log('出错啦！' + err)
        })
    },
    editStudioInfo() {
      let reqParams = {
        username: this.userinfo.username,
        studioname: this.studioName,
        fullname: this.formValidateM.name,
        tel: this.formValidateM.tel,
        logofile: this.uploadImg
      };
      this.$http.put('http://mp.dev.hubpd.com/api/studio/' + this.userinfo.id, {params:reqParams})
        .then(res => {
          if (res.data.status == 1) {
            this.$Message.success(res.data.message);
          } else {
            this.$Message.err(res.data.message);
          }
          console.log(JSON.stringify(res.data))
        }, err => {
          console.log('出错啦！' + JSON.stringify(err))
        })
    },
    editOperatorInfo() {
      let reqParams = {
        username: this.userinfo.username,
        password: this.userinfo.password,
        studioname: this.studioName,
        fullname: this.formValidate.name,
        tel: this.formValidate.tel,
        email: this.formValidate.mail
      };
      this.$http.put('http://mp.dev.hubpd.com/api/studio/' + this.userinfo.id, {params:reqParams})
        .then(res => {
          if (res.data.status == 1) {
            this.$Message.success(res.data.message);
          } else {
            this.$Message.err(res.data.message);
          }
          console.log(JSON.stringify(res.data))
        }, err => {
          console.log('出错啦！' + JSON.stringify(err))
        })
    },
    handleView(name) {
      this.imgName = name;
      this.visible = true;
    },
    handleRemove(file) {
      // 从 upload 实例删除数据
      const fileList = this.$refs.upload.fileList;
      this.$refs.upload.fileList.splice(fileList.indexOf(file), 1);
    },
    handleSuccess(res, file) {
      console.log(JSON.stringify(res.path))
      this.$Message.success(res.message);
      // 因为上传过程为实例，这里模拟添加 url
      file.url = 'http://mp.dev.hubpd.com/' + res.path;
      this.uploadImg = file.url;
      this.hideImg = true;
      // file.name = res.name;
    },
    handleFormatError(file) {
      this.$Notice.warning({
        title: '文件格式不正确',
        desc: '文件 ' + file.name + ' 格式不正确，请上传 jpg 或 png 格式的图片。'
      });
    },
    handleMaxSize(file) {
      this.$Notice.warning({
        title: '超出文件大小限制',
        desc: '文件 ' + file.name + ' 太大，不能超过 2M。'
      });
    },
    handleBeforeUpload() {
      const check = this.uploadList.length < 1;
      if (!check) {
        this.uploadList.splice(0, 1)
        return true
        // this.$Notice.warning({
        //   title: '最多只能上传 1 张图片。'
        // });
      }
      return check;
    },
    handleSubmit(name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          if (this.roleType == 0) {
            this.editOperatorInfo();
          } else {
            this.editStudioInfo();
          }

        } else {
          this.$Message.error('表单验证失败!');
        }
      })
    },
    handleReset(name) {
      this.$refs[name].resetFields();
    },

  },
  created() {
    if (this.userinfo.roleType == 'Edit') {
      this.roleType = 1;
      console.log('工作室编辑')
      this.getStudioInfo();
    } else {
      this.roleType = 0;
      this.getOperatorInfo();
    }
  },
  mounted() {
    this.uploadList = this.$refs.upload.fileList;
  }
}
