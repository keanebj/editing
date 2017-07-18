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
      this.$http.post('http://mp.dev.hubpd.com/api/studio/login', reqParams)
        .then(res => {
          //设置用户身份等信息
          if (res.data.status == 0) {
            this.$Message.error(res.data.message);
          } else if (res.data.status == 1) {
            console.log(JSON.stringify(res.data))
            this.$store.commit('set', {
              userinfo: {
                id: res.data.id,
                roleType: res.data.operatortype,
                username: res.data.operator,
                password: this.formItem.password
              }
            })
            sessionStorage.setItem('token', res.data.token)
            this.$store.commit('set', {
              token: res.data.token
            })
            this.$router.push('/home')
          } else {
            this.$router.push('/login')
          }
        }, err => {
          console.log('出错啦！' + JSON.stringify(err))
        })
    }
  },
  created() {},
  mounted() {}
}
