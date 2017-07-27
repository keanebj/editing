import Vue from 'vue'
import Cookies from 'js-cookie'
export default {
  data() {
    return {
      isLoading:false,
      loginDisabled:false,
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
      this.isLoading = true
      let reqParams = {
        username: this.formItem.username,
        password: this.formItem.password
      };
      this.$http.post('http://mp.dev.hubpd.com/api/studio/login', reqParams)
        .then(res => {          
          //设置用户身份等信息
          if (res.data.status == 1) {
            var userinfo = {
              id: res.data.id,
              roleType: res.data.operatortype,
              username: res.data.operator,
              password: this.formItem.password,
              // studioLogo: this.$conf.host + res.data.logo || ''
              studioLogo: res.data.operatortype == "Manage" ? '' : res.data.logo
            }

            this.$store.commit('set', { userinfo })
            this.$store.commit('set', {
              token: res.data.token
            })
            sessionStorage.setItem('token', res.data.token)
            sessionStorage.setItem('userinfo', JSON.stringify(userinfo))
            this.$Message.success('登录成功!');
            Cookies.remove('clickedNo');//删除对应的cookie
            Cookies.remove('clickedCo');//删除对应的cookie
            this.$router.push('/home')
          }else{
            this.$Message.error(res.data.message);
          }
          // this.isLoading = false
        }, err => {
          this.isLoading = false
          console.log('出错啦！' + JSON.stringify(err))
        })
    }
  },
  created() { },
  mounted() { }
}