import Vue from 'vue'
export default {
  data() {
    return {
      formItem: {
        username: '',
        password: ''
      },
      formRules: {
        username: [{
          required: true,
          message: '请填写用户名',
          trigger: 'blur'
        }],
        password: [{
          required: true,
          message: '请填写密码',
          trigger: 'blur'
        }, {
          type: 'string',
          min: 4,
          message: '密码长度不能小于6位',
          trigger: 'blur'
        }]
      }
    }
  },
  methods: {
    handleSubmit(name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          this.$Message.success('提交成功!');
          this.submitLogin();
        } else {
          this.$Message.error('表单验证失败!');
        }
      })
    },
    handleReset(name) {
      this.$refs[name].resetFields();
    },
    // 登录请求发送
    submitLogin() {
      let reqParams = {
        username: this.formItem.username,
        password: this.formItem.password
      };
      this.$http({
          method: 'post',
          url: 'http://mp.dev.hubpd.com/api/studio/login',
          params: reqParams
        })
        .then(res => {
          //设置用户身份等信息
          console.log('ret=' + JSON.stringify())
          if (res.data.status == 0) {
            this.$Message.error(res.data.message);
          } else {
            console.log(JSON.stringify(res.data))
            this.$store.state.id = res.data.id
            this.$store.state.roleType = res.data.operatortype
            sessionStorage.setItem('token', res.data.token)
            console.log(sessionStorage.getItem('token'))
            this.$store.state.username = res.data.operator
            this.$store.state.password = this.formItem.password
            Vue.http.headers.common['token'] = res.data.token
            this.$router.push('/home')
          }
        }, err => {
          console.log('出错啦！' + JSON.stringify(err))
        })
    }
  },
  created() {},
  mounted() {}
}
